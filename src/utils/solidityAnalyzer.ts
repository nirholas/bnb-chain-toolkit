/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 The journey of a thousand apps begins with a single line 🛤️
 *
 * Solidity Static Analyzer — deterministic code analysis for all Innovation components
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SolidityFunction {
  name: string;
  visibility: 'public' | 'external' | 'internal' | 'private';
  mutability: 'pure' | 'view' | 'payable' | 'nonpayable';
  modifiers: string[];
  params: string[];
  returns: string[];
  lineIndex: number;
}

export interface Vulnerability {
  id: string;
  type: VulnerabilityType;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  description: string;
  confidence: number;
  line?: number;
  fix: string;
  gasImpact?: number;
}

export type VulnerabilityType =
  | 'reentrancy'
  | 'overflow'
  | 'frontrunning'
  | 'flashloan'
  | 'delegation'
  | 'oracle'
  | 'unchecked-return'
  | 'tx-origin'
  | 'selfdestruct'
  | 'access-control'
  | 'timestamp'
  | 'dos';

export interface GasEstimate {
  operation: string;
  baseCost: number;
  optimizedCost: number;
  savings: number;
  savingsPercent: number;
  recommendations: string[];
}

export interface ContractInfo {
  type: ContractType[];
  name: string | null;
  pragmaVersion: string | null;
  imports: string[];
  stateVarCount: number;
  functionCount: number;
  eventCount: number;
  modifierCount: number;
  complexity: number;
  linesOfCode: number;
}

export type ContractType =
  | 'ERC20'
  | 'ERC721'
  | 'ERC1155'
  | 'Proxy'
  | 'Ownable'
  | 'Pausable'
  | 'Upgradeable'
  | 'MultiSig'
  | 'Staking'
  | 'DEX'
  | 'Lending'
  | 'Governor'
  | 'Custom';

// ─── Opcode Gas Costs (EIP-based) ───────────────────────────────────────────

const GAS_COSTS = {
  SSTORE_NEW: 20_000,
  SSTORE_UPDATE: 5_000,
  SSTORE_CLEAR: 15_000, // refund
  SLOAD: 2_100,
  CALL: 2_600,
  CALL_WITH_VALUE: 9_000,
  CREATE: 32_000,
  CREATE2: 32_000,
  LOG0: 375,
  LOG_PER_TOPIC: 375,
  LOG_PER_BYTE: 8,
  KECCAK256_BASE: 30,
  KECCAK256_PER_WORD: 6,
  MEMORY_PER_WORD: 3,
  COPY_PER_WORD: 3,
  BASE_TX: 21_000,
  CALLDATA_ZERO: 4,
  CALLDATA_NONZERO: 16,
  EXP_BASE: 10,
  BALANCE: 2_600,
  EXTCODESIZE: 2_600,
  SELFDESTRUCT: 5_000,
  // Arithmetic (post-Berlin)
  ADD: 3,
  MUL: 5,
  DIV: 5,
  MOD: 5,
  COMPARISON: 3,
} as const;

// ─── Vulnerability Patterns ─────────────────────────────────────────────────

interface VulnPattern {
  type: VulnerabilityType;
  severity: Vulnerability['severity'];
  title: string;
  description: string;
  confidence: number;
  check: (code: string, lines: string[]) => { found: boolean; line?: number };
  defense: (code: string) => boolean;
  fix: string;
  gasImpact?: number;
}

const VULN_PATTERNS: VulnPattern[] = [
  {
    type: 'reentrancy',
    severity: 'critical',
    title: 'Reentrancy Vulnerability',
    description: 'External call before state update allows re-entrant calls to drain funds.',
    confidence: 0.94,
    check: (code, lines) => {
      // Look for .call{value: or .transfer( without ReentrancyGuard
      const hasExternalCall = /\.(call\{value:|transfer\(|send\()/.test(code);
      if (!hasExternalCall) return { found: false };

      // Check if state update happens AFTER external call
      const callIdx = lines.findIndex(l => /\.(call\{value:|transfer\(|send\()/.test(l));
      const stateUpdateAfterCall = lines.slice(callIdx + 1).some(l =>
        /\b\w+\s*[+\-*/]?=\s*/.test(l) && !l.trim().startsWith('//') && !l.trim().startsWith('*')
      );

      return { found: stateUpdateAfterCall, line: callIdx + 1 };
    },
    defense: (code) =>
      code.includes('ReentrancyGuard') ||
      code.includes('nonReentrant') ||
      code.includes('_status') ||
      code.includes('locked'),
    fix: "Use OpenZeppelin ReentrancyGuard or follow Checks-Effects-Interactions pattern",
    gasImpact: 2_300,
  },
  {
    type: 'overflow',
    severity: 'critical',
    title: 'Integer Overflow/Underflow',
    description: 'Arithmetic operations on pre-0.8 Solidity without SafeMath can overflow.',
    confidence: 0.99,
    check: (code) => {
      const pre08 = !code.includes('pragma solidity ^0.8') &&
                     !code.includes('pragma solidity >=0.8') &&
                     !code.includes('pragma solidity 0.8');
      const hasArithmetic = /uint\d*\s+\w+/.test(code) && /[+\-*]/.test(code);
      return { found: pre08 && hasArithmetic };
    },
    defense: (code) =>
      code.includes('SafeMath') ||
      code.includes('pragma solidity ^0.8') ||
      code.includes('pragma solidity >=0.8') ||
      code.includes('pragma solidity 0.8'),
    fix: "Upgrade to Solidity ^0.8.0 or use OpenZeppelin SafeMath library",
  },
  {
    type: 'frontrunning',
    severity: 'high',
    title: 'Front-Running Susceptibility',
    description: 'Public functions with price-sensitive logic can be front-run in the mempool.',
    confidence: 0.78,
    check: (code, lines) => {
      const hasPriceSensitive = /\b(swap|buy|sell|trade|price|rate|exchange)\b/i.test(code);
      const hasPublicPayable = lines.some(l =>
        /function\s+\w+.*\bpublic\b.*\bpayable\b/.test(l) ||
        /function\s+\w+.*\bexternal\b.*\bpayable\b/.test(l)
      );
      return { found: hasPriceSensitive && hasPublicPayable };
    },
    defense: (code) =>
      code.includes('commit') ||
      code.includes('reveal') ||
      code.includes('deadline') ||
      code.includes('minAmount') ||
      code.includes('slippage'),
    fix: "Implement commit-reveal scheme, add deadline parameters, or use Flashbots for MEV protection",
  },
  {
    type: 'flashloan',
    severity: 'critical',
    title: 'Flash Loan Attack Vector',
    description: 'On-chain price calculation without TWAP oracle enables flash loan price manipulation.',
    confidence: 0.85,
    check: (code) => {
      const usesSpotPrice = /balance(Of)?.*\//i.test(code) || /reserve[s01]?\s*[/*]/.test(code);
      const hasPriceLogic = /\b(price|rate|getAmount|quote)\b/i.test(code);
      return { found: usesSpotPrice || (hasPriceLogic && code.includes('balanceOf')) };
    },
    defense: (code) =>
      code.includes('TWAP') ||
      code.includes('oracle') ||
      code.includes('Chainlink') ||
      code.includes('AggregatorV3'),
    fix: "Use Chainlink price feeds or TWAP oracles instead of spot balances for pricing",
    gasImpact: 5_000,
  },
  {
    type: 'delegation',
    severity: 'critical',
    title: 'Unprotected Delegatecall',
    description: 'Delegatecall to user-controlled address allows arbitrary storage writes.',
    confidence: 0.92,
    check: (code, lines) => {
      const line = lines.findIndex(l => /delegatecall/.test(l));
      return { found: line !== -1, line: line + 1 };
    },
    defense: (code) => {
      const hasDelegatecall = code.includes('delegatecall');
      if (!hasDelegatecall) return true;
      return code.includes('onlyOwner') ||
             code.includes('require(msg.sender') ||
             code.includes('allowedTargets') ||
             code.includes('implementation()');
    },
    fix: "Whitelist delegatecall targets and restrict access with onlyOwner or role-based control",
  },
  {
    type: 'oracle',
    severity: 'high',
    title: 'Oracle Manipulation Risk',
    description: 'Single oracle source without validation can be manipulated.',
    confidence: 0.80,
    check: (code) => {
      const usesOracle = /\b(oracle|price|feed|getLatest)\b/i.test(code);
      const singleSource = !code.includes('multiple') && !code.includes('aggregate') && !code.includes('average');
      return { found: usesOracle && singleSource && code.includes('price') };
    },
    defense: (code) =>
      code.includes('Chainlink') ||
      code.includes('AggregatorV3') ||
      code.includes('staleness') ||
      code.includes('roundId'),
    fix: "Use Chainlink VRF, check staleness with roundId, and consider multi-oracle aggregation",
  },
  {
    type: 'unchecked-return',
    severity: 'high',
    title: 'Unchecked Return Value',
    description: 'Low-level call without return value check silently fails.',
    confidence: 0.91,
    check: (code, lines) => {
      const line = lines.findIndex(l =>
        /\.call[\s({[]/.test(l) && !/bool\s+success/.test(l) && !l.trim().startsWith('//')
      );
      return { found: line !== -1, line: line + 1 };
    },
    defense: (code) =>
      !code.includes('.call') ||
      (code.includes('.call') && code.includes('(bool success')),
    fix: '(bool success, ) = target.call{...}(...); require(success, "Call failed");',
  },
  {
    type: 'tx-origin',
    severity: 'high',
    title: 'tx.origin Authentication',
    description: 'Using tx.origin for auth allows phishing via intermediary contracts.',
    confidence: 0.97,
    check: (code, lines) => {
      const line = lines.findIndex(l =>
        /tx\.origin/.test(l) && /require|if|==/.test(l)
      );
      return { found: line !== -1, line: line + 1 };
    },
    defense: () => true, // If not found, it's defended
    fix: "Use msg.sender instead of tx.origin for authentication",
  },
  {
    type: 'selfdestruct',
    severity: 'high',
    title: 'Selfdestruct Vulnerability',
    description: 'selfdestruct can force-send ETH and destroy the contract permanently.',
    confidence: 0.95,
    check: (code, lines) => {
      const line = lines.findIndex(l => /selfdestruct/.test(l));
      return { found: line !== -1, line: line + 1 };
    },
    defense: (code) =>
      !code.includes('selfdestruct') ||
      (code.includes('selfdestruct') && code.includes('onlyOwner')),
    fix: "Remove selfdestruct or protect with strict access control and time-lock",
  },
  {
    type: 'access-control',
    severity: 'medium',
    title: 'Missing Access Control',
    description: 'Sensitive functions without access modifiers are callable by anyone.',
    confidence: 0.86,
    check: (code, lines) => {
      const sensitivePatterns = /function\s+(withdraw|transfer|mint|burn|pause|upgrade|set\w+)\s*\(/;
      const line = lines.findIndex(l => {
        if (!sensitivePatterns.test(l)) return false;
        const isPublicOrExternal = /\b(public|external)\b/.test(l);
        const hasModifier = /\b(onlyOwner|onlyRole|onlyAdmin|require\(msg\.sender)\b/.test(l);
        return isPublicOrExternal && !hasModifier;
      });
      // Also check if the function body has a require(msg.sender check within next 3 lines
      if (line !== -1) {
        const bodyLines = lines.slice(line + 1, line + 4).join(' ');
        if (/require\s*\(\s*msg\.sender/.test(bodyLines)) return { found: false };
      }
      return { found: line !== -1, line: line + 1 };
    },
    defense: (code) =>
      code.includes('Ownable') ||
      code.includes('AccessControl') ||
      code.includes('onlyOwner'),
    fix: "Use OpenZeppelin Ownable or AccessControl for role-based permissions",
  },
  {
    type: 'timestamp',
    severity: 'low',
    title: 'Block Timestamp Dependence',
    description: 'Miners can manipulate block.timestamp by ~15 seconds.',
    confidence: 0.72,
    check: (code, lines) => {
      const line = lines.findIndex(l =>
        /block\.timestamp/.test(l) && (/require|if|>|<|==/.test(l) || /random|seed/.test(l))
      );
      return { found: line !== -1, line: line + 1 };
    },
    defense: (code) =>
      !code.includes('block.timestamp') ||
      code.includes('Chainlink') ||
      code.includes('VRF'),
    fix: "Avoid block.timestamp for critical logic; use Chainlink VRF for randomness",
  },
  {
    type: 'dos',
    severity: 'medium',
    title: 'Denial of Service Risk',
    description: 'Unbounded loops over dynamic arrays can exceed block gas limit.',
    confidence: 0.83,
    check: (code, lines) => {
      // Loops over storage arrays
      const line = lines.findIndex(l =>
        /for\s*\(.*\.length/.test(l) || /while\s*\(.*\.length/.test(l)
      );
      return { found: line !== -1, line: line + 1 };
    },
    defense: (code) =>
      code.includes('maxIterations') ||
      code.includes('pagination') ||
      code.includes('batch'),
    fix: "Add pagination or batch processing; set maximum iteration limits",
  },
];

// ─── Core Analysis Functions ────────────────────────────────────────────────

/**
 * Parse all function signatures from Solidity code
 */
export function parseFunctions(code: string): SolidityFunction[] {
  const lines = code.split('\n');
  const functions: SolidityFunction[] = [];
  const funcRegex = /function\s+(\w+)\s*\(([^)]*)\)\s*(.*)/;

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(funcRegex);
    if (!match) continue;

    const name = match[1];
    const paramStr = match[2].trim();
    const modifierStr = match[3];

    // Parse visibility
    let visibility: SolidityFunction['visibility'] = 'public';
    if (modifierStr.includes('external')) visibility = 'external';
    else if (modifierStr.includes('internal')) visibility = 'internal';
    else if (modifierStr.includes('private')) visibility = 'private';

    // Parse mutability
    let mutability: SolidityFunction['mutability'] = 'nonpayable';
    if (modifierStr.includes('pure')) mutability = 'pure';
    else if (modifierStr.includes('view')) mutability = 'view';
    else if (modifierStr.includes('payable')) mutability = 'payable';

    // Parse custom modifiers
    const modifiers: string[] = [];
    const modRegex = /\b(onlyOwner|nonReentrant|whenNotPaused|whenPaused|onlyRole|onlyAdmin|initializer)\b/g;
    let modMatch;
    while ((modMatch = modRegex.exec(modifierStr)) !== null) {
      modifiers.push(modMatch[1]);
    }

    // Parse params
    const params = paramStr ? paramStr.split(',').map(p => p.trim()).filter(Boolean) : [];

    // Parse returns
    const returns: string[] = [];
    const retMatch = modifierStr.match(/returns\s*\(([^)]*)\)/);
    if (retMatch) {
      returns.push(...retMatch[1].split(',').map(r => r.trim()).filter(Boolean));
    }

    functions.push({
      name,
      visibility,
      mutability,
      modifiers,
      params,
      returns,
      lineIndex: i,
    });
  }

  return functions;
}

/**
 * Run all vulnerability checks against code
 */
export function detectVulnerabilities(code: string): Vulnerability[] {
  const lines = code.split('\n');
  const vulnerabilities: Vulnerability[] = [];

  for (const pattern of VULN_PATTERNS) {
    const result = pattern.check(code, lines);
    if (result.found && !pattern.defense(code)) {
      vulnerabilities.push({
        id: `vuln-${pattern.type}-${Date.now()}`,
        type: pattern.type,
        severity: pattern.severity,
        title: pattern.title,
        description: pattern.description,
        confidence: pattern.confidence,
        line: result.line,
        fix: pattern.fix,
        gasImpact: pattern.gasImpact,
      });
    }
  }

  return vulnerabilities;
}

/**
 * Test whether a specific vulnerability type is exploitable in given code.
 * Returns true if the attack would succeed (vulnerability present + no defense).
 */
export function testVulnerability(code: string, type: VulnerabilityType): boolean {
  const pattern = VULN_PATTERNS.find(p => p.type === type);
  if (!pattern) return false;

  const lines = code.split('\n');
  const result = pattern.check(code, lines);
  return result.found && !pattern.defense(code);
}

/**
 * Estimate gas costs for all detected operations in the code
 */
export function estimateGas(code: string): GasEstimate[] {
  const operations = extractOperations(code);
  return operations.map(op => estimateOperationGas(op, code));
}

/**
 * Extract Solidity operations from code using pattern matching
 */
export function extractOperations(code: string): string[] {
  const operations: string[] = [];
  const lines = code.split('\n');
  const seen = new Set<string>();

  const add = (op: string) => {
    if (!seen.has(op)) {
      seen.add(op);
      operations.push(op);
    }
  };

  // Count storage variables (state declarations)
  const stateVars = lines.filter(l =>
    /^\s*(uint|int|bool|address|bytes|string|mapping)\d*\s/.test(l) &&
    !l.includes('memory') && !l.includes('calldata')
  );
  if (stateVars.length > 0) add('Storage Write (SSTORE)');

  // Mappings
  if (/mapping\s*\(/.test(code)) add('Mapping Lookup (SLOAD)');

  // Array operations
  if (/\w+\[\w+\]/.test(code) && /push|pop|delete|\.length/.test(code)) {
    add('Dynamic Array');
  }

  // Loops
  if (/\bfor\s*\(/.test(code)) add('For Loop');
  if (/\bwhile\s*\(/.test(code)) add('While Loop');

  // External calls
  if (/\.call\{/.test(code)) add('Low-level Call');
  if (/\.transfer\(/.test(code)) add('Transfer');
  if (/\.send\(/.test(code)) add('Send');
  if (/\.\w+\(/.test(code) && /interface|import/.test(code)) add('External Contract Call');

  // Event emissions
  const eventCount = (code.match(/\bemit\s+\w+/g) || []).length;
  if (eventCount > 0) add('Event Emission');

  // Hashing
  if (/keccak256/.test(code)) add('Keccak256 Hash');
  if (/abi\.encode/.test(code)) add('ABI Encoding');

  // String operations
  if (/\bstring\b/.test(code) && /bytes\(/.test(code)) add('String Processing');

  // Math-heavy
  const mathOps = (code.match(/[+\-*/%]/g) || []).length;
  if (mathOps > 10) add('Heavy Arithmetic');
  else if (mathOps > 0) add('Arithmetic');

  // Contract creation
  if (/\bnew\s+\w+/.test(code)) add('Contract Creation (CREATE)');

  // Selfdestruct
  if (/selfdestruct/.test(code)) add('Selfdestruct');

  if (operations.length === 0) add('Contract Deployment');

  return operations;
}

/**
 * Estimate gas for a single operation with optimization recommendations
 */
function estimateOperationGas(operation: string, code: string): GasEstimate {
  const estimates: Record<string, { base: number; factor: number; recs: string[] }> = {
    'Storage Write (SSTORE)': {
      base: GAS_COSTS.SSTORE_NEW,
      factor: 0.75,
      recs: [
        'Pack multiple variables into single 256-bit slot',
        'Use uint96/uint128 instead of uint256 when possible',
        'Initialize non-zero values in constructor to avoid cold SSTORE',
      ],
    },
    'Mapping Lookup (SLOAD)': {
      base: GAS_COSTS.SLOAD,
      factor: 0.85,
      recs: [
        'Cache frequently read storage values in memory',
        'Use immutable for values set once in constructor',
      ],
    },
    'Dynamic Array': {
      base: GAS_COSTS.SSTORE_NEW + GAS_COSTS.SLOAD,
      factor: 0.70,
      recs: [
        'Use fixed-size arrays when length is known',
        'Prefer mappings over arrays for O(1) access',
        'Batch array operations to amortize overhead',
      ],
    },
    'For Loop': {
      base: 15_000,
      factor: 0.65,
      recs: [
        'Cache array.length outside the loop',
        'Use unchecked { ++i } for counter increment',
        'Consider off-chain computation with on-chain verification',
      ],
    },
    'While Loop': {
      base: 15_000,
      factor: 0.65,
      recs: [
        'Set maximum iteration limit to prevent DoS',
        'Use unchecked arithmetic for loop counter',
      ],
    },
    'Low-level Call': {
      base: GAS_COSTS.CALL_WITH_VALUE,
      factor: 0.90,
      recs: [
        'Batch multiple calls with multicall pattern',
        'Use staticcall for read-only operations',
      ],
    },
    'Transfer': {
      base: GAS_COSTS.CALL + 2_300,
      factor: 0.85,
      recs: [
        'Use .call{value:} instead of .transfer() for forward compatibility',
        'Implement pull-over-push for batch distributions',
      ],
    },
    'Send': {
      base: GAS_COSTS.CALL + 2_300,
      factor: 0.85,
      recs: [
        'Replace .send() with .call{value:} and check return value',
      ],
    },
    'External Contract Call': {
      base: GAS_COSTS.CALL + GAS_COSTS.EXTCODESIZE,
      factor: 0.85,
      recs: [
        'Cache external contract results when possible',
        'Use staticcall for view/pure functions',
      ],
    },
    'Event Emission': {
      base: GAS_COSTS.LOG0 + GAS_COSTS.LOG_PER_TOPIC * 2,
      factor: 0.92,
      recs: [
        'Use up to 3 indexed parameters for efficient filtering',
        'Emit events after state changes for correct ordering',
      ],
    },
    'Keccak256 Hash': {
      base: GAS_COSTS.KECCAK256_BASE + GAS_COSTS.KECCAK256_PER_WORD * 2,
      factor: 0.95,
      recs: [
        'Pre-compute constant hashes at compile time',
        'Minimize data length being hashed',
      ],
    },
    'ABI Encoding': {
      base: GAS_COSTS.MEMORY_PER_WORD * 10 + GAS_COSTS.COPY_PER_WORD * 5,
      factor: 0.88,
      recs: [
        'Use abi.encodePacked for non-ABI contexts (smaller output)',
        'Avoid encoding large dynamic types on-chain',
      ],
    },
    'String Processing': {
      base: 5_000,
      factor: 0.70,
      recs: [
        'Use bytes32 instead of string when length ≤ 32',
        'Move string operations off-chain when possible',
      ],
    },
    'Heavy Arithmetic': {
      base: GAS_COSTS.MUL * 20,
      factor: 0.80,
      recs: [
        'Use unchecked blocks for safe arithmetic (Solidity ^0.8)',
        'Pre-compute constants at compile time',
        'Use bit shifts for powers of 2',
      ],
    },
    'Arithmetic': {
      base: GAS_COSTS.MUL * 5,
      factor: 0.90,
      recs: [
        'Use unchecked block if overflow is impossible',
      ],
    },
    'Contract Creation (CREATE)': {
      base: GAS_COSTS.CREATE + 200 * (code.length),
      factor: 0.75,
      recs: [
        'Use minimal proxy (EIP-1167) clones to save deployment gas',
        'Enable Solidity optimizer with ≥200 runs',
      ],
    },
    'Selfdestruct': {
      base: GAS_COSTS.SELFDESTRUCT,
      factor: 1.0,
      recs: [
        'selfdestruct is deprecated (EIP-6049); use pausable pattern instead',
      ],
    },
    'Contract Deployment': {
      base: GAS_COSTS.BASE_TX + GAS_COSTS.CREATE + code.length * GAS_COSTS.CALLDATA_NONZERO,
      factor: 0.80,
      recs: [
        'Enable Solidity optimizer with runs=200',
        'Use EIP-1167 minimal proxies for factory patterns',
        'Remove unused code and dead branches',
      ],
    },
  };

  const config = estimates[operation] || { base: 10_000, factor: 0.85, recs: [] };
  const optimized = Math.floor(config.base * config.factor);
  const savings = config.base - optimized;

  return {
    operation,
    baseCost: config.base,
    optimizedCost: optimized,
    savings,
    savingsPercent: Math.round((savings / config.base) * 100),
    recommendations: config.recs,
  };
}

/**
 * Calculate overall security score (0–100)
 */
export function calculateSecurityScore(code: string): number {
  if (!code.trim()) return 0;

  let score = 100;
  const lines = code.split('\n');

  // Deductions for each vulnerability found
  const vulns = detectVulnerabilities(code);
  for (const vuln of vulns) {
    switch (vuln.severity) {
      case 'critical': score -= 25; break;
      case 'high': score -= 15; break;
      case 'medium': score -= 8; break;
      case 'low': score -= 3; break;
      case 'info': score -= 1; break;
    }
  }

  // Bonuses for good patterns
  if (code.includes('ReentrancyGuard') || code.includes('nonReentrant')) score += 5;
  if (code.includes('Ownable') || code.includes('AccessControl')) score += 5;
  if (code.includes('Pausable') || code.includes('whenNotPaused')) score += 3;
  if (code.includes('pragma solidity ^0.8') || code.includes('pragma solidity >=0.8')) score += 5;
  if ((code.match(/\bemit\s+/g) || []).length > 0) score += 2;
  if (lines.some(l => /\/\/\/ @notice|\/\*\*/.test(l))) score += 2; // NatSpec

  return Math.max(0, Math.min(100, score));
}

/**
 * Identify what type(s) of contract this is
 */
export function identifyContractType(code: string): ContractType[] {
  const types: ContractType[] = [];

  if (/\b(ERC20|IERC20|totalSupply|balanceOf|transfer|approve|allowance)\b/.test(code) &&
      /\bmapping\b/.test(code)) {
    types.push('ERC20');
  }
  if (/\b(ERC721|IERC721|tokenURI|ownerOf|safeTransferFrom)\b/.test(code)) {
    types.push('ERC721');
  }
  if (/\b(ERC1155|IERC1155|balanceOfBatch|safeBatchTransferFrom)\b/.test(code)) {
    types.push('ERC1155');
  }
  if (/\b(delegatecall|implementation|upgradeTo|Proxy|_fallback)\b/.test(code)) {
    types.push('Proxy');
  }
  if (/\b(Ownable|onlyOwner|transferOwnership)\b/.test(code)) {
    types.push('Ownable');
  }
  if (/\b(Pausable|whenNotPaused|_pause|_unpause)\b/.test(code)) {
    types.push('Pausable');
  }
  if (/\b(UUPSUpgradeable|TransparentUpgradeableProxy|initializer)\b/.test(code)) {
    types.push('Upgradeable');
  }
  if (/\b(multisig|threshold|confirmTransaction|owners)\b/i.test(code)) {
    types.push('MultiSig');
  }
  if (/\b(stake|unstake|reward|staking|delegat)\b/i.test(code)) {
    types.push('Staking');
  }
  if (/\b(swap|liquidity|addLiquidity|removeLiquidity|pair|router)\b/i.test(code)) {
    types.push('DEX');
  }
  if (/\b(borrow|lend|collateral|liquidat|repay|interest)\b/i.test(code)) {
    types.push('Lending');
  }
  if (/\b(propose|vote|quorum|execute|Governor)\b/i.test(code)) {
    types.push('Governor');
  }

  if (types.length === 0) types.push('Custom');
  return types;
}

/**
 * Get comprehensive contract metadata
 */
export function analyzeContract(code: string): ContractInfo {
  const lines = code.split('\n');
  const nonEmpty = lines.filter(l => l.trim().length > 0 && !l.trim().startsWith('//'));

  const contractMatch = code.match(/contract\s+(\w+)/);
  const pragmaMatch = code.match(/pragma\s+solidity\s+([^;]+)/);
  const imports = (code.match(/import\s+.*?[;'"]/g) || []).map(i => i.replace(/import\s+/, '').replace(/;$/, ''));

  const stateVarCount = lines.filter(l =>
    /^\s*(uint|int|bool|address|bytes|string|mapping)\d*\s/.test(l) &&
    !l.includes('memory') && !l.includes('calldata') &&
    !l.includes('function')
  ).length;

  const functionCount = (code.match(/\bfunction\s+\w+/g) || []).length;
  const eventCount = (code.match(/\bevent\s+\w+/g) || []).length;
  const modifierCount = (code.match(/\bmodifier\s+\w+/g) || []).length;

  // Cyclomatic complexity approximation
  const complexity =
    (code.match(/\bif\b/g) || []).length +
    (code.match(/\belse\b/g) || []).length +
    (code.match(/\bfor\b/g) || []).length +
    (code.match(/\bwhile\b/g) || []).length +
    (code.match(/\brequire\b/g) || []).length +
    (code.match(/\b\?\s*:/g) || []).length +
    1;

  return {
    type: identifyContractType(code),
    name: contractMatch?.[1] || null,
    pragmaVersion: pragmaMatch?.[1]?.trim() || null,
    imports,
    stateVarCount,
    functionCount,
    eventCount,
    modifierCount,
    complexity,
    linesOfCode: nonEmpty.length,
  };
}

/**
 * Estimate total deployment gas for the contract
 */
export function estimateDeploymentGas(code: string): number {
  let gas = GAS_COSTS.BASE_TX + GAS_COSTS.CREATE;

  // Bytecode approximation (~200 gas per character for deployment)
  gas += code.length * 200;

  // Functions add ABI encoding overhead
  const funcs = parseFunctions(code);
  gas += funcs.length * 5_000;

  // State variables require initialization
  const info = analyzeContract(code);
  gas += info.stateVarCount * GAS_COSTS.SSTORE_NEW;

  // Events add log overhead
  gas += info.eventCount * (GAS_COSTS.LOG0 + GAS_COSTS.LOG_PER_TOPIC);

  return gas;
}

/**
 * Validate Solidity code structure (basic syntax checks)
 */
export function validateSyntax(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!code.trim()) {
    return { valid: false, errors: ['Empty code'] };
  }

  if (!/pragma\s+solidity/.test(code)) {
    errors.push('Missing pragma solidity directive');
  }

  if (!/contract\s+\w+/.test(code) && !/interface\s+\w+/.test(code) && !/library\s+\w+/.test(code)) {
    errors.push('No contract, interface, or library declaration found');
  }

  // Check balanced braces
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push(`Unbalanced braces: ${openBraces} opening, ${closeBraces} closing`);
  }

  // Check balanced parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    errors.push(`Unbalanced parentheses: ${openParens} opening, ${closeParens} closing`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Check contract compatibility with a target chain
 */
export function checkChainCompatibility(code: string, chainId: number): {
  compatible: boolean;
  warnings: string[];
  features: string[];
} {
  const warnings: string[] = [];
  const features: string[] = [];

  const _info = analyzeContract(code);

  // EVM version checks
  const pragmaMatch = code.match(/pragma\s+solidity\s+\^?([\d.]+)/);
  const version = pragmaMatch?.[1] || '0.8.0';

  // L2 specific warnings
  const l2Chains = [42161, 10, 324, 8453, 204]; // Arbitrum, Optimism, zkSync, Base, opBNB
  if (l2Chains.includes(chainId)) {
    if (code.includes('block.difficulty') || code.includes('prevrandao')) {
      warnings.push('block.difficulty/prevrandao behaves differently on L2');
    }
    if (code.includes('block.number')) {
      warnings.push('block.number may represent L1 block number on some L2s');
    }
    features.push('Lower gas costs on L2');
  }

  // BSC specific
  if (chainId === 56 || chainId === 97) {
    features.push('3-second block time for fast confirmations');
    if (parseInt(version.split('.')[1]) < 8) {
      warnings.push('BSC validators require Solidity >=0.6.0');
    }
  }

  // Check for chain-specific opcodes
  if (code.includes('PUSH0') && chainId !== 1) {
    warnings.push('PUSH0 opcode (Solidity 0.8.20+) may not be supported on this chain');
  }

  // Contract size limit
  if (code.length > 24_576) {
    warnings.push('Contract may exceed 24KB size limit (EIP-170)');
  }

  return {
    compatible: warnings.length === 0,
    warnings,
    features,
  };
}

/**
 * Simulate scenario execution against code structure (deterministic)
 */
export function simulateScenario(
  code: string,
  scenario: 'normal' | 'high-traffic' | 'attack' | 'edge-cases'
): {
  success: boolean;
  gasUsed: number;
  outcome: string;
  details: string[];
} {
  const info = analyzeContract(code);
  const vulns = detectVulnerabilities(code);
  const score = calculateSecurityScore(code);
  const deployGas = estimateDeploymentGas(code);

  switch (scenario) {
    case 'normal': {
      const success = vulns.filter(v => v.severity === 'critical').length === 0;
      return {
        success,
        gasUsed: deployGas,
        outcome: success ? '✅ Normal execution succeeds' : '❌ Critical vulnerability blocks safe execution',
        details: [
          `Contract: ${info.name || 'Unknown'}`,
          `Functions: ${info.functionCount}`,
          `Security Score: ${score}/100`,
          ...(success ? [] : vulns.filter(v => v.severity === 'critical').map(v => `⚠️ ${v.title}`)),
        ],
      };
    }
    case 'high-traffic': {
      const hasDoS = vulns.some(v => v.type === 'dos');
      const gasMultiplier = info.complexity > 10 ? 1.5 : 1.2;
      return {
        success: !hasDoS && info.complexity < 20,
        gasUsed: Math.floor(deployGas * gasMultiplier),
        outcome: hasDoS
          ? '❌ Unbounded loops cause gas limit exhaustion under traffic'
          : info.complexity >= 20
          ? '❌ High complexity causes timeout under load'
          : '✅ Contract handles high traffic',
        details: [
          `Complexity: ${info.complexity}`,
          `Gas multiplier: ${gasMultiplier}x`,
          hasDoS ? '⚠️ DoS-vulnerable loops detected' : '✅ No DoS vectors',
        ],
      };
    }
    case 'attack': {
      const criticalVulns = vulns.filter(v => v.severity === 'critical' || v.severity === 'high');
      return {
        success: criticalVulns.length === 0,
        gasUsed: deployGas,
        outcome: criticalVulns.length === 0
          ? '✅ Contract withstands known attack vectors'
          : `❌ ${criticalVulns.length} exploitable vulnerabilities found`,
        details: criticalVulns.length === 0
          ? ['✅ Reentrancy: Protected', '✅ Overflow: Safe', '✅ Access Control: Present']
          : criticalVulns.map(v => `💀 ${v.title}: ${v.description}`),
      };
    }
    case 'edge-cases': {
      const missingChecks = !code.includes('require') && !code.includes('revert');
      const noEvents = (code.match(/\bemit\b/g) || []).length === 0 && info.functionCount > 0;
      const success = !missingChecks && score > 50;
      return {
        success,
        gasUsed: deployGas,
        outcome: success
          ? '✅ Edge cases handled correctly'
          : '❌ Missing input validation or error handling',
        details: [
          missingChecks ? '⚠️ No require/revert statements found' : '✅ Input validation present',
          noEvents ? '⚠️ No events emitted — hard to track off-chain' : '✅ Events present',
          `Security Score: ${score}/100`,
        ],
      };
    }
  }
}

/**
 * Validate a challenge solution against test criteria (deterministic)
 */
export function validateChallengeSolution(
  code: string,
  challengeId: string
): { passed: boolean; score: number; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;

  const info = analyzeContract(code);
  const vulns = detectVulnerabilities(code);
  const secScore = calculateSecurityScore(code);

  // Base points for having valid Solidity structure
  if (info.pragmaVersion) { score += 10; feedback.push('✅ Valid pragma directive'); }
  else feedback.push('❌ Missing pragma directive');

  if (info.name) { score += 10; feedback.push('✅ Contract declaration found'); }
  else feedback.push('❌ No contract declaration');

  if (info.functionCount > 0) { score += 10; feedback.push(`✅ ${info.functionCount} function(s) implemented`); }
  else feedback.push('❌ No functions implemented');

  // Challenge-specific checks
  switch (challengeId) {
    case 'defi-swap':
      if (code.includes('swap') || code.includes('exchange')) { score += 15; feedback.push('✅ Swap function found'); }
      else feedback.push('❌ Missing swap function');

      if (code.includes('slippage') || code.includes('minAmount') || code.includes('amountOutMin')) {
        score += 15; feedback.push('✅ Slippage protection implemented');
      } else feedback.push('❌ Missing slippage protection');

      if (code.includes('ReentrancyGuard') || code.includes('nonReentrant')) {
        score += 10; feedback.push('✅ Reentrancy protection');
      } else feedback.push('⚠️ Consider adding ReentrancyGuard');
      break;

    case 'nft-auction':
      if (code.includes('bid') || code.includes('placeBid')) { score += 15; feedback.push('✅ Bid function found'); }
      else feedback.push('❌ Missing bid function');

      if (code.includes('highestBid') || code.includes('highest')) {
        score += 10; feedback.push('✅ Highest bid tracking');
      } else feedback.push('❌ Missing bid tracking');

      if (code.includes('withdraw') || code.includes('refund')) {
        score += 10; feedback.push('✅ Withdrawal/refund pattern');
      } else feedback.push('❌ Missing refund mechanism');

      if (code.includes('block.timestamp') || code.includes('endTime')) {
        score += 10; feedback.push('✅ Time-based auction end');
      } else feedback.push('⚠️ Consider adding time limit');
      break;

    case 'multisig-wallet':
      if (code.includes('confirm') || code.includes('approve')) {
        score += 15; feedback.push('✅ Confirmation mechanism');
      } else feedback.push('❌ Missing confirmation logic');

      if (code.includes('threshold') || code.includes('required')) {
        score += 10; feedback.push('✅ Threshold requirement');
      } else feedback.push('❌ Missing threshold');

      if (code.includes('execute')) { score += 10; feedback.push('✅ Execute function'); }
      else feedback.push('❌ Missing execute function');

      if (code.includes('nonce') || code.includes('txId')) {
        score += 10; feedback.push('✅ Replay protection');
      } else feedback.push('⚠️ Consider replay attack protection');
      break;

    default:
      // Generic scoring
      score += Math.min(20, secScore / 5);
      feedback.push(`Security score: ${secScore}/100`);
  }

  // Bonus for no critical vulnerabilities
  const criticals = vulns.filter(v => v.severity === 'critical');
  if (criticals.length === 0) {
    score += 10;
    feedback.push('✅ No critical vulnerabilities');
  } else {
    feedback.push(`❌ ${criticals.length} critical vulnerabilities found`);
  }

  return {
    passed: score >= 50,
    score: Math.min(100, score),
    feedback,
  };
}
