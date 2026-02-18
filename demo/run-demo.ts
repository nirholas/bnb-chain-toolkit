// demo/run-demo.ts
import { ethers } from 'ethers';

const BSC_TESTNET_RPC = 'https://data-seed-prebsc-1-s1.binance.org:8545';
const IDENTITY_REGISTRY = '0x8004A818BFB912233c491871b3d84c89A494BD9e';
const REPUTATION_REGISTRY = '0x8004B663056A597Dffe9eCcC1965A193B7388713';

// ABIs (minimal — just the functions we call)
const IDENTITY_ABI = [
  'function register(string uri) returns (uint256)',
  'function agentCount() view returns (uint256)',
  'function tokenURI(uint256 tokenId) view returns (string)',
  'function ownerOf(uint256 tokenId) view returns (address)',
  'function setMetadata(uint256 agentId, string key, string value)',
  'function getMetadata(uint256 agentId, string key) view returns (string)',
  'event Transfer(address indexed from, address indexed to, uint256 indexed tokenId)',
];

const REPUTATION_ABI = [
  'function giveFeedback(uint256 agentId, int8 value, uint8 decimals, bytes32 tag1, bytes32 tag2, string endpoint, string uri, bytes32 hash)',
  'function getFeedbackCount(uint256 agentId) view returns (uint256)',
  'event FeedbackGiven(uint256 indexed agentId, address indexed client, int8 value)',
];

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('ERROR: Set PRIVATE_KEY environment variable');
    process.exit(1);
  }

  const provider = new ethers.JsonRpcProvider(BSC_TESTNET_RPC);
  const wallet = new ethers.Wallet(privateKey, provider);

  console.log('='.repeat(60));
  console.log('BNB Chain AI Toolkit — End-to-End Demo');
  console.log('='.repeat(60));
  console.log(`Network: BSC Testnet (chain 97)`);
  console.log(`Wallet: ${wallet.address}`);
  console.log(
    `Balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} tBNB`,
  );
  console.log('');

  const identity = new ethers.Contract(
    IDENTITY_REGISTRY,
    IDENTITY_ABI,
    wallet,
  );
  const reputation = new ethers.Contract(
    REPUTATION_REGISTRY,
    REPUTATION_ABI,
    wallet,
  );

  // Step 1: Register agent
  console.log('Step 1: Registering AI agent on-chain...');
  const agentURI =
    'data:application/json;base64,' +
    btoa(
      JSON.stringify({
        name: 'BNB Chain AI Toolkit Demo Agent',
        description:
          'An autonomous AI agent with on-chain identity, demonstrating the ERC-8004 standard on BSC.',
        version: '1.0.0',
        capabilities: ['chat', 'analysis', 'on-chain-execution'],
        protocols: ['a2a', 'x402', 'mcp'],
        chain: 'bsc-testnet',
        toolkit: 'https://github.com/nirholas/bnb-chain-toolkit',
      }),
    );

  const tx1 = await identity.register(agentURI);
  console.log(`  TX: https://testnet.bscscan.com/tx/${tx1.hash}`);
  const receipt1 = await tx1.wait();

  // Extract agentId from Transfer event
  const transferEvent = receipt1.logs.find((log: { topics: string[]; data: string }) => {
    try {
      return identity.interface.parseLog(log)?.name === 'Transfer';
    } catch {
      return false;
    }
  });
  const agentId = transferEvent
    ? identity.interface.parseLog(transferEvent)!.args.tokenId
    : null;
  console.log(`  Agent ID: ${agentId}`);
  console.log(`  Block: ${receipt1.blockNumber}`);
  console.log('');

  // Step 2: Verify registration
  console.log('Step 2: Verifying on-chain identity...');
  const count = await identity.agentCount();
  const owner = await identity.ownerOf(agentId);
  const uri = await identity.tokenURI(agentId);
  console.log(`  Total agents registered: ${count}`);
  console.log(`  Owner: ${owner}`);
  console.log(`  URI stored on-chain: ${uri.substring(0, 80)}...`);
  console.log('');

  // Step 3: Set metadata
  console.log('Step 3: Setting agent metadata...');
  const tx2 = await identity.setMetadata(
    agentId,
    'mcp-server',
    'bnbchain-mcp',
  );
  console.log(`  TX: https://testnet.bscscan.com/tx/${tx2.hash}`);
  await tx2.wait();

  const tx3 = await identity.setMetadata(
    agentId,
    'a2a-endpoint',
    'https://demo.bnb-chain-toolkit.vercel.app/a2a',
  );
  console.log(`  TX: https://testnet.bscscan.com/tx/${tx3.hash}`);
  await tx3.wait();
  console.log('');

  // Step 4: Query reputation
  // Note: If using same wallet, giveFeedback may revert due to self-feedback restriction.
  // We query the count instead.
  console.log('Step 4: Querying reputation registry...');
  const feedbackCount = await reputation.getFeedbackCount(agentId);
  console.log(`  Feedback count for agent ${agentId}: ${feedbackCount}`);
  console.log('');

  // Summary
  console.log('='.repeat(60));
  console.log('DEMO COMPLETE — On-Chain Proof');
  console.log('='.repeat(60));
  console.log(`Network:            BSC Testnet (Chain ID: 97)`);
  console.log(`Identity Registry:  ${IDENTITY_REGISTRY}`);
  console.log(`Reputation Registry: ${REPUTATION_REGISTRY}`);
  console.log(`Agent ID:           ${agentId}`);
  console.log(
    `Registration TX:    https://testnet.bscscan.com/tx/${tx1.hash}`,
  );
  console.log(`Metadata TX 1:      https://testnet.bscscan.com/tx/${tx2.hash}`);
  console.log(`Metadata TX 2:      https://testnet.bscscan.com/tx/${tx3.hash}`);
  console.log(
    `Agent Page:         https://testnet.bscscan.com/nft/${IDENTITY_REGISTRY}/${agentId}`,
  );
  console.log('='.repeat(60));
}

main().catch(console.error);
