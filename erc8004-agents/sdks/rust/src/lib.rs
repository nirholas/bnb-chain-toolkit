//! ERC-8004 Rust SDK — Interact with ERC-8004 AI Agent Registries on any EVM chain.
//!
//! # Quick Start
//!
//! ```rust,no_run
//! use erc8004::{ERC8004Client, ChainName};
//!
//! #[tokio::main]
//! async fn main() -> erc8004::Result<()> {
//!     let client = ERC8004Client::new(ChainName::BscTestnet, None)?;
//!     let version = client.get_version().await?;
//!     println!("Version: {version}");
//!     Ok(())
//! }
//! ```

pub mod chains;
pub mod client;
pub mod contracts;
pub mod identity;
#[cfg(feature = "keystore")]
pub mod keystore;
pub mod reputation;
pub mod types;

pub use chains::{ChainConfig, ChainName, get_chain};
pub use client::ERC8004Client;
pub use types::{AgentMetadata, AgentService, MetadataEntry, RegisteredAgent};

/// Result type for ERC-8004 operations.
pub type Result<T> = std::result::Result<T, Error>;

/// Errors returned by the ERC-8004 SDK.
#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("Chain not supported: {0}")]
    UnsupportedChain(String),

    #[error("Contract call failed: {0}")]
    ContractError(String),

    #[error("Transaction failed: {0}")]
    TransactionError(String),

    #[error("Invalid URI format: {0}")]
    InvalidUri(String),

    #[error("Parse error: {0}")]
    ParseError(String),

    #[error("No private key configured for write operations")]
    NoPrivateKey,

    #[error("Alloy transport error: {0}")]
    TransportError(String),

    #[error("JSON error: {0}")]
    JsonError(#[from] serde_json::Error),

    #[error("Base64 decode error: {0}")]
    Base64Error(#[from] base64::DecodeError),

    #[error("Keystore error: {0}")]
    KeystoreError(String),

    #[error("IO error: {0}")]
    IoError(#[from] std::io::Error),
}
