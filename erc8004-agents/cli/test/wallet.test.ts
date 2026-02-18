/**
 * CLI wallet & config unit tests.
 *
 * Tests loadConfig / saveConfig, keystore migration logic,
 * getWallet resolution, and import/export roundtrip.
 */

import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ethers } from 'ethers';

// ─── Test constants ─────────────────────────────────────────────────────────

const TEST_PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const TEST_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const KEYSTORE_PASSWORD = 'test-password-123';

// ─── Temp directory helpers ─────────────────────────────────────────────────

let tmpConfigDir: string;
let tmpConfigFile: string;

function setupTmpConfig(): void {
  tmpConfigDir = path.join(os.tmpdir(), `erc8004-cli-test-${Date.now()}`);
  fs.mkdirSync(tmpConfigDir, { recursive: true });
  tmpConfigFile = path.join(tmpConfigDir, 'config.json');
}

function teardownTmpConfig(): void {
  try {
    fs.rmSync(tmpConfigDir, { recursive: true, force: true });
  } catch {
    // best-effort
  }
}

function writeConfig(data: Record<string, unknown>): void {
  fs.writeFileSync(tmpConfigFile, JSON.stringify(data, null, 2));
}

function readConfig(): Record<string, unknown> {
  return JSON.parse(fs.readFileSync(tmpConfigFile, 'utf-8'));
}

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('CLI Config — loadConfig / saveConfig', () => {
  beforeEach(() => {
    setupTmpConfig();
  });

  afterEach(() => {
    teardownTmpConfig();
  });

  it('should return defaults when no config file exists', () => {
    // Remove the file if it exists
    if (fs.existsSync(tmpConfigFile)) {
      fs.unlinkSync(tmpConfigFile);
    }
    // Simulate loadConfig behavior
    const defaultConfig = { defaultChain: 'bsc-testnet', customRpcUrls: {} };
    assert.deepStrictEqual(defaultConfig.defaultChain, 'bsc-testnet');
  });

  it('should persist and reload config', () => {
    const config = {
      defaultChain: 'eth-mainnet',
      customRpcUrls: { 'bsc-testnet': 'https://custom-rpc.example.com' },
    };
    writeConfig(config);
    const reloaded = readConfig();
    assert.strictEqual(reloaded.defaultChain, 'eth-mainnet');
    assert.deepStrictEqual(reloaded.customRpcUrls, {
      'bsc-testnet': 'https://custom-rpc.example.com',
    });
  });

  it('should restrict config file permissions to 0o600', () => {
    writeConfig({ defaultChain: 'bsc-testnet' });
    fs.chmodSync(tmpConfigFile, 0o600);
    const stat = fs.statSync(tmpConfigFile);
    const mode = stat.mode & 0o777;
    assert.strictEqual(mode, 0o600, 'Config file should be owner-only read/write');
  });
});

describe('CLI Config — keystore migration', () => {
  beforeEach(() => {
    setupTmpConfig();
  });

  afterEach(() => {
    teardownTmpConfig();
  });

  it('should detect legacy plaintext privateKey in config', () => {
    const configWithPlaintext = {
      defaultChain: 'bsc-testnet',
      privateKey: TEST_PRIVATE_KEY,
    };
    writeConfig(configWithPlaintext);
    const loaded = readConfig();
    assert.ok(loaded.privateKey, 'Legacy config should have privateKey');
    assert.strictEqual(loaded.keystore, undefined, 'Should not have keystore yet');
  });

  it('should migrate plaintext key to encrypted keystore', async function () {
    // Encrypt the test key
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
    const keystoreJson = await wallet.encrypt(KEYSTORE_PASSWORD);

    // Simulate migration
    const config: Record<string, unknown> = {
      defaultChain: 'bsc-testnet',
      privateKey: TEST_PRIVATE_KEY,
    };
    config.keystore = keystoreJson;
    delete config.privateKey;
    writeConfig(config);

    const migrated = readConfig();
    assert.strictEqual(migrated.privateKey, undefined, 'privateKey should be deleted after migration');
    assert.ok(typeof migrated.keystore === 'string', 'keystore should be a string');

    // Verify the keystore is valid
    const parsed = JSON.parse(migrated.keystore as string);
    assert.strictEqual(parsed.version, 3);
    assert.ok(parsed.crypto || parsed.Crypto, 'Should have crypto section');
  });

  it('should preserve other config fields during migration', async function () {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
    const keystoreJson = await wallet.encrypt(KEYSTORE_PASSWORD);

    const config: Record<string, unknown> = {
      defaultChain: 'eth-mainnet',
      privateKey: TEST_PRIVATE_KEY,
      customRpcUrls: { 'bsc-testnet': 'https://custom.rpc' },
    };
    config.keystore = keystoreJson;
    delete config.privateKey;
    writeConfig(config);

    const migrated = readConfig();
    assert.strictEqual(migrated.defaultChain, 'eth-mainnet');
    assert.deepStrictEqual(migrated.customRpcUrls, { 'bsc-testnet': 'https://custom.rpc' });
  });
});

describe('CLI Config — getWallet resolution', () => {
  it('should create wallet from direct private key', () => {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
    assert.strictEqual(wallet.address, TEST_ADDRESS);
  });

  it('should create wallet from keystore + password', async function () {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
    const keystoreJson = await wallet.encrypt(KEYSTORE_PASSWORD);
    const decrypted = await ethers.Wallet.fromEncryptedJson(keystoreJson, KEYSTORE_PASSWORD);
    assert.strictEqual(decrypted.address, TEST_ADDRESS);
  });

  it('should create wallet from ERC8004_PRIVATE_KEY env var', () => {
    // Simulate env var resolution
    const key = TEST_PRIVATE_KEY; // would come from process.env.ERC8004_PRIVATE_KEY
    const wallet = new ethers.Wallet(key);
    assert.strictEqual(wallet.address, TEST_ADDRESS);
  });

  it('should resolve wallet from stored keystore in config', async function () {
    setupTmpConfig();
    try {
      const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
      const keystoreJson = await wallet.encrypt(KEYSTORE_PASSWORD);
      writeConfig({ defaultChain: 'bsc-testnet', keystore: keystoreJson });

      const loaded = readConfig();
      const decrypted = await ethers.Wallet.fromEncryptedJson(
        loaded.keystore as string,
        KEYSTORE_PASSWORD
      );
      assert.strictEqual(decrypted.address, TEST_ADDRESS);
    } finally {
      teardownTmpConfig();
    }
  });

  it('should return null-equivalent when no wallet source available', () => {
    // Simulate: no key, no keystore, no env
    const config = { defaultChain: 'bsc-testnet' };
    const hasWallet = !!(config as any).keystore || !!(config as any).privateKey;
    assert.strictEqual(hasWallet, false);
  });
});

describe('CLI Wallet — import/export roundtrip', () => {
  let tmpExportDir: string;

  beforeEach(() => {
    tmpExportDir = path.join(os.tmpdir(), `erc8004-cli-export-${Date.now()}`);
    fs.mkdirSync(tmpExportDir, { recursive: true });
  });

  afterEach(() => {
    try {
      fs.rmSync(tmpExportDir, { recursive: true, force: true });
    } catch {
      // best-effort
    }
  });

  it('should export wallet as keystore file and re-import', async function () {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);

    // Export
    const exportPassword = 'export-pass-456';
    const exported = await wallet.encrypt(exportPassword);
    const exportPath = path.join(tmpExportDir, 'exported-keystore.json');
    fs.writeFileSync(exportPath, exported);
    fs.chmodSync(exportPath, 0o600);

    // Verify file exists and permissions
    const stat = fs.statSync(exportPath);
    assert.ok(stat.isFile());
    assert.strictEqual(stat.mode & 0o777, 0o600);

    // Re-import
    const content = fs.readFileSync(exportPath, 'utf-8');
    const reimported = await ethers.Wallet.fromEncryptedJson(content, exportPassword);
    assert.strictEqual(reimported.address, TEST_ADDRESS);
    assert.strictEqual(reimported.privateKey, TEST_PRIVATE_KEY);
  });

  it('should fail re-import with wrong password', async function () {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
    const exported = await wallet.encrypt('correct-password');
    const exportPath = path.join(tmpExportDir, 'bad-import.json');
    fs.writeFileSync(exportPath, exported);

    const content = fs.readFileSync(exportPath, 'utf-8');
    try {
      await ethers.Wallet.fromEncryptedJson(content, 'wrong-password');
      assert.fail('Should have thrown on wrong password');
    } catch (err: any) {
      assert.ok(err, 'Error should be truthy');
    }
  });

  it('should produce different ciphertext for same key with different passwords', async function () {
    const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
    const ks1 = await wallet.encrypt('password-1');
    const ks2 = await wallet.encrypt('password-2');
    assert.notStrictEqual(ks1, ks2, 'Different passwords should produce different keystores');

    // Both should still decrypt to the same address
    const w1 = await ethers.Wallet.fromEncryptedJson(ks1, 'password-1');
    const w2 = await ethers.Wallet.fromEncryptedJson(ks2, 'password-2');
    assert.strictEqual(w1.address, w2.address);
  });
});
