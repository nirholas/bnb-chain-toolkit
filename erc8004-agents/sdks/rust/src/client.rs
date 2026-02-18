//! ERC-8004 Client implementation.

use base64::{engine::general_purpose::STANDARD as BASE64, Engine};

use crate::chains::{ChainConfig, ChainName, get_chain};
use crate::types::AgentMetadata;
use crate::{Error, Result};

/// High-level client for ERC-8004 AI Agent Registry operations.
///
/// # Examples
///
/// ```rust,no_run
/// use erc8004::{ERC8004Client, ChainName};
///
/// # async fn example() -> erc8004::Result<()> {
/// let client = ERC8004Client::new(ChainName::BscTestnet, None)?;
/// let version = client.get_version().await?;
/// println!("Version: {version}");
/// # Ok(())
/// # }
/// ```
pub struct ERC8004Client {
    chain: ChainConfig,
    _private_key: Option<String>,
    /// Hex-encoded address derived from the loaded key (if any).
    _address: Option<String>,
}

impl ERC8004Client {
    /// Create a new ERC-8004 client.
    ///
    /// # Arguments
    ///
    /// * `chain` - The target chain.
    /// * `private_key` - Optional private key for write operations.
    pub fn new(chain: ChainName, private_key: Option<String>) -> Result<Self> {
        let chain_config = get_chain(chain);
        Ok(Self {
            chain: chain_config,
            _private_key: private_key,
            _address: None,
        })
    }

    /// Create a client with a custom chain configuration.
    pub fn with_config(chain: ChainConfig, private_key: Option<String>) -> Self {
        Self {
            chain,
            _private_key: private_key,
            _address: None,
        }
    }

    /// Create a client by decrypting an Ethereum V3 keystore file.
    ///
    /// Requires the `keystore` feature (`erc8004 = { features = ["keystore"] }`).
    ///
    /// # Arguments
    ///
    /// * `chain` - The target chain.
    /// * `path` - Path to the keystore JSON file.
    /// * `password` - Password to decrypt the keystore.
    ///
    /// # Example
    ///
    /// ```rust,no_run
    /// # #[cfg(feature = "keystore")]
    /// # {
    /// use erc8004::{ERC8004Client, ChainName};
    /// let client = ERC8004Client::from_keystore(
    ///     ChainName::BscTestnet,
    ///     "path/to/keystore.json",
    ///     "my-password",
    /// ).unwrap();
    /// # }
    /// ```
    #[cfg(feature = "keystore")]
    pub fn from_keystore(chain: ChainName, path: &str, password: &str) -> Result<Self> {
        let (secret_key, address) = crate::keystore::decrypt_keystore(path, password)?;
        let chain_config = get_chain(chain);
        Ok(Self {
            chain: chain_config,
            _private_key: Some(secret_key),
            _address: Some(address),
        })
    }

    /// Export the current private key as an encrypted Ethereum V3 keystore JSON string.
    ///
    /// Requires the `keystore` feature.
    ///
    /// # Arguments
    ///
    /// * `password` - Password to encrypt the keystore with.
    #[cfg(feature = "keystore")]
    pub fn export_keystore(&self, password: &str) -> Result<String> {
        let pk = self._private_key.as_deref().ok_or(Error::NoPrivateKey)?;
        crate::keystore::encrypt_keystore(pk, password)
    }

    /// Get the wallet address (if a private key or keystore was loaded).
    pub fn address(&self) -> Option<&str> {
        self._address.as_deref()
    }

    /// Get the chain configuration.
    pub fn chain(&self) -> &ChainConfig {
        &self.chain
    }

    /// Get the RPC URL.
    pub fn rpc_url(&self) -> &str {
        self.chain.rpc_url
    }

    /// Get the IdentityRegistry contract version.
    ///
    /// This is a placeholder that would use alloy's provider in production.
    pub async fn get_version(&self) -> Result<String> {
        // In a full implementation, this would use alloy to call getVersion()
        // For now, demonstrate the pattern
        Err(Error::ContractError(format!(
            "Direct RPC calls require alloy provider setup for {}",
            self.chain.rpc_url
        )))
    }

    /// Build an agent metadata URI.
    pub fn build_agent_uri(metadata: &AgentMetadata) -> Result<String> {
        let json = serde_json::to_string(metadata)?;
        let encoded = BASE64.encode(json.as_bytes());
        Ok(format!("data:application/json;base64,{encoded}"))
    }

    /// Parse an agent metadata URI.
    pub fn parse_agent_uri(uri: &str) -> Result<AgentMetadata> {
        let json_str = if let Some(b64) = uri.strip_prefix("data:application/json;base64,") {
            let bytes = BASE64.decode(b64)?;
            String::from_utf8(bytes).map_err(|e| Error::ParseError(e.to_string()))?
        } else if uri.starts_with('{') {
            uri.to_string()
        } else {
            return Err(Error::InvalidUri(uri.chars().take(80).collect()));
        };

        let meta: AgentMetadata = serde_json::from_str(&json_str)?;
        Ok(meta)
    }

    /// Build a CAIP-10 identifier.
    pub fn caip10_address(chain_id: u64, contract_address: &str) -> String {
        format!("eip155:{chain_id}:{contract_address}")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_build_and_parse_uri() {
        let meta = AgentMetadata::new("Test Agent", "A test agent");
        let uri = ERC8004Client::build_agent_uri(&meta).unwrap();
        assert!(uri.starts_with("data:application/json;base64,"));

        let parsed = ERC8004Client::parse_agent_uri(&uri).unwrap();
        assert_eq!(parsed.name, "Test Agent");
        assert_eq!(parsed.description, "A test agent");
    }

    #[test]
    fn test_parse_raw_json() {
        let raw = r#"{"type":"AI Agent","name":"Raw","description":"test","active":true}"#;
        let parsed = ERC8004Client::parse_agent_uri(raw).unwrap();
        assert_eq!(parsed.name, "Raw");
    }

    #[test]
    fn test_parse_invalid_uri() {
        let result = ERC8004Client::parse_agent_uri("ipfs://QmInvalid");
        assert!(result.is_err());
    }

    #[test]
    fn test_caip10() {
        let result = ERC8004Client::caip10_address(97, "0x8004A818BFB912233c491871b3d84c89A494BD9e");
        assert_eq!(result, "eip155:97:0x8004A818BFB912233c491871b3d84c89A494BD9e");
    }

    #[test]
    fn test_agent_metadata_builder() {
        let meta = AgentMetadata::new("Builder", "Test")
            .with_service("A2A", "https://example.com/a2a")
            .with_service("MCP", "https://example.com/mcp")
            .with_image("https://example.com/avatar.png");

        assert_eq!(meta.services.len(), 2);
        assert_eq!(meta.services[0].name, "A2A");
        assert_eq!(meta.image, Some("https://example.com/avatar.png".to_string()));
    }

    #[test]
    fn test_new_client() {
        let client = ERC8004Client::new(ChainName::BscTestnet, None).unwrap();
        assert_eq!(client.chain().chain_id, 97);
        assert_eq!(client.chain().name, "BSC Testnet");
    }

    #[test]
    fn test_all_chains() {
        for chain in [ChainName::BscTestnet, ChainName::Bsc, ChainName::Ethereum, ChainName::Sepolia] {
            let config = get_chain(chain);
            assert!(config.identity_registry.starts_with("0x8004"));
        }
    }
}
