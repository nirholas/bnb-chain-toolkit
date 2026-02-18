/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Write code that makes you proud 🏆
 */

import { Router } from 'express';
import { uploadToIPFS, pinFile } from '../services/ipfs.js';
import { strictRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

// Upload file to IPFS
router.post('/upload', strictRateLimiter, async (req, res, next) => {
  try {
    const { content, name, metadata } = req.body;

    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Content is required'
      });
    }

    // Security: Validate content size (max 5MB)
    const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
    if (contentStr.length > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: 'Content exceeds maximum size of 5MB'
      });
    }

    const result = await uploadToIPFS({
      content,
      name: name || 'file',
      metadata: metadata || {}
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error: unknown) {
    next(error);
  }
});

// CID format validation (CIDv0: Qm..., CIDv1: bafy..., bafk...)
const CID_PATTERN = /^(Qm[1-9A-HJ-NP-Za-km-z]{44}|b[a-z2-7]{58,})$/;

// Pin existing CID
router.post('/pin', strictRateLimiter, async (req, res, next) => {
  try {
    const { cid, name } = req.body;

    if (!cid) {
      return res.status(400).json({
        success: false,
        error: 'CID is required'
      });
    }

    // Security: Validate CID format
    if (typeof cid !== 'string' || !CID_PATTERN.test(cid)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid CID format. Must be a valid CIDv0 (Qm...) or CIDv1 (bafy...)'
      });
    }

    const result = await pinFile(cid, name);

    res.json({
      success: true,
      data: result
    });
  } catch (error: unknown) {
    next(error);
  }
});

export default router;
