"""Tests for keystore wallet support in ERC8004Client."""

from __future__ import annotations

import json
from pathlib import Path

import pytest
from eth_account import Account

from erc8004.client import ERC8004Client


# A deterministic test private key — never use for real funds.
_TEST_PRIVATE_KEY = "0x4c0883a69102937d6231471b5dbb6204fe51296170827936ea5cce4b76994ba4"
_TEST_PASSWORD = "test-password-123"


class TestCreateWallet:
    """Test ERC8004Client.create_wallet()."""

    def test_creates_valid_keystore_file(self, tmp_path: Path) -> None:
        ks_path = tmp_path / "wallet.json"
        result = ERC8004Client.create_wallet(password=_TEST_PASSWORD, save_path=ks_path)

        assert result == ks_path
        assert ks_path.is_file()

        keystore = json.loads(ks_path.read_text(encoding="utf-8"))
        assert "crypto" in keystore or "Crypto" in keystore
        assert "address" in keystore

    def test_keystore_is_decryptable(self, tmp_path: Path) -> None:
        ks_path = tmp_path / "wallet.json"
        ERC8004Client.create_wallet(password=_TEST_PASSWORD, save_path=ks_path)

        keystore = json.loads(ks_path.read_text(encoding="utf-8"))
        private_key = Account.decrypt(keystore, _TEST_PASSWORD)
        assert isinstance(private_key, bytes)
        assert len(private_key) == 32

    def test_creates_parent_directories(self, tmp_path: Path) -> None:
        ks_path = tmp_path / "nested" / "dir" / "wallet.json"
        ERC8004Client.create_wallet(password=_TEST_PASSWORD, save_path=ks_path)
        assert ks_path.is_file()


class TestFromKeystore:
    """Test ERC8004Client.from_keystore()."""

    @pytest.fixture()
    def keystore_file(self, tmp_path: Path) -> Path:
        """Create a keystore file from the test private key."""
        account = Account.from_key(_TEST_PRIVATE_KEY)
        keystore = Account.encrypt(account.key, _TEST_PASSWORD)
        ks_path = tmp_path / "test-wallet.json"
        ks_path.write_text(json.dumps(keystore, indent=2), encoding="utf-8")
        return ks_path

    def test_loads_keystore_and_sets_account(self, keystore_file: Path) -> None:
        client = ERC8004Client.from_keystore(
            keystore_path=keystore_file,
            password=_TEST_PASSWORD,
        )
        expected_address = Account.from_key(_TEST_PRIVATE_KEY).address
        assert client.w3.eth.default_account == expected_address
        assert client._account is not None
        assert client._account.address == expected_address

    def test_keystore_wrong_password_raises(self, keystore_file: Path) -> None:
        with pytest.raises(ValueError, match="Failed to decrypt"):
            ERC8004Client.from_keystore(
                keystore_path=keystore_file,
                password="wrong-password",
            )

    def test_keystore_file_not_found_raises(self, tmp_path: Path) -> None:
        with pytest.raises(FileNotFoundError, match="Keystore file not found"):
            ERC8004Client.from_keystore(
                keystore_path=tmp_path / "missing.json",
                password=_TEST_PASSWORD,
            )

    def test_keystore_respects_chain_param(self, keystore_file: Path) -> None:
        client = ERC8004Client.from_keystore(
            keystore_path=keystore_file,
            password=_TEST_PASSWORD,
            chain="bsc",
        )
        assert client.chain.chain_id == 56

    def test_from_keystore_matches_from_private_key(self, keystore_file: Path) -> None:
        """Both constructors should produce the same account."""
        ks_client = ERC8004Client.from_keystore(
            keystore_path=keystore_file,
            password=_TEST_PASSWORD,
        )
        pk_client = ERC8004Client.from_private_key(_TEST_PRIVATE_KEY)

        assert ks_client.w3.eth.default_account == pk_client.w3.eth.default_account


class TestFromPrivateKey:
    """Test ERC8004Client.from_private_key()."""

    def test_creates_authenticated_client(self) -> None:
        client = ERC8004Client.from_private_key(_TEST_PRIVATE_KEY)
        expected_address = Account.from_key(_TEST_PRIVATE_KEY).address
        assert client.w3.eth.default_account == expected_address

    def test_accepts_chain_parameter(self) -> None:
        client = ERC8004Client.from_private_key(_TEST_PRIVATE_KEY, chain="bsc")
        assert client.chain.chain_id == 56


class TestExportKeystore:
    """Test ERC8004Client.export_keystore()."""

    def test_export_creates_valid_keystore(self, tmp_path: Path) -> None:
        client = ERC8004Client(chain="bsc-testnet", private_key=_TEST_PRIVATE_KEY)
        dest = tmp_path / "exported.json"
        result = client.export_keystore(password=_TEST_PASSWORD, path=dest)

        assert result == dest
        assert dest.is_file()

        keystore = json.loads(dest.read_text(encoding="utf-8"))
        recovered_key = Account.decrypt(keystore, _TEST_PASSWORD)
        original_key = Account.from_key(_TEST_PRIVATE_KEY).key
        assert recovered_key == original_key

    def test_export_roundtrip_with_from_keystore(self, tmp_path: Path) -> None:
        """Export then re-import should yield the same account."""
        client = ERC8004Client(chain="bsc-testnet", private_key=_TEST_PRIVATE_KEY)
        dest = tmp_path / "roundtrip.json"
        client.export_keystore(password=_TEST_PASSWORD, path=dest)

        restored = ERC8004Client.from_keystore(
            keystore_path=dest,
            password=_TEST_PASSWORD,
        )
        assert restored.w3.eth.default_account == client.w3.eth.default_account

    def test_export_without_account_raises(self, tmp_path: Path) -> None:
        client = ERC8004Client(chain="bsc-testnet")
        with pytest.raises(RuntimeError, match="No signing account"):
            client.export_keystore(password=_TEST_PASSWORD, path=tmp_path / "fail.json")

    def test_export_creates_parent_directories(self, tmp_path: Path) -> None:
        client = ERC8004Client(chain="bsc-testnet", private_key=_TEST_PRIVATE_KEY)
        dest = tmp_path / "deep" / "nested" / "wallet.json"
        client.export_keystore(password=_TEST_PASSWORD, path=dest)
        assert dest.is_file()
