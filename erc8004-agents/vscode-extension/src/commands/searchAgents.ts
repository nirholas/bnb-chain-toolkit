/**
 * Search/discover agents on the current chain.
 */

import * as vscode from 'vscode';
import { ethers } from 'ethers';
import { getIdentityContract, getActiveChain, getActiveChainKey, ensureProvider } from '../utils/wallet';
import { showError, withProgress } from '../utils/notifications';
import { getContracts } from '../utils/contracts';
import { getAddressUrl } from '../utils/chains';

interface DiscoveredAgent {
  tokenId: string;
  owner: string;
  name: string;
  uri: string;
  services: string[];
}

export async function searchAgents(): Promise<void> {
  const searchType = await vscode.window.showQuickPick(
    [
      { label: 'By Owner Address', description: 'List all agents for a wallet address', detail: 'owner' },
      { label: 'By Token ID', description: 'Look up a specific agent', detail: 'id' },
      { label: 'By Service Type', description: 'Find agents offering a specific service', detail: 'service' },
      { label: 'Recent Registrations', description: 'Browse recently registered agents', detail: 'recent' },
    ],
    { title: 'Search Agents', placeHolder: 'How would you like to search?' }
  );
  if (!searchType) {
    return;
  }

  if (searchType.detail === 'id') {
    await vscode.commands.executeCommand('erc8004.viewAgent');
    return;
  }

  if (searchType.detail === 'owner') {
    const address = await vscode.window.showInputBox({
      title: 'Search by Owner',
      prompt: 'Enter wallet address (0x...)',
      placeHolder: '0x...',
      validateInput: (v: string) => {
        if (!ethers.isAddress(v.trim())) {
          return 'Must be a valid Ethereum address';
        }
        return undefined;
      },
    });
    if (!address) {
      return;
    }

    await searchByOwner(address.trim());
    return;
  }

  if (searchType.detail === 'service') {
    const service = await vscode.window.showQuickPick(
      ['A2A', 'MCP', 'OASF', 'ENS', 'DID'],
      { title: 'Service Type', placeHolder: 'Select service type to search for' }
    );
    if (!service) {
      return;
    }

    await searchByService(service);
    return;
  }

  if (searchType.detail === 'recent') {
    await searchRecent();
  }
}

async function searchByOwner(address: string): Promise<void> {
  await withProgress('Searching agents...', async (progress) => {
    try {
      const contract = getIdentityContract();

      progress.report({ message: 'Querying Transfer events...' });
      const filter = contract.filters.Transfer(null, address);
      const events = await contract.queryFilter(filter);

      const agents: DiscoveredAgent[] = [];
      for (const event of events) {
        const log = event as ethers.EventLog;
        if (log.args) {
          const tokenId = log.args[2].toString();
          try {
            const owner = await contract.ownerOf(tokenId);
            if (owner.toLowerCase() === address.toLowerCase()) {
              const agent = await loadAgentSummary(contract, tokenId, owner);
              agents.push(agent);
            }
          } catch {
            // Skip
          }
        }
      }

      displaySearchResults(agents, `Agents owned by ${address.slice(0, 8)}...`);
    } catch (error: any) {
      showError('Search failed', error.message || String(error));
    }
  });
}

async function searchByService(serviceType: string): Promise<void> {
  await withProgress(`Searching for ${serviceType} agents...`, async (progress) => {
    try {
      const contract = getIdentityContract();

      progress.report({ message: 'Scanning recent registrations...' });
      const filter = contract.filters.Registered();
      const events = await contract.queryFilter(filter, -10000); // Last ~10K blocks

      const agents: DiscoveredAgent[] = [];
      for (const event of events) {
        const log = event as ethers.EventLog;
        if (log.args) {
          const tokenId = log.args[0].toString();
          const agentUri = log.args[1];

          // Check if URI contains the service type
          if (agentUri && agentUri.includes(serviceType)) {
            try {
              const owner = await contract.ownerOf(tokenId);
              const agent = await loadAgentSummary(contract, tokenId, owner);
              if (agent.services.includes(serviceType)) {
                agents.push(agent);
              }
            } catch {
              // Skip
            }
          }
        }
      }

      displaySearchResults(agents, `${serviceType} Agents`);
    } catch (error: any) {
      showError('Search failed', error.message || String(error));
    }
  });
}

async function searchRecent(): Promise<void> {
  await withProgress('Loading recent agents...', async (progress) => {
    try {
      const contract = getIdentityContract();

      progress.report({ message: 'Querying recent Transfer events...' });
      const filter = contract.filters.Transfer(ethers.ZeroAddress);
      const events = await contract.queryFilter(filter, -5000); // Last ~5K blocks

      const agents: DiscoveredAgent[] = [];
      const seen = new Set<string>();

      for (const event of events.slice(-20).reverse()) {
        const log = event as ethers.EventLog;
        if (log.args) {
          const tokenId = log.args[2].toString();
          if (seen.has(tokenId)) {
            continue;
          }
          seen.add(tokenId);

          try {
            const owner = await contract.ownerOf(tokenId);
            const agent = await loadAgentSummary(contract, tokenId, owner);
            agents.push(agent);
          } catch {
            // Skip
          }
        }
      }

      displaySearchResults(agents, 'Recent Registrations');
    } catch (error: any) {
      showError('Search failed', error.message || String(error));
    }
  });
}

async function loadAgentSummary(
  contract: ethers.Contract,
  tokenId: string,
  owner: string
): Promise<DiscoveredAgent> {
  const agent: DiscoveredAgent = {
    tokenId,
    owner,
    name: `Agent #${tokenId}`,
    uri: '',
    services: [],
  };

  try {
    const uri = await contract.tokenURI(tokenId);
    agent.uri = uri;

    if (uri.startsWith('data:application/json;base64,')) {
      const base64 = uri.replace('data:application/json;base64,', '');
      const json = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
      agent.name = json.name || agent.name;
      agent.services = (json.services || []).map((s: any) => s.name);
    }
  } catch {
    // No URI
  }

  return agent;
}

function displaySearchResults(agents: DiscoveredAgent[], title: string): void {
  if (agents.length === 0) {
    vscode.window.showInformationMessage(`ERC-8004: No agents found for "${title}"`);
    return;
  }

  const items: vscode.QuickPickItem[] = agents.map((a) => ({
    label: `$(robot) ${a.name}`,
    description: `#${a.tokenId}`,
    detail: `Owner: ${a.owner.slice(0, 10)}... | Services: ${a.services.join(', ') || 'None'}`,
  }));

  vscode.window
    .showQuickPick(items, {
      title: `ERC-8004: ${title} (${agents.length} found)`,
      placeHolder: 'Select an agent to view details',
    })
    .then((selected: vscode.QuickPickItem | undefined) => {
      if (selected) {
        const tokenId = selected.description?.replace('#', '');
        if (tokenId) {
          vscode.commands.executeCommand('erc8004.viewAgent', tokenId);
        }
      }
    });
}
