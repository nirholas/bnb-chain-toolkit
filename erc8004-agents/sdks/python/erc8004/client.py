"""ERC-8004 Client — high-level interface for interacting with ERC-8004 registries."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from eth_account import Account
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

    Supports two authentication methods:

    1. **Private key** (direct)::

        client = ERC8004Client(chain="bsc-testnet", private_key="0x...")

    2. **Keystore file** (recommended — keeps keys encrypted at rest)::

        client = ERC8004Client.from_keystore(
            keystore_path="wallet.json",
            password="my-secure-password",
            chain="bsc-testnet",
        )

    You can also generate a new keystore wallet::

        path = ERC8004Client.create_wallet(password="secure", save_path="wallet.json")
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
                Consider using :meth:`from_keystore` instead to keep keys encrypted at rest.
            rpc_url: Override the default RPC URL.
            chain_config: Custom chain configuration (overrides chain parameter).
        """
        self._chain = chain_config or get_chain(chain)
        url = rpc_url or self._chain.rpc_url

        self._w3 = AsyncWeb3(AsyncHTTPProvider(url))
        self._account: Account | None = None

        if private_key:
            self._setup_account(private_key)

        self._identity = IdentityRegistry(self._w3, self._chain)
        self._reputation: ReputationRegistry | None = None
        self._validation: ValidationRegistry | None = None

    def _setup_account(self, private_key: str) -> None:
        """Configure the Web3 instance with a signing account.

        Args:
            private_key: Hex-encoded private key.
        """
        account = self._w3.eth.account.from_key(private_key)
        self._account = account
        self._w3.eth.default_account = account.address
        self._w3.middleware_onion.add(
            self._w3.middleware.construct_sign_and_send_raw_middleware(account)
        )

    # ── Alternative Constructors ────────────────────────────────────────

    @classmethod
    def from_private_key(
        cls,
        private_key: str,
        chain: str | int = "bsc-testnet",
        *,
        rpc_url: str | None = None,
        chain_config: ChainConfig | None = None,
    ) -> ERC8004Client:
        """Create a client authenticated with a raw private key.

        This is equivalent to passing ``private_key`` to the constructor.

        Args:
            private_key: Hex-encoded private key (with or without ``0x`` prefix).
            chain: Chain name or chain ID.
            rpc_url: Override the default RPC URL.
            chain_config: Custom chain configuration.

        Returns:
            An authenticated :class:`ERC8004Client`.
        """
        return cls(
            chain=chain,
            private_key=private_key,
            rpc_url=rpc_url,
            chain_config=chain_config,
        )

    @classmethod
    def from_keystore(
        cls,
        keystore_path: str | Path,
        password: str,
        chain: str | int = "bsc-testnet",
        *,
        rpc_url: str | None = None,
        chain_config: ChainConfig | None = None,
    ) -> ERC8004Client:
        """Create a client by decrypting an encrypted keystore (JSON) file.

        This is the **recommended** way to authenticate — private keys stay
        encrypted on disk and are only decrypted in memory.

        Args:
            keystore_path: Path to the JSON keystore file.
            password: Password used to encrypt the keystore.
            chain: Chain name or chain ID.
            rpc_url: Override the default RPC URL.
            chain_config: Custom chain configuration.

        Returns:
            An authenticated :class:`ERC8004Client`.

        Raises:
            FileNotFoundError: If the keystore file does not exist.
            ValueError: If the password is incorrect or the file is malformed.
        """
        path = Path(keystore_path)
        if not path.is_file():
            raise FileNotFoundError(f"Keystore file not found: {path}")

        keystore_json = json.loads(path.read_text(encoding="utf-8"))

        try:
            private_key = Account.decrypt(keystore_json, password)
        except Exception as exc:
            raise ValueError(
                f"Failed to decrypt keystore — wrong password or malformed file: {exc}"
            ) from exc

        return cls(
            chain=chain,
            private_key=private_key.hex() if isinstance(private_key, bytes) else private_key,
            rpc_url=rpc_url,
            chain_config=chain_config,
        )

    # ── Wallet Utilities ────────────────────────────────────────────────

    @staticmethod
    def create_wallet(password: str, save_path: str | Path) -> Path:
        """Generate a new Ethereum wallet and save it as an encrypted keystore file.

        Args:
            password: Password to encrypt the keystore.
            save_path: File path where the keystore JSON will be written.

        Returns:
            The :class:`~pathlib.Path` to the saved keystore file.
        """
        account = Account.create()
        keystore = Account.encrypt(account.key, password)

        path = Path(save_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(keystore, indent=2), encoding="utf-8")
        return path

    def export_keystore(self, password: str, path: str | Path) -> Path:
        """Export the current account as an encrypted keystore JSON file.

        Args:
            password: Password to encrypt the keystore.
            path: Destination file path.

        Returns:
            The :class:`~pathlib.Path` to the saved keystore file.

        Raises:
            RuntimeError: If the client has no signing account configured.
        """
        if self._account is None:
            raise RuntimeError(
                "No signing account configured. "
                "Initialize the client with a private_key or use from_keystore()."
            )

        keystore = Account.encrypt(self._account.key, password)
        dest = Path(path)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(json.dumps(keystore, indent=2), encoding="utf-8")
        return dest

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
