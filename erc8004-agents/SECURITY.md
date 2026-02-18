# Security — ERC-8004 Agent Creator

> Authentication security model for the ERC-8004 agent toolkit components.

## Overview

ERC-8004 Agent Creator provides three components that handle cryptographic key material:

| Component | Auth Methods | Key Storage |
|-----------|-------------|-------------|
| **VS Code Extension** | Private key, Keystore import | VS Code SecretStorage (OS-level encrypted) |
| **MCP Server** | `PRIVATE_KEY` env var, `KEYSTORE_FILE` + `KEYSTORE_PASSWORD` env vars | Environment variables (runtime only) |
| **CLI** | Encrypted keystore in config, `--key` flag (deprecated), `ERC8004_PRIVATE_KEY` env var | `~/.erc8004/config.json` (0o600 permissions) |

---

## Wallet Authentication Methods

### 1. Encrypted Keystore (Recommended)

All three components support [Ethereum V3 Keystore](https://ethereum.org/en/developers/docs/data-structures-and-encoding/#keystore) files — the industry standard for encrypted key storage.

- **Encryption**: scrypt KDF + AES-128-CTR cipher
- **At rest**: Private key is encrypted; password is required to decrypt
- **In transit**: Keystore JSON can be safely copied between machines (password-protected)

**Security properties:**
- Private key never stored in plaintext on disk
- Password is used transiently (only during decrypt) and then discarded
- Keystore files use `chmod 600` (owner read/write only)

### 2. Raw Private Key (Legacy / CI)

Supported for backward compatibility and CI/CD pipelines.

- **VS Code**: Stored in SecretStorage (encrypted by the OS keyring)
- **MCP Server**: Passed via `PRIVATE_KEY` environment variable (runtime only)
- **CLI**: Deprecated `--key` flag prints a warning; old plaintext config is auto-migrated

### 3. Environment Variables (CI/CD)

For automated pipelines where interactive password entry is not possible:

- `PRIVATE_KEY` — hex-encoded private key with `0x` prefix
- `KEYSTORE_FILE` + `KEYSTORE_PASSWORD` — path to keystore + password
- `ERC8004_PRIVATE_KEY` (CLI only) — overrides stored config

---

## Security Guarantees

### Private keys are never logged

All components follow these rules:

1. **No `console.log` of key material** — private keys, passwords, and keystore decrypted content are never printed to stdout/stderr
2. **No telemetry** — no data is sent to external services
3. **No network transmission** — keys are used locally to sign transactions; only signed transactions are broadcast

### Password handling

- Keystore passwords are used **transiently** — only during the decrypt operation
- Passwords are **never stored** in config files, environment, or secret storage
- The VS Code extension prompts for passwords via `showInputBox({ password: true })` which masks input
- The CLI uses `inquirer` with `type: 'password'` and `mask: '*'`

### Config file security

The CLI stores its config at `~/.erc8004/config.json`:

- File permissions are set to `0o600` (owner read/write only) on every write
- After keystore migration, the plaintext `privateKey` field is deleted and replaced with an encrypted `keystore` field
- The migration is automatic on first CLI invocation after upgrade

### VS Code SecretStorage

The VS Code extension uses the built-in `SecretStorage` API:

- On macOS: stored in Keychain
- On Linux: stored in libsecret (GNOME Keyring / KWallet)
- On Windows: stored in Windows Credential Manager
- Keys are encrypted at rest by the operating system

---

## Threat Model

| Threat | Mitigation |
|--------|-----------|
| Disk compromise | Keystore encryption (scrypt + AES-128-CTR); config file permissions (0o600) |
| Process memory dump | Keys exist in memory only during signing; no persistent in-memory caching of raw keys beyond the session |
| Shoulder surfing | Password inputs are masked in all UIs |
| Log file leaks | No private key material logged anywhere |
| Config file left world-readable | `chmod 600` enforced on every write; migration removes plaintext keys |
| Clipboard sniffing | Private keys are never copied to clipboard by the tools |
| Environment variable exposure | Users warned to use keystore over raw env vars; `PRIVATE_KEY` env var is standard practice for Ethereum tooling |

---

## CLI Migration: Plaintext to Keystore

When the CLI detects a legacy `privateKey` field in `~/.erc8004/config.json`:

1. User is prompted to set an encryption password (min 8 characters)
2. Password is confirmed with a second prompt
3. Private key is encrypted into a V3 keystore JSON
4. The encrypted keystore replaces the plaintext key in config
5. The `privateKey` field is **deleted** from the config file
6. Config file permissions are set to `0o600`

If migration fails (e.g., passwords don't match), the plaintext key is left unchanged and migration retries on next invocation.

---

## Reporting Security Issues

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public GitHub issue**
2. Email: [security contact via repository]
3. Include: description, reproduction steps, and impact assessment
4. Expected response time: 48 hours

---

## Audit Checklist

- [x] No `console.log` with private key, secret, or password content
- [x] Keystore passwords never stored persistently
- [x] CLI migration deletes plaintext keys from config
- [x] Config file permissions set to 0o600
- [x] VS Code uses SecretStorage (OS-level encryption)
- [x] MCP server uses env vars only (no disk persistence)
- [x] All password inputs are masked
- [x] No telemetry or external data collection
- [x] Keystore files use industry-standard scrypt + AES encryption
