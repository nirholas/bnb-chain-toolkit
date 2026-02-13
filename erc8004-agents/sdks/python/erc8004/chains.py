"""Chain configurations for supported EVM networks."""

from __future__ import annotations

from erc8004.types import ChainConfig

# Deterministic CREATE2 addresses (shared across testnets)
TESTNET_IDENTITY = "0x8004A818BFB912233c491871b3d84c89A494BD9e"
TESTNET_REPUTATION = "0x8004B663056A597Dffe9eCcC1965A193B7388713"
TESTNET_VALIDATION = "0x8004Cb1BF31DAf7788923b405b754f57acEB4272"

# Mainnet addresses
MAINNET_IDENTITY = "0x8004A169FB4a3325136EB29fA0ceB6D2e539a432"
MAINNET_REPUTATION = "0x8004BAa17C55a88189AE136b182e5fdA19dE9b63"

CHAINS: dict[str, ChainConfig] = {
    "bsc-testnet": ChainConfig(
        name="BSC Testnet",
        chain_id=97,
        rpc_url="https://data-seed-prebsc-1-s1.bnbchain.org:8545",
        explorer="https://testnet.bscscan.com",
        currency_name="tBNB",
        currency_symbol="tBNB",
        identity_registry=TESTNET_IDENTITY,
        reputation_registry=TESTNET_REPUTATION,
        validation_registry=TESTNET_VALIDATION,
        agent_registry_caip10=f"eip155:97:{TESTNET_IDENTITY}",
    ),
    "bsc": ChainConfig(
        name="BSC Mainnet",
        chain_id=56,
        rpc_url="https://bsc-dataseed.bnbchain.org",
        explorer="https://bscscan.com",
        currency_name="BNB",
        currency_symbol="BNB",
        identity_registry=MAINNET_IDENTITY,
        reputation_registry=MAINNET_REPUTATION,
        validation_registry=TESTNET_VALIDATION,
        agent_registry_caip10=f"eip155:56:{MAINNET_IDENTITY}",
    ),
    "ethereum": ChainConfig(
        name="Ethereum Mainnet",
        chain_id=1,
        rpc_url="https://eth.llamarpc.com",
        explorer="https://etherscan.io",
        currency_name="ETH",
        currency_symbol="ETH",
        identity_registry=MAINNET_IDENTITY,
        reputation_registry=MAINNET_REPUTATION,
        agent_registry_caip10=f"eip155:1:{MAINNET_IDENTITY}",
    ),
    "sepolia": ChainConfig(
        name="Ethereum Sepolia",
        chain_id=11155111,
        rpc_url="https://rpc.sepolia.org",
        explorer="https://sepolia.etherscan.io",
        currency_name="SepoliaETH",
        currency_symbol="ETH",
        identity_registry=TESTNET_IDENTITY,
        reputation_registry=TESTNET_REPUTATION,
        agent_registry_caip10=f"eip155:11155111:{TESTNET_IDENTITY}",
    ),
}


def get_chain(chain: str | int) -> ChainConfig:
    """Get chain config by name or chain ID.

    Args:
        chain: Chain name (e.g., 'bsc-testnet') or chain ID (e.g., 97).

    Returns:
        ChainConfig for the requested chain.

    Raises:
        ValueError: If chain is not supported.
    """
    if isinstance(chain, str):
        if chain in CHAINS:
            return CHAINS[chain]
        raise ValueError(
            f"Unknown chain '{chain}'. Supported: {', '.join(CHAINS.keys())}"
        )

    for cfg in CHAINS.values():
        if cfg.chain_id == chain:
            return cfg
    raise ValueError(
        f"Unknown chain ID {chain}. Supported: {', '.join(str(c.chain_id) for c in CHAINS.values())}"
    )
