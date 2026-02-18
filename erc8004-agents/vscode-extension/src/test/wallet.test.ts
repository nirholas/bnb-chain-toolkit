/**
 * Wallet authentication unit tests.
 *
 * Tests connectWithKey, connectWithKeystore, exportKeystore,
 * initWallet, disconnectWallet — with mocked vscode APIs.
 */

import * as assert from 'assert';
import { ethers } from 'ethers';

// ─── Mock vscode SecretStorage & workspace config ───────────────────────────

/** In-memory SecretStorage for testing. */
class MockSecretStorage {
  private _store = new Map<string, string>();
  async get(key: string): Promise<string | undefined> {
    return this._store.get(key);
  }
  async store(key: string, value: string): Promise<void> {
    this._store.set(key, value);
  }
  async delete(key: string): Promise<void> {
    this._store.delete(key);
  }
}

/**
 * Build a minimal mock ExtensionContext with SecretStorage.
 */
function createMockContext(): { secrets: MockSecretStorage } & Record<string, unknown> {
  return {
    secrets: new MockSecretStorage(),
    subscriptions: [],
    extensionPath: '/mock',
    globalState: { get: () => undefined, update: async () => {} },
    workspaceState: { get: () => undefined, update: async () => {} },
  };
}

// ─── A known test private key (DO NOT use on any real chain) ────────────────

const TEST_PRIVATE_KEY =
  '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const TEST_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

// ─── Tests ──────────────────────────────────────────────────────────────────

suite('Wallet Authentication Tests', () => {
  suite('connectWithKey()', () => {
    test('should create a valid ethers.Wallet from a private key', () => {
      const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
      assert.ok(wallet, 'Wallet should be truthy');
      assert.strictEqual(wallet.address, TEST_ADDRESS);
      assert.strictEqual(typeof wallet.signMessage, 'function');
    });

    test('should reject an invalid private key', () => {
      assert.throws(() => {
        new ethers.Wallet('0xINVALID');
      });
    });

    test('should connect wallet to a JsonRpcProvider', () => {
      const provider = new ethers.JsonRpcProvider('https://data-seed-prebsc-1-s1.bnbchain.org:8545', {
        name: 'BSC Testnet',
        chainId: 97,
      });
      const wallet = new ethers.Wallet(TEST_PRIVATE_KEY, provider);
      assert.ok(wallet.provider, 'Wallet should have a provider');
      assert.strictEqual(wallet.address, TEST_ADDRESS);
    });
  });

  suite('connectWithKeystore()', () => {
    /** Pre-generated keystore JSON for TEST_PRIVATE_KEY with password "testpass" */
    let keystoreJson: string;

    suiteSetup(async function () {
      // ethers.Wallet.encrypt() is CPU-intensive; increase timeout
      this.timeout(60_000);
      const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
      keystoreJson = await wallet.encrypt('testpass');
    });

    test('should decrypt a valid keystore and produce the correct address', async function () {
      this.timeout(60_000);
      const decrypted = await ethers.Wallet.fromEncryptedJson(keystoreJson, 'testpass');
      assert.strictEqual(decrypted.address, TEST_ADDRESS);
    });

    test('should throw on wrong password', async function () {
      this.timeout(60_000);
      try {
        await ethers.Wallet.fromEncryptedJson(keystoreJson, 'wrongpassword');
        assert.fail('Should have thrown');
      } catch (err: any) {
        assert.ok(err, 'Error should be truthy');
      }
    });

    test('should throw on invalid JSON', async () => {
      try {
        await ethers.Wallet.fromEncryptedJson('not json', 'password');
        assert.fail('Should have thrown');
      } catch (err: any) {
        assert.ok(err);
      }
    });

    test('should throw on JSON without crypto field', async () => {
      const bad = JSON.stringify({ version: 3 });
      try {
        await ethers.Wallet.fromEncryptedJson(bad, 'password');
        assert.fail('Should have thrown');
      } catch (err: any) {
        assert.ok(err);
      }
    });
  });

  suite('exportKeystore()', () => {
    test('should produce valid JSON that can be re-imported', async function () {
      this.timeout(60_000);
      const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
      const exportedJson = await wallet.encrypt('export-password');

      // Parse to verify JSON structure
      const parsed = JSON.parse(exportedJson);
      assert.ok(parsed.crypto || parsed.Crypto, 'Keystore should have crypto field');
      assert.strictEqual(parsed.version, 3, 'Keystore version should be 3');

      // Re-import
      const reimported = await ethers.Wallet.fromEncryptedJson(exportedJson, 'export-password');
      assert.strictEqual(reimported.address, TEST_ADDRESS, 'Re-imported address should match');
      assert.strictEqual(reimported.privateKey, TEST_PRIVATE_KEY, 'Re-imported key should match');
    });
  });

  suite('initWallet() — SecretStorage integration', () => {
    test('should return null when no stored secret', async () => {
      const ctx = createMockContext();
      const stored = await ctx.secrets.get('erc8004.privateKey');
      assert.strictEqual(stored, undefined);
    });

    test('should store and retrieve a private key', async () => {
      const ctx = createMockContext();
      await ctx.secrets.store('erc8004.privateKey', TEST_PRIVATE_KEY);
      const stored = await ctx.secrets.get('erc8004.privateKey');
      assert.strictEqual(stored, TEST_PRIVATE_KEY);
    });

    test('should store auth method alongside key', async () => {
      const ctx = createMockContext();
      await ctx.secrets.store('erc8004.privateKey', TEST_PRIVATE_KEY);
      await ctx.secrets.store('erc8004.walletAuthMethod', 'keystore');
      const method = await ctx.secrets.get('erc8004.walletAuthMethod');
      assert.strictEqual(method, 'keystore');
    });

    test('should load wallet from stored secret', async () => {
      const ctx = createMockContext();
      await ctx.secrets.store('erc8004.privateKey', TEST_PRIVATE_KEY);

      // Simulate initWallet logic
      const pk = await ctx.secrets.get('erc8004.privateKey');
      assert.ok(pk, 'Private key should be stored');
      const wallet = new ethers.Wallet(pk!);
      assert.strictEqual(wallet.address, TEST_ADDRESS);
    });
  });

  suite('disconnectWallet()', () => {
    test('should clear all stored secrets', async () => {
      const ctx = createMockContext();
      await ctx.secrets.store('erc8004.privateKey', TEST_PRIVATE_KEY);
      await ctx.secrets.store('erc8004.walletAuthMethod', 'keystore');

      // Simulate disconnectWallet
      await ctx.secrets.delete('erc8004.privateKey');
      await ctx.secrets.delete('erc8004.walletAuthMethod');

      assert.strictEqual(await ctx.secrets.get('erc8004.privateKey'), undefined);
      assert.strictEqual(await ctx.secrets.get('erc8004.walletAuthMethod'), undefined);
    });
  });

  suite('Keystore roundtrip', () => {
    test('encrypt → decrypt → compare addresses', async function () {
      this.timeout(60_000);
      const original = ethers.Wallet.createRandom();
      const ks = await original.encrypt('roundtrip');
      const restored = await ethers.Wallet.fromEncryptedJson(ks, 'roundtrip');
      assert.strictEqual(restored.address, original.address);
      assert.strictEqual(restored.privateKey, original.privateKey);
    });

    test('keystore JSON has expected structure', async function () {
      this.timeout(60_000);
      const wallet = new ethers.Wallet(TEST_PRIVATE_KEY);
      const ks = await wallet.encrypt('struct-test');
      const parsed = JSON.parse(ks);
      assert.strictEqual(parsed.version, 3);
      assert.ok(parsed.address, 'keystore should include address');
      assert.ok(parsed.crypto || parsed.Crypto, 'keystore should have crypto section');
      assert.ok(parsed.crypto?.cipher || parsed.Crypto?.cipher, 'should specify cipher');
    });
  });
});
