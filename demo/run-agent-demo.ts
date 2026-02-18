// demo/run-agent-demo.ts
// Starts a real ERC-8004 agent that registers on BSC Testnet
// Requires: PRIVATE_KEY env var with tBNB

// This imports from the agent-runtime and starts a live agent
// that registers on-chain and accepts A2A tasks

import { resolve } from 'path';

async function main() {
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error('Set PRIVATE_KEY with tBNB on BSC Testnet');
    console.error('Get tBNB: https://www.bnbchain.org/en/testnet-faucet');
    process.exit(1);
  }

  // Dynamically import to handle path resolution
  const agentRuntime = await import(resolve('../agent-runtime/src/agent.js'));
  const { ERC8004Agent } = agentRuntime;

  const agent = new ERC8004Agent({
    name: 'BNB Chain Toolkit Agent',
    description:
      'Full-stack AI agent with 1,100+ tools for BNB Chain — MCP servers, market data, DeFi tools, and on-chain identity via ERC-8004.',
    privateKey,
    chain: 'bsc-testnet',
    capabilities: [
      'chat',
      'defi-analysis',
      'security-audit',
      'market-data',
      'on-chain-execution',
    ],
    services: [
      { type: 'a2a', url: 'http://localhost:3000' },
      { type: 'mcp', url: 'https://github.com/nirholas/bnb-chain-toolkit' },
    ],
  });

  agent.onDefault(async (task: any) => {
    const text =
      typeof task.messages?.[task.messages.length - 1]?.content === 'string'
        ? task.messages[task.messages.length - 1].content
        : 'No message';

    return {
      status: 'completed',
      result: {
        type: 'text',
        text: `[BNB Chain Toolkit Agent] I'm an AI agent with on-chain identity on BSC Testnet. I have access to 1,100+ blockchain tools via MCP servers. Your message: "${text}"`,
      },
    };
  });

  await agent.start({
    port: 3000,
    skipRegistration: false, // REGISTER ON-CHAIN
    devMode: false,
  });

  console.log('\nAgent registered on BSC Testnet and running!');
  console.log(
    'Test: curl http://localhost:3000/.well-known/agent.json',
  );
  console.log(
    'A2A:  curl -X POST http://localhost:3000/a2a -H "Content-Type: application/json" -d \'{"jsonrpc":"2.0","method":"tasks/send","params":{"id":"1","message":{"role":"user","parts":[{"type":"text","text":"Hello!"}]}},"id":1}\'',
  );
}

main().catch(console.error);
