"""ValidationRegistry interactions."""

from __future__ import annotations

from dataclasses import dataclass
from typing import TYPE_CHECKING

from web3 import AsyncWeb3
from web3.contract import AsyncContract

from erc8004.contracts import VALIDATION_ABI

if TYPE_CHECKING:
    from erc8004.types import ChainConfig


@dataclass
class ValidationRecord:
    """A validation record from the registry."""

    validation_id: int
    agent_id: int
    validation_type: str
    validator: str
    timestamp: int


class ValidationRegistry:
    """Interact with the ERC-8004 ValidationRegistry contract."""

    def __init__(self, w3: AsyncWeb3, chain: ChainConfig) -> None:
        if not chain.validation_registry:
            raise ValueError(f"No ValidationRegistry deployed on {chain.name}")
        self._w3 = w3
        self._chain = chain
        self._contract: AsyncContract = w3.eth.contract(
            address=w3.to_checksum_address(chain.validation_registry),
            abi=VALIDATION_ABI,
        )

    async def validate(
        self,
        agent_id: int,
        validation_type: str,
        evidence: bytes = b"",
    ) -> int:
        """Submit a validation for an agent.

        Args:
            agent_id: The agent token ID.
            validation_type: Type of validation (e.g., 'identity', 'capability').
            evidence: Validation evidence as bytes.

        Returns:
            The validation record ID.
        """
        tx = await self._contract.functions.validate(  # type: ignore[attr-defined]
            agent_id, validation_type, evidence
        ).transact()
        receipt = await self._w3.eth.wait_for_transaction_receipt(tx)

        # Parse Validated event
        try:
            logs = self._contract.events.Validated().process_receipt(receipt)  # type: ignore[attr-defined]
            if logs:
                return int(logs[0]["args"]["validationId"])
        except Exception:
            pass

        raise RuntimeError("Could not parse validation ID from receipt")

    async def is_valid(self, agent_id: int, validation_type: str) -> bool:
        """Check if an agent has a valid validation of a given type.

        Args:
            agent_id: The agent token ID.
            validation_type: Type of validation to check.

        Returns:
            True if the agent is validated.
        """
        return await self._contract.functions.isValid(  # type: ignore[attr-defined]
            agent_id, validation_type
        ).call()

    async def get_validation(self, validation_id: int) -> ValidationRecord:
        """Get details of a specific validation record.

        Args:
            validation_id: The validation record ID.

        Returns:
            ValidationRecord with full details.
        """
        result = await self._contract.functions.getValidation(validation_id).call()  # type: ignore[attr-defined]
        return ValidationRecord(
            validation_id=validation_id,
            agent_id=result[0],
            validation_type=result[1],
            validator=result[2],
            timestamp=result[3],
        )

    async def get_version(self) -> str:
        """Get the contract version string."""
        return await self._contract.functions.getVersion().call()  # type: ignore[attr-defined]
