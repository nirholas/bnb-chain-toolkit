#!/usr/bin/env node
/**
 * ERC-8004 CLI — Terminal-based agent management.
 *
 * Usage:
 *   erc8004 register       Interactive agent registration
 *   erc8004 view <id>      View agent details
 *   erc8004 list            List agents for an address
 *   erc8004 search          Search/discover agents
 *   erc8004 update <id>    Update agent URI
 *   erc8004 reputation <id> Show reputation details
 *   erc8004 init            Scaffold .well-known files
 *   erc8004 chains          List supported chains
 */

import { Command } from 'commander';
import { registerCommand } from './commands/register';
import { viewCommand } from './commands/view';
import { listCommand } from './commands/list';
import { searchCommand } from './commands/search';
import { updateCommand } from './commands/update';
import { reputationCommand } from './commands/reputation';
import { initCommand } from './commands/init';
import { chainsCommand } from './commands/chains';
import {
  walletImportCommand,
  walletExportCommand,
  walletShowCommand,
  walletClearCommand,
} from './commands/wallet';

const program = new Command();

program
  .name('erc8004')
  .description('ERC-8004 AI Agent Management CLI — Register, view, and manage agents on BSC & Ethereum')
  .version('1.0.0');

// Register
program
  .command('register')
  .description('Register a new ERC-8004 agent (interactive)')
  .option('-n, --name <name>', 'Agent name')
  .option('-d, --desc <description>', 'Agent description')
  .option('-c, --chain <chain>', 'Chain (bsc-testnet, bsc-mainnet, opbnb-testnet, opbnb-mainnet, eth-sepolia, eth-mainnet)')
  .option('-k, --key <privateKey>', 'Private key (or set ERC8004_PRIVATE_KEY env)')
  .option('--keystore <file>', 'Path to keystore JSON file')
  .option('--keystore-password <password>', 'Keystore password (prompted if omitted)')
  .option('-u, --uri <uri>', 'Agent URI (HTTPS URL or will generate data URI)')
  .action(registerCommand);

// View
program
  .command('view <tokenId>')
  .description('View agent details')
  .option('-c, --chain <chain>', 'Chain to query')
  .action(viewCommand);

// List
program
  .command('list')
  .description('List agents for an address')
  .option('-o, --owner <address>', 'Owner address')
  .option('-c, --chain <chain>', 'Chain to query')
  .action(listCommand);

// Search
program
  .command('search')
  .description('Search/discover agents')
  .option('-s, --service <type>', 'Service type (A2A, MCP, OASF)')
  .option('-c, --chain <chain>', 'Chain to query')
  .option('-l, --limit <count>', 'Max results', '20')
  .action(searchCommand);

// Update
program
  .command('update <tokenId>')
  .description('Update agent URI')
  .option('-u, --uri <uri>', 'New URI')
  .option('-c, --chain <chain>', 'Chain')
  .option('-k, --key <privateKey>', 'Private key')
  .option('--keystore <file>', 'Path to keystore JSON file')
  .option('--keystore-password <password>', 'Keystore password (prompted if omitted)')
  .action(updateCommand);

// Reputation
program
  .command('reputation <tokenId>')
  .alias('rep')
  .description('Show reputation details for an agent')
  .option('-c, --chain <chain>', 'Chain to query')
  .action(reputationCommand);

// Init
program
  .command('init')
  .description('Scaffold .well-known/agent-card.json in current directory')
  .option('-n, --name <name>', 'Agent name')
  .option('-c, --chain <chain>', 'Target chain')
  .action(initCommand);

// Chains
program
  .command('chains')
  .description('List all supported chains with status')
  .action(chainsCommand);

// Wallet management
const walletCmd = program
  .command('wallet')
  .description('Manage encrypted wallet keystore');

walletCmd
  .command('import')
  .description('Import a keystore file or raw private key (encrypted at rest)')
  .action(walletImportCommand);

walletCmd
  .command('export')
  .description('Export current wallet as a keystore JSON file')
  .action(walletExportCommand);

walletCmd
  .command('show')
  .description('Display current wallet address and auth method')
  .action(walletShowCommand);

walletCmd
  .command('clear')
  .description('Remove stored wallet from config')
  .action(walletClearCommand);

program.parse();
