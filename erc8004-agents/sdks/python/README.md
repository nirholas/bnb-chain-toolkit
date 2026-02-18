# ERC-8004 Python SDK

> Python SDK for interacting with ERC-8004 Trustless AI Agent Registries on any EVM chain.

## Installation

```bash
pip install erc8004
```

Or from source:

```bash
git clone https://github.com/nirholas/erc8004-agent-creator.git
cd erc8004-agent-creator/sdks/python
pip install -e ".[dev]"
```

## Quick Start

```python
import asyncio
from erc8004 import ERC8004Client

async def main():
    # Read-only client (no private key needed)
    client = ERC8004Client(chain="bsc-testnet")
    
    # Check connection
    print(await client.is_connected())     # True
    print(await client.get_version())      # "1.0.0"
    
    # Query an agent
    agent = await client.get_agent(1)
    print(agent.metadata.name)

asyncio.run(main())
```

### Register an Agent

```python
import asyncio
from erc8004 import ERC8004Client

async def main():
    client = ERC8004Client(
        chain="bsc-testnet",
        private_key="0xYOUR_PRIVATE_KEY",
    )

    agent_id = await client.register(
        name="My Python Agent",
        description="Built with the Python SDK",
        services=[
            {"name": "A2A", "endpoint": "https://my-agent.example.com/a2a"},
            {"name": "MCP", "endpoint": "https://my-agent.example.com/mcp"},
        ],
    )
    print(f"Agent #{agent_id} registered!")

asyncio.run(main())
```

### Keystore Wallet (Recommended)

Using an encrypted keystore file is the **recommended** way to authenticate.
Private keys stay encrypted on disk and are only decrypted in memory.

#### Create a new wallet

```python
from erc8004 import ERC8004Client

# Generate a brand-new wallet and save it as an encrypted keystore file
path = ERC8004Client.create_wallet(
    password="my-secure-password",
    save_path="wallet.json",
)
print(f"Wallet saved to {path}")
```

#### Authenticate from a keystore file

```python
import asyncio
from erc8004 import ERC8004Client

async def main():
    client = ERC8004Client.from_keystore(
        keystore_path="wallet.json",
        password="my-secure-password",
        chain="bsc-testnet",
    )

    agent_id = await client.register(
        name="Keystore Agent",
        description="Registered using an encrypted keystore",
        services=[{"name": "A2A", "endpoint": "https://example.com/a2a"}],
    )
    print(f"Agent #{agent_id} registered!")

asyncio.run(main())
```

#### Export an existing account to keystore

```python
from erc8004 import ERC8004Client

client = ERC8004Client(chain="bsc-testnet", private_key="0x...")
client.export_keystore(password="my-secure-password", path="exported-wallet.json")
```

#### Alternative: `from_private_key` classmethod

```python
client = ERC8004Client.from_private_key("0xYOUR_KEY", chain="bsc-testnet")
```

## Supported Chains

| Chain | Name | Chain ID |
|-------|------|----------|
| `bsc-testnet` | BSC Testnet | 97 |
| `bsc` | BSC Mainnet | 56 |
| `ethereum` | Ethereum Mainnet | 1 |
| `sepolia` | Ethereum Sepolia | 11155111 |

### Custom Chain

```python
from erc8004 import ERC8004Client
from erc8004.types import ChainConfig

custom = ChainConfig(
    name="My Chain",
    chain_id=12345,
    rpc_url="https://rpc.mychain.com",
    explorer="https://scan.mychain.com",
    currency_name="MYC",
    currency_symbol="MYC",
    identity_registry="0x8004A818BFB912233c491871b3d84c89A494BD9e",
)
client = ERC8004Client(chain_config=custom)
```

## API Reference

### `ERC8004Client`

High-level client for all registry operations.

| Method | Description |
|--------|-------------|
| `ERC8004Client(chain, private_key=...)` | Constructor with optional private key |
| `from_keystore(path, password, chain)` | Create client from encrypted keystore file (**recommended**) |
| `from_private_key(key, chain)` | Create client from raw private key |
| `create_wallet(password, save_path)` | Generate a new wallet and save as keystore |
| `export_keystore(password, path)` | Export current account as encrypted keystore |
| `register(name, description, services, ...)` | Register a new agent |
| `register_full(metadata, ...)` | Register with full `AgentMetadata` object |
| `get_agent(agent_id)` | Fetch agent details by token ID |
| `get_version()` | Get IdentityRegistry contract version |
| `is_connected()` | Check RPC connection |

### `client.identity` (IdentityRegistry)

| Method | Description |
|--------|-------------|
| `register(agent_uri, metadata_entries)` | Low-level register |
| `set_agent_uri(agent_id, new_uri)` | Update metadata URI |
| `set_metadata(agent_id, key, value)` | Set on-chain key-value |
| `get_metadata(agent_id, key)` | Read on-chain key-value |
| `get_agent_wallet(agent_id)` | Get bound wallet address |
| `token_uri(agent_id)` | Get metadata URI |
| `owner_of(agent_id)` | Get owner address |
| `balance_of(address)` | Count agents owned |

### `client.reputation` (ReputationRegistry)

| Method | Description |
|--------|-------------|
| `submit_score(agent_id, domain, score, evidence)` | Submit reputation score |
| `get_score(agent_id, domain)` | Get domain-specific score |
| `get_aggregate_score(agent_id)` | Get aggregate score |

### `client.validation` (ValidationRegistry)

| Method | Description |
|--------|-------------|
| `validate(agent_id, validation_type, evidence)` | Submit validation |
| `is_valid(agent_id, validation_type)` | Check validation status |
| `get_validation(validation_id)` | Get validation record |

## Development

```bash
pip install -e ".[dev]"
pytest
ruff check .
mypy erc8004
```

## License

Apache-2.0
