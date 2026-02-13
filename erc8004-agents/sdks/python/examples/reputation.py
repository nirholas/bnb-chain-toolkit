"""Example: Query and submit reputation scores."""

import asyncio
import os

from erc8004 import ERC8004Client


async def main() -> None:
    private_key = os.environ.get("PRIVATE_KEY", "")

    # Read-only mode for querying reputation
    client = ERC8004Client(
        chain="bsc-testnet",
        private_key=private_key if private_key else None,
    )

    if not await client.is_connected():
        print("Failed to connect to BSC Testnet")
        return

    agent_id = 1

    # Query reputation score
    try:
        score = await client.reputation.get_score(agent_id, "accuracy")
        print(f"Agent #{agent_id} accuracy score: {score.score}/100 ({score.count} reviews)")

        aggregate = await client.reputation.get_aggregate_score(agent_id)
        print(f"Aggregate score: {aggregate.score}/100 ({aggregate.count} total reviews)")
    except Exception as e:
        print(f"Could not query reputation: {e}")

    # Submit a score (requires private key)
    if private_key:
        try:
            tx_hash = await client.reputation.submit_score(
                agent_id=agent_id,
                domain="reliability",
                score=85,
                evidence="Tested 100 queries with 85% success rate",
            )
            print(f"Score submitted: {tx_hash}")
        except Exception as e:
            print(f"Could not submit score: {e}")
    else:
        print("\nSet PRIVATE_KEY to submit reputation scores")


if __name__ == "__main__":
    asyncio.run(main())
