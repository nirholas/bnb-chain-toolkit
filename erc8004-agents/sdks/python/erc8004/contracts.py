"""Contract ABIs for ERC-8004 registries."""

from __future__ import annotations

from typing import Any

# IdentityRegistry ABI — covers registration, metadata, and ERC-721 views
IDENTITY_ABI: list[dict[str, Any]] = [
    # --- Registration Functions ---
    {
        "name": "register",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [],
        "outputs": [{"name": "agentId", "type": "uint256"}],
    },
    {
        "name": "register",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [{"name": "agentURI", "type": "string"}],
        "outputs": [{"name": "agentId", "type": "uint256"}],
    },
    {
        "name": "register",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "agentURI", "type": "string"},
            {
                "name": "metadata",
                "type": "tuple[]",
                "components": [
                    {"name": "metadataKey", "type": "string"},
                    {"name": "metadataValue", "type": "bytes"},
                ],
            },
        ],
        "outputs": [{"name": "agentId", "type": "uint256"}],
    },
    # --- URI / Metadata ---
    {
        "name": "setAgentURI",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "agentId", "type": "uint256"},
            {"name": "newURI", "type": "string"},
        ],
        "outputs": [],
    },
    {
        "name": "setMetadata",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "agentId", "type": "uint256"},
            {"name": "metadataKey", "type": "string"},
            {"name": "metadataValue", "type": "bytes"},
        ],
        "outputs": [],
    },
    {
        "name": "getMetadata",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {"name": "agentId", "type": "uint256"},
            {"name": "metadataKey", "type": "string"},
        ],
        "outputs": [{"name": "", "type": "bytes"}],
    },
    {
        "name": "getAgentWallet",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "agentId", "type": "uint256"}],
        "outputs": [{"name": "", "type": "address"}],
    },
    # --- ERC-721 Views ---
    {
        "name": "tokenURI",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "outputs": [{"name": "", "type": "string"}],
    },
    {
        "name": "ownerOf",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "tokenId", "type": "uint256"}],
        "outputs": [{"name": "", "type": "address"}],
    },
    {
        "name": "balanceOf",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "owner", "type": "address"}],
        "outputs": [{"name": "", "type": "uint256"}],
    },
    {
        "name": "getVersion",
        "type": "function",
        "stateMutability": "pure",
        "inputs": [],
        "outputs": [{"name": "", "type": "string"}],
    },
    {
        "name": "name",
        "type": "function",
        "stateMutability": "view",
        "inputs": [],
        "outputs": [{"name": "", "type": "string"}],
    },
    {
        "name": "symbol",
        "type": "function",
        "stateMutability": "view",
        "inputs": [],
        "outputs": [{"name": "", "type": "string"}],
    },
    # --- Events ---
    {
        "name": "Registered",
        "type": "event",
        "inputs": [
            {"name": "agentId", "type": "uint256", "indexed": True},
            {"name": "agentURI", "type": "string", "indexed": False},
            {"name": "owner", "type": "address", "indexed": True},
        ],
    },
    {
        "name": "Transfer",
        "type": "event",
        "inputs": [
            {"name": "from", "type": "address", "indexed": True},
            {"name": "to", "type": "address", "indexed": True},
            {"name": "tokenId", "type": "uint256", "indexed": True},
        ],
    },
]

# ReputationRegistry ABI (partial — core functions)
REPUTATION_ABI: list[dict[str, Any]] = [
    {
        "name": "submitScore",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "agentId", "type": "uint256"},
            {"name": "domain", "type": "string"},
            {"name": "score", "type": "uint256"},
            {"name": "evidence", "type": "string"},
        ],
        "outputs": [],
    },
    {
        "name": "getScore",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {"name": "agentId", "type": "uint256"},
            {"name": "domain", "type": "string"},
        ],
        "outputs": [
            {"name": "score", "type": "uint256"},
            {"name": "count", "type": "uint256"},
        ],
    },
    {
        "name": "getAggregateScore",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "agentId", "type": "uint256"}],
        "outputs": [
            {"name": "score", "type": "uint256"},
            {"name": "totalReviews", "type": "uint256"},
        ],
    },
    {
        "name": "getVersion",
        "type": "function",
        "stateMutability": "pure",
        "inputs": [],
        "outputs": [{"name": "", "type": "string"}],
    },
    # Events
    {
        "name": "ScoreSubmitted",
        "type": "event",
        "inputs": [
            {"name": "agentId", "type": "uint256", "indexed": True},
            {"name": "domain", "type": "string", "indexed": False},
            {"name": "score", "type": "uint256", "indexed": False},
            {"name": "reviewer", "type": "address", "indexed": True},
        ],
    },
]

# ValidationRegistry ABI (partial — core functions)
VALIDATION_ABI: list[dict[str, Any]] = [
    {
        "name": "validate",
        "type": "function",
        "stateMutability": "nonpayable",
        "inputs": [
            {"name": "agentId", "type": "uint256"},
            {"name": "validationType", "type": "string"},
            {"name": "evidence", "type": "bytes"},
        ],
        "outputs": [{"name": "validationId", "type": "uint256"}],
    },
    {
        "name": "isValid",
        "type": "function",
        "stateMutability": "view",
        "inputs": [
            {"name": "agentId", "type": "uint256"},
            {"name": "validationType", "type": "string"},
        ],
        "outputs": [{"name": "", "type": "bool"}],
    },
    {
        "name": "getValidation",
        "type": "function",
        "stateMutability": "view",
        "inputs": [{"name": "validationId", "type": "uint256"}],
        "outputs": [
            {"name": "agentId", "type": "uint256"},
            {"name": "validationType", "type": "string"},
            {"name": "validator", "type": "address"},
            {"name": "timestamp", "type": "uint256"},
        ],
    },
    {
        "name": "getVersion",
        "type": "function",
        "stateMutability": "pure",
        "inputs": [],
        "outputs": [{"name": "", "type": "string"}],
    },
    # Events
    {
        "name": "Validated",
        "type": "event",
        "inputs": [
            {"name": "agentId", "type": "uint256", "indexed": True},
            {"name": "validationType", "type": "string", "indexed": False},
            {"name": "validator", "type": "address", "indexed": True},
            {"name": "validationId", "type": "uint256", "indexed": False},
        ],
    },
]
