/**
 * ERC-8004 Agent Manager — VSCode Extension
 *
 * Create, manage, and discover ERC-8004 AI agents directly from the editor.
 * Supports BSC Testnet/Mainnet, Ethereum Sepolia/Mainnet.
 */

import * as vscode from 'vscode';
import {
  AgentTreeProvider,
  WalletTreeProvider,
} from './providers/AgentTreeProvider';
import { ChainStatusBar } from './providers/ChainStatusBar';
import {
  AgentHoverProvider,
  AgentCodeLensProvider,
} from './providers/AgentHoverProvider';
import { AgentCreatorPanel } from './webviews/AgentCreatorPanel';
import { AgentDashboard } from './webviews/AgentDashboard';
import { ReputationPanel } from './webviews/ReputationPanel';
import { registerAgent } from './commands/registerAgent';
import { viewAgent } from './commands/viewAgent';
import { updateAgent } from './commands/updateAgent';
import { searchAgents } from './commands/searchAgents';
import { generateConfig } from './commands/generateConfig';
import {
  initWallet,
  connectWallet,
  disconnectWallet,
  setActiveChain,
  getActiveChainKey,
  isConnected,
  getWallet,
  getIdentityContract,
  getActiveChain,
} from './utils/wallet';
import {
  showInfo,
  showError,
  showWarning,
  pickChain,
} from './utils/notifications';
import { getContracts } from './utils/contracts';
import { getAddressUrl, getTxUrl } from './utils/chains';

let statusBar: ChainStatusBar;
let agentTreeProvider: AgentTreeProvider;
let walletTreeProvider: WalletTreeProvider;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  console.log('ERC-8004 Agent Manager activating...');

  // Initialize default chain from settings
  const config = vscode.workspace.getConfiguration('erc8004');
  const defaultChain = config.get<string>('defaultChain') || 'bsc-testnet';
  setActiveChain(defaultChain);

  // --- Providers ---

  // Status bar
  statusBar = new ChainStatusBar();
  context.subscriptions.push({ dispose: () => statusBar.dispose() });

  // Tree views
  agentTreeProvider = new AgentTreeProvider();
  walletTreeProvider = new WalletTreeProvider();

  vscode.window.registerTreeDataProvider('erc8004-agents', agentTreeProvider);
  vscode.window.registerTreeDataProvider('erc8004-wallet', walletTreeProvider);

  // Hover provider for 0x8004 addresses
  const hoverProvider = new AgentHoverProvider();
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      ['javascript', 'typescript', 'solidity', 'json', 'markdown', 'python'],
      hoverProvider
    )
  );

  // Code lens for 0x8004 addresses
  const codeLensProvider = new AgentCodeLensProvider();
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      ['javascript', 'typescript', 'solidity', 'json'],
      codeLensProvider
    )
  );

  // --- Commands ---

  // Connect wallet
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.connectWallet', async () => {
      const privateKey = await vscode.window.showInputBox({
        title: 'Connect Wallet',
        prompt: 'Enter your private key (stored securely in VSCode Secrets)',
        password: true,
        placeHolder: '0x...',
        validateInput: (v: string) => {
          const key = v.trim();
          if (!key.startsWith('0x') || key.length !== 66) {
            return 'Must be a 64-character hex private key (with 0x prefix)';
          }
          return undefined;
        },
      });
      if (!privateKey) {
        return;
      }

      try {
        const wallet = await connectWallet(context, privateKey.trim());
        showInfo(`Connected: ${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`);
        refreshAll();
      } catch (error: any) {
        showError('Failed to connect wallet', error.message);
      }
    })
  );

  // Disconnect wallet
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.disconnectWallet', async () => {
      await disconnectWallet(context);
      showInfo('Wallet disconnected');
      refreshAll();
    })
  );

  // Register agent
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.registerAgent', () => {
      // Use the webview-based creator
      AgentCreatorPanel.createOrShow(context.extensionUri);
    })
  );

  // View agent
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.viewAgent', (tokenId?: string) => viewAgent(tokenId))
  );

  // Update agent
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.updateAgent', (tokenId?: string) => updateAgent(tokenId))
  );

  // Search agents
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.searchAgents', () => searchAgents())
  );

  // Switch chain
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.switchChain', async () => {
      const chainKey = await pickChain();
      if (chainKey) {
        setActiveChain(chainKey);
        showInfo(`Switched to ${getActiveChain().name}`);
        refreshAll();
      }
    })
  );

  // Generate .well-known files
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.generateWellKnown', () => generateConfig())
  );

  // Export agent config
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.exportConfig', async (tokenId?: string) => {
      if (!tokenId) {
        tokenId = await vscode.window.showInputBox({
          title: 'Export Agent Config',
          prompt: 'Enter the agent token ID',
          placeHolder: '42',
        });
      }
      if (!tokenId) {
        return;
      }

      try {
        const contract = getIdentityContract();
        const uri = await contract.tokenURI(tokenId);
        let json: Record<string, unknown>;

        if (uri.startsWith('data:application/json;base64,')) {
          json = JSON.parse(
            Buffer.from(uri.replace('data:application/json;base64,', ''), 'base64').toString('utf-8')
          );
        } else {
          json = { tokenURI: uri };
        }

        // Add on-chain metadata
        const owner = await contract.ownerOf(tokenId);
        json._onChain = {
          tokenId,
          owner,
          chain: getActiveChain().name,
          chainId: getActiveChain().chainId,
          contract: getContracts(getActiveChainKey()).identity,
        };

        const doc = await vscode.workspace.openTextDocument({
          content: JSON.stringify(json, null, 2),
          language: 'json',
        });
        await vscode.window.showTextDocument(doc);
      } catch (error: any) {
        showError('Export failed', error.message);
      }
    })
  );

  // Refresh agents
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.refreshAgents', () => refreshAll())
  );

  // Open dashboard
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.openDashboard', () => AgentDashboard.createOrShow())
  );

  // View reputation
  context.subscriptions.push(
    vscode.commands.registerCommand('erc8004.viewReputation', (tokenId?: string) =>
      ReputationPanel.show(tokenId)
    )
  );

  // --- Auto-connect ---
  if (config.get<boolean>('autoConnect')) {
    try {
      const wallet = await initWallet(context);
      if (wallet) {
        refreshAll();
      }
    } catch {
      // Silent fail for auto-connect
    }
  }

  // Listen for config changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e: vscode.ConfigurationChangeEvent) => {
      if (e.affectsConfiguration('erc8004.defaultChain')) {
        const newChain = vscode.workspace
          .getConfiguration('erc8004')
          .get<string>('defaultChain');
        if (newChain) {
          setActiveChain(newChain);
          refreshAll();
        }
      }
    })
  );

  console.log('ERC-8004 Agent Manager activated');
}

function refreshAll(): void {
  agentTreeProvider.refresh();
  walletTreeProvider.refresh();
  statusBar.update();
}

export function deactivate(): void {
  // Cleanup handled by disposables
}
