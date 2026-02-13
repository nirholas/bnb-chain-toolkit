"""ERC-8004 Client — high-level interface for interacting with ERC-8004 registries."""

from __future__ import annotations

from typing import Any

from web3 import AsyncWeb3
from web3.providers import AsyncHTTPProvider

from erc8004.chains import get_chain
from erc8004.identity import IdentityRegistry
from erc8004.reputation import ReputationRegistry
from erc8004.types import (
    AgentMetadata,
    AgentService,
    ChainConfig,
    MetadataEntry,
    RegisteredAgent,
)
from erc8004.validation import ValidationRegistry


class ERC8004Client:
    """High-level client for ERC-8004 AI Agent Registry operations.

    Usage::

        from erc8004 import ERC8004Client

        client = ERC8004Client(chain="bsc-testnet", private_key="0x...")
        agent_id = await client.register(
            name="My Agent",
            description="An AI agent on BNB Chain",
            services=[{"name": "A2A", "endpoint": "https://agent.example.com/a2a"}],
        )
        print(f"Agent #{agent_id} registered!")
    """

    def __init__(
        self,
        chain: str | int = "bsc-testnet",
        *,
        private_key: str | None = None,
        rpc_url: str | None = None,
        chain_config: ChainConfig | None = None,
    ) -> None:
        """Initialize the ERC-8004 client.

        Args:
            chain: Chain name (e.g., 'bsc-testnet', 'bsc', 'ethereum') or chain ID.
            private_key: Private key for signing transactions. Required for write operations.
            rpc_url: Override the default RPC URL.
            chain_config: Custom chain configuration (overrides chain parameter).
        """
        self._chain = chain_config or get_chain(chain)
        url = rpc_url or self._chain.rpc_url

        self._w3 = AsyncWeb3(AsyncHTTPProvider(url))

        if private_key:
            account = self._w3.eth.account.from_key(private_key)
            self._w3.eth.default_account = account.address
            self._w3.middleware_onion.add(
                self._w3.middleware.construct_sign_and_send_raw_middleware(account)
            )

        self._identity = IdentityRegistry(self._w3, self._chain)
        self._reputation: ReputationRegistry | None = None
        self._validation: ValidationRegistry | None = None

    @property
    def chain(self) -> ChainConfig:
        """The current chain configuration."""
        return self._chain

    @property
    def identity(self) -> IdentityRegistry:
        """Direct access to the IdentityRegistry."""
        return self._identity

    @property
    def reputation(self) -> ReputationRegistry:
        """Direct access to the ReputationRegistry."""
        if self._reputation is None:
            self._reputation = ReputationRegistry(self._w3, self._chain)
        return self._reputation

    @property
    def validation(self) -> ValidationRegistry:
        """Direct access to the ValidationRegistry."""
        if self._validation is None:
            self._validation = ValidationRegistry(self._w3, self._chain)
        return self._validation

    @property
    def w3(self) -> AsyncWeb3:
        """Direct access to the Web3 instance."""
        return self._w3

    # ── High-Level Convenience Methods ──────────────────────────────────

    async def register(
        self,
        name: str,
        description: str,
        *,
        services: list[dict[str, str]] | list[AgentService] | None = None,
        image: str | None = None,
        metadata_entries: list[MetadataEntry] | None = None,
        **kwargs: Any,
    ) -> int:
        """Register a new agent with metadata.

        This is the simplest way to register an agent. It builds the metadata
        JSON, encodes it as a data URI, and submits the registration transaction.

        Args:
            name: Agent display name.
            description: Agent description.
            services: List of service endpoints.
            image: Agent image URL.
            metadata_entries: Additional on-chain metadata key-value pairs.
            **kwargs: Additional fields for AgentMetadata.

        Returns:
            The newly minted agent token ID.
        """
        svc_list: list[AgentService] = []
        if services:
            for s in services:
                if isinstance(s, AgentService):
                    svc_list.append(s)
                else:
                    svc_list.append(AgentService(**s))

        meta = AgentMetadata(
            name=name,
            description=description,
            services=svc_list,
            image=image,
            **kwargs,
        )

        result = await self._identity.register_with_metadata(
            meta, extra_entries=metadata_entries
        )
        return result.agent_id

    async def register_full(
        self,
        metadata: AgentMetadata,
        *,
        metadata_entries: list[MetadataEntry] | None = None,
    ) -> RegisteredAgent:
        """Register an agent and return full details.

        Args:
            metadata: Complete agent metadata.
            metadata_entries: Additional on-chain metadata key-value pairs.

        Returns:
            RegisteredAgent with all registration details.
        """
        return await self._identity.register_with_metadata(
            metadata, extra_entries=metadata_entries
        )

    async def get_agent(self, agent_id: int) -> RegisteredAgent:
        """Fetch an agent's details by token ID.

        Args:
            agent_id: The agent token ID.

        Returns:
            RegisteredAgent with metadata.
        """
        return await self._identity.get_agent(agent_id)

    async def get_version(self) -> str:
        """Get the IdentityRegistry contract version."""
        return await self._identity.get_version()

    async def is_connected(self) -> bool:
        """Check if connected to the RPC endpoint."""
        try:
            return await self._w3.is_connected()
        except Exception:
            return False
