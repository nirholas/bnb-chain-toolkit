"""ERC-8004 Python SDK — Interact with ERC-8004 AI Agent Registries on any EVM chain."""

from erc8004.client import ERC8004Client
from erc8004.types import (
    AgentMetadata,
    AgentService,
    ChainConfig,
    MetadataEntry,
    RegisteredAgent,
)

__all__ = [
    "ERC8004Client",
    "AgentMetadata",
    "AgentService",
    "ChainConfig",
    "MetadataEntry",
    "RegisteredAgent",
]

__version__ = "0.1.0"
