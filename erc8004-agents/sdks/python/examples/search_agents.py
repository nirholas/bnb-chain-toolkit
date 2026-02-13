"""Example: Search/query agents from the registry."""

import asyncio

from erc8004 import ERC8004Client


async def main() -> None:
    # Read-only client — no private key needed
    client = ERC8004Client(chain="bsc-testnet")

    if not await client.is_connected():
        print("Failed to connect to BSC Testnet")
        return

    print(f"Connected to {client.chain.name}")
    print(f"IdentityRegistry: {client.chain.identity_registry}")

    # Query a specific agent by ID
    try:
        agent = await client.get_agent(1)
        print(f"\nAgent #1:")
        print(f"  Owner: {agent.owner}")
        if agent.metadata:
            print(f"  Name: {agent.metadata.name}")
            print(f"  Description: {agent.metadata.description}")
            for svc in agent.metadata.services:
                print(f"  Service: {svc.name} → {svc.endpoint}")
    except Exception as e:
        print(f"Agent #1 not found: {e}")

    # Check how many agents an address owns
    address = "0x0000000000000000000000000000000000000000"
    balance = await client.identity.balance_of(address)
    print(f"\n{address} owns {balance} agents")


if __name__ == "__main__":
    asyncio.run(main())
