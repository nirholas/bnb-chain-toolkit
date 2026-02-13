/**
 * Status bar showing connected chain and agent count.
 */

import * as vscode from 'vscode';
import { getActiveChain, isConnected, shortenAddress, getWallet } from '../utils/wallet';

export class ChainStatusBar {
  private statusBarItem: vscode.StatusBarItem;
  private agentCountItem: vscode.StatusBarItem;

  constructor() {
    // Chain indicator
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Left,
      100
    );
    this.statusBarItem.command = 'erc8004.switchChain';
    this.statusBarItem.tooltip = 'Click to switch chain';

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
      this.statusBarItem.text = `$(globe) ${chain.name} · ${shortenAddress(wallet.address)}`;
      this.statusBarItem.backgroundColor = chain.isTestnet
        ? new vscode.ThemeColor('statusBarItem.warningBackground')
        : undefined;
    } else {
      this.statusBarItem.text = `$(globe) ${chain.name} · Not Connected`;
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
