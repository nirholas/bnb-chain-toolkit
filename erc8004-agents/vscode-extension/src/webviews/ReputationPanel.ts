/**
 * Reputation viewer webview panel.
 */

import * as vscode from 'vscode';
import { getReputationContract, getIdentityContract, getActiveChain, getActiveChainKey } from '../utils/wallet';
import { showError, withProgress } from '../utils/notifications';

export class ReputationPanel {
  public static async show(tokenId?: string): Promise<void> {
    if (!tokenId) {
      tokenId = await vscode.window.showInputBox({
        title: 'View Reputation',
        prompt: 'Enter the agent token ID',
        placeHolder: '42',
        validateInput: (v: string) => (!/^\d+$/.test(v.trim()) ? 'Must be a numeric token ID' : undefined),
      });
    }
    if (!tokenId) {
      return;
    }

    await withProgress(`Loading reputation for agent #${tokenId}...`, async (progress) => {
      try {
        const repContract = getReputationContract();
        const idContract = getIdentityContract();
        const chain = getActiveChain();

        // Get agent name
        let agentName = `Agent #${tokenId}`;
        try {
          const uri = await idContract.tokenURI(tokenId);
          if (uri.startsWith('data:application/json;base64,')) {
            const json = JSON.parse(
              Buffer.from(uri.replace('data:application/json;base64,', ''), 'base64').toString('utf-8')
            );
            agentName = json.name || agentName;
          }
        } catch {
          // No URI
        }

        // Get reputation data
        let feedbackCount = 0;
        let averageRating = 0;
        const feedbacks: Array<{
          reviewer: string;
          rating: number;
          comment: string;
          timestamp: number;
        }> = [];

        try {
          feedbackCount = Number(await repContract.getFeedbackCount(tokenId));
          if (feedbackCount > 0) {
            averageRating = Number(await repContract.getAverageRating(tokenId));
            // Load last 10 feedbacks
            const start = Math.max(0, feedbackCount - 10);
            for (let i = start; i < feedbackCount; i++) {
              try {
                const fb = await repContract.getFeedback(tokenId, i);
                feedbacks.push({
                  reviewer: fb[0],
                  rating: Number(fb[1]),
                  comment: fb[2],
                  timestamp: Number(fb[3]),
                });
              } catch {
                break;
              }
            }
          }
        } catch {
          // Reputation contract may not be available
        }

        const panel = vscode.window.createWebviewPanel(
          'erc8004-reputation',
          `Reputation: ${agentName}`,
          vscode.ViewColumn.One,
          { enableScripts: false }
        );

        panel.webview.html = getReputationHtml(
          tokenId!,
          agentName,
          feedbackCount,
          averageRating,
          feedbacks,
          chain.name
        );
      } catch (error: any) {
        showError('Failed to load reputation', error.message || String(error));
      }
    });
  }
}

function getReputationHtml(
  tokenId: string,
  name: string,
  feedbackCount: number,
  averageRating: number,
  feedbacks: Array<{
    reviewer: string;
    rating: number;
    comment: string;
    timestamp: number;
  }>,
  chainName: string
): string {
  const stars = (rating: number) => '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const avgStars = averageRating > 0 ? stars(Math.round(averageRating)) : 'No ratings';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reputation: ${escapeHtml(name)}</title>
  <style>
    body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); padding: 20px; max-width: 700px; margin: 0 auto; }
    h1 { font-size: 22px; margin-bottom: 4px; }
    .subtitle { color: var(--vscode-descriptionForeground); margin-bottom: 24px; }
    .stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 24px; }
    .stat { padding: 16px; border-radius: 8px; background: var(--vscode-editor-inactiveSelectionBackground); text-align: center; }
    .stat-value { font-size: 28px; font-weight: bold; }
    .stat-label { font-size: 12px; color: var(--vscode-descriptionForeground); margin-top: 4px; }
    .stars { color: #f0b90b; font-size: 20px; }
    .feedback-list { margin-top: 16px; }
    .feedback { padding: 12px; border-radius: 6px; background: var(--vscode-editor-inactiveSelectionBackground); margin-bottom: 8px; border-left: 3px solid #f0b90b; }
    .feedback .rating { color: #f0b90b; }
    .feedback .reviewer { font-size: 12px; color: var(--vscode-descriptionForeground); }
    .feedback .comment { margin-top: 4px; }
    .empty { text-align: center; padding: 40px; color: var(--vscode-descriptionForeground); }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 12px; background: #f0b90b; color: #000; }
  </style>
</head>
<body>
  <h1>⭐ Reputation: ${escapeHtml(name)}</h1>
  <p class="subtitle">Token ID: ${tokenId} · <span class="badge">${chainName}</span></p>

  <div class="stats">
    <div class="stat">
      <div class="stat-value stars">${avgStars}</div>
      <div class="stat-label">Average Rating</div>
    </div>
    <div class="stat">
      <div class="stat-value">${feedbackCount}</div>
      <div class="stat-label">Total Reviews</div>
    </div>
    <div class="stat">
      <div class="stat-value">${averageRating > 0 ? (averageRating / 1).toFixed(1) : '—'}</div>
      <div class="stat-label">Score (1-5)</div>
    </div>
  </div>

  <h2>Recent Feedback</h2>
  ${
    feedbacks.length === 0
      ? '<div class="empty"><p>No feedback submitted yet</p><p style="font-size:12px">Feedback can be submitted through the Reputation Registry contract</p></div>'
      : `<div class="feedback-list">${feedbacks
          .reverse()
          .map(
            (f) => `
    <div class="feedback">
      <div class="rating">${stars(f.rating)}</div>
      <div class="reviewer">${f.reviewer.slice(0, 10)}... · ${new Date(f.timestamp * 1000).toLocaleDateString()}</div>
      ${f.comment ? `<div class="comment">${escapeHtml(f.comment)}</div>` : ''}
    </div>`
          )
          .join('')}</div>`
  }
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
