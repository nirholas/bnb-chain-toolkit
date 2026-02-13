"""Pydantic models for ERC-8004 data types."""

from __future__ import annotations

from enum import Enum
from typing import Any

from pydantic import BaseModel, Field


class ServiceType(str, Enum):
    """Known service protocol types."""

    A2A = "A2A"
    MCP = "MCP"
    REST = "REST"
    GRAPHQL = "GraphQL"
    WEBSOCKET = "WebSocket"
    CUSTOM = "Custom"


class AgentService(BaseModel):
    """A service endpoint exposed by an agent."""

    name: str = Field(..., description="Service protocol name (A2A, MCP, REST, etc.)")
    endpoint: str = Field(..., description="URL of the service endpoint")
    description: str | None = Field(None, description="Human-readable service description")
    version: str | None = Field(None, description="Service version string")


class MetadataEntry(BaseModel):
    """A key-value metadata pair for on-chain storage."""

    key: str = Field(..., description="Metadata key")
    value: str = Field(..., description="Metadata value (will be UTF-8 encoded)")


class TrustConfig(BaseModel):
    """Trust mechanism configuration."""

    type: str = Field(..., description="Trust type (e.g., 'signature', 'reputation', 'stake')")
    provider: str | None = Field(None, description="Trust provider address or URL")
    threshold: int | None = Field(None, description="Minimum trust score")


class X402PaymentConfig(BaseModel):
    """x402 payment protocol configuration."""

    enabled: bool = True
    tokens: list[str] = Field(default_factory=lambda: ["USDC", "USDT", "BNB"])
    min_amount: str | None = Field(None, description="Minimum payment amount")
    receiver: str | None = Field(None, description="Payment receiver address")


class AgentMetadata(BaseModel):
    """Full agent registration metadata (stored as JSON URI)."""

    type: str = Field(default="AI Agent", description="Agent type identifier")
    name: str = Field(..., description="Agent display name")
    description: str = Field(..., description="Agent description")
    image: str | None = Field(None, description="Agent image URL or data URI")
    services: list[AgentService] = Field(default_factory=list)
    x402_support: X402PaymentConfig | None = Field(None, alias="x402Support")
    active: bool = True
    registrations: list[dict[str, Any]] = Field(default_factory=list)
    supported_trust: list[TrustConfig] = Field(default_factory=list, alias="supportedTrust")

    model_config = {"populate_by_name": True}


class RegisteredAgent(BaseModel):
    """An agent that has been registered on-chain."""

    agent_id: int = Field(..., description="On-chain agent token ID")
    owner: str = Field(..., description="Owner wallet address")
    chain_id: int = Field(..., description="Chain ID where registered")
    tx_hash: str = Field(..., description="Registration transaction hash")
    block_number: int = Field(..., description="Block number of registration")
    agent_uri: str | None = Field(None, description="Agent metadata URI")
    metadata: AgentMetadata | None = Field(None, description="Parsed agent metadata")


class ChainConfig(BaseModel):
    """Configuration for a supported blockchain."""

    name: str
    chain_id: int
    rpc_url: str
    explorer: str
    currency_name: str
    currency_symbol: str
    currency_decimals: int = 18
    identity_registry: str
    reputation_registry: str | None = None
    validation_registry: str | None = None
    agent_registry_caip10: str | None = None
