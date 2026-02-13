/**
 * erc8004 update <tokenId> — Update agent URI.
 */

import { ethers } from 'ethers';
import inquirer from 'inquirer';
import ora from 'ora';
import { getChain, IDENTITY_ABI } from '../utils/config';
import { header, field, printError, printSuccess, gold, link, shortAddr } from '../utils/display';

interface UpdateOptions {
  uri?: string;
  chain?: string;
  key?: string;
}

export async function updateCommand(tokenId: string, options: UpdateOptions): Promise<void> {
  header(`Update Agent #${tokenId}`);

  const chain = getChain(options.chain);
  field('Chain', `${chain.name} (${chain.chainId})`);

  // Get private key
  const privateKey = options.key || process.env.ERC8004_PRIVATE_KEY;
  if (!privateKey) {
    const { key } = await inquirer.prompt([
      {
        type: 'password',
        name: 'key',
        message: 'Private key (0x...):',
        mask: '*',
        validate: (v: string) => (v.startsWith('0x') && v.length === 66) || 'Invalid key format',
      },
    ]);
    if (!key) {
      printError('Private key is required');
      return;
    }
    options.key = key;
  }

  const provider = new ethers.JsonRpcProvider(chain.rpcUrl, {
    name: chain.name,
    chainId: chain.chainId,
  });
  const wallet = new ethers.Wallet(options.key as string, provider);
  const contract = new ethers.Contract(chain.contracts.identity, IDENTITY_ABI, wallet);

  // Verify ownership
  const spinner = ora('Verifying ownership...').start();
  try {
    const owner = await contract.ownerOf(tokenId);
    if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
      spinner.fail('Not the owner');
      printError(`Agent #${tokenId} is owned by ${shortAddr(owner)}, not ${shortAddr(wallet.address)}`);
      return;
    }
    spinner.stop();
  } catch (error: any) {
    spinner.fail('Agent not found');
    printError(error.message);
    return;
  }

  // Get current URI
  let currentUri = '';
  try {
    currentUri = await contract.tokenURI(tokenId);
    if (currentUri) {
      field('Current URI', currentUri.length > 80 ? currentUri.slice(0, 77) + '...' : currentUri);
    }
  } catch {
    // No URI set
  }

  // Get new URI
  let newUri = options.uri;
  if (!newUri) {
    const { method } = await inquirer.prompt([
      {
        type: 'list',
        name: 'method',
        message: 'Update method:',
        choices: [
          { name: 'Enter HTTPS URL', value: 'https' },
          { name: 'Enter JSON (generates data URI)', value: 'json' },
          { name: 'Enter raw URI', value: 'raw' },
        ],
      },
    ]);

    if (method === 'https') {
      const { uri } = await inquirer.prompt([
        {
          type: 'input',
          name: 'uri',
          message: 'New HTTPS URL:',
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
      newUri = uri;
    } else if (method === 'json') {
      // If we have current metadata, let them edit it
      let defaultJson = '{}';
      if (currentUri.startsWith('data:application/json;base64,')) {
        try {
          const base64 = currentUri.replace('data:application/json;base64,', '');
          defaultJson = JSON.stringify(JSON.parse(Buffer.from(base64, 'base64').toString('utf-8')), null, 2);
        } catch {
          // Use empty
        }
      }

      const { json } = await inquirer.prompt([
        {
          type: 'editor',
          name: 'json',
          message: 'Edit agent metadata JSON:',
          default: defaultJson,
          validate: (v: string) => {
            try {
              JSON.parse(v);
              return true;
            } catch {
              return 'Must be valid JSON';
            }
          },
        },
      ]);
      const base64 = Buffer.from(json).toString('base64');
      newUri = `data:application/json;base64,${base64}`;
    } else {
      const { uri } = await inquirer.prompt([
        { type: 'input', name: 'uri', message: 'New URI:' },
      ]);
      newUri = uri;
    }
  }

  if (!newUri) {
    printError('URI is required');
    return;
  }

  // Confirm
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `Update agent #${tokenId} URI on ${chain.name}?`,
      default: true,
    },
  ]);
  if (!confirm) {
    return;
  }

  // Send transaction
  const txSpinner = ora('Sending update transaction...').start();
  try {
    const tx = await contract.setAgentURI(BigInt(tokenId), newUri);
    txSpinner.text = `Tx sent: ${shortAddr(tx.hash)}`;

    const receipt = await tx.wait();
    txSpinner.succeed(gold.bold(`Agent #${tokenId} URI updated`));
    console.log();
    field('Transaction', link(`${chain.explorer}/tx/${receipt.hash}`));
    console.log();
  } catch (error: any) {
    txSpinner.fail('Update failed');
    printError(error.message || String(error));
  }
}
