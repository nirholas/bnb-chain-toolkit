/**
 * Status bar showing connected chain and agent count.
 */

import * as vscode from 'vscode';
import { getActiveChain, isConnected, shortenAddress, getWallet, getWalletAuthMethod } from '../utils/wallet';

export class ChainStatusBar {
  private statusBarItem: vscode.StatusBarItem;
  private agentCountItem: vscode.StatusBarItem;

  constructor() {
    // Chain indicator
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.statusBarItem.command = 'erc8004.walletActions';
    this.statusBarItem.tooltip = 'Click for wallet & chain actions';

    // Agent count
    this.agentCountItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      99
    );
    this.agentCountItem.command = 'erc8004.openDashboard';
    this.agentCountItem.tooltip = 'Open Agent Dashboard';

    this.update();
  }

  update(agentCount?: number): void {
    const chain = getActiveChain();
    const connected = isConnected();

    if (connected) {
      const wallet = getWallet()!;
      const authMethod = getWalletAuthMethod();
      const authIcon = authMethod === 'keystore' ? '🔒' : '🔑';
      const authLabel = authMethod === 'keystore' ? 'Encrypted Keystore' : 'Raw Private Key';
      this.statusBarItem.text = `$(globe) ${chain.name} · ${authIcon} ${shortenAddress(wallet.address)}`;
      this.statusBarItem.tooltip = new vscode.MarkdownString(
        `**ERC-8004 Wallet**\n\n` +
        `**Address:** \`${wallet.address}\`\n\n` +
        `**Chain:** ${chain.name} (ID: ${chain.chainId})\n\n` +
        `**Auth:** ${authIcon} ${authLabel}\n\n` +
        `_Click for wallet actions (switch chain, export keystore, disconnect)_`
      );
      this.statusBarItem.backgroundColor = chain.isTestnet
        ? new vscode.ThemeColor('statusBarItem.warningBackground')
        : undefined;
    } else {
      this.statusBarItem.text = `$(globe) ${chain.name} · Not Connected`;
      this.statusBarItem.tooltip = 'Click to connect wallet or switch chain';
      this.statusBarItem.backgroundColor = undefined;
    }
    this.statusBarItem.show();

    if (agentCount !== undefined && agentCount > 0) {
      this.agentCountItem.text = `$(robot) ${agentCount} agent${agentCount !== 1 ? 's' : ''}`;
      this.agentCountItem.show();
    } else {
      this.agentCountItem.hide();
    }
  }

  dispose(): void {
    this.statusBarItem.dispose();
    this.agentCountItem.dispose();
  }
}
