package erc8004

// Data types for ERC-8004 interactions.

// AgentService represents a service endpoint exposed by an agent.
type AgentService struct {
	Type        string `json:"type"`
	URL         string `json:"url"`
	Description string `json:"description,omitempty"`
	Version     string `json:"version,omitempty"`
}

// MetadataEntry is a key-value pair for on-chain metadata.
type MetadataEntry struct {
	Key   string
	Value string
}

// TrustConfig defines a trust mechanism.
type TrustConfig struct {
	Type      string `json:"type"`
	Provider  string `json:"provider,omitempty"`
	Threshold int    `json:"threshold,omitempty"`
}

// X402PaymentConfig configures x402 payment support.
type X402PaymentConfig struct {
	Enabled   bool     `json:"enabled"`
	Tokens    []string `json:"tokens,omitempty"`
	MinAmount string   `json:"minAmount,omitempty"`
	Receiver  string   `json:"receiver,omitempty"`
}

// AgentMetadata is the full agent registration metadata (stored as JSON URI).
type AgentMetadata struct {
	Type           string             `json:"type"`
	Name           string             `json:"name"`
	Description    string             `json:"description"`
	Image          string             `json:"image,omitempty"`
	Services       []AgentService     `json:"services,omitempty"`
	X402Support    *X402PaymentConfig `json:"x402Support,omitempty"`
	Active         bool               `json:"active"`
	Registrations  []map[string]any   `json:"registrations,omitempty"`
	SupportedTrust []TrustConfig      `json:"supportedTrust,omitempty"`
}

// RegisteredAgent represents an agent registered on-chain.
type RegisteredAgent struct {
	AgentID     int64          `json:"agentId"`
	Owner       string         `json:"owner"`
	ChainID     int64          `json:"chainId"`
	TxHash      string         `json:"txHash"`
	BlockNumber uint64         `json:"blockNumber"`
	AgentURI    string         `json:"agentUri,omitempty"`
	Metadata    *AgentMetadata `json:"metadata,omitempty"`
}

// ReputationScore holds a reputation query result.
type ReputationScore struct {
	Score int64 `json:"score"`
	Count int64 `json:"count"`
}

// ValidationRecord holds a validation query result.
type ValidationRecord struct {
	ValidationID   int64  `json:"validationId"`
	AgentID        int64  `json:"agentId"`
	ValidationType string `json:"validationType"`
	Validator      string `json:"validator"`
	Timestamp      int64  `json:"timestamp"`
}

// RegisterOptions configures an agent registration call.
type RegisterOptions struct {
	Name            string
	Description     string
	Services        []AgentService
	Image           string
	MetadataEntries []MetadataEntry
}
