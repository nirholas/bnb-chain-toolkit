"""Example: Register an agent using the Python SDK."""

import asyncio
import os

from erc8004 import ERC8004Client


async def main() -> None:
    private_key = os.environ.get("PRIVATE_KEY", "")
    if not private_key:
        print("Set PRIVATE_KEY environment variable to run this example")
        return

    client = ERC8004Client(chain="bsc-testnet", private_key=private_key)

    if not await client.is_connected():
        print("Failed to connect to BSC Testnet")
        return

    print("Connected to BSC Testnet")
    version = await client.get_version()
    print(f"IdentityRegistry version: {version}")

    agent_id = await client.register(
        name="My Python Agent",
        description="An AI agent registered via the Python SDK",
        services=[
            {"name": "A2A", "endpoint": "https://my-agent.example.com/.well-known/agent.json"},
            {"name": "MCP", "endpoint": "https://my-agent.example.com/mcp"},
        ],
    )
    print(f"Agent #{agent_id} registered!")

    agent = await client.get_agent(agent_id)
    print(f"Agent name: {agent.metadata.name if agent.metadata else 'N/A'}")
    print(f"Owner: {agent.owner}")
    print(f"Chain: {client.chain.name}")


if __name__ == "__main__":
    asyncio.run(main())
