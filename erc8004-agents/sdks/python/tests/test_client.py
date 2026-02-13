"""Tests for ERC8004Client."""

from __future__ import annotations

from unittest.mock import AsyncMock, MagicMock, patch

import pytest

from erc8004.client import ERC8004Client
from erc8004.chains import get_chain, CHAINS
from erc8004.types import AgentMetadata, AgentService, ChainConfig


class TestChainConfig:
    """Test chain configuration."""

    def test_get_chain_by_name(self) -> None:
        chain = get_chain("bsc-testnet")
        assert chain.chain_id == 97
        assert chain.name == "BSC Testnet"

    def test_get_chain_by_id(self) -> None:
        chain = get_chain(56)
        assert chain.name == "BSC Mainnet"

    def test_get_chain_unknown_name(self) -> None:
        with pytest.raises(ValueError, match="Unknown chain"):
            get_chain("unknown-chain")

    def test_get_chain_unknown_id(self) -> None:
        with pytest.raises(ValueError, match="Unknown chain ID"):
            get_chain(99999)

    def test_all_chains_have_identity(self) -> None:
        for name, chain in CHAINS.items():
            assert chain.identity_registry, f"{name} missing identity_registry"
            assert chain.identity_registry.startswith("0x8004")


class TestAgentMetadata:
    """Test agent metadata models."""

    def test_minimal_metadata(self) -> None:
        meta = AgentMetadata(name="Test Agent", description="A test agent")
        assert meta.name == "Test Agent"
        assert meta.active is True
        assert meta.services == []

    def test_full_metadata(self) -> None:
        meta = AgentMetadata(
            name="Full Agent",
            description="A fully configured agent",
            services=[
                AgentService(name="A2A", endpoint="https://example.com/a2a"),
                AgentService(name="MCP", endpoint="https://example.com/mcp"),
            ],
            image="https://example.com/avatar.png",
        )
        assert len(meta.services) == 2
        assert meta.services[0].name == "A2A"

    def test_metadata_serialization(self) -> None:
        meta = AgentMetadata(
            name="Test", description="Test", services=[]
        )
        d = meta.model_dump(by_alias=True, exclude_none=True)
        assert "name" in d
        assert "type" in d
        assert d["type"] == "AI Agent"


class TestERC8004Client:
    """Test client initialization."""

    def test_client_init_by_name(self) -> None:
        client = ERC8004Client(chain="bsc-testnet")
        assert client.chain.chain_id == 97

    def test_client_init_by_id(self) -> None:
        client = ERC8004Client(chain=56)
        assert client.chain.name == "BSC Mainnet"

    def test_client_custom_rpc(self) -> None:
        client = ERC8004Client(chain="bsc-testnet", rpc_url="https://custom-rpc.example.com")
        assert client.chain.chain_id == 97

    def test_client_custom_chain(self) -> None:
        custom = ChainConfig(
            name="Custom Chain",
            chain_id=12345,
            rpc_url="https://custom.example.com",
            explorer="https://scan.custom.example.com",
            currency_name="TEST",
            currency_symbol="TEST",
            identity_registry="0x8004A818BFB912233c491871b3d84c89A494BD9e",
        )
        client = ERC8004Client(chain_config=custom)
        assert client.chain.chain_id == 12345

    def test_identity_registry_accessible(self) -> None:
        client = ERC8004Client(chain="bsc-testnet")
        assert client.identity is not None

    def test_reputation_lazy_init(self) -> None:
        client = ERC8004Client(chain="bsc-testnet")
        assert client._reputation is None
        rep = client.reputation
        assert rep is not None
        assert client._reputation is not None
