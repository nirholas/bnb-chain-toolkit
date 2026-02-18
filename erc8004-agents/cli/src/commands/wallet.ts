/**
 * erc8004 wallet — Encrypted keystore wallet management.
 *
 * Subcommands:
 *   wallet import  — Import a keystore file or raw private key (encrypted at rest)
 *   wallet export  — Export current wallet as a keystore JSON file
 *   wallet show    — Display current wallet address and auth method
 *   wallet clear   — Remove stored wallet
 */

import * as fs from 'fs';
import * as path from 'path';
import { ethers } from 'ethers';
import inquirer from 'inquirer';
import ora from 'ora';
import chalk from 'chalk';
import {
  loadConfig,
  saveConfig,
  promptKeystorePassword,
} from '../utils/config';
import { header, field, printSuccess, printError, gold } from '../utils/display';

/**
 * wallet import — interactive: choose between keystore file or raw private key.
 */
export async function walletImportCommand(): Promise<void> {
  header('Import Wallet');

  const { method } = await inquirer.prompt([
    {
      type: 'list',
      name: 'method',
      message: 'Import method:',
      choices: [
        { name: 'Raw private key (will be encrypted)', value: 'key' },
        { name: 'Keystore JSON file', value: 'keystore' },
      ],
    },
  ]);

  if (method === 'key') {
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

    const { password } = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: 'Set encryption password for keystore:',
        mask: '*',
        validate: (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
      },
    ]);

    const { confirmPassword } = await inquirer.prompt([
      {
        type: 'password',
        name: 'confirmPassword',
        message: 'Confirm password:',
        mask: '*',
      },
    ]);

    if (password !== confirmPassword) {
      printError('Passwords do not match');
      return;
    }

    const spinner = ora('Encrypting wallet...').start();
    try {
      const wallet = new ethers.Wallet(key);
      const keystoreJson = await wallet.encrypt(password);

      const config = loadConfig();
      delete config.privateKey;
      config.keystore = keystoreJson;
      saveConfig(config);

      spinner.succeed('Wallet imported and encrypted');
      console.log();
      field('Address', wallet.address);
      field('Storage', '~/.erc8004/config.json (encrypted keystore)');
      console.log();
    } catch (error: any) {
      spinner.fail('Failed to encrypt wallet');
      printError(error.message || String(error));
    }
  } else {
    // Keystore file import
    const { filePath } = await inquirer.prompt([
      {
        type: 'input',
        name: 'filePath',
        message: 'Path to keystore JSON file:',
        validate: (v: string) => {
          const resolved = path.resolve(v);
          if (!fs.existsSync(resolved)) {
            return `File not found: ${resolved}`;
          }
          return true;
        },
      },
    ]);

    const keystoreContent = fs.readFileSync(path.resolve(filePath), 'utf-8');

    // Validate it's valid JSON keystore
    try {
      JSON.parse(keystoreContent);
    } catch {
      printError('File is not valid JSON');
      return;
    }

    const { password } = await inquirer.prompt([
      {
        type: 'password',
        name: 'password',
        message: 'Keystore password (to verify):',
        mask: '*',
      },
    ]);

    const spinner = ora('Decrypting keystore to verify...').start();
    try {
      const wallet = await ethers.Wallet.fromEncryptedJson(keystoreContent, password);
      spinner.succeed('Keystore verified');

      // Ask if they want to re-encrypt with a new password or keep existing
      const { reencrypt } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'reencrypt',
          message: 'Re-encrypt with a new password?',
          default: false,
        },
      ]);

      let finalKeystore = keystoreContent;
      if (reencrypt) {
        const { newPassword } = await inquirer.prompt([
          {
            type: 'password',
            name: 'newPassword',
            message: 'New encryption password:',
            mask: '*',
            validate: (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
          },
        ]);
        const { confirmNew } = await inquirer.prompt([
          {
            type: 'password',
            name: 'confirmNew',
            message: 'Confirm new password:',
            mask: '*',
          },
        ]);
        if (newPassword !== confirmNew) {
          printError('Passwords do not match');
          return;
        }
        const reSpinner = ora('Re-encrypting...').start();
        finalKeystore = await wallet.encrypt(newPassword);
        reSpinner.succeed('Re-encrypted');
      }

      const config = loadConfig();
      delete config.privateKey;
      config.keystore = finalKeystore;
      saveConfig(config);

      console.log();
      field('Address', wallet.address);
      field('Storage', '~/.erc8004/config.json (encrypted keystore)');
      console.log();
      printSuccess('Wallet imported successfully');
    } catch (error: any) {
      spinner.fail('Failed to decrypt keystore');
      printError('Wrong password or invalid keystore file');
    }
  }
}

/**
 * wallet export — Export current wallet as keystore JSON file.
 */
export async function walletExportCommand(): Promise<void> {
  header('Export Wallet');

  const config = loadConfig();
  if (!config.keystore && !config.privateKey) {
    printError('No wallet configured. Run `erc8004 wallet import` first.');
    return;
  }

  let wallet: ethers.Wallet;
  if (config.keystore) {
    const password = await promptKeystorePassword();
    const spinner = ora('Decrypting wallet...').start();
    try {
      wallet = await ethers.Wallet.fromEncryptedJson(config.keystore, password);
      spinner.succeed('Wallet decrypted');
    } catch {
      spinner.fail('Wrong password');
      return;
    }
  } else if (config.privateKey) {
    console.log(chalk.yellow('  ⚠ Warning: Using legacy plaintext key. Run `erc8004 wallet import` to encrypt it.'));
    wallet = new ethers.Wallet(config.privateKey);
  } else {
    printError('No wallet found');
    return;
  }

  field('Address', wallet.address);
  console.log();

  const { exportPassword } = await inquirer.prompt([
    {
      type: 'password',
      name: 'exportPassword',
      message: 'Password for exported keystore:',
      mask: '*',
      validate: (v: string) => v.length >= 8 || 'Password must be at least 8 characters',
    },
  ]);

  const { confirmPassword } = await inquirer.prompt([
    {
      type: 'password',
      name: 'confirmPassword',
      message: 'Confirm password:',
      mask: '*',
    },
  ]);

  if (exportPassword !== confirmPassword) {
    printError('Passwords do not match');
    return;
  }

  const { outputPath } = await inquirer.prompt([
    {
      type: 'input',
      name: 'outputPath',
      message: 'Output file path:',
      default: `./erc8004-keystore-${wallet.address.slice(0, 8).toLowerCase()}.json`,
    },
  ]);

  const spinner = ora('Encrypting keystore...').start();
  try {
    const keystoreJson = await wallet.encrypt(exportPassword);
    const resolved = path.resolve(outputPath);
    fs.writeFileSync(resolved, keystoreJson);
    fs.chmodSync(resolved, 0o600);
    spinner.succeed('Keystore exported');
    console.log();
    field('File', resolved);
    field('Address', wallet.address);
    console.log();
    console.log(chalk.yellow('  ⚠ Keep this file and password safe. Anyone with both can access your funds.'));
    console.log();
  } catch (error: any) {
    spinner.fail('Export failed');
    printError(error.message || String(error));
  }
}

/**
 * wallet show — Display current wallet address and auth method.
 */
export async function walletShowCommand(): Promise<void> {
  header('Wallet Info');

  const config = loadConfig();

  if (!config.keystore && !config.privateKey) {
    printError('No wallet configured. Run `erc8004 wallet import` first.');
    return;
  }

  if (config.keystore) {
    // Parse the keystore JSON to extract the address without decrypting
    try {
      const ks = JSON.parse(config.keystore);
      const address = ks.address ? ethers.getAddress('0x' + ks.address) : '(encrypted)';
      field('Address', address);
      field('Auth method', 'Encrypted keystore');
      field('Storage', '~/.erc8004/config.json');
    } catch {
      field('Auth method', 'Encrypted keystore');
      field('Address', '(unable to parse — keystore still valid)');
    }
  } else if (config.privateKey) {
    try {
      const wallet = new ethers.Wallet(config.privateKey);
      field('Address', wallet.address);
      field('Auth method', chalk.yellow('Plaintext private key (DEPRECATED)'));
      field('Storage', '~/.erc8004/config.json');
      console.log();
      console.log(chalk.yellow('  ⚠ Your private key is stored in plaintext. Run `erc8004 wallet import` to encrypt it.'));
    } catch {
      field('Auth method', chalk.yellow('Plaintext private key (DEPRECATED, invalid)'));
    }
  }

  // Check env var
  if (process.env.ERC8004_PRIVATE_KEY) {
    console.log();
    field('Env override', 'ERC8004_PRIVATE_KEY is set (takes precedence for commands)');
  }

  console.log();
}

/**
 * wallet clear — Remove stored wallet from config.
 */
export async function walletClearCommand(): Promise<void> {
  header('Clear Wallet');

  const config = loadConfig();

  if (!config.keystore && !config.privateKey) {
    console.log(chalk.dim('  No wallet stored in config.\n'));
    return;
  }

  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: 'Remove stored wallet from config? This cannot be undone.',
      default: false,
    },
  ]);

  if (!confirm) {
    console.log(chalk.dim('\n  Cancelled.\n'));
    return;
  }

  delete config.keystore;
  delete config.privateKey;
  saveConfig(config);
  printSuccess('Wallet removed from config');
  console.log();
}
