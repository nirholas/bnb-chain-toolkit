# ERC-8004 CLI

> Terminal-based management for ERC-8004 AI agents on BNB Chain and Ethereum.

![npm](https://img.shields.io/badge/npm-@nirholas/erc8004--cli-red.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Version](https://img.shields.io/badge/version-1.0.0-orange.svg)

## Installation

```bash
npm install -g @nirholas/erc8004-cli
```

## Quick Start

```bash
# Check supported chains and connectivity
erc8004 chains

# Import wallet (encrypted keystore — recommended)
erc8004 wallet import

# Register a new agent (interactive)
erc8004 register

# View an agent by token ID
erc8004 view 1

# List agents owned by an address
erc8004 list 0xYourAddress

# Search recent registrations
erc8004 search --limit 20

# Check reputation
erc8004 reputation 1
```

## Wallet Management

The CLI stores your wallet as an **encrypted keystore** in `~/.erc8004/config.json`. Private keys are never stored in plaintext.

### `erc8004 wallet import`

Import a wallet from a raw private key (encrypts it) or an existing keystore file.

```bash
erc8004 wallet import
# Interactive: choose raw key or keystore file, set encryption password
```

### `erc8004 wallet export`

Export your current wallet as an encrypted keystore JSON file.

```bash
erc8004 wallet export
# Prompts for decryption password, then new export password and file path
```

### `erc8004 wallet show`

Display current wallet address and auth method (no decryption needed).

```bash
erc8004 wallet show
```

### `erc8004 wallet clear`

Remove stored wallet from config (requires confirmation).

```bash
erc8004 wallet clear
```

### Authentication Priority

When running write commands (`register`, `update`), the CLI resolves a wallet in this order:

1. `--keystore <file>` + `--keystore-password <pw>` flags
2. `--key <hex>` flag (deprecated, prints warning)
3. `ERC8004_PRIVATE_KEY` environment variable (for CI/CD)
4. Encrypted keystore in `~/.erc8004/config.json` (prompts for password)
5. Legacy plaintext `privateKey` in config (deprecated, auto-migrates)

### Legacy Key Migration

If your config has a plaintext `privateKey` field, the CLI will prompt you to encrypt it on the next run. After migration:
- The `privateKey` field is deleted from config
- An encrypted `keystore` field is created
- Config file permissions are set to `0o600`

## Commands

### `erc8004 register`

Interactively register a new ERC-8004 agent.

```bash
erc8004 register [options]

Options:
  -c, --chain <chain>  Chain to register on (default: bsc-testnet)
  -k, --key <key>      Private key (or set ERC8004_PRIVATE_KEY)
```

Walks you through:
1. Agent name, description, and image URL
2. Service definitions (name, type, endpoint, method)
3. Trust mechanisms and x402 payment support
4. URI method (data URI or HTTPS URL)

### `erc8004 view <agentId>`

Display full agent details including metadata, services, trust, and registrations.

```bash
erc8004 view 1 --chain bsc-testnet
```

### `erc8004 list <owner>`

List all agents owned by an address.

```bash
erc8004 list 0xABC... --chain bsc-mainnet --limit 50
```

### `erc8004 search`

Search for recently registered agents with optional service type filter.

```bash
erc8004 search --service inference --limit 10 --chain bsc-testnet
```

### `erc8004 update <agentId>`

Update the metadata URI for an agent you own.

```bash
erc8004 update 1 --chain bsc-testnet --key $ERC8004_PRIVATE_KEY
```

### `erc8004 reputation <agentId>`

View reputation scores and recent feedback for an agent.

```bash
erc8004 reputation 1 --chain bsc-testnet --limit 20
```

### `erc8004 init`

Scaffold `.well-known/agent-card.json` and `ai-plugin.json` templates.

```bash
erc8004 init --dir ./my-agent
```

### `erc8004 chains`

List supported chains with live connectivity status.

```bash
erc8004 chains
```

## Configuration

Config is stored at `~/.erc8004/config.json` (permissions: `0o600`):

```json
{
  "defaultChain": "bsc-testnet",
  "keystore": "{\"version\":3,\"crypto\":{...}}"
}
```

> **Note:** The `keystore` field contains an encrypted Ethereum V3 keystore. Your private key is never stored in plaintext. Legacy configs with a `privateKey` field will be auto-migrated on next run.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `ERC8004_PRIVATE_KEY` | Override wallet for commands (CI/CD) |

### CLI Flags for Auth

| Flag | Description |
|------|-------------|
| `--keystore <path>` | Path to keystore JSON file |
| `--keystore-password <pw>` | Keystore password (avoid in shell history — prefer interactive prompt) |
| `--key <hex>` | Raw private key (deprecated — use `wallet import` instead) |

## Supported Chains

| Chain | ID | Explorer |
|-------|----|----------|
| BSC Testnet | 97 | testnet.bscscan.com |
| BSC Mainnet | 56 | bscscan.com |
| Ethereum Sepolia | 11155111 | sepolia.etherscan.io |
| Ethereum Mainnet | 1 | etherscan.io |

## Development

```bash
cd cli
npm install
npm run build
npm link        # Link for local testing
erc8004 --help
```

## Security

- **Encrypted keystore** is the recommended wallet storage method
- Private keys are never stored in plaintext (legacy configs are auto-migrated)
- Config file permissions are enforced at `chmod 600` on every write
- Passwords are used transiently during decryption and never persisted
- `--key` flag is deprecated (prints a security warning)
- See [SECURITY.md](../SECURITY.md) for the full security audit

## License

MIT
