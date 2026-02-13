/**
 * Hover provider for ERC-8004 contract addresses (0x8004...) in code.
 * Shows inline agent details and actions.
 */

import * as vscode from 'vscode';
import { ethers } from 'ethers';
import { getIdentityContract, ensureProvider, getActiveChain, getActiveChainKey } from '../utils/wallet';
import { CONTRACT_ADDRESSES } from '../utils/contracts';
import { getAddressUrl } from '../utils/chains';

/** Regex to match 0x8004 addresses */
const ADDRESS_PATTERN = /0x8004[a-fA-F0-9]{36}/g;

export class AgentHoverProvider implements vscode.HoverProvider {
  async provideHover(
    document: vscode.TextDocument,
    position: vscode.Position,
    _token: vscode.CancellationToken
  ): Promise<vscode.Hover | undefined> {
    const line = document.lineAt(position.line).text;
    const matches = [...line.matchAll(ADDRESS_PATTERN)];

    for (const match of matches) {
      const startIndex = match.index!;
      const endIndex = startIndex + match[0].length;
      const range = new vscode.Range(
        position.line,
        startIndex,
        position.line,
        endIndex
      );

      if (!range.contains(position)) {
        continue;
      }

      const address = match[0];
      const chain = getActiveChain();
      const chainKey = getActiveChainKey();

      // Identify if this is a known contract
      const contracts = CONTRACT_ADDRESSES[chainKey];
      let contractType: string | undefined;
      if (contracts) {
        if (address.toLowerCase() === contracts.identity.toLowerCase()) {
          contractType = 'Identity Registry';
        } else if (address.toLowerCase() === contracts.reputation.toLowerCase()) {
          contractType = 'Reputation Registry';
        } else if (address.toLowerCase() === contracts.validation.toLowerCase()) {
          contractType = 'Validation Registry';
        }
      }

      const markdown = new vscode.MarkdownString();
      markdown.isTrusted = true;
      markdown.supportHtml = true;

      markdown.appendMarkdown('### 🤖 ERC-8004 Address\n\n');
      markdown.appendMarkdown(`**Address:** \`${address}\`\n\n`);
      markdown.appendMarkdown(`**Chain:** ${chain.name} (${chain.chainId})\n\n`);

      if (contractType) {
        markdown.appendMarkdown(`**Contract:** ${contractType}\n\n`);
      }

      const explorerUrl = getAddressUrl(chainKey, address);
      markdown.appendMarkdown(`[View on Explorer](${explorerUrl}) · `);
      markdown.appendMarkdown(
        `[View Agent](command:erc8004.viewAgent) · `
      );
      markdown.appendMarkdown(
        `[Check Reputation](command:erc8004.viewReputation)\n`
      );

      return new vscode.Hover(markdown, range);
    }

    return undefined;
  }
}

/**
 * Code Lens provider for ERC-8004 addresses in code.
 */
export class AgentCodeLensProvider implements vscode.CodeLensProvider {
  private _onDidChangeCodeLenses = new vscode.EventEmitter<void>();
  readonly onDidChangeCodeLenses = this._onDidChangeCodeLenses.event;

  provideCodeLenses(
    document: vscode.TextDocument,
    _token: vscode.CancellationToken
  ): vscode.CodeLens[] {
    const lenses: vscode.CodeLens[] = [];

    for (let i = 0; i < document.lineCount; i++) {
      const line = document.lineAt(i).text;
      const matches = [...line.matchAll(ADDRESS_PATTERN)];

      for (const match of matches) {
        const startIndex = match.index!;
        const range = new vscode.Range(i, startIndex, i, startIndex + match[0].length);

        lenses.push(
          new vscode.CodeLens(range, {
            title: '🤖 View Agent',
            command: 'erc8004.viewAgent',
            arguments: [undefined], // Will prompt for token ID
          })
        );

        lenses.push(
          new vscode.CodeLens(range, {
            title: '⭐ Check Reputation',
            command: 'erc8004.viewReputation',
          })
        );
      }
    }

    return lenses;
  }
}
