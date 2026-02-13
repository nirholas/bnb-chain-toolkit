/**
 * Update agent URI for an existing agent.
 */

import * as vscode from 'vscode';
import { getIdentityContract, getActiveChain } from '../utils/wallet';
import { showTxSuccess, showError, withProgress, requireWallet } from '../utils/notifications';

export async function updateAgent(tokenId?: string): Promise<void> {
  if (!(await requireWallet())) {
    return;
  }

  if (!tokenId) {
    tokenId = await vscode.window.showInputBox({
      title: 'Update Agent URI',
      prompt: 'Enter the agent token ID to update',
      placeHolder: '42',
      validateInput: (v: string) => (!/^\d+$/.test(v.trim()) ? 'Must be a numeric token ID' : undefined),
    });
  }
  if (!tokenId) {
    return;
  }

  // Get current URI
  const contract = getIdentityContract();
  let currentUri = '';
  try {
    currentUri = await contract.tokenURI(tokenId);
  } catch {
    // No URI set
  }

  const method = await vscode.window.showQuickPick(
    [
      { label: 'Enter new HTTPS URL', detail: 'https' },
      { label: 'Enter new JSON (base64 on-chain)', detail: 'onchain' },
      { label: 'Edit current URI', detail: 'edit' },
    ],
    { title: 'Update Method', placeHolder: 'How do you want to update the URI?' }
  );
  if (!method) {
    return;
  }

  let newUri: string;

  if (method.detail === 'https') {
    const uri = await vscode.window.showInputBox({
      title: 'New Agent URI',
      prompt: 'Enter the new HTTPS URL for agent metadata',
      placeHolder: 'https://example.com/.well-known/agent-card.json',
      value: currentUri.startsWith('http') ? currentUri : '',
      validateInput: (v: string) => {
        try {
          new URL(v);
          return undefined;
        } catch {
          return 'Must be a valid URL';
        }
      },
    });
    if (!uri) {
      return;
    }
    newUri = uri;
  } else if (method.detail === 'onchain') {
    // Open a text editor for JSON editing
    const doc = await vscode.workspace.openTextDocument({
      content: currentUri.startsWith('data:application/json;base64,')
        ? Buffer.from(
            currentUri.replace('data:application/json;base64,', ''),
            'base64'
          ).toString('utf-8')
        : JSON.stringify(
            {
              type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1',
              name: 'My Agent',
              description: '',
              services: [],
              active: true,
            },
            null,
            2
          ),
      language: 'json',
    });
    await vscode.window.showTextDocument(doc);

    const result = await vscode.window.showInformationMessage(
      'Edit the JSON document, then click "Use This JSON" to update the agent URI.',
      'Use This JSON',
      'Cancel'
    );
    if (result !== 'Use This JSON') {
      return;
    }

    const jsonContent = doc.getText();
    try {
      JSON.parse(jsonContent); // Validate JSON
    } catch {
      showError('Invalid JSON content');
      return;
    }

    const base64 = Buffer.from(jsonContent).toString('base64');
    newUri = `data:application/json;base64,${base64}`;
  } else {
    const uri = await vscode.window.showInputBox({
      title: 'Edit URI',
      prompt: 'Edit the current URI',
      value: currentUri,
    });
    if (!uri) {
      return;
    }
    newUri = uri;
  }

  const chain = getActiveChain();
  const confirm = await vscode.window.showInformationMessage(
    `Update URI for agent #${tokenId} on ${chain.name}?`,
    { modal: true },
    'Update'
  );
  if (confirm !== 'Update') {
    return;
  }

  await withProgress(`Updating agent #${tokenId}...`, async (progress) => {
    try {
      progress.report({ message: 'Sending transaction...' });
      const tx = await contract.setAgentURI(BigInt(tokenId!), newUri);
      progress.report({ message: `Tx sent: ${tx.hash.slice(0, 10)}...` });

      const receipt = await tx.wait();
      await showTxSuccess(`Agent #${tokenId} URI updated`, receipt.hash);

      vscode.commands.executeCommand('erc8004.refreshAgents');
    } catch (error: any) {
      showError('Update failed', error.message || String(error));
    }
  });
}
