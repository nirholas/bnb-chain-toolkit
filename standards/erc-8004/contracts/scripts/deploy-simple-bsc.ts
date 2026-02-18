import hre from "hardhat";
import { encodeFunctionData, Hex, encodeAbiParameters } from "viem";
import dotenv from "dotenv";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";

dotenv.config();

/**
 * Simple BSC Testnet deployment script (fallback path).
 *
 * Uses HardhatMinimalUUPS (msg.sender = owner) instead of the vanity
 * CREATE2 deployment. Deploys all 3 registries behind ERC1967 proxies,
 * then immediately upgrades them to the real implementations.
 *
 * This gives us on-chain tx hashes for the deployment without requiring
 * the hardcoded owner key (0x547289...).
 */

interface DeployResult {
  name: string;
  proxy: string;
  implementation: string;
  deployTx: string;
  upgradeTx: string;
}

async function main() {
  const { viem } = await hre.network.connect();
  const publicClient = await viem.getPublicClient();
  const [deployer] = await viem.getWalletClients();

  const chainId = await publicClient.getChainId();

  console.log("=".repeat(80));
  console.log("ERC-8004 Simple Deployment to BSC Testnet");
  console.log("=".repeat(80));
  console.log("Chain ID:        ", chainId);
  console.log("Deployer:        ", deployer.account.address);
  console.log("");

  // Check balance
  const balance = await publicClient.getBalance({ address: deployer.account.address });
  console.log("Balance:         ", (Number(balance) / 1e18).toFixed(6), "tBNB");
  if (balance === 0n) {
    console.error("❌ No tBNB! Fund this address first:");
    console.error("   Address: ", deployer.account.address);
    console.error("   Faucet:  https://www.bnbchain.org/en/testnet-faucet");
    process.exit(1);
  }
  console.log("");

  // Load artifacts
  const minimalUUPSArtifact = await hre.artifacts.readArtifact("HardhatMinimalUUPS");
  const identityArtifact = await hre.artifacts.readArtifact("IdentityRegistryUpgradeable");
  const reputationArtifact = await hre.artifacts.readArtifact("ReputationRegistryUpgradeable");
  const validationArtifact = await hre.artifacts.readArtifact("ValidationRegistryUpgradeable");
  const proxyArtifact = await hre.artifacts.readArtifact("ERC1967Proxy");

  const results: DeployResult[] = [];
  const allTxHashes: string[] = [];

  // =========================================================================
  // PHASE 1: Deploy HardhatMinimalUUPS implementation
  // =========================================================================
  console.log("PHASE 1: Deploy HardhatMinimalUUPS implementation");
  console.log("-".repeat(50));

  const minimalUUPSHash = await deployer.deployContract({
    abi: minimalUUPSArtifact.abi,
    bytecode: minimalUUPSArtifact.bytecode as Hex,
  });
  const minimalUUPSReceipt = await publicClient.waitForTransactionReceipt({ hash: minimalUUPSHash });
  const minimalUUPSAddr = minimalUUPSReceipt.contractAddress!;
  allTxHashes.push(minimalUUPSHash);
  console.log("  ✅ HardhatMinimalUUPS: ", minimalUUPSAddr);
  console.log("     tx: ", minimalUUPSHash);
  console.log("");

  // =========================================================================
  // PHASE 2: Deploy 3 proxies (pointing to HardhatMinimalUUPS)
  // =========================================================================
  console.log("PHASE 2: Deploy ERC1967 Proxies");
  console.log("-".repeat(50));

  // Helper to deploy a proxy
  async function deployProxy(
    name: string,
    identityRegistryAddr: string
  ): Promise<{ address: string; txHash: string }> {
    const initData = encodeFunctionData({
      abi: minimalUUPSArtifact.abi,
      functionName: "initialize",
      args: [identityRegistryAddr as `0x${string}`],
    });

    const constructorArgs = encodeAbiParameters(
      [
        { name: "implementation", type: "address" },
        { name: "data", type: "bytes" },
      ],
      [minimalUUPSAddr as `0x${string}`, initData]
    );

    const fullBytecode = (proxyArtifact.bytecode + constructorArgs.slice(2)) as Hex;

    const txHash = await deployer.sendTransaction({
      data: fullBytecode,
    });
    const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });
    const proxyAddr = receipt.contractAddress!;
    allTxHashes.push(txHash);

    console.log(`  ✅ ${name} proxy: ${proxyAddr}`);
    console.log(`     tx: ${txHash}`);
    return { address: proxyAddr, txHash };
  }

  // Deploy IdentityRegistry proxy first (others reference it)
  const identityProxy = await deployProxy(
    "IdentityRegistry",
    "0x0000000000000000000000000000000000000000"
  );

  const reputationProxy = await deployProxy(
    "ReputationRegistry",
    identityProxy.address
  );

  const validationProxy = await deployProxy(
    "ValidationRegistry",
    identityProxy.address
  );
  console.log("");

  // =========================================================================
  // PHASE 3: Deploy real implementation contracts
  // =========================================================================
  console.log("PHASE 3: Deploy Real Implementations");
  console.log("-".repeat(50));

  const identityImplHash = await deployer.deployContract({
    abi: identityArtifact.abi,
    bytecode: identityArtifact.bytecode as Hex,
  });
  const identityImplReceipt = await publicClient.waitForTransactionReceipt({ hash: identityImplHash });
  const identityImplAddr = identityImplReceipt.contractAddress!;
  allTxHashes.push(identityImplHash);
  console.log("  ✅ IdentityRegistryUpgradeable:   ", identityImplAddr);
  console.log("     tx: ", identityImplHash);

  const reputationImplHash = await deployer.deployContract({
    abi: reputationArtifact.abi,
    bytecode: reputationArtifact.bytecode as Hex,
  });
  const reputationImplReceipt = await publicClient.waitForTransactionReceipt({ hash: reputationImplHash });
  const reputationImplAddr = reputationImplReceipt.contractAddress!;
  allTxHashes.push(reputationImplHash);
  console.log("  ✅ ReputationRegistryUpgradeable:  ", reputationImplAddr);
  console.log("     tx: ", reputationImplHash);

  const validationImplHash = await deployer.deployContract({
    abi: validationArtifact.abi,
    bytecode: validationArtifact.bytecode as Hex,
  });
  const validationImplReceipt = await publicClient.waitForTransactionReceipt({ hash: validationImplHash });
  const validationImplAddr = validationImplReceipt.contractAddress!;
  allTxHashes.push(validationImplHash);
  console.log("  ✅ ValidationRegistryUpgradeable:  ", validationImplAddr);
  console.log("     tx: ", validationImplHash);
  console.log("");

  // =========================================================================
  // PHASE 4: Upgrade proxies to real implementations
  // =========================================================================
  console.log("PHASE 4: Upgrade Proxies");
  console.log("-".repeat(50));

  // Helper to upgrade a proxy
  async function upgradeProxy(
    name: string,
    proxyAddr: string,
    newImplAddr: string,
    implAbi: any,
    initArgs: any[]
  ): Promise<string> {
    const initData = encodeFunctionData({
      abi: implAbi,
      functionName: "initialize",
      args: initArgs,
    });

    const upgradeData = encodeFunctionData({
      abi: minimalUUPSArtifact.abi,
      functionName: "upgradeToAndCall",
      args: [newImplAddr as `0x${string}`, initData],
    });

    const txHash = await deployer.sendTransaction({
      to: proxyAddr as `0x${string}`,
      data: upgradeData,
    });
    await publicClient.waitForTransactionReceipt({ hash: txHash });
    allTxHashes.push(txHash);

    console.log(`  ✅ ${name} upgraded`);
    console.log(`     tx: ${txHash}`);
    return txHash;
  }

  // Upgrade IdentityRegistry (initialize takes no args)
  const identityUpgradeTx = await upgradeProxy(
    "IdentityRegistry",
    identityProxy.address,
    identityImplAddr,
    identityArtifact.abi,
    []
  );
  results.push({
    name: "IdentityRegistry",
    proxy: identityProxy.address,
    implementation: identityImplAddr,
    deployTx: identityProxy.txHash,
    upgradeTx: identityUpgradeTx,
  });

  // Upgrade ReputationRegistry (initialize takes identityRegistry address)
  const reputationUpgradeTx = await upgradeProxy(
    "ReputationRegistry",
    reputationProxy.address,
    reputationImplAddr,
    reputationArtifact.abi,
    [identityProxy.address as `0x${string}`]
  );
  results.push({
    name: "ReputationRegistry",
    proxy: reputationProxy.address,
    implementation: reputationImplAddr,
    deployTx: reputationProxy.txHash,
    upgradeTx: reputationUpgradeTx,
  });

  // Upgrade ValidationRegistry (initialize takes identityRegistry address)
  const validationUpgradeTx = await upgradeProxy(
    "ValidationRegistry",
    validationProxy.address,
    validationImplAddr,
    validationArtifact.abi,
    [identityProxy.address as `0x${string}`]
  );
  results.push({
    name: "ValidationRegistry",
    proxy: validationProxy.address,
    implementation: validationImplAddr,
    deployTx: validationProxy.txHash,
    upgradeTx: validationUpgradeTx,
  });
  console.log("");

  // =========================================================================
  // PHASE 5: Verify contracts respond to calls
  // =========================================================================
  console.log("PHASE 5: Verification");
  console.log("-".repeat(50));

  try {
    const identityVersion = await publicClient.readContract({
      address: identityProxy.address as `0x${string}`,
      abi: identityArtifact.abi,
      functionName: "getVersion",
    });
    console.log(`  ✅ IdentityRegistry version:   ${identityVersion}`);
  } catch (e: any) {
    console.log(`  ❌ IdentityRegistry version:   ${e.message}`);
  }

  try {
    const reputationVersion = await publicClient.readContract({
      address: reputationProxy.address as `0x${string}`,
      abi: reputationArtifact.abi,
      functionName: "getVersion",
    });
    console.log(`  ✅ ReputationRegistry version:  ${reputationVersion}`);
  } catch (e: any) {
    console.log(`  ❌ ReputationRegistry version:  ${e.message}`);
  }

  try {
    const validationVersion = await publicClient.readContract({
      address: validationProxy.address as `0x${string}`,
      abi: validationArtifact.abi,
      functionName: "getVersion",
    });
    console.log(`  ✅ ValidationRegistry version:  ${validationVersion}`);
  } catch (e: any) {
    console.log(`  ❌ ValidationRegistry version:  ${e.message}`);
  }

  try {
    const identityOwner = await publicClient.readContract({
      address: identityProxy.address as `0x${string}`,
      abi: identityArtifact.abi,
      functionName: "owner",
    });
    console.log(`  ✅ IdentityRegistry owner:     ${identityOwner}`);
  } catch (e: any) {
    console.log(`  ❌ IdentityRegistry owner:     ${e.message}`);
  }
  console.log("");

  // =========================================================================
  // Save deployment evidence
  // =========================================================================
  const deploymentData = {
    network: "BSC Testnet",
    chainId,
    deployedAt: new Date().toISOString(),
    deploymentType: "simple (non-vanity fallback)",
    contracts: {
      IdentityRegistry: {
        proxy: identityProxy.address,
        implementation: identityImplAddr,
        deployTx: identityProxy.txHash,
        upgradeTx: identityUpgradeTx,
      },
      ReputationRegistry: {
        proxy: reputationProxy.address,
        implementation: reputationImplAddr,
        deployTx: reputationProxy.txHash,
        upgradeTx: reputationUpgradeTx,
      },
      ValidationRegistry: {
        proxy: validationProxy.address,
        implementation: validationImplAddr,
        deployTx: validationProxy.txHash,
        upgradeTx: validationUpgradeTx,
      },
    },
    implementations: {
      HardhatMinimalUUPS: minimalUUPSAddr,
      IdentityRegistryUpgradeable: identityImplAddr,
      ReputationRegistryUpgradeable: reputationImplAddr,
      ValidationRegistryUpgradeable: validationImplAddr,
    },
    deployer: deployer.account.address,
    owner: deployer.account.address,
    allTransactionHashes: allTxHashes,
    explorerLinks: {
      identity: `https://testnet.bscscan.com/address/${identityProxy.address}`,
      reputation: `https://testnet.bscscan.com/address/${reputationProxy.address}`,
      validation: `https://testnet.bscscan.com/address/${validationProxy.address}`,
    },
  };

  const deploymentsDir = join(dirname(new URL(import.meta.url).pathname), "..", "deployments");
  mkdirSync(deploymentsDir, { recursive: true });
  const outputPath = join(deploymentsDir, "bsc-testnet.json");
  writeFileSync(outputPath, JSON.stringify(deploymentData, null, 2) + "\n");

  console.log("=".repeat(80));
  console.log("DEPLOYMENT COMPLETE");
  console.log("=".repeat(80));
  console.log("");
  console.log("Deployment evidence saved to: deployments/bsc-testnet.json");
  console.log("");
  console.log("All transaction hashes:");
  allTxHashes.forEach((h, i) => console.log(`  ${i + 1}. ${h}`));
  console.log("");
  console.log("Explorer links:");
  console.log(`  Identity:    https://testnet.bscscan.com/address/${identityProxy.address}`);
  console.log(`  Reputation:  https://testnet.bscscan.com/address/${reputationProxy.address}`);
  console.log(`  Validation:  https://testnet.bscscan.com/address/${validationProxy.address}`);
  console.log("");

  return deploymentData;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
