/**
 * Generate .well-known files for agent discovery.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { getActiveChain, getActiveChainKey } from '../utils/wallet';
import { getContracts } from '../utils/contracts';
import { showInfo, showError } from '../utils/notifications';

export async function generateConfig(): Promise<void> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    showError('No workspace folder open. Open a folder first.');
    return;
  }

  const rootUri = workspaceFolders[0].uri;
  const chain = getActiveChain();
  const chainKey = getActiveChainKey();
  const contracts = getContracts(chainKey);

  // Agent name
  const name = await vscode.window.showInputBox({
    title: 'Agent Name',
    prompt: 'Enter a name for the agent-card.json',
    placeHolder: 'My AI Agent',
    validateInput: (v: string) => (v.trim().length === 0 ? 'Name is required' : undefined),
  });
  if (!name) {
    return;
  }

  const description = await vscode.window.showInputBox({
    title: 'Agent Description',
    prompt: 'Describe the agent',
    placeHolder: 'An autonomous AI agent that...',
  });

  // Service endpoints
  const endpoint = await vscode.window.showInputBox({
    title: 'Agent Endpoint',
    prompt: 'Primary service endpoint URL',
    placeHolder: 'https://api.example.com/a2a',
  });

  const fileType = await vscode.window.showQuickPick(
    [
      { label: 'agent-card.json', description: 'ERC-8004 Agent Card', detail: 'agent-card' },
      { label: 'ai-plugin.json', description: 'OpenAI Plugin manifest', detail: 'ai-plugin' },
      { label: 'Both', description: 'Generate both files', detail: 'both' },
    ],
    { title: 'File Type', placeHolder: 'Which files to generate?' }
  );
  if (!fileType) {
    return;
  }

  const wellKnownDir = vscode.Uri.joinPath(rootUri, '.well-known');

  // Ensure .well-known directory exists
  try {
    await vscode.workspace.fs.createDirectory(wellKnownDir);
  } catch {
    // May already exist
  }

  if (fileType.detail === 'agent-card' || fileType.detail === 'both') {
    const agentCard = {
      type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1',
      name,
      description: description || '',
      services: endpoint
        ? [
            {
              name: 'A2A',
              endpoint,
              version: '0.3.0',
            },
          ]
        : [],
      x402Support: false,
      active: true,
      registrations: [
        {
          agentId: 0,
          agentRegistry: chain.agentRegistry,
        },
      ],
      supportedTrust: ['reputation'],
    };

    const agentCardUri = vscode.Uri.joinPath(wellKnownDir, 'agent-card.json');
    await vscode.workspace.fs.writeFile(
      agentCardUri,
      Buffer.from(JSON.stringify(agentCard, null, 2))
    );
  }

  if (fileType.detail === 'ai-plugin' || fileType.detail === 'both') {
    const aiPlugin = {
      schema_version: 'v1',
      name_for_human: name,
      name_for_model: name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
      description_for_human: description || '',
      description_for_model: description || '',
      auth: { type: 'none' },
      api: {
        type: 'openapi',
        url: endpoint ? `${new URL(endpoint).origin}/openapi.json` : 'https://api.example.com/openapi.json',
        is_user_authenticated: false,
      },
      logo_url: '',
      contact_email: '',
      legal_info_url: '',
      erc8004: {
        chain: chain.name,
        chainId: chain.chainId,
        identityRegistry: contracts.identity,
        reputationRegistry: contracts.reputation,
      },
    };

    const aiPluginUri = vscode.Uri.joinPath(wellKnownDir, 'ai-plugin.json');
    await vscode.workspace.fs.writeFile(
      aiPluginUri,
      Buffer.from(JSON.stringify(aiPlugin, null, 2))
    );
  }

  showInfo(`Generated .well-known files in workspace root`);

  // Open the generated file
  const fileToOpen =
    fileType.detail === 'ai-plugin'
      ? vscode.Uri.joinPath(wellKnownDir, 'ai-plugin.json')
      : vscode.Uri.joinPath(wellKnownDir, 'agent-card.json');
  const doc = await vscode.workspace.openTextDocument(fileToOpen);
  await vscode.window.showTextDocument(doc);
}
