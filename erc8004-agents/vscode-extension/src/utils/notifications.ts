/**
 * VSCode notification helper utilities.
 */

import * as vscode from 'vscode';
import { getTxUrl } from './chains';
import { getActiveChainKey } from './wallet';

/**
 * Show an info notification with optional actions.
 */
export function showInfo(message: string): void {
  vscode.window.showInformationMessage(`ERC-8004: ${message}`);
}

/**
 * Show a warning notification.
 */
export function showWarning(message: string): void {
  vscode.window.showWarningMessage(`ERC-8004: ${message}`);
}

/**
 * Show an error notification with optional detail.
 */
export function showError(message: string, detail?: string): void {
  const full = detail ? `${message}: ${detail}` : message;
  vscode.window.showErrorMessage(`ERC-8004: ${full}`);
}

/**
 * Show a transaction success notification with "View on Explorer" action.
 */
export async function showTxSuccess(
  message: string,
  txHash: string
): Promise<void> {
  const chainKey = getActiveChainKey();
  const url = getTxUrl(chainKey, txHash);
  const action = await vscode.window.showInformationMessage(
    `ERC-8004: ${message}`,
    'View on Explorer'
  );
  if (action === 'View on Explorer') {
    vscode.env.openExternal(vscode.Uri.parse(url));
  }
}

/**
 * Show a progress notification that wraps a task.
 */
export async function withProgress<T>(
  title: string,
  task: (
    progress: vscode.Progress<{ message?: string; increment?: number }>,
    token: vscode.CancellationToken
  ) => Promise<T>
): Promise<T> {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: `ERC-8004: ${title}`,
      cancellable: true,
    },
    task
  );
}

/**
 * Show a quick pick with chain selection.
 */
export async function pickChain(): Promise<string | undefined> {
  const items: vscode.QuickPickItem[] = [
    { label: 'BSC Testnet', description: 'Chain ID: 97', detail: 'bsc-testnet' },
    { label: 'BSC Mainnet', description: 'Chain ID: 56', detail: 'bsc-mainnet' },
    { label: 'Ethereum Sepolia', description: 'Chain ID: 11155111', detail: 'eth-sepolia' },
    { label: 'Ethereum Mainnet', description: 'Chain ID: 1', detail: 'eth-mainnet' },
  ];

  const selected = await vscode.window.showQuickPick(items, {
    placeHolder: 'Select blockchain network',
    title: 'ERC-8004: Switch Chain',
  });

  return selected?.detail;
}

/**
 * Require wallet connection, prompting if not connected.
 */
export async function requireWallet(): Promise<boolean> {
  const { isConnected } = await import('./wallet');
  if (!isConnected()) {
    const action = await vscode.window.showWarningMessage(
      'ERC-8004: No wallet connected. Connect now?',
      'Connect Wallet',
      'Cancel'
    );
    if (action === 'Connect Wallet') {
      await vscode.commands.executeCommand('erc8004.connectWallet');
      return isConnected();
    }
    return false;
  }
  return true;
}
