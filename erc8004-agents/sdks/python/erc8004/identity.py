"""IdentityRegistry interactions."""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from web3 import AsyncWeb3
from web3.contract import AsyncContract

from erc8004.contracts import IDENTITY_ABI
from erc8004.types import MetadataEntry, RegisteredAgent
from erc8004.utils import build_agent_uri, parse_agent_uri

if TYPE_CHECKING:
    from erc8004.types import AgentMetadata, ChainConfig


class IdentityRegistry:
    """Interact with the ERC-8004 IdentityRegistry contract."""

    def __init__(self, w3: AsyncWeb3, chain: ChainConfig) -> None:
        self._w3 = w3
        self._chain = chain
        self._contract: AsyncContract = w3.eth.contract(
            address=w3.to_checksum_address(chain.identity_registry),
            abi=IDENTITY_ABI,
        )

    async def register(
        self,
        *,
        agent_uri: str | None = None,
        metadata_entries: list[MetadataEntry] | None = None,
    ) -> int:
        """Register a new agent.

        Args:
            agent_uri: Optional metadata URI (data URI, IPFS, or HTTPS).
            metadata_entries: Optional on-chain key-value metadata pairs.

        Returns:
            The newly minted agent token ID.
        """
        if metadata_entries and agent_uri:
            encoded = [
                (e.key, e.value.encode("utf-8")) for e in metadata_entries
            ]
            tx = await self._contract.functions.register(  # type: ignore[attr-defined]
                agent_uri, encoded
            ).transact()
        elif agent_uri:
            tx = await self._contract.functions.register(agent_uri).transact()  # type: ignore[attr-defined]
        else:
            tx = await self._contract.functions.register().transact()  # type: ignore[attr-defined]

        receipt = await self._w3.eth.wait_for_transaction_receipt(tx)
        return self._parse_agent_id(receipt)

    async def register_with_metadata(
        self,
        metadata: AgentMetadata,
        *,
        extra_entries: list[MetadataEntry] | None = None,
    ) -> RegisteredAgent:
        """Register an agent with full metadata, building the URI automatically.

        Args:
            metadata: Agent metadata model.
            extra_entries: Additional on-chain metadata pairs.

        Returns:
            RegisteredAgent with full details.
        """
        meta_dict = metadata.model_dump(by_alias=True, exclude_none=True)
        uri = build_agent_uri(meta_dict)

        if extra_entries:
            encoded = [(e.key, e.value.encode("utf-8")) for e in extra_entries]
            tx = await self._contract.functions.register(uri, encoded).transact()  # type: ignore[attr-defined]
        else:
            tx = await self._contract.functions.register(uri).transact()  # type: ignore[attr-defined]

        receipt = await self._w3.eth.wait_for_transaction_receipt(tx)
        agent_id = self._parse_agent_id(receipt)

        return RegisteredAgent(
            agent_id=agent_id,
            owner=receipt["from"],
            chain_id=self._chain.chain_id,
            tx_hash=receipt["transactionHash"].hex(),
            block_number=receipt["blockNumber"],
            agent_uri=uri,
            metadata=metadata,
        )

    async def set_agent_uri(self, agent_id: int, new_uri: str) -> str:
        """Update an agent's metadata URI.

        Returns:
            Transaction hash.
        """
        tx = await self._contract.functions.setAgentURI(agent_id, new_uri).transact()  # type: ignore[attr-defined]
        receipt = await self._w3.eth.wait_for_transaction_receipt(tx)
        return receipt["transactionHash"].hex()

    async def set_metadata(self, agent_id: int, key: str, value: str) -> str:
        """Set a single on-chain metadata entry.

        Returns:
            Transaction hash.
        """
        tx = await self._contract.functions.setMetadata(  # type: ignore[attr-defined]
            agent_id, key, value.encode("utf-8")
        ).transact()
        receipt = await self._w3.eth.wait_for_transaction_receipt(tx)
        return receipt["transactionHash"].hex()

    async def get_metadata(self, agent_id: int, key: str) -> str:
        """Read an on-chain metadata value."""
        raw: bytes = await self._contract.functions.getMetadata(agent_id, key).call()  # type: ignore[attr-defined]
        return raw.decode("utf-8")

    async def get_agent_wallet(self, agent_id: int) -> str:
        """Get the wallet address bound to an agent."""
        return await self._contract.functions.getAgentWallet(agent_id).call()  # type: ignore[attr-defined]

    async def token_uri(self, agent_id: int) -> str:
        """Get the metadata URI for an agent."""
        return await self._contract.functions.tokenURI(agent_id).call()  # type: ignore[attr-defined]

    async def get_agent(self, agent_id: int) -> RegisteredAgent:
        """Fetch full agent details by ID."""
        owner: str = await self._contract.functions.ownerOf(agent_id).call()  # type: ignore[attr-defined]
        uri: str = await self._contract.functions.tokenURI(agent_id).call()  # type: ignore[attr-defined]

        parsed_meta = None
        try:
            meta_dict = parse_agent_uri(uri)
            from erc8004.types import AgentMetadata
            parsed_meta = AgentMetadata.model_validate(meta_dict)
        except Exception:
            pass

        return RegisteredAgent(
            agent_id=agent_id,
            owner=owner,
            chain_id=self._chain.chain_id,
            tx_hash="",
            block_number=0,
            agent_uri=uri,
            metadata=parsed_meta,
        )

    async def owner_of(self, agent_id: int) -> str:
        """Get the owner address of an agent token."""
        return await self._contract.functions.ownerOf(agent_id).call()  # type: ignore[attr-defined]

    async def balance_of(self, address: str) -> int:
        """Get the number of agents owned by an address."""
        return await self._contract.functions.balanceOf(address).call()  # type: ignore[attr-defined]

    async def get_version(self) -> str:
        """Get the contract version string."""
        return await self._contract.functions.getVersion().call()  # type: ignore[attr-defined]

    async def name(self) -> str:
        """Get the token name."""
        return await self._contract.functions.name().call()  # type: ignore[attr-defined]

    async def symbol(self) -> str:
        """Get the token symbol."""
        return await self._contract.functions.symbol().call()  # type: ignore[attr-defined]

    def _parse_agent_id(self, receipt: dict[str, Any]) -> int:
        """Extract agent ID from transaction receipt logs."""
        # Try Registered event first
        try:
            logs = self._contract.events.Registered().process_receipt(receipt)  # type: ignore[attr-defined]
            if logs:
                return int(logs[0]["args"]["agentId"])
        except Exception:
            pass

        # Fallback: Transfer event (mint from 0x0)
        try:
            logs = self._contract.events.Transfer().process_receipt(receipt)  # type: ignore[attr-defined]
            for log in logs:
                if log["args"]["from"] == "0x" + "0" * 40:
                    return int(log["args"]["tokenId"])
        except Exception:
            pass

        raise RuntimeError("Could not parse agent ID from transaction receipt")
