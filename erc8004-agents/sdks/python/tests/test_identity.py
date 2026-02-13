"""Tests for IdentityRegistry and utility functions."""

from __future__ import annotations

import pytest

from erc8004.utils import build_agent_uri, parse_agent_uri, caip10_address, truncate_address
from erc8004.types import AgentMetadata, AgentService


class TestAgentUri:
    """Test URI encoding/decoding."""

    def test_build_and_parse_roundtrip(self) -> None:
        original = {"name": "Test", "description": "A test agent", "type": "AI Agent"}
        uri = build_agent_uri(original)
        assert uri.startswith("data:application/json;base64,")
        parsed = parse_agent_uri(uri)
        assert parsed == original

    def test_parse_raw_json(self) -> None:
        raw = '{"name": "Test"}'
        parsed = parse_agent_uri(raw)
        assert parsed["name"] == "Test"

    def test_parse_invalid_uri(self) -> None:
        with pytest.raises(ValueError, match="Unsupported URI format"):
            parse_agent_uri("ipfs://QmInvalid")

    def test_build_uri_unicode(self) -> None:
        original = {"name": "テスト", "description": "日本語のテスト"}
        uri = build_agent_uri(original)
        parsed = parse_agent_uri(uri)
        assert parsed["name"] == "テスト"


class TestCaip10:
    """Test CAIP-10 address formatting."""

    def test_caip10(self) -> None:
        result = caip10_address(97, "0x8004A818BFB912233c491871b3d84c89A494BD9e")
        assert result == "eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e"


class TestTruncateAddress:
    """Test address truncation."""

    def test_truncate_default(self) -> None:
        addr = "0x8004A818BFB912233c491871b3d84c89A494BD9e"
        result = truncate_address(addr)
        assert result == "0x8004...BD9e"

    def test_truncate_short(self) -> None:
        short = "0x1234"
        assert truncate_address(short) == short
