package erc8004

import (
	"encoding/base64"
	"encoding/json"
	"testing"

	"github.com/ethereum/go-ethereum/accounts/keystore"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/google/uuid"
)

func TestGetChain(t *testing.T) {
	chain, ok := GetChain("bsc-testnet")
	if !ok {
		t.Fatal("expected bsc-testnet to exist")
	}
	if chain.ChainID != 97 {
		t.Errorf("expected chainID 97, got %d", chain.ChainID)
	}
	if chain.Name != "BSC Testnet" {
		t.Errorf("expected name 'BSC Testnet', got '%s'", chain.Name)
	}
}

func TestGetChainByID(t *testing.T) {
	chain, ok := GetChainByID(56)
	if !ok {
		t.Fatal("expected chain 56 to exist")
	}
	if chain.Name != "BSC Mainnet" {
		t.Errorf("expected 'BSC Mainnet', got '%s'", chain.Name)
	}
}

func TestGetChainUnknown(t *testing.T) {
	_, ok := GetChain("unknown")
	if ok {
		t.Error("expected unknown chain to return false")
	}
}

func TestBuildAgentURI(t *testing.T) {
	meta := &AgentMetadata{
		Type:        "AI Agent",
		Name:        "Test Agent",
		Description: "A test",
		Active:      true,
	}

	uri, err := BuildAgentURI(meta)
	if err != nil {
		t.Fatalf("BuildAgentURI failed: %v", err)
	}

	prefix := "data:application/json;base64,"
	if len(uri) <= len(prefix) {
		t.Fatal("URI too short")
	}

	b64 := uri[len(prefix):]
	decoded, err := base64.StdEncoding.DecodeString(b64)
	if err != nil {
		t.Fatalf("base64 decode failed: %v", err)
	}

	var parsed AgentMetadata
	if err := json.Unmarshal(decoded, &parsed); err != nil {
		t.Fatalf("JSON unmarshal failed: %v", err)
	}

	if parsed.Name != "Test Agent" {
		t.Errorf("expected 'Test Agent', got '%s'", parsed.Name)
	}
}

func TestParseAgentURI(t *testing.T) {
	original := &AgentMetadata{
		Type:        "AI Agent",
		Name:        "Roundtrip",
		Description: "Testing roundtrip",
		Active:      true,
	}

	uri, err := BuildAgentURI(original)
	if err != nil {
		t.Fatal(err)
	}

	parsed, err := ParseAgentURI(uri)
	if err != nil {
		t.Fatal(err)
	}

	if parsed.Name != "Roundtrip" {
		t.Errorf("expected 'Roundtrip', got '%s'", parsed.Name)
	}
}

func TestParseAgentURIRawJSON(t *testing.T) {
	raw := `{"type":"AI Agent","name":"Raw","description":"test","active":true}`
	parsed, err := ParseAgentURI(raw)
	if err != nil {
		t.Fatal(err)
	}
	if parsed.Name != "Raw" {
		t.Errorf("expected 'Raw', got '%s'", parsed.Name)
	}
}

func TestParseAgentURIUnsupported(t *testing.T) {
	_, err := ParseAgentURI("ipfs://QmInvalid")
	if err == nil {
		t.Error("expected error for unsupported URI")
	}
}

func TestAllChainsHaveIdentity(t *testing.T) {
	for name, chain := range SupportedChains {
		if chain.IdentityRegistry == "" {
			t.Errorf("%s missing IdentityRegistry", name)
		}
		if chain.IdentityRegistry[:6] != "0x8004" {
			t.Errorf("%s IdentityRegistry doesn't start with 0x8004", name)
		}
	}
}

// --- Keystore tests ---

// generateTestKeystore creates a keystore JSON for testing using light scrypt params.
func generateTestKeystore(t *testing.T, password string) ([]byte, *keystore.Key) {
	t.Helper()
	privateKey, err := crypto.GenerateKey()
	if err != nil {
		t.Fatalf("failed to generate key: %v", err)
	}
	id, err := uuid.NewRandom()
	if err != nil {
		t.Fatalf("failed to generate uuid: %v", err)
	}
	key := &keystore.Key{
		Id:         id,
		Address:    crypto.PubkeyToAddress(privateKey.PublicKey),
		PrivateKey: privateKey,
	}
	keyjson, err := keystore.EncryptKey(key, password, keystore.LightScryptN, keystore.LightScryptP)
	if err != nil {
		t.Fatalf("failed to encrypt key: %v", err)
	}
	return keyjson, key
}

func TestNewClientFromKeystoreJSON(t *testing.T) {
	password := "testpassword"
	keyjson, key := generateTestKeystore(t, password)
	expectedAddr := key.Address.Hex()

	client, err := NewClientFromKeystoreJSON(keyjson, password, "http://127.0.0.1:1", 97)
	if err != nil {
		t.Fatalf("NewClientFromKeystoreJSON failed: %v", err)
	}
	defer client.Close()

	if client.Address() != expectedAddr {
		t.Errorf("expected address %s, got %s", expectedAddr, client.Address())
	}

	// Verify the client has write capability (auth is set)
	if client.auth == nil {
		t.Error("expected auth to be set for keystore client")
	}
}

func TestNewClientFromKeystoreJSON_WrongPassword(t *testing.T) {
	keyjson, _ := generateTestKeystore(t, "correctpassword")

	_, err := NewClientFromKeystoreJSON(keyjson, "wrongpassword", "http://127.0.0.1:1", 97)
	if err == nil {
		t.Error("expected error for wrong password")
	}
}

func TestNewClientFromKeystore_FileNotFound(t *testing.T) {
	_, err := NewClientFromKeystore("/nonexistent/path/keystore.json", "pass", "http://127.0.0.1:1", 97)
	if err == nil {
		t.Error("expected error for nonexistent keystore file")
	}
}

func TestExportKeystore(t *testing.T) {
	password := "exporttest"
	keyjson, key := generateTestKeystore(t, password)
	expectedAddr := key.Address

	client, err := NewClientFromKeystoreJSON(keyjson, password, "http://127.0.0.1:1", 56)
	if err != nil {
		t.Fatalf("NewClientFromKeystoreJSON failed: %v", err)
	}
	defer client.Close()

	// Export with a different password
	exported, err := client.ExportKeystore("newpassword")
	if err != nil {
		t.Fatalf("ExportKeystore failed: %v", err)
	}

	// Verify exported keystore is valid go-ethereum keystore JSON
	decrypted, err := keystore.DecryptKey(exported, "newpassword")
	if err != nil {
		t.Fatalf("failed to decrypt exported keystore: %v", err)
	}

	exportedAddr := crypto.PubkeyToAddress(decrypted.PrivateKey.PublicKey)
	if exportedAddr != expectedAddr {
		t.Errorf("exported address %s doesn't match original %s", exportedAddr.Hex(), expectedAddr.Hex())
	}
}

func TestExportKeystore_ReadOnlyClient(t *testing.T) {
	// A client with no private key should fail to export
	c := &Client{}
	_, err := c.ExportKeystore("password")
	if err == nil {
		t.Error("expected error when exporting from read-only client")
	}
}

func TestKeystoreRoundtrip(t *testing.T) {
	// Full roundtrip: generate key → encrypt → import → export → decrypt → verify
	password := "roundtrip"
	keyjson, key := generateTestKeystore(t, password)
	originalKey := crypto.FromECDSA(key.PrivateKey)

	// Import
	client, err := NewClientFromKeystoreJSON(keyjson, password, "http://127.0.0.1:1", 97)
	if err != nil {
		t.Fatalf("import failed: %v", err)
	}
	defer client.Close()

	// Export with new password
	exported, err := client.ExportKeystore("newpass")
	if err != nil {
		t.Fatalf("export failed: %v", err)
	}

	// Decrypt exported keystore
	decrypted, err := keystore.DecryptKey(exported, "newpass")
	if err != nil {
		t.Fatalf("decrypt exported failed: %v", err)
	}

	// Compare raw private key bytes
	roundtripKey := crypto.FromECDSA(decrypted.PrivateKey)
	if len(originalKey) != len(roundtripKey) {
		t.Fatal("key length mismatch")
	}
	for i := range originalKey {
		if originalKey[i] != roundtripKey[i] {
			t.Fatal("private key bytes don't match after roundtrip")
		}
	}
}

func TestAddress_ReadOnly(t *testing.T) {
	c := &Client{}
	if addr := c.Address(); addr != "" {
		t.Errorf("expected empty address for read-only client, got %s", addr)
	}
}

func TestReadOnlyClientHasNoAuth(t *testing.T) {
	// Verify read-only pattern still works — no keystore, no key
	c := &Client{}
	if c.auth != nil {
		t.Error("read-only client should have nil auth")
	}
	if c.privateKey != nil {
		t.Error("read-only client should have nil privateKey")
	}
	if c.Address() != "" {
		t.Error("read-only client should return empty address")
	}
}
