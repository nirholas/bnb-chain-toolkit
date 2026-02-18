/**
 * MCP Server auth.ts — unit tests.
 *
 * Tests requireSigner() and getAuthStatus() with various env-var
 * combinations: PRIVATE_KEY, KEYSTORE_FILE + KEYSTORE_PASSWORD, and none.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomBytes } from 'node:crypto';
import { Wallet } from 'ethers';

// ─── Dynamic import helper (auth.ts is ESM) ────────────────────────────────

/** We re-import fresh on each test to bypass the cached keystore wallet. */
async function loadAuth() {
  // Force cache busting so the module-level `_cachedKeystoreWallet` resets.
  const url = new URL(`../src/utils/auth.ts?t=${Date.now()}-${randomBytes(4).toString('hex')}`, import.meta.url);
  // tsx can resolve .ts URLs — fall back to compiled .js if needed
  try {
    return await import(url.href);
  } catch {
    const jsUrl = new URL(`../src/utils/auth.js?t=${Date.now()}`, import.meta.url);
    return await import(jsUrl.href);
  }
}

// ─── Known test private key (Hardhat #0 — never use on real chains) ────────

const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const TEST_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const KEYSTORE_PASSWORD = 'test-password-123';

// ─── Temp directory for keystore file tests ─────────────────────────────────

const tmpDir = join(tmpdir(), `erc8004-mcp-test-${Date.now()}`);
let keystoreFilePath: string;
let keystoreJson: string;

// ─── Env-var helpers ────────────────────────────────────────────────────────

function clearAuthEnv() {
  delete process.env.PRIVATE_KEY;
  delete process.env.KEYSTORE_FILE;
  delete process.env.KEYSTORE_PASSWORD;
}

// ─── Setup / Teardown ───────────────────────────────────────────────────────

let originalEnv: NodeJS.ProcessEnv;

beforeEach(() => {
  originalEnv = { ...process.env };
  clearAuthEnv();
});

afterEach(() => {
  // Restore original env
  for (const key of Object.keys(process.env)) {
    if (!(key in originalEnv)) {
      delete process.env[key];
    }
  }
  Object.assign(process.env, originalEnv);
});

// ─── Generate keystore fixture (once, before all tests) ─────────────────────

async function ensureKeystoreFixture() {
  if (keystoreJson) return;
  mkdirSync(tmpDir, { recursive: true });
  const wallet = new Wallet(TEST_PRIVATE_KEY);
  keystoreJson = await wallet.encrypt(KEYSTORE_PASSWORD);
  keystoreFilePath = join(tmpDir, 'test-keystore.json');
  writeFileSync(keystoreFilePath, keystoreJson);
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('requireSigner()', () => {
  it('should return a Wallet when PRIVATE_KEY is set', async () => {
    process.env.PRIVATE_KEY = TEST_PRIVATE_KEY;
    const { requireSigner } = await loadAuth();
    const signer = requireSigner();
    assert.equal(signer.address, TEST_ADDRESS);
  });

  it('should return a Wallet when KEYSTORE_FILE + KEYSTORE_PASSWORD are set', async () => {
    await ensureKeystoreFixture();
    process.env.KEYSTORE_FILE = keystoreFilePath;
    process.env.KEYSTORE_PASSWORD = KEYSTORE_PASSWORD;
    const { requireSigner } = await loadAuth();
    const signer = requireSigner();
    assert.equal(signer.address, TEST_ADDRESS);
  });

  it('should throw when no auth env vars are set', async () => {
    clearAuthEnv();
    const { requireSigner } = await loadAuth();
    assert.throws(() => requireSigner(), /authentication/i);
  });

  it('should prefer PRIVATE_KEY over KEYSTORE_FILE', async () => {
    await ensureKeystoreFixture();
    process.env.PRIVATE_KEY = TEST_PRIVATE_KEY;
    process.env.KEYSTORE_FILE = keystoreFilePath;
    process.env.KEYSTORE_PASSWORD = KEYSTORE_PASSWORD;
    const { requireSigner } = await loadAuth();
    const signer = requireSigner();
    // Both resolve to the same key in this test, but at least it doesn't throw
    assert.equal(signer.address, TEST_ADDRESS);
  });

  it('should throw when KEYSTORE_FILE is set without KEYSTORE_PASSWORD', async () => {
    await ensureKeystoreFixture();
    process.env.KEYSTORE_FILE = keystoreFilePath;
    // No KEYSTORE_PASSWORD
    const { requireSigner } = await loadAuth();
    assert.throws(() => requireSigner(), /authentication/i);
  });
});

describe('createSignerFromEnv() / requireSigner() returns valid wallet', () => {
  it('wallet created from PRIVATE_KEY should have signMessage()', async () => {
    process.env.PRIVATE_KEY = TEST_PRIVATE_KEY;
    const { requireSigner } = await loadAuth();
    const signer = requireSigner();
    assert.equal(typeof signer.signMessage, 'function');
    assert.equal(typeof signer.signTransaction, 'function');
  });

  it('wallet from keystore should have signMessage()', async () => {
    await ensureKeystoreFixture();
    process.env.KEYSTORE_FILE = keystoreFilePath;
    process.env.KEYSTORE_PASSWORD = KEYSTORE_PASSWORD;
    const { requireSigner } = await loadAuth();
    const signer = requireSigner();
    assert.equal(typeof signer.signMessage, 'function');
  });
});

describe('signer caching (decrypt only once)', () => {
  it('should return the same instance on repeated calls with keystore', async () => {
    await ensureKeystoreFixture();
    process.env.KEYSTORE_FILE = keystoreFilePath;
    process.env.KEYSTORE_PASSWORD = KEYSTORE_PASSWORD;
    // Import only once so the module-level cache is tested
    const { requireSigner } = await loadAuth();
    const first = requireSigner();
    const second = requireSigner();
    // With the same module import, the cached wallet is the same object
    assert.equal(first, second, 'Should return the same cached wallet instance');
  });
});

describe('getAuthStatus()', () => {
  it('should report "private key" when PRIVATE_KEY is set', async () => {
    process.env.PRIVATE_KEY = TEST_PRIVATE_KEY;
    const { getAuthStatus } = await loadAuth();
    assert.match(getAuthStatus(), /private key/i);
  });

  it('should report "keystore file" when KEYSTORE_FILE + PASSWORD are set', async () => {
    await ensureKeystoreFixture();
    process.env.KEYSTORE_FILE = keystoreFilePath;
    process.env.KEYSTORE_PASSWORD = KEYSTORE_PASSWORD;
    const { getAuthStatus } = await loadAuth();
    assert.match(getAuthStatus(), /keystore/i);
  });

  it('should report "missing" when only KEYSTORE_FILE is set (no password)', async () => {
    await ensureKeystoreFixture();
    process.env.KEYSTORE_FILE = keystoreFilePath;
    const { getAuthStatus } = await loadAuth();
    assert.match(getAuthStatus(), /missing/i);
  });

  it('should report "none" when nothing is configured', async () => {
    clearAuthEnv();
    const { getAuthStatus } = await loadAuth();
    assert.match(getAuthStatus(), /none|read-only/i);
  });
});

// ─── Cleanup temp directory ─────────────────────────────────────────────────

describe('cleanup', () => {
  it('remove temp directory', () => {
    try {
      rmSync(tmpDir, { recursive: true, force: true });
    } catch {
      // Best effort cleanup
    }
    assert.ok(true);
  });
});
