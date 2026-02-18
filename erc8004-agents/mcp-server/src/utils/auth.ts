/**
 * Shared Authentication Utilities for ERC-8004 MCP Server
 *
 * Supports two auth modes for write operations:
 *   1. PRIVATE_KEY env var (hex-encoded private key)
 *   2. KEYSTORE_FILE + KEYSTORE_PASSWORD env vars (encrypted JSON keystore)
 *
 * PRIVATE_KEY takes precedence if both are set.
 * The decrypted keystore wallet is cached so decryption only happens once.
 */

import { ethers } from 'ethers';
import { readFileSync } from 'node:fs';

// ─── Cached keystore wallet (decryption is CPU-intensive) ───

let _cachedKeystoreWallet: ethers.Wallet | ethers.HDNodeWallet | null = null;

/**
 * Require a signer (private key or keystore).
 * Returns an unconnected ethers.Wallet — call .connect(provider) before use.
 *
 * Priority: PRIVATE_KEY > KEYSTORE_FILE + KEYSTORE_PASSWORD
 */
export function requireSigner(): ethers.Wallet | ethers.HDNodeWallet {
  // 1. PRIVATE_KEY — fastest path
  const pk = process.env.PRIVATE_KEY;
  if (pk) {
    return new ethers.Wallet(pk);
  }

  // 2. KEYSTORE_FILE + KEYSTORE_PASSWORD
  const keystorePath = process.env.KEYSTORE_FILE;
  const keystorePassword = process.env.KEYSTORE_PASSWORD;

  if (keystorePath && keystorePassword) {
    if (!_cachedKeystoreWallet) {
      const json = readFileSync(keystorePath, 'utf-8');
      _cachedKeystoreWallet = ethers.Wallet.fromEncryptedJsonSync(
        json,
        keystorePassword
      );
    }
    return _cachedKeystoreWallet;
  }

  throw new Error(
    'Write operations require authentication. Set one of:\n' +
      '  • PRIVATE_KEY          — hex-encoded wallet private key (0x-prefixed)\n' +
      '  • KEYSTORE_FILE        — path to an encrypted JSON keystore file\n' +
      '    KEYSTORE_PASSWORD    — password to decrypt the keystore'
  );
}

/**
 * Detect which auth method is currently configured.
 * Returns a human-readable label for startup logging.
 */
export function getAuthStatus(): string {
  if (process.env.PRIVATE_KEY) {
    return 'private key';
  }
  if (process.env.KEYSTORE_FILE && process.env.KEYSTORE_PASSWORD) {
    return `keystore file (${process.env.KEYSTORE_FILE})`;
  }
  if (process.env.KEYSTORE_FILE && !process.env.KEYSTORE_PASSWORD) {
    return 'keystore file configured but KEYSTORE_PASSWORD is missing';
  }
  return 'none (read-only mode — set PRIVATE_KEY or KEYSTORE_FILE + KEYSTORE_PASSWORD)';
}
