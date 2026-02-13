/**
 * erc8004 register — Interactive agent registration.
 */

import { ethers } from 'ethers';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import { getChain, loadConfig, IDENTITY_ABI } from '../utils/config';
import { header, field, printSuccess, printError, gold, link, shortAddr } from '../utils/display';

interface RegisterOptions {
  name?: string;
  desc?: string;
  chain?: string;
  key?: string;
  uri?: string;
}

export async function registerCommand(options: RegisterOptions): Promise<void> {
  header('Register New Agent');

  const chain = getChain(options.chain);
  field('Chain', `${chain.name} (ID: ${chain.chainId})`);
  console.log();

  // Get private key
  const privateKey = options.key || process.env.ERC8004_PRIVATE_KEY || (await promptPrivateKey());
  if (!privateKey) {
    printError('Private key is required. Set ERC8004_PRIVATE_KEY or use --key');
    return;
  }

  // Connect
  const provider = new ethers.JsonRpcProvider(chain.rpcUrl, {
    name: chain.name,
    chainId: chain.chainId,
  });
  const wallet = new ethers.Wallet(privateKey, provider);
  field('Wallet', shortAddr(wallet.address));

  const balance = ethers.formatEther(await provider.getBalance(wallet.address));
  field('Balance', `${parseFloat(balance).toFixed(4)} ${chain.currency}`);
  console.log();

  if (parseFloat(balance) === 0) {
    printError(`Insufficient balance. You need ${chain.currency} for gas fees.`);
    if (chain.isTestnet) {
      console.log(`  Get testnet tokens: ${link('https://www.bnbchain.org/en/testnet-faucet')}`);
    }
    return;
  }

  // Gather agent info
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Agent name:',
      default: options.name,
      validate: (v: string) => v.trim().length > 0 || 'Name is required',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description:',
      default: options.desc || '',
    },
    {
      type: 'input',
      name: 'image',
      message: 'Image URL (optional):',
    },
    {
      type: 'checkbox',
      name: 'serviceTypes',
      message: 'Service protocols:',
      choices: ['A2A', 'MCP', 'OASF', 'Custom'],
      default: ['A2A'],
    },
  ]);

  // Gather endpoints for each service
  const services: Array<{ name: string; endpoint: string; version?: string }> = [];
  for (const svc of answers.serviceTypes) {
    const svcAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'endpoint',
        message: `${svc} endpoint URL:`,
        validate: (v: string) => {
          try {
            new URL(v);
            return true;
          } catch {
            return 'Must be a valid URL';
          }
        },
      },
      {
        type: 'input',
        name: 'version',
        message: `${svc} version (optional):`,
        default: svc === 'A2A' ? '0.3.0' : svc === 'MCP' ? '2025-06-18' : '',
      },
    ]);
    services.push({
      name: svc,
      endpoint: svcAnswers.endpoint,
      ...(svcAnswers.version ? { version: svcAnswers.version } : {}),
    });
  }

  // Trust mechanisms
  const trustAnswers = await inquirer.prompt([
    {
      type: 'checkbox',
      name: 'trust',
      message: 'Trust mechanisms:',
      choices: ['reputation', 'crypto-economic', 'tee-attestation'],
      default: ['reputation'],
    },
    {
      type: 'confirm',
      name: 'x402',
      message: 'Enable x402 payment support?',
      default: false,
    },
    {
      type: 'list',
      name: 'uriMethod',
      message: 'Storage method:',
      choices: [
        { name: 'On-chain (base64 data URI)', value: 'onchain' },
        { name: 'HTTPS URL', value: 'https' },
      ],
    },
  ]);

  // Build registration JSON
  const registrationJson: Record<string, unknown> = {
    type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1',
    name: answers.name,
    description: answers.description,
    ...(answers.image ? { image: answers.image } : {}),
    services,
    x402Support: trustAnswers.x402,
    active: true,
    supportedTrust: trustAnswers.trust,
  };

  let agentURI: string;
  if (trustAnswers.uriMethod === 'https') {
    if (options.uri) {
      agentURI = options.uri;
    } else {
      const uriAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'uri',
          message: 'Agent URI (HTTPS URL):',
          validate: (v: string) => {
            try {
              new URL(v);
              return true;
            } catch {
              return 'Must be a valid URL';
            }
          },
        },
      ]);
      agentURI = uriAnswer.uri;
    }
  } else {
    const base64 = Buffer.from(JSON.stringify(registrationJson)).toString('base64');
    agentURI = `data:application/json;base64,${base64}`;
  }

  // Preview
  console.log();
  console.log(gold.bold('  Registration Preview:'));
  console.log(chalk.gray(JSON.stringify(registrationJson, null, 2).split('\n').map((l) => '  ' + l).join('\n')));
  console.log();

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Deploy agent "${answers.name}" on ${chain.name}?`,
      default: true,
    },
  ]);

  if (!confirm) {
    console.log(chalk.dim('\n  Cancelled.\n'));
    return;
  }

  // Deploy
  const spinner = ora('Sending registration transaction...').start();
  try {
    const contract = new ethers.Contract(chain.contracts.identity, IDENTITY_ABI, wallet);
    const tx = await contract.getFunction('register(string)').send(agentURI);
    spinner.text = `Transaction sent: ${shortAddr(tx.hash)}`;

    const receipt = await tx.wait();
    if (!receipt) {
      spinner.fail('Transaction receipt not found');
      return;
    }
    spinner.text = 'Parsing events...';

    // Parse agentId
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

    // Update URI with real agentId if on-chain
    if (agentId && trustAnswers.uriMethod === 'onchain') {
      spinner.text = 'Updating URI with agent ID...';
      registrationJson.registrations = [
        { agentId: parseInt(agentId), agentRegistry: chain.agentRegistry },
      ];
      const updatedBase64 = Buffer.from(JSON.stringify(registrationJson)).toString('base64');
      const updatedURI = `data:application/json;base64,${updatedBase64}`;
      const updateTx = await contract.setAgentURI(BigInt(agentId), updatedURI);
      await updateTx.wait();
    }

    spinner.succeed(gold.bold(`Agent registered! ID: #${agentId || 'unknown'}`));
    console.log();
    field('Transaction', link(`${chain.explorer}/tx/${receipt.hash}`));
    if (agentId) {
      field('Agent ID', agentId);
      field('Registry', chain.agentRegistry);
    }
    field('Chain', chain.name);
    console.log();
  } catch (error: any) {
    spinner.fail('Registration failed');
    printError(error.message || String(error));
  }
}

async function promptPrivateKey(): Promise<string | undefined> {
  const { key } = await inquirer.prompt([
    {
      type: 'password',
      name: 'key',
      message: 'Private key (0x...):',
      mask: '*',
      validate: (v: string) => {
        if (!v.startsWith('0x') || v.length !== 66) {
          return 'Must be a 64-character hex private key with 0x prefix';
        }
        return true;
      },
    },
  ]);
  return key;
}
