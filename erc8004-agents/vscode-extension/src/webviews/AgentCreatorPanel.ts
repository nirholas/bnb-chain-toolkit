/**
 * Full Agent Creator webview panel — embeds the agent creator UI.
 */

import * as vscode from 'vscode';
import { getActiveChain, getActiveChainKey, getWallet, isConnected, shortenAddress } from '../utils/wallet';
import { getContracts, IDENTITY_ABI } from '../utils/contracts';

export class AgentCreatorPanel {
  public static currentPanel: AgentCreatorPanel | undefined;
  private readonly panel: vscode.WebviewPanel;
  private readonly extensionUri: vscode.Uri;
  private disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionUri: vscode.Uri): void {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (AgentCreatorPanel.currentPanel) {
      AgentCreatorPanel.currentPanel.panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'erc8004-creator',
      'ERC-8004 Agent Creator',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [extensionUri],
      }
    );

    AgentCreatorPanel.currentPanel = new AgentCreatorPanel(panel, extensionUri);
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this.panel = panel;
    this.extensionUri = extensionUri;

    this.update();

    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

    // Handle messages from webview
    this.panel.webview.onDidReceiveMessage(
      async (message: { type: string; data?: any }) => {
        switch (message.type) {
          case 'deploy':
            await this.handleDeploy(message.data);
            break;
          case 'getWalletInfo':
            this.sendWalletInfo();
            break;
          case 'switchChain':
            await vscode.commands.executeCommand('erc8004.switchChain');
            this.sendWalletInfo();
            break;
          case 'connectWallet':
            await vscode.commands.executeCommand('erc8004.connectWallet');
            this.sendWalletInfo();
            break;
        }
      },
      null,
      this.disposables
    );
  }

  private sendWalletInfo(): void {
    const chain = getActiveChain();
    const wallet = getWallet();
    this.panel.webview.postMessage({
      type: 'walletInfo',
      data: {
        connected: isConnected(),
        address: wallet?.address,
        shortAddress: wallet ? shortenAddress(wallet.address) : null,
        chain: chain.name,
        chainId: chain.chainId,
        isTestnet: chain.isTestnet,
      },
    });
  }

  private async handleDeploy(data: {
    agentURI: string;
    name: string;
  }): Promise<void> {
    try {
      const { getIdentityContract } = await import('../utils/wallet');
      const contract = getIdentityContract();

      this.panel.webview.postMessage({ type: 'deployStatus', data: { status: 'pending', message: 'Sending transaction...' } });

      const tx = await contract.getFunction('register(string)').send(data.agentURI);
      this.panel.webview.postMessage({ type: 'deployStatus', data: { status: 'pending', message: `Tx sent: ${tx.hash}` } });

      const receipt = await tx.wait();
      if (!receipt) { throw new Error('Transaction receipt not found'); }

      // Parse agentId from events
      let agentId: string | undefined;
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog({ topics: log.topics as string[], data: log.data });
          if (parsed && parsed.name === 'Registered') {
            agentId = parsed.args[0].toString();
            break;
          }
        } catch {
          // Not our event
        }
      }

      this.panel.webview.postMessage({
        type: 'deployStatus',
        data: {
          status: 'success',
          message: `Agent registered! ID: ${agentId || 'unknown'}`,
          txHash: receipt.hash,
          agentId,
        },
      });

      vscode.commands.executeCommand('erc8004.refreshAgents');
    } catch (error: any) {
      this.panel.webview.postMessage({
        type: 'deployStatus',
        data: { status: 'error', message: error.message || String(error) },
      });
    }
  }

  private update(): void {
    this.panel.webview.html = this.getHtml();
  }

  private getHtml(): string {
    const chain = getActiveChain();
    const chainKey = getActiveChainKey();
    const contracts = getContracts(chainKey);
    const wallet = getWallet();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src https: data:;">
  <title>ERC-8004 Agent Creator</title>
  <style>
    :root {
      --bg: var(--vscode-editor-background);
      --fg: var(--vscode-foreground);
      --accent: #f0b90b;
      --border: var(--vscode-widget-border);
      --input-bg: var(--vscode-input-background);
      --input-border: var(--vscode-input-border);
      --input-fg: var(--vscode-input-foreground);
      --btn-bg: var(--vscode-button-background);
      --btn-fg: var(--vscode-button-foreground);
      --btn-hover: var(--vscode-button-hoverBackground);
      --section-bg: var(--vscode-editor-inactiveSelectionBackground);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: var(--vscode-font-family); color: var(--fg); background: var(--bg); padding: 20px; max-width: 800px; margin: 0 auto; }
    h1 { font-size: 24px; margin-bottom: 4px; }
    h2 { font-size: 16px; margin-bottom: 12px; color: var(--accent); }
    .subtitle { color: var(--vscode-descriptionForeground); margin-bottom: 20px; }
    .step { display: none; }
    .step.active { display: block; }
    .step-header { display: flex; gap: 8px; margin-bottom: 24px; }
    .step-indicator { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; border: 2px solid var(--border); color: var(--vscode-descriptionForeground); }
    .step-indicator.active { background: var(--accent); color: #000; border-color: var(--accent); }
    .step-indicator.done { background: #4caf50; color: #fff; border-color: #4caf50; }
    .form-group { margin-bottom: 16px; }
    label { display: block; font-weight: bold; margin-bottom: 4px; font-size: 13px; }
    .hint { font-size: 12px; color: var(--vscode-descriptionForeground); margin-bottom: 4px; }
    input, textarea, select { width: 100%; padding: 8px 12px; background: var(--input-bg); border: 1px solid var(--input-border); color: var(--input-fg); border-radius: 4px; font-family: inherit; font-size: 13px; }
    textarea { min-height: 80px; resize: vertical; }
    .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; font-weight: bold; }
    .btn-primary { background: var(--btn-bg); color: var(--btn-fg); }
    .btn-primary:hover { background: var(--btn-hover); }
    .btn-secondary { background: transparent; color: var(--fg); border: 1px solid var(--border); }
    .btn-accent { background: var(--accent); color: #000; }
    .btn-accent:hover { opacity: 0.9; }
    .btn-row { display: flex; gap: 8px; margin-top: 20px; }
    .card { padding: 16px; border-radius: 8px; background: var(--section-bg); margin-bottom: 12px; border: 1px solid var(--border); }
    .service-list { display: flex; flex-direction: column; gap: 8px; }
    .service-item { display: flex; gap: 8px; align-items: center; }
    .service-item input { flex: 1; }
    .service-item select { width: 120px; flex-shrink: 0; }
    .remove-btn { background: none; border: none; color: var(--vscode-errorForeground); cursor: pointer; font-size: 18px; padding: 4px; }
    .tag { display: inline-block; padding: 4px 10px; border-radius: 12px; font-size: 12px; margin: 2px; cursor: pointer; border: 1px solid var(--border); }
    .tag.selected { background: var(--accent); color: #000; border-color: var(--accent); }
    .json-preview { background: var(--vscode-textCodeBlock-background); padding: 12px; border-radius: 6px; font-family: var(--vscode-editor-font-family); font-size: 12px; white-space: pre-wrap; overflow: auto; max-height: 400px; }
    .status { padding: 12px; border-radius: 6px; margin-top: 16px; }
    .status.pending { background: rgba(240, 185, 11, 0.1); border: 1px solid var(--accent); }
    .status.success { background: rgba(76, 175, 80, 0.1); border: 1px solid #4caf50; }
    .status.error { background: rgba(244, 67, 54, 0.1); border: 1px solid #f44336; }
    .wallet-bar { padding: 8px 12px; border-radius: 6px; background: var(--section-bg); margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
    .chain-badge { padding: 2px 8px; border-radius: 4px; font-size: 12px; background: var(--accent); color: #000; font-weight: bold; }
  </style>
</head>
<body>
  <h1>🤖 ERC-8004 Agent Creator</h1>
  <p class="subtitle">Register an AI agent identity on-chain</p>

  <div class="wallet-bar" id="walletBar">
    <span id="walletStatus">Not connected</span>
    <button class="btn btn-secondary" id="walletBtn" onclick="handleWallet()">Connect Wallet</button>
  </div>

  <div class="step-header">
    <div class="step-indicator active" id="si1">1</div>
    <div class="step-indicator" id="si2">2</div>
    <div class="step-indicator" id="si3">3</div>
    <div class="step-indicator" id="si4">4</div>
  </div>

  <!-- Step 1: Identity -->
  <div class="step active" id="step1">
    <h2>Step 1: Agent Identity</h2>
    <div class="form-group">
      <label>Name *</label>
      <input type="text" id="agentName" placeholder="My AI Agent" />
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea id="agentDesc" placeholder="What does your agent do?"></textarea>
    </div>
    <div class="form-group">
      <label>Image URL</label>
      <input type="url" id="agentImage" placeholder="https://example.com/avatar.png" />
    </div>
    <div class="btn-row">
      <button class="btn btn-primary" onclick="goToStep(2)">Next →</button>
    </div>
  </div>

  <!-- Step 2: Services -->
  <div class="step" id="step2">
    <h2>Step 2: Services & Endpoints</h2>
    <div class="service-list" id="serviceList"></div>
    <button class="btn btn-secondary" onclick="addService()" style="margin-top:8px">+ Add Service</button>
    <div class="btn-row">
      <button class="btn btn-secondary" onclick="goToStep(1)">← Back</button>
      <button class="btn btn-primary" onclick="goToStep(3)">Next →</button>
    </div>
  </div>

  <!-- Step 3: Trust -->
  <div class="step" id="step3">
    <h2>Step 3: Trust & Settings</h2>
    <div class="form-group">
      <label>Trust Mechanisms</label>
      <div>
        <span class="tag selected" data-trust="reputation" onclick="toggleTag(this)">reputation</span>
        <span class="tag" data-trust="crypto-economic" onclick="toggleTag(this)">crypto-economic</span>
        <span class="tag" data-trust="tee-attestation" onclick="toggleTag(this)">tee-attestation</span>
      </div>
    </div>
    <div class="form-group">
      <label>x402 Payment Support</label>
      <select id="x402">
        <option value="false">No</option>
        <option value="true">Yes</option>
      </select>
    </div>
    <div class="form-group">
      <label>URI Storage</label>
      <select id="uriMethod">
        <option value="onchain">On-chain (base64 data URI)</option>
        <option value="https">HTTPS URL</option>
      </select>
    </div>
    <div class="form-group" id="httpsUriGroup" style="display:none">
      <label>HTTPS URI</label>
      <input type="url" id="httpsUri" placeholder="https://example.com/.well-known/agent-card.json" />
    </div>
    <div class="btn-row">
      <button class="btn btn-secondary" onclick="goToStep(2)">← Back</button>
      <button class="btn btn-primary" onclick="goToStep(4)">Review →</button>
    </div>
  </div>

  <!-- Step 4: Review & Deploy -->
  <div class="step" id="step4">
    <h2>Step 4: Review & Deploy</h2>
    <div class="json-preview" id="jsonPreview"></div>
    <div class="btn-row">
      <button class="btn btn-secondary" onclick="goToStep(3)">← Back</button>
      <button class="btn btn-accent" id="deployBtn" onclick="deploy()">🚀 Deploy Agent</button>
    </div>
    <div id="deployStatus"></div>
  </div>

  <script>
    const vscode = acquireVsCodeApi();
    let currentStep = 1;
    let services = [];
    let serviceIdCounter = 0;

    // Request wallet info on load
    vscode.postMessage({ type: 'getWalletInfo' });

    window.addEventListener('message', (event) => {
      const msg = event.data;
      if (msg.type === 'walletInfo') {
        const d = msg.data;
        const status = document.getElementById('walletStatus');
        const btn = document.getElementById('walletBtn');
        if (d.connected) {
          status.innerHTML = '<span class="chain-badge">' + d.chain + '</span> ' + d.shortAddress;
          btn.textContent = 'Switch Chain';
          btn.onclick = () => vscode.postMessage({ type: 'switchChain' });
        } else {
          status.textContent = 'Not connected';
          btn.textContent = 'Connect Wallet';
          btn.onclick = () => vscode.postMessage({ type: 'connectWallet' });
        }
      } else if (msg.type === 'deployStatus') {
        const el = document.getElementById('deployStatus');
        const d = msg.data;
        el.className = 'status ' + d.status;
        el.textContent = d.message;
        if (d.status === 'success' || d.status === 'error') {
          document.getElementById('deployBtn').disabled = false;
        }
      }
    });

    function handleWallet() {
      vscode.postMessage({ type: 'connectWallet' });
    }

    function goToStep(step) {
      if (step === 2 && !document.getElementById('agentName').value.trim()) {
        document.getElementById('agentName').focus();
        return;
      }
      document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
      document.getElementById('step' + step).classList.add('active');
      for (let i = 1; i <= 4; i++) {
        const si = document.getElementById('si' + i);
        si.className = 'step-indicator' + (i === step ? ' active' : i < step ? ' done' : '');
      }
      currentStep = step;
      if (step === 4) updatePreview();
    }

    function addService() {
      const id = ++serviceIdCounter;
      services.push({ id, name: 'A2A', endpoint: '', version: '' });
      renderServices();
    }

    function removeService(id) {
      services = services.filter(s => s.id !== id);
      renderServices();
    }

    function renderServices() {
      const list = document.getElementById('serviceList');
      list.innerHTML = services.map(s => 
        '<div class="service-item">' +
        '<select onchange="updateService(' + s.id + ',\\'name\\',this.value)">' +
        ['A2A','MCP','OASF','ENS','DID','Custom'].map(n => '<option' + (s.name===n?' selected':'') + '>' + n + '</option>').join('') +
        '</select>' +
        '<input type="url" placeholder="https://..." value="' + (s.endpoint||'') + '" onchange="updateService(' + s.id + ',\\'endpoint\\',this.value)" />' +
        '<input type="text" placeholder="version" value="' + (s.version||'') + '" style="width:80px" onchange="updateService(' + s.id + ',\\'version\\',this.value)" />' +
        '<button class="remove-btn" onclick="removeService(' + s.id + ')">×</button>' +
        '</div>'
      ).join('');
    }

    function updateService(id, field, value) {
      const svc = services.find(s => s.id === id);
      if (svc) svc[field] = value;
    }

    function toggleTag(el) {
      el.classList.toggle('selected');
    }

    function buildJson() {
      const trust = [];
      document.querySelectorAll('.tag.selected').forEach(t => trust.push(t.dataset.trust));
      return {
        type: 'https://eips.ethereum.org/EIPS/eip-8004#registration-v1',
        name: document.getElementById('agentName').value.trim(),
        description: document.getElementById('agentDesc').value.trim(),
        image: document.getElementById('agentImage').value.trim() || undefined,
        services: services.filter(s => s.endpoint).map(s => ({
          name: s.name,
          endpoint: s.endpoint,
          ...(s.version ? { version: s.version } : {})
        })),
        x402Support: document.getElementById('x402').value === 'true',
        active: true,
        supportedTrust: trust
      };
    }

    function updatePreview() {
      const json = buildJson();
      document.getElementById('jsonPreview').textContent = JSON.stringify(json, null, 2);
    }

    function deploy() {
      const json = buildJson();
      const btn = document.getElementById('deployBtn');
      btn.disabled = true;
      
      const method = document.getElementById('uriMethod').value;
      let agentURI;
      if (method === 'https') {
        agentURI = document.getElementById('httpsUri').value;
        if (!agentURI) { btn.disabled = false; return; }
      } else {
        agentURI = 'data:application/json;base64,' + btoa(JSON.stringify(json));
      }

      vscode.postMessage({ type: 'deploy', data: { agentURI, name: json.name } });
    }

    // URI method toggle
    document.getElementById('uriMethod').addEventListener('change', function() {
      document.getElementById('httpsUriGroup').style.display = this.value === 'https' ? 'block' : 'none';
    });

    // Add initial service
    addService();
  </script>
</body>
</html>`;
  }

  public dispose(): void {
    AgentCreatorPanel.currentPanel = undefined;
    this.panel.dispose();
    while (this.disposables.length) {
      const d = this.disposables.pop();
      if (d) {
        d.dispose();
      }
    }
  }
}
