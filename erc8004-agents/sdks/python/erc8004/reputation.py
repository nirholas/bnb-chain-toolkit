"""ReputationRegistry interactions."""

from __future__ import annotations

from typing import TYPE_CHECKING

from web3 import AsyncWeb3
from web3.contract import AsyncContract

from erc8004.contracts import REPUTATION_ABI

if TYPE_CHECKING:
    from erc8004.types import ChainConfig


class ReputationScore:
    """A reputation score result."""

    def __init__(self, score: int, count: int) -> None:
        self.score = score
        self.count = count

    def __repr__(self) -> str:
        return f"ReputationScore(score={self.score}, count={self.count})"


class ReputationRegistry:
    """Interact with the ERC-8004 ReputationRegistry contract."""

    def __init__(self, w3: AsyncWeb3, chain: ChainConfig) -> None:
        if not chain.reputation_registry:
            raise ValueError(f"No ReputationRegistry deployed on {chain.name}")
        self._w3 = w3
        self._chain = chain
        self._contract: AsyncContract = w3.eth.contract(
            address=w3.to_checksum_address(chain.reputation_registry),
            abi=REPUTATION_ABI,
        )

    async def submit_score(
        self,
        agent_id: int,
        domain: str,
        score: int,
        evidence: str = "",
    ) -> str:
        """Submit a reputation score for an agent in a specific domain.

        Args:
            agent_id: The agent token ID.
            domain: Reputation domain (e.g., 'accuracy', 'reliability').
            score: Score value (0-100).
            evidence: Optional evidence URI or description.

        Returns:
            Transaction hash.
        """
        if not 0 <= score <= 100:
            raise ValueError(f"Score must be 0-100, got {score}")

        tx = await self._contract.functions.submitScore(  # type: ignore[attr-defined]
            agent_id, domain, score, evidence
        ).transact()
        receipt = await self._w3.eth.wait_for_transaction_receipt(tx)
        return receipt["transactionHash"].hex()

    async def get_score(self, agent_id: int, domain: str) -> ReputationScore:
        """Get an agent's reputation score for a specific domain.

        Args:
            agent_id: The agent token ID.
            domain: Reputation domain.

        Returns:
            ReputationScore with score and review count.
        """
        result = await self._contract.functions.getScore(agent_id, domain).call()  # type: ignore[attr-defined]
        return ReputationScore(score=result[0], count=result[1])

    async def get_aggregate_score(self, agent_id: int) -> ReputationScore:
        """Get an agent's aggregate reputation score across all domains.

        Args:
            agent_id: The agent token ID.

        Returns:
            ReputationScore with aggregate score and total reviews.
        """
        result = await self._contract.functions.getAggregateScore(agent_id).call()  # type: ignore[attr-defined]
        return ReputationScore(score=result[0], count=result[1])

    async def get_version(self) -> str:
        """Get the contract version string."""
        return await self._contract.functions.getVersion().call()  # type: ignore[attr-defined]
