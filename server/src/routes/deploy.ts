/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Turning ideas into reality, one function at a time 💭
 */

import { Router } from 'express';
import { deployContract } from '../services/deployer.js';
import { strictRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Allowed networks whitelist
const ALLOWED_NETWORKS = ['sepolia', 'mumbai'];

// Deploy compiled contract
router.post('/', strictRateLimiter, async (req, res, next) => {
  try {
    const { bytecode, abi, network, constructorArgs } = req.body;

    if (!bytecode || !abi) {
      return res.status(400).json({
        success: false,
        error: 'Bytecode and ABI are required'
      });
    }

    // Security: Validate bytecode is a hex string
    if (typeof bytecode !== 'string' || !/^0x[0-9a-fA-F]+$/.test(bytecode)) {
      return res.status(400).json({
        success: false,
        error: 'Bytecode must be a valid hex string (0x-prefixed)'
      });
    }

    // Security: Validate ABI is an array
    if (!Array.isArray(abi)) {
      return res.status(400).json({
        success: false,
        error: 'ABI must be a valid JSON array'
      });
    }

    // Security: Validate network against whitelist
    const targetNetwork = network || 'sepolia';
    if (!ALLOWED_NETWORKS.includes(targetNetwork)) {
      return res.status(400).json({
        success: false,
        error: `Unsupported network: ${targetNetwork}. Allowed: ${ALLOWED_NETWORKS.join(', ')}`
      });
    }

    // Security: Validate constructorArgs is an array with reasonable length
    const args = constructorArgs || [];
    if (!Array.isArray(args) || args.length > 20) {
      return res.status(400).json({
        success: false,
        error: 'constructorArgs must be an array with at most 20 elements'
      });
    }

    const result = await deployContract({
      bytecode,
      abi,
      network: targetNetwork,
      constructorArgs: args
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error: unknown) {
    next(error);
  }
});

export default router;
