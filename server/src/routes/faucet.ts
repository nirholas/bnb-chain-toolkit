/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Every expert was once a beginner 📚
 */

import { Router } from 'express';
import { fundAddress } from '../services/faucet.js';
import { faucetRateLimiter } from '../middleware/rateLimiter.js';
import { isValidEthereumAddress } from '../utils/validation.js';

const router = Router();

// Allowed testnet networks — BNB Chain testnets first, plus EVM testnets
const ALLOWED_NETWORKS = ['bsc-testnet', 'opbnb-testnet', 'sepolia'] as const;
type NetworkType = typeof ALLOWED_NETWORKS[number];

// Shared handler for faucet requests
async function handleFaucetRequest(req: any, res: any, next: any) {
  try {
    const { address, network } = req.body;

    if (!address || typeof address !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Address is required and must be a string'
      });
    }

    // Validate Ethereum address format
    if (!isValidEthereumAddress(address)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid Ethereum address'
      });
    }

    // Validate network — default to BSC testnet
    const safeNetwork: NetworkType = network && ALLOWED_NETWORKS.includes(network)
      ? network
      : 'bsc-testnet';

    const result = await fundAddress(address, safeNetwork);

    res.json({
      success: true,
      data: result
    });
  } catch (error: unknown) {
    next(error);
  }
}

// Support both POST / and POST /request for convenience
router.post('/', faucetRateLimiter, handleFaucetRequest);
router.post('/request', faucetRateLimiter, handleFaucetRequest);

// GET /api/faucet/networks — list supported networks
router.get('/networks', (_req, res) => {
  res.json({
    networks: [...ALLOWED_NETWORKS],
    default: 'bsc-testnet'
  });
});

export default router;
