# ERC-8004 Go SDK

> Go SDK for interacting with ERC-8004 Trustless AI Agent Registries on any EVM chain.

## Installation

```bash
go get github.com/nirholas/erc8004-agent-creator/sdks/go
```

## Quick Start

```go
package main

import (
    "context"
    "fmt"
    "log"

    erc8004 "github.com/nirholas/erc8004-agent-creator/sdks/go"
)

func main() {
    ctx := context.Background()

    // Read-only client
    client, err := erc8004.NewReadOnlyClient("bsc-testnet")
    if err != nil {
        log.Fatal(err)
    }
    defer client.Close()

    // Query an agent
    agent, err := client.GetAgent(ctx, 1)
    if err != nil {
        log.Fatal(err)
    }
    fmt.Printf("Agent: %s\n", agent.Metadata.Name)
}
```

### Register an Agent

```go
client, err := erc8004.NewClient("bsc-testnet", "0xYOUR_PRIVATE_KEY")
if err != nil {
    log.Fatal(err)
}
defer client.Close()

agentID, err := client.Register(ctx, erc8004.RegisterOptions{
    Name:        "My Go Agent",
    Description: "Built with the Go SDK",
    Services: []erc8004.AgentService{
        {Name: "A2A", Endpoint: "https://my-agent.example.com/a2a"},
    },
})
fmt.Printf("Agent #%d registered!\n", agentID)
```

### Connect with an Encrypted Keystore

```go
// From a keystore file on disk
client, err := erc8004.NewClientFromKeystore(
    "/path/to/keystore.json",
    "mypassword",
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    97, // BSC Testnet chain ID
)
if err != nil {
    log.Fatal(err)
}
defer client.Close()

fmt.Printf("Wallet address: %s\n", client.Address())
```

```go
// From in-memory keystore JSON (e.g., loaded from a secret manager)
keystoreJSON := []byte(`{"address":"...","crypto":{...},...}`)

client, err := erc8004.NewClientFromKeystoreJSON(
    keystoreJSON,
    "mypassword",
    "https://data-seed-prebsc-1-s1.bnbchain.org:8545",
    97,
)
if err != nil {
    log.Fatal(err)
}
defer client.Close()
```

### Export a Keystore

```go
// Export the client's private key as an encrypted keystore JSON blob
exported, err := client.ExportKeystore("newpassword")
if err != nil {
    log.Fatal(err)
}

// Save to file
os.WriteFile("my-wallet.json", exported, 0600)
```

## Supported Chains

| Name | Chain ID | Key |
|------|----------|-----|
| BSC Testnet | 97 | `bsc-testnet` |
| BSC Mainnet | 56 | `bsc` |
| Ethereum | 1 | `ethereum` |
| Sepolia | 11155111 | `sepolia` |

## API

### Client

- `NewClient(chain, privateKey)` — Full client with private key hex
- `NewReadOnlyClient(chain)` — Read-only client (no signing)
- `NewClientFromKeystore(path, password, rpcURL, chainID)` — Client from keystore file
- `NewClientFromKeystoreJSON(json, password, rpcURL, chainID)` — Client from in-memory keystore
- `ExportKeystore(password)` — Export private key as encrypted keystore JSON
- `Address()` — Wallet address (empty for read-only)
- `Register(ctx, opts)` — Register an agent
- `GetAgent(ctx, id)` — Get agent details
- `GetVersion(ctx)` — Contract version

### Identity

- `OwnerOf(ctx, id)` — Token owner
- `TokenURI(ctx, id)` — Metadata URI
- `BalanceOf(ctx, addr)` — Agent count
- `GetAgentWallet(ctx, id)` — Bound wallet

### Reputation

- `GetScore(ctx, id, domain)` — Domain score
- `GetAggregateScore(ctx, id)` — Aggregate score
- `SubmitScore(ctx, id, domain, score, evidence)` — Submit score

## Testing

```bash
go test ./...
```

## License

Apache-2.0
