//! Ethereum V3 keystore encryption / decryption.
//!
//! This module bridges the `eth-keystore` crate with the ERC-8004 client,
//! providing helpers to load a wallet from an encrypted JSON keystore file
//! and to export the current private key back into keystore format.
//!
//! Enable with the `keystore` Cargo feature:
//!
//! ```toml
//! [dependencies]
//! erc8004 = { version = "0.1", features = ["keystore"] }
//! ```

use std::path::Path;

use crate::{Error, Result};

/// Decrypt a V3 keystore file and return `(hex_private_key, hex_address)`.
///
/// The returned private key is a **lowercase hex string without `0x` prefix**.
/// The address is checksummed with a `0x` prefix.
pub fn decrypt_keystore(path: &str, password: &str) -> Result<(String, String)> {
    let dir = Path::new(path)
        .parent()
        .ok_or_else(|| Error::KeystoreError("Invalid keystore path".into()))?;
    let file_name = Path::new(path)
        .file_name()
        .ok_or_else(|| Error::KeystoreError("Invalid keystore file name".into()))?;

    let secret_bytes = eth_keystore::decrypt_key(dir.join(file_name), password)
        .map_err(|e| Error::KeystoreError(format!("Keystore decryption failed: {e}")))?;

    let private_key_hex = hex::encode(&secret_bytes);

    // Derive the Ethereum address from the private key using alloy's k256
    // signing key → public key → keccak256 → last 20 bytes.
    let address = derive_address(&secret_bytes)?;

    Ok((private_key_hex, address))
}

/// Encrypt a hex-encoded private key into a V3 keystore JSON string.
///
/// The keystore is created in a temporary directory and the JSON content is
/// returned as a string so callers can persist it wherever they want.
pub fn encrypt_keystore(hex_private_key: &str, password: &str) -> Result<String> {
    let pk_bytes = hex::decode(hex_private_key)
        .map_err(|e| Error::KeystoreError(format!("Invalid hex private key: {e}")))?;

    let dir = std::env::temp_dir();
    let name = eth_keystore::encrypt_key(
        &dir,
        &mut rand(),
        &pk_bytes,
        password,
        None,
    )
    .map_err(|e| Error::KeystoreError(format!("Keystore encryption failed: {e}")))?;

    let keystore_path = dir.join(name);
    let json = std::fs::read_to_string(&keystore_path)?;

    // Clean up the temp file
    let _ = std::fs::remove_file(keystore_path);

    Ok(json)
}

/// Derive a checksummed Ethereum address from raw secret key bytes.
fn derive_address(secret_bytes: &[u8]) -> Result<String> {
    use alloy::primitives::{keccak256, Address};
    use alloy::signers::k256::ecdsa::SigningKey;

    let signing_key = SigningKey::from_bytes(secret_bytes.into())
        .map_err(|e| Error::KeystoreError(format!("Invalid private key: {e}")))?;

    let verifying_key = signing_key.verifying_key();
    let public_key_bytes = verifying_key.to_encoded_point(false);
    // Skip the 0x04 prefix byte, take the remaining 64 bytes
    let hash = keccak256(&public_key_bytes.as_bytes()[1..]);
    let addr = Address::from_slice(&hash[12..]);
    Ok(format!("{addr}"))
}

/// Simple wrapper for an RNG source used by `eth_keystore::encrypt_key`.
fn rand() -> impl rand::RngCore + rand::CryptoRng {
    rand::thread_rng()
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;

    /// Round-trip: encrypt then decrypt. Verify the private key survives.
    #[test]
    fn test_encrypt_decrypt_roundtrip() {
        // 32-byte dummy key (all 0x01)
        let pk_hex = "0101010101010101010101010101010101010101010101010101010101010101";
        let password = "test-password-123";

        let json = encrypt_keystore(pk_hex, password).unwrap();
        assert!(json.contains("crypto") || json.contains("Crypto"));

        // Write to a temp file so we can decrypt
        let dir = std::env::temp_dir();
        let path = dir.join("erc8004_test_keystore.json");
        let mut f = std::fs::File::create(&path).unwrap();
        f.write_all(json.as_bytes()).unwrap();

        let (recovered_pk, _address) = decrypt_keystore(path.to_str().unwrap(), password).unwrap();
        assert_eq!(recovered_pk, pk_hex);

        // The address should be a 0x-prefixed 42-char hex string
        assert!(_address.starts_with("0x"));
        assert_eq!(_address.len(), 42);

        let _ = std::fs::remove_file(path);
    }
}
