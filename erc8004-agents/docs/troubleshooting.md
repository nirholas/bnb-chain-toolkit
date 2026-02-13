# Troubleshooting

> Fix common issues with the ERC-8004 Agent Creator.

---

## Wallet Issues

### MetaMask won't connect

**Symptom:** Clicking "Connect Wallet" does nothing, or MetaMask doesn't pop up.

**Fixes:**
1. Make sure MetaMask is unlocked and your password is entered
2. Refresh the page (`Ctrl+R` / `Cmd+R`)
3. Check if another tab is blocking MetaMask — close other dApp tabs
4. Disconnect all sites in MetaMask → Settings → Connected Sites → Remove all
5. Try a different browser (Chrome, Brave, Firefox)

### "No wallet detected" error

**Symptom:** Toast notification says no wallet is detected.

**Fix:** Install MetaMask from [metamask.io/download](https://metamask.io/download/). The app launches the download page automatically.

### Wrong network after connecting

**Symptom:** You're connected but on the wrong chain.

**Fix:** The app automatically calls `wallet_switchEthereumChain`. If it fails:
1. Manually switch in MetaMask → Network dropdown → BSC Testnet
2. If BSC Testnet isn't listed, the app will call `wallet_addEthereumChain` to add it

---

## Transaction Issues

### Transaction fails or reverts

**Symptom:** MetaMask shows "Transaction failed" or the app shows an error.

**Causes & Fixes:**

| Cause | Fix |
|---|---|
| Insufficient gas | Increase gas limit in MetaMask (try 500,000) |
| No BNB for gas | Get tBNB from [faucet](https://www.bnbchain.org/en/testnet-faucet) |
| Wrong network | Switch to BSC Testnet (chain ID 97) |
| Contract issue | Check BscScan for contract status |
| Nonce too low | Reset account in MetaMask: Settings → Advanced → Clear activity tab data |

### Transaction stuck / pending

**Symptom:** Transaction submitted but never confirms.

**Fixes:**
1. Wait 30 seconds — BSC blocks are ~3s but can be slower
2. Check the transaction on BscScan using the TX hash
3. If stuck, speed up or cancel in MetaMask
4. Reset nonce: MetaMask → Settings → Advanced → Clear activity tab data

### "Insufficient funds" error

**Symptom:** Error about insufficient funds.

**Fix:** 
- **Testnet:** Get free tBNB from [BNB Chain Faucet](https://www.bnbchain.org/en/testnet-faucet)
- **Mainnet:** You need real BNB. Registration costs ~0.001-0.005 BNB.

### User rejected transaction

**Symptom:** Transaction was cancelled.

**Fix:** This means you clicked "Reject" in MetaMask. Try again and click "Confirm" this time.

---

## Dashboard Issues

### Agents not showing in dashboard

**Symptom:** Dashboard says "0 agents" or can't find your agents.

**Causes:**
1. **Wrong network** — Make sure you're on the same network where you registered
2. **Old registration** — Dashboard scans last ~5000 blocks. Old agents may not appear.
3. **Transferred agent** — Dashboard verifies ownership. Transferred agents won't show.

**Workaround:** Check your agents directly on BscScan:
- Testnet: `https://testnet.bscscan.com/address/YOUR_ADDRESS`
- Mainnet: `https://bscscan.com/address/YOUR_ADDRESS`

### Agent count shows but details don't load

**Symptom:** Says "You own 3 agent(s)" but can't load details.

**Cause:** The event scan didn't cover enough blocks.

**Fix:** Click "Refresh" to retry. If your agents were registered far in the past, use BscScan to view them.

---

## Display Issues

### Page is blank or won't load

**Symptom:** White page or nothing renders.

**Causes & Fixes:**

| Cause | Fix |
|---|---|
| ethers.js CDN blocked | Disable ad blocker for the page |
| No internet | Check connection and reload |
| JavaScript disabled | Enable JavaScript in browser settings |
| Corporate firewall | Try on a personal network |

### Fonts not loading

**Symptom:** Text appears in default system font instead of Inter.

**Cause:** Google Fonts CDN is blocked.

**Fix:** Not critical — the app still works perfectly. The system font fallback looks fine.

### Mobile layout issues

**Symptom:** UI looks cramped on mobile.

**Fix:** The app is responsive but optimized for desktop. For the best experience:
- Use a desktop browser
- On mobile, use landscape mode
- MetaMask mobile browser works for transactions

---

## Gas Estimation Issues

### "Could not estimate gas"

**Symptom:** Review step says gas can't be estimated.

**Causes:**
1. Wallet not connected — connect your wallet first
2. Wrong network — switch to the correct chain
3. Contract not deployed — verify the contract exists on your selected network
4. RPC issues — the public RPC may be slow; try refreshing

**Note:** Gas will still be calculated when you submit the transaction. The estimate is a convenience feature.

---

## URI Storage Issues

### On-chain URI too large

**Symptom:** Transaction is expensive or fails due to URI size.

**Fix:** If your registration JSON is very large (many services/metadata):
1. Switch to **IPFS** storage — upload the JSON to IPFS first
2. Or switch to **HTTPS** — host the JSON on your server
3. Remove unnecessary metadata entries

### IPFS URI not resolving

**Symptom:** Your IPFS-stored agent URI doesn't load in the dashboard.

**Fix:** Make sure your IPFS content is pinned. Free pinning services:
- [Pinata](https://pinata.cloud/) — 500MB free
- [web3.storage](https://web3.storage/) — 5GB free

---

## Still Stuck?

1. **Check BscScan** — Verify the contract is live and your transactions are processing
2. **Open browser console** — `F12` → Console tab → look for error messages
3. **Try a different browser** — Chrome, Brave, or Firefox
4. **Open an issue** — [GitHub Issues](https://github.com/nirholas/erc8004-agent-creator/issues) with:
   - Browser and wallet version
   - Network (testnet/mainnet)
   - Error message or screenshot
   - Console output
