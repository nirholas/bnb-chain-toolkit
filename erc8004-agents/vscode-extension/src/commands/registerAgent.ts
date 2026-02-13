/**
 * Register a new ERC-8004 agent via interactive form.
 */

import * as vscode from 'vscode';
import { ethers } from 'ethers';
import {
  getWallet,
  getIdentityContract,
  getActiveChain,
  getActiveChainKey,
} from '../utils/wallet';
import { showTxSuccess, showError, withProgress, requireWallet } from '../utils/notifications';
import { getTxUrl } from '../utils/chains';

interface AgentRegistration {
  name: string;
  description: string;
  image?: string;
  services: Array<{ name: string; endpoint: string; version?: string }>;
  x402Support: boolean;
  supportedTrust: string[];
  metadata: Array<{ key: string; value: string }>;
}

export async function registerAgent(): Promise<void> {
  if (!(await requireWallet())) {
    return;
  }

  // Step 1: Agent Identity
  const name = await vscode.window.showInputBox({
    title: 'Agent Name (1/4)',
    prompt: 'Enter a name for your AI agent',
    placeHolder: 'My AI Agent',
    validateInput: (v: string) => (v.trim().length === 0 ? 'Name is required' : undefined),
  });
  if (!name) {return;}

  const description = await vscode.window.showInputBox({
    title: 'Agent Description (1/4)',
    prompt: 'Describe what your agent does',
    placeHolder: 'An autonomous AI agent that...',
  });
  if (description === undefined) {return;}

  const image = await vscode.window.showInputBox({
    title: 'Agent Image URL (1/4)',
    prompt: 'Optional: HTTPS URL to agent avatar/image',
    placeHolder: 'https://example.com/agent-avatar.png',
  });

  // Step 2: Services
  const serviceTypes = await vscode.window.showQuickPick(
    [
      { label: 'A2A', description: 'Agent-to-Agent Protocol', picked: true },
      { label: 'MCP', description: 'Model Context Protocol' },
      { label: 'OASF', description: 'Open Agent Service Framework' },
      { label: 'Custom', description: 'Custom service endpoint' },
    ],
    {
      title: 'Agent Services (2/4)',
      placeHolder: 'Select service protocols',
      canPickMany: true,
    }
  );
  if (!serviceTypes) {return;}

  const services: Array<{ name: string; endpoint: string; version?: string }> = [];
  for (const svc of serviceTypes) {
    const endpoint = await vscode.window.showInputBox({
      title: `${svc.label} Endpoint (2/4)`,
      prompt: `Enter the ${svc.label} endpoint URL`,
      placeHolder: `https://api.example.com/${svc.label.toLowerCase()}`,
      validateInput: (v: string) => {
        if (v.trim().length === 0) {return 'Endpoint is required';}
        try {
          new URL(v);
          return undefined;
        } catch {
          return 'Must be a valid URL';
        }
      },
    });
    if (!endpoint) {return;}

    const version = await vscode.window.showInputBox({
      title: `${svc.label} Version (2/4)`,
      prompt: `Optional: Protocol version`,
      placeHolder: svc.label === 'A2A' ? '0.3.0' : svc.label === 'MCP' ? '2025-06-18' : '1.0.0',
    });

    services.push({ name: svc.label, endpoint, version: version || undefined });
  }

  // Step 3: Trust & Settings
  const trustMechanisms = await vscode.window.showQuickPick(
    [
      { label: 'reputation', description: 'On-chain reputation scoring', picked: true },
      { label: 'crypto-economic', description: 'Staking-based trust' },
      { label: 'tee-attestation', description: 'TEE-based attestation' },
    ],
    {
      title: 'Trust Mechanisms (3/4)',
      placeHolder: 'Select supported trust mechanisms',
      canPickMany: true,
    }
  );

  const x402 = await vscode.window.showQuickPick(
    [
      { label: 'Yes', description: 'Enable x402 payment support' },
      { label: 'No', description: 'No payment integration' },
    ],
    {
      title: 'x402 Payment Support (3/4)',
      placeHolder: 'Enable payment support?',
    }
  );

  // Step 4: URI method
  const uriMethod = await vscode.window.showQuickPick(
    [
      { label: 'On-chain (base64)', description: 'Store metadata as data URI on-chain', detail: 'onchain' },
      { label: 'HTTPS URL', description: 'Point to hosted JSON file', detail: 'https' },
    ],
    {
      title: 'Storage Method (4/4)',
      placeHolder: 'How should agent metadata be stored?',
    }
  );
  if (!uriMethod) {return;}

  // Build registration JSON
  const chain = getActiveChain();
  const registrationJson: Record<string, unknown> = {
    type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1',
    name,
    description: description || '',
    ...(image ? { image } : {}),
    services,
    x402Support: x402?.label === 'Yes',
    active: true,
    supportedTrust: trustMechanisms?.map((t: { label: string }) => t.label) || ['reputation'],
  };

  let agentURI: string;
  if (uriMethod.detail === 'https') {
    const uri = await vscode.window.showInputBox({
      title: 'Agent URI',
      prompt: 'Enter the HTTPS URL where agent metadata will be hosted',
      placeHolder: 'https://example.com/.well-known/agent-card.json',
      validateInput: (v: string) => {
        try {
          new URL(v);
          return undefined;
        } catch {
          return 'Must be a valid HTTPS URL';
        }
      },
    });
    if (!uri) {return;}
    agentURI = uri;
  } else {
    const base64 = Buffer.from(JSON.stringify(registrationJson)).toString('base64');
    agentURI = `data:application/json;base64,${base64}`;
  }

  // Confirm
  const confirm = await vscode.window.showInformationMessage(
    `Register agent "${name}" on ${chain.name}?`,
    { modal: true, detail: `Services: ${services.map((s) => s.name).join(', ')}\nURI Method: ${uriMethod.label}` },
    'Deploy'
  );
  if (confirm !== 'Deploy') {return;}

  // Deploy
  await withProgress('Registering agent...', async (progress) => {
    try {
      const contract = getIdentityContract();
      progress.report({ message: 'Estimating gas...' });

      const tx = await contract.getFunction('register(string)').send(agentURI);
      progress.report({ message: `Transaction sent: ${tx.hash.slice(0, 10)}...` });

      const receipt = await tx.wait();
      if (!receipt) { throw new Error('Transaction receipt not found'); }
      progress.report({ message: 'Confirmed!' });

      // Parse the Registered event to get the agentId
      let agentId: string | undefined;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog({
            topics: log.topics as string[],
            data: log.data,
          });
          if (parsed && parsed.name === 'Registered') {
            agentId = parsed.args[0].toString();
            break;
          }
        } catch {
          // Not our event
        }
      }

      if (agentId) {
        // If on-chain, update URI with real agentId in registrations
        if (uriMethod.detail === 'onchain') {
          registrationJson.registrations = [
            {
              agentId: parseInt(agentId),
              agentRegistry: chain.agentRegistry,
            },
          ];
          const updatedBase64 = Buffer.from(JSON.stringify(registrationJson)).toString('base64');
          const updatedURI = `data:application/json;base64,${updatedBase64}`;

          progress.report({ message: 'Updating URI with agent ID...' });
          const updateTx = await contract.setAgentURI(BigInt(agentId), updatedURI);
          await updateTx.wait();
        }

        await showTxSuccess(
          `Agent "${name}" registered with ID #${agentId}`,
          receipt!.hash
        );
      } else {
        await showTxSuccess('Agent registered successfully', receipt!.hash);
      }

      // Refresh tree view
      vscode.commands.executeCommand('erc8004.refreshAgents');
    } catch (error: any) {
      showError('Registration failed', error.message || String(error));
    }
  });
}
