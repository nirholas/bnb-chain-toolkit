/**
 * View agent details in a webview panel.
 */

import * as vscode from 'vscode';
import { ethers } from 'ethers';
import { getIdentityContract, getActiveChain, getActiveChainKey, ensureProvider } from '../utils/wallet';
import { getContracts } from '../utils/contracts';
import { getAddressUrl, getTxUrl } from '../utils/chains';
import { showError, withProgress } from '../utils/notifications';

export async function viewAgent(tokenId?: string): Promise<void> {
  if (!tokenId) {
    tokenId = await vscode.window.showInputBox({
      title: 'View Agent',
      prompt: 'Enter the agent token ID',
      placeHolder: '42',
      validateInput: (v: string) => {
        if (!/^\d+$/.test(v.trim())) {
          return 'Must be a numeric token ID';
        }
        return undefined;
      },
    });
  }
  if (!tokenId) {
    return;
  }

  await withProgress(`Loading agent #${tokenId}...`, async (progress) => {
    try {
      const contract = getIdentityContract();
      const chain = getActiveChain();
      const chainKey = getActiveChainKey();
      const contracts = getContracts(chainKey);

      // Fetch on-chain data
      progress.report({ message: 'Fetching owner...' });
      const owner = await contract.ownerOf(tokenId);

      progress.report({ message: 'Fetching URI...' });
      let uri = '';
      let metadata: Record<string, unknown> = {};
      try {
        uri = await contract.tokenURI(tokenId);
        if (uri.startsWith('data:application/json;base64,')) {
          const base64 = uri.replace('data:application/json;base64,', '');
          metadata = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
        }
      } catch {
        // No URI set
      }

      progress.report({ message: 'Fetching wallet...' });
      let agentWallet = '';
      try {
        agentWallet = await contract.getAgentWallet(tokenId);
        if (agentWallet === ethers.ZeroAddress) {
          agentWallet = '';
        }
      } catch {
        // No wallet set
      }

      // Create webview panel
      const panel = vscode.window.createWebviewPanel(
        'erc8004-agent',
        `Agent #${tokenId}`,
        vscode.ViewColumn.One,
        { enableScripts: true }
      );

      panel.webview.html = getAgentViewHtml(
        tokenId!,
        owner,
        uri,
        metadata,
        agentWallet,
        chain.name,
        chainKey,
        contracts.identity
      );
    } catch (error: any) {
      if (error.message?.includes('ERC721')) {
        showError(`Agent #${tokenId} does not exist on ${getActiveChain().name}`);
      } else {
        showError('Failed to load agent', error.message || String(error));
      }
    }
  });
}

function getAgentViewHtml(
  tokenId: string,
  owner: string,
  uri: string,
  metadata: Record<string, unknown>,
  agentWallet: string,
  chainName: string,
  chainKey: string,
  contractAddress: string
): string {
  const name = (metadata.name as string) || `Agent #${tokenId}`;
  const description = (metadata.description as string) || 'No description';
  const image = (metadata.image as string) || '';
  const services = (metadata.services as Array<{ name: string; endpoint: string; version?: string }>) || [];
  const x402 = metadata.x402Support ? 'Yes' : 'No';
  const trust = (metadata.supportedTrust as string[]) || [];
  const registrations = (metadata.registrations as Array<{ agentId: number; agentRegistry: string }>) || [];
  const explorerUrl = getAddressUrl(chainKey, contractAddress);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agent #${tokenId}</title>
  <style>
    body {
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
      padding: 20px;
      line-height: 1.6;
    }
    .header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
    .avatar { width: 64px; height: 64px; border-radius: 12px; object-fit: cover; background: var(--vscode-badge-background); display: flex; align-items: center; justify-content: center; font-size: 32px; }
    .avatar img { width: 100%; height: 100%; border-radius: 12px; }
    h1 { margin: 0; font-size: 24px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); margin-right: 4px; }
    .badge.testnet { background: #f0b90b; color: #000; }
    .section { margin: 20px 0; padding: 16px; border-radius: 8px; background: var(--vscode-editor-inactiveSelectionBackground); }
    .section h2 { margin-top: 0; font-size: 16px; border-bottom: 1px solid var(--vscode-widget-border); padding-bottom: 8px; }
    .field { margin: 8px 0; }
    .field label { font-weight: bold; color: var(--vscode-descriptionForeground); }
    .field .value { font-family: var(--vscode-editor-font-family); word-break: break-all; }
    .service { padding: 8px 12px; margin: 4px 0; border-radius: 4px; background: var(--vscode-input-background); border: 1px solid var(--vscode-input-border); }
    .service .name { font-weight: bold; }
    .service .endpoint { font-family: var(--vscode-editor-font-family); font-size: 12px; color: var(--vscode-textLink-foreground); }
    .trust-badges { display: flex; gap: 4px; flex-wrap: wrap; }
    a { color: var(--vscode-textLink-foreground); }
    code { background: var(--vscode-textCodeBlock-background); padding: 2px 6px; border-radius: 3px; font-family: var(--vscode-editor-font-family); }
    .json-preview { background: var(--vscode-textCodeBlock-background); padding: 12px; border-radius: 6px; overflow-x: auto; font-family: var(--vscode-editor-font-family); font-size: 12px; white-space: pre-wrap; max-height: 300px; overflow-y: auto; }
  </style>
</head>
<body>
  <div class="header">
    <div class="avatar">
      ${image ? `<img src="${image}" alt="${name}" />` : '🤖'}
    </div>
    <div>
      <h1>${escapeHtml(name)}</h1>
      <span class="badge">ID: ${tokenId}</span>
      <span class="badge ${chainKey.includes('testnet') || chainKey.includes('sepolia') ? 'testnet' : ''}">${chainName}</span>
    </div>
  </div>

  <div class="section">
    <h2>📋 Details</h2>
    <div class="field"><label>Description:</label> <span class="value">${escapeHtml(description)}</span></div>
    <div class="field"><label>Owner:</label> <span class="value"><code>${owner}</code></span></div>
    ${agentWallet ? `<div class="field"><label>Agent Wallet:</label> <span class="value"><code>${agentWallet}</code></span></div>` : ''}
    <div class="field"><label>x402 Payments:</label> <span class="value">${x402}</span></div>
    <div class="field"><label>Contract:</label> <span class="value"><a href="${explorerUrl}">${contractAddress}</a></span></div>
  </div>

  ${services.length > 0 ? `
  <div class="section">
    <h2>🔌 Services (${services.length})</h2>
    ${services.map((s) => `
    <div class="service">
      <div class="name">${escapeHtml(s.name)} ${s.version ? `<span class="badge">v${s.version}</span>` : ''}</div>
      <div class="endpoint">${escapeHtml(s.endpoint)}</div>
    </div>`).join('')}
  </div>` : ''}

  ${trust.length > 0 ? `
  <div class="section">
    <h2>🛡️ Trust Mechanisms</h2>
    <div class="trust-badges">
      ${trust.map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join('')}
    </div>
  </div>` : ''}

  ${registrations.length > 0 ? `
  <div class="section">
    <h2>📡 Registrations</h2>
    ${registrations.map((r) => `
    <div class="field">
      <label>Agent ID ${r.agentId}:</label>
      <span class="value"><code>${r.agentRegistry}</code></span>
    </div>`).join('')}
  </div>` : ''}

  <div class="section">
    <h2>📄 Raw Metadata</h2>
    <div class="json-preview">${escapeHtml(JSON.stringify(metadata, null, 2))}</div>
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
