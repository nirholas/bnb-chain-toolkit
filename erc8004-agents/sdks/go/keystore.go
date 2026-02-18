package erc8004

import (
	"fmt"
	"math/big"
	"os"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/google/uuid"
)

// NewClientFromKeystore creates a new ERC-8004 client from an encrypted keystore file on disk.
// The keystore file must be in go-ethereum's standard keystore format (scrypt-encrypted JSON).
func NewClientFromKeystore(keystorePath string, password string, rpcURL string, chainID int64) (*Client, error) {
	keyjson, err := os.ReadFile(keystorePath)
	if err != nil {
		return nil, fmt.Errorf("failed to read keystore file: %w", err)
	}
	return NewClientFromKeystoreJSON(keyjson, password, rpcURL, chainID)
}

// NewClientFromKeystoreJSON creates a new ERC-8004 client from in-memory keystore JSON bytes.
// This is useful when the keystore content is already loaded (e.g., from a secret manager or environment variable).
func NewClientFromKeystoreJSON(keystoreJSON []byte, password string, rpcURL string, chainID int64) (*Client, error) {
	key, err := keystore.DecryptKey(keystoreJSON, password)
	if err != nil {
		return nil, fmt.Errorf("failed to decrypt keystore: %w", err)
	}

	ethClient, err := ethclient.Dial(rpcURL)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to %s: %w", rpcURL, err)
	}

	auth, err := bind.NewKeyedTransactorWithChainID(key.PrivateKey, big.NewInt(chainID))
	if err != nil {
		ethClient.Close()
		return nil, fmt.Errorf("failed to create transactor: %w", err)
	}

	return &Client{
		chain: ChainConfig{
			ChainID: chainID,
			RPCURL:  rpcURL,
		},
		ethClient:  ethClient,
		auth:       auth,
		privateKey: key.PrivateKey,
	}, nil
}

// ExportKeystore encrypts the client's private key as a go-ethereum keystore JSON blob.
// Uses standard scrypt parameters (N=262144, P=1) for production-grade security.
// Returns an error if the client has no private key (read-only mode).
func (c *Client) ExportKeystore(password string) ([]byte, error) {
	if c.privateKey == nil {
		return nil, fmt.Errorf("no private key available (read-only client)")
	}

	id, err := uuid.NewRandom()
	if err != nil {
		return nil, fmt.Errorf("failed to generate UUID: %w", err)
	}

	key := &keystore.Key{
		Id:         id,
		Address:    crypto.PubkeyToAddress(c.privateKey.PublicKey),
		PrivateKey: c.privateKey,
	}

	keyjson, err := keystore.EncryptKey(key, password, keystore.StandardScryptN, keystore.StandardScryptP)
	if err != nil {
		return nil, fmt.Errorf("failed to encrypt keystore: %w", err)
	}

	return keyjson, nil
}

// Address returns the hex address of the client's wallet.
// Returns an empty string for read-only clients.
func (c *Client) Address() string {
	if c.privateKey == nil {
		return ""
	}
	return crypto.PubkeyToAddress(c.privateKey.PublicKey).Hex()
}
