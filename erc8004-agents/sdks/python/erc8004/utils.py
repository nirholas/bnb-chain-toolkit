"""Utility helpers for the ERC-8004 SDK."""

from __future__ import annotations

import base64
import json
from typing import Any


def build_agent_uri(metadata: dict[str, Any]) -> str:
    """Encode agent metadata as an on-chain data URI.

    Args:
        metadata: Agent metadata dict to encode.

    Returns:
        A ``data:application/json;base64,...`` URI.
    """
    json_str = json.dumps(metadata, separators=(",", ":"), ensure_ascii=False)
    encoded = base64.b64encode(json_str.encode("utf-8")).decode("ascii")
    return f"data:application/json;base64,{encoded}"


def parse_agent_uri(uri: str) -> dict[str, Any]:
    """Decode an agent metadata URI.

    Supports ``data:application/json;base64,...`` and plain JSON strings.

    Args:
        uri: The agent URI to parse.

    Returns:
        Parsed metadata dict.

    Raises:
        ValueError: If the URI format is not recognized.
    """
    if uri.startswith("data:application/json;base64,"):
        b64_part = uri.split(",", 1)[1]
        json_str = base64.b64decode(b64_part).decode("utf-8")
        return json.loads(json_str)
    if uri.startswith("{"):
        return json.loads(uri)
    raise ValueError(f"Unsupported URI format: {uri[:80]}...")


def caip10_address(chain_id: int, contract_address: str) -> str:
    """Build a CAIP-10 identifier.

    Args:
        chain_id: EVM chain ID.
        contract_address: Contract address (checksummed or not).

    Returns:
        CAIP-10 string like ``eip155:97:0x8004...``.
    """
    return f"eip155:{chain_id}:{contract_address}"


def truncate_address(address: str, chars: int = 4) -> str:
    """Shorten an Ethereum address for display.

    Args:
        address: Full address string.
        chars: Number of characters to keep on each side.

    Returns:
        ``0x1234...abcd`` style string.
    """
    if len(address) <= chars * 2 + 4:
        return address
    return f"{address[:chars + 2]}...{address[-chars:]}"
