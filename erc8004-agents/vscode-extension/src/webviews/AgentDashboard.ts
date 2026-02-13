/**
 * Agent Dashboard webview — overview of all registered agents.
 */

import * as vscode from 'vscode';
import { ethers } from 'ethers';
import {
  getWallet,
  getIdentityContract,
  getActiveChain,
  getActiveChainKey,
  isConnected,
  shortenAddress,
  getBalance,
} from '../utils/wallet';
import { getContracts } from '../utils/contracts';
import { getAddressUrl, getTxUrl } from '../utils/chains';
import { showError } from '../utils/notifications';

export class AgentDashboard {
  public static currentPanel: AgentDashboard | undefined;
  private readonly panel: vscode.WebviewPanel;
  private disposables: vscode.Disposable[] = [];

  public static async createOrShow(): Promise<void> {
    if (AgentDashboard.currentPanel) {
      AgentDashboard.currentPanel.panel.reveal();
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'erc8004-dashboard',
      'ERC-8004 Dashboard',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );

    AgentDashboard.currentPanel = new AgentDashboard(panel);
    await AgentDashboard.currentPanel.loadData();
  }

  private constructor(panel: vscode.WebviewPanel) {
    this.panel = panel;
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    this.panel.webview.onDidReceiveMessage(
      async (message: { type: string; tokenId?: string }) => {
        switch (message.type) {
          case 'viewAgent':
            vscode.commands.executeCommand('erc8004.viewAgent', message.tokenId);
            break;
          case 'registerAgent':
            vscode.commands.executeCommand('erc8004.registerAgent');
            break;
          case 'refresh':
            await this.loadData();
            break;
        }
      },
      null,
      this.disposables
    );
  }

  private async loadData(): Promise<void> {
    if (!isConnected()) {
      this.panel.webview.html = this.getNoWalletHtml();
      return;
    }

    const wallet = getWallet()!;
    const chain = getActiveChain();
    const chainKey = getActiveChainKey();
    const contracts = getContracts(chainKey);

    let balance = '0';
    try {
      balance = await getBalance();
    } catch {
      // Ignore
    }

    // Load agents
    interface DashboardAgent {
      tokenId: string;
      name: string;
      services: string[];
      uri: string;
    }

    const agents: DashboardAgent[] = [];
    try {
      const contract = getIdentityContract();
      const filter = contract.filters.Transfer(null, wallet.address);
      const events = await contract.queryFilter(filter);

      for (const event of events) {
        const log = event as ethers.EventLog;
        if (log.args) {
          const tokenId = log.args[2].toString();
          try {
            const owner = await contract.ownerOf(tokenId);
            if (owner.toLowerCase() === wallet.address.toLowerCase()) {
              let name = `Agent #${tokenId}`;
              let services: string[] = [];
              let uri = '';
              try {
                uri = await contract.tokenURI(tokenId);
                if (uri.startsWith('data:application/json;base64,')) {
                  const json = JSON.parse(
                    Buffer.from(uri.replace('data:application/json;base64,', ''), 'base64').toString('utf-8')
                  );
                  name = json.name || name;
                  services = (json.services || []).map((s: any) => s.name);
                }
              } catch {
                // Skip
              }
              agents.push({ tokenId, name, services, uri });
            }
          } catch {
            // Skip
          }
        }
      }
    } catch (error: any) {
      showError('Failed to load dashboard', error.message);
    }

    this.panel.webview.html = this.getDashboardHtml(
      wallet.address,
      chain.name,
      chainKey,
      balance,
      chain.currency.symbol,
      agents,
      contracts.identity
    );
  }

  private getNoWalletHtml(): string {
    return `<!DOCTYPE html>
<html><head><style>
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 40px; text-align: center; }
  .btn { padding: 10px 20px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
</style></head><body>
  <h1>🤖 ERC-8004 Dashboard</h1>
  <p style="margin: 20px 0; color: var(--vscode-descriptionForeground);">Connect a wallet to view your agents</p>
  <button class="btn" onclick="connectWallet()">Connect Wallet</button>
  <script>
    const vscode = acquireVsCodeApi();
    function connectWallet() { vscode.postMessage({ type: 'connectWallet' }); }
  </script>
</body></html>`;
  }

  private getDashboardHtml(
    address: string,
    chainName: string,
    chainKey: string,
    balance: string,
    symbol: string,
    agents: Array<{ tokenId: string; name: string; services: string[]; uri: string }>,
    contractAddress: string
  ): string {
    const isTestnet = chainKey.includes('testnet') || chainKey.includes('sepolia');
    const explorerUrl = getAddressUrl(chainKey, address);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ERC-8004 Dashboard</title>
  <style>
    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 20px; }
    h1 { font-size: 22px; margin-bottom: 20px; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .stat { padding: 16px; border-radius: 8px; background: var(--vscode-editor-inactiveSelectionBackground); border: 1px solid var(--vscode-widget-border); }
    .stat-label { font-size: 12px; color: var(--vscode-descriptionForeground); margin-bottom: 4px; }
    .stat-value { font-size: 20px; font-weight: bold; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; background: #f0b90b; color: #000; font-weight: bold; }
    .agents-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
    .agent-card { padding: 16px; border-radius: 8px; background: var(--vscode-editor-inactiveSelectionBackground); border: 1px solid var(--vscode-widget-border); cursor: pointer; transition: border-color 0.2s; }
    .agent-card:hover { border-color: #f0b90b; }
    .agent-name { font-weight: bold; font-size: 16px; margin-bottom: 4px; }
    .agent-id { font-size: 12px; color: var(--vscode-descriptionForeground); }
    .agent-services { margin-top: 8px; display: flex; gap: 4px; flex-wrap: wrap; }
    .svc-badge { padding: 2px 6px; border-radius: 3px; font-size: 11px; background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); }
    .btn { padding: 8px 16px; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; border-radius: 4px; cursor: pointer; font-size: 13px; }
    .btn:hover { background: var(--vscode-button-hoverBackground); }
    .header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .empty { text-align: center; padding: 40px; color: var(--vscode-descriptionForeground); }
    a { color: var(--vscode-textLink-foreground); text-decoration: none; }
  </style>
</head>
<body>
  <h1>🤖 ERC-8004 Dashboard</h1>

  <div class="stats">
    <div class="stat">
      <div class="stat-label">Wallet</div>
      <div class="stat-value" style="font-size:14px"><a href="${explorerUrl}">${shortenAddress(address)}</a></div>
    </div>
    <div class="stat">
      <div class="stat-label">Chain</div>
      <div class="stat-value"><span class="badge">${chainName}</span></div>
    </div>
    <div class="stat">
      <div class="stat-label">Balance</div>
      <div class="stat-value">${parseFloat(balance).toFixed(4)} ${symbol}</div>
    </div>
    <div class="stat">
      <div class="stat-label">Agents</div>
      <div class="stat-value">${agents.length}</div>
    </div>
  </div>

  <div class="header-row">
    <h2>My Agents</h2>
    <div>
      <button class="btn" onclick="refresh()">↻ Refresh</button>
      <button class="btn" onclick="register()" style="margin-left:4px">+ Register</button>
    </div>
  </div>

  ${
    agents.length === 0
      ? '<div class="empty"><p>No agents registered yet</p><button class="btn" onclick="register()">Register Your First Agent</button></div>'
      : `<div class="agents-grid">${agents
          .map(
            (a) => `
    <div class="agent-card" onclick="viewAgent('${a.tokenId}')">
      <div class="agent-name">🤖 ${escapeHtml(a.name)}</div>
      <div class="agent-id">Token ID: ${a.tokenId}</div>
      <div class="agent-services">
        ${a.services.map((s) => `<span class="svc-badge">${s}</span>`).join('')}
      </div>
    </div>`
          )
          .join('')}</div>`
  }

  <script>
    const vscode = acquireVsCodeApi();
    function viewAgent(id) { vscode.postMessage({ type: 'viewAgent', tokenId: id }); }
    function register() { vscode.postMessage({ type: 'registerAgent' }); }
    function refresh() { vscode.postMessage({ type: 'refresh' }); }
  </script>
</body>
</html>`;
  }

  private dispose(): void {
    AgentDashboard.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) {
        d.dispose();
      }
    }
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
