/**
 * Agent Tree View Provider — Shows registered agents in the sidebar.
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
  ensureProvider,
} from '../utils/wallet';
import { getContracts } from '../utils/contracts';
import { getTxUrl, getAddressUrl } from '../utils/chains';

export class AgentTreeProvider implements vscode.TreeDataProvider<AgentTreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<AgentTreeItem | undefined | null>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  private agents: AgentInfo[] = [];

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: AgentTreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(element?: AgentTreeItem): Promise<AgentTreeItem[]> {
    if (!isConnected()) {
      return [];
    }

    // Root level: list agents
    if (!element) {
      await this.loadAgents();
      if (this.agents.length === 0) {
        return [
          new AgentTreeItem(
            'No agents found',
            vscode.TreeItemCollapsibleState.None,
            'info',
            'Register your first agent with the + button above'
          ),
        ];
      }
      return this.agents.map(
        (agent) =>
          new AgentTreeItem(
            agent.name || `Agent #${agent.tokenId}`,
            vscode.TreeItemCollapsibleState.Collapsed,
            'agent',
            `Token ID: ${agent.tokenId}`,
            agent
          )
      );
    }

    // Agent details
    if (element.contextValue === 'agent' && element.agentInfo) {
      const info = element.agentInfo;
      const items: AgentTreeItem[] = [];

      items.push(
        new AgentTreeItem(
          `ID: ${info.tokenId}`,
          vscode.TreeItemCollapsibleState.None,
          'detail'
        )
      );
      items.push(
        new AgentTreeItem(
          `Owner: ${shortenAddress(info.owner)}`,
          vscode.TreeItemCollapsibleState.None,
          'detail'
        )
      );

      if (info.uri) {
        items.push(
          new AgentTreeItem(
            `URI: ${info.uri.length > 50 ? info.uri.slice(0, 50) + '...' : info.uri}`,
            vscode.TreeItemCollapsibleState.None,
            'detail'
          )
        );
      }

      if (info.services && info.services.length > 0) {
        items.push(
          new AgentTreeItem(
            'Services',
            vscode.TreeItemCollapsibleState.Collapsed,
            'services',
            undefined,
            info
          )
        );
      }

      if (info.wallet) {
        items.push(
          new AgentTreeItem(
            `Wallet: ${shortenAddress(info.wallet)}`,
            vscode.TreeItemCollapsibleState.None,
            'detail'
          )
        );
      }

      return items;
    }

    // Services sub-tree
    if (element.contextValue === 'services' && element.agentInfo?.services) {
      return element.agentInfo.services.map(
        (svc) =>
          new AgentTreeItem(
            `${svc.name}: ${svc.endpoint}`,
            vscode.TreeItemCollapsibleState.None,
            'service'
          )
      );
    }

    return [];
  }

  private async loadAgents(): Promise<void> {
    try {
      const wallet = getWallet();
      if (!wallet) {
        this.agents = [];
        return;
      }

      const contract = getIdentityContract();
      const address = wallet.address;

      // Query Transfer events to find agent IDs owned by this address
      const filter = contract.filters.Transfer(null, address);
      const events = await contract.queryFilter(filter);
      const agentIds = new Set<string>();

      for (const event of events) {
        const log = event as ethers.EventLog;
        if (log.args) {
          const tokenId = log.args[2].toString();
          // Verify still owned
          try {
            const owner = await contract.ownerOf(tokenId);
            if (owner.toLowerCase() === address.toLowerCase()) {
              agentIds.add(tokenId);
            }
          } catch {
            // Token may not exist or be owned by someone else
          }
        }
      }

      // Load agent details
      this.agents = [];
      for (const tokenId of agentIds) {
        try {
          const info = await this.loadAgentInfo(contract, tokenId, address);
          this.agents.push(info);
        } catch {
          this.agents.push({
            tokenId,
            owner: address,
            name: `Agent #${tokenId}`,
          });
        }
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
      this.agents = [];
    }
  }

  private async loadAgentInfo(
    contract: ethers.Contract,
    tokenId: string,
    owner: string
  ): Promise<AgentInfo> {
    const info: AgentInfo = { tokenId, owner };

    try {
      const uri = await contract.tokenURI(tokenId);
      info.uri = uri;

      // Parse URI if it's a data URI
      if (uri.startsWith('data:application/json;base64,')) {
        const base64 = uri.replace('data:application/json;base64,', '');
        const json = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
        info.name = json.name;
        info.description = json.description;
        info.services = json.services;
        info.image = json.image;
      } else if (uri.startsWith('http')) {
        // Could fetch HTTPS URI, but skip for tree view performance
        info.name = `Agent #${tokenId}`;
      }
    } catch {
      // tokenURI may not be set
    }

    try {
      const wallet = await contract.getAgentWallet(tokenId);
      if (wallet !== ethers.ZeroAddress) {
        info.wallet = wallet;
      }
    } catch {
      // getAgentWallet may fail
    }

    return info;
  }
}

export interface AgentInfo {
  tokenId: string;
  owner: string;
  name?: string;
  description?: string;
  uri?: string;
  services?: Array<{ name: string; endpoint: string; version?: string }>;
  image?: string;
  wallet?: string;
}

export class AgentTreeItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly description?: string,
    public readonly agentInfo?: AgentInfo
  ) {
    super(label, collapsibleState);
    this.contextValue = contextValue;

    if (contextValue === 'agent') {
      this.iconPath = new vscode.ThemeIcon('robot');
      this.command = {
        command: 'erc8004.viewAgent',
        title: 'View Agent',
        arguments: [agentInfo?.tokenId],
      };
    } else if (contextValue === 'service') {
      this.iconPath = new vscode.ThemeIcon('plug');
    } else if (contextValue === 'detail') {
      this.iconPath = new vscode.ThemeIcon('info');
    } else if (contextValue === 'info') {
      this.iconPath = new vscode.ThemeIcon('lightbulb');
    } else if (contextValue === 'services') {
      this.iconPath = new vscode.ThemeIcon('extensions');
    }
  }
}

/**
 * Wallet tree provider for the wallet view.
 */
export class WalletTreeProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<vscode.TreeItem | undefined | null>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element;
  }

  async getChildren(): Promise<vscode.TreeItem[]> {
    if (!isConnected()) {
      return [];
    }

    const wallet = getWallet()!;
    const chain = getActiveChain();
    const items: vscode.TreeItem[] = [];

    // Address
    const addrItem = new vscode.TreeItem(
      `Address: ${shortenAddress(wallet.address)}`,
      vscode.TreeItemCollapsibleState.None
    );
    addrItem.iconPath = new vscode.ThemeIcon('key');
    addrItem.tooltip = wallet.address;
    addrItem.command = {
      command: 'vscode.env.clipboard.writeText',
      title: 'Copy Address',
      arguments: [wallet.address],
    };
    items.push(addrItem);

    // Chain
    const chainItem = new vscode.TreeItem(
      `Chain: ${chain.name}`,
      vscode.TreeItemCollapsibleState.None
    );
    chainItem.iconPath = new vscode.ThemeIcon('globe');
    chainItem.description = `ID: ${chain.chainId}`;
    chainItem.command = {
      command: 'erc8004.switchChain',
      title: 'Switch Chain',
    };
    items.push(chainItem);

    // Balance
    try {
      const balance = await getBalance();
      const balItem = new vscode.TreeItem(
        `Balance: ${parseFloat(balance).toFixed(4)} ${chain.currency.symbol}`,
        vscode.TreeItemCollapsibleState.None
      );
      balItem.iconPath = new vscode.ThemeIcon('credit-card');
      items.push(balItem);
    } catch {
      const balItem = new vscode.TreeItem(
        'Balance: Unable to fetch',
        vscode.TreeItemCollapsibleState.None
      );
      balItem.iconPath = new vscode.ThemeIcon('warning');
      items.push(balItem);
    }

    // Disconnect
    const disconnectItem = new vscode.TreeItem(
      'Disconnect Wallet',
      vscode.TreeItemCollapsibleState.None
    );
    disconnectItem.iconPath = new vscode.ThemeIcon('debug-disconnect');
    disconnectItem.command = {
      command: 'erc8004.disconnectWallet',
      title: 'Disconnect',
    };
    items.push(disconnectItem);

    return items;
  }
}
