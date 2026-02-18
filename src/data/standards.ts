/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Building something beautiful, one line at a time
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TimelineEvent {
  /** Quarter/date label e.g. "Q3 2024" */
  date: string;
  /** Milestone title */
  title: string;
  /** 2-3 sentence description */
  description: string;
  /** Event category */
  type: "milestone" | "technical" | "deployment" | "community";
  /** Whether this is a featured / highlighted event */
  highlight?: boolean;
  /** Optional code snippet to display */
  codeSnippet?: string;
  /** Optional link (label + url) */
  link?: { label: string; url: string };
}

export interface RegistryInfo {
  title: string;
  description: string;
  icon: string;
  capabilities: string[];
}

export interface ConformanceLevel {
  level: string;
  name: string;
  description: string;
  examples: string[];
  criteriaCount: number;
  target: string;
}

export interface AccessibleComponent {
  name: string;
  description: string;
  criteria: string[];
  principle: string;
}

export interface StandardOverview {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  anchorId: string;
  iconEmoji: string;
  stats: { label: string; value: string }[];
}

// ─── ERC-8004 Timeline ───────────────────────────────────────────────────────

export const erc8004Timeline: TimelineEvent[] = [
  {
    date: "Q1 2024",
    title: "The Problem: No On-Chain Agent Trust",
    description:
      "As AI agents proliferate across DeFi, the fundamental question emerges — how do you trust an autonomous agent operating on your behalf? Without verifiable on-chain identity, any agent could impersonate another, fabricate reputation, or act maliciously with no accountability trail.",
    type: "milestone",
    highlight: true,
  },
  {
    date: "Q2 2024",
    title: "ERC-8004 Draft Specification",
    description:
      "The initial ERC-8004 standard is drafted as an Ethereum Improvement Proposal — a protocol for trustless agent discovery, reputation, and validation. Designed to be chain-agnostic and deployed as per-chain singletons, the spec proposes three lightweight registries that compose with existing standards like ERC-721, EIP-712, and ERC-1271.",
    type: "technical",
  },
  {
    date: "Q3 2024",
    title: "Three-Registry Architecture",
    description:
      "The core architecture crystallizes into three complementary registries: Identity Registry (ERC-721-based agent handles), Reputation Registry (signed feedback signals with on-chain aggregation), and Validation Registry (hooks for stake-secured re-execution, zkML proofs, and TEE oracles). Each registry is independent yet composable.",
    type: "technical",
    highlight: true,
    codeSnippet: `// ERC-8004 Three Registries
interface IdentityRegistry {
  register(agentURI: string): uint256;     // Mint agent NFT
  setAgentWallet(agentId, wallet, sig);    // Verified wallet
  getMetadata(agentId, key): bytes;        // On-chain metadata
}

interface ReputationRegistry {
  giveFeedback(agentId, value, tags...);   // Submit rating
  getSummary(agentId, clients, tags);      // Aggregated score
  readAllFeedback(agentId, filters);       // Full history
}

interface ValidationRegistry {
  validationRequest(validator, agentId);   // Request check
  validationResponse(hash, response);      // Submit result
  getSummary(agentId, validators, tag);    // Aggregated stats
}`,
  },
  {
    date: "Q4 2024",
    title: "Solidity Reference Implementation",
    description:
      "Production-grade smart contracts are developed with Hardhat, including the Identity Registry (ERC-721 + URIStorage extension), Reputation Registry (on-chain feedback storage with Sybil-resistant aggregation), and Validation Registry (generic validator hooks). Full test suite covers core, local, and upgradeable scenarios.",
    type: "technical",
    codeSnippet: `// Agent Registration — creates an on-chain identity
function register(
  string agentURI,
  MetadataEntry[] calldata metadata
) external returns (uint256 agentId);

// Feedback — composable reputation signal
function giveFeedback(
  uint256 agentId,
  int128 value,
  uint8 valueDecimals,
  string calldata tag1,
  string calldata tag2,
  string calldata endpoint,
  string calldata feedbackURI,
  bytes32 feedbackHash
) external;`,
  },
  {
    date: "Q1 2025",
    title: "Mainnet Deployment",
    description:
      "ERC-8004 contracts are deployed to Ethereum mainnet with contract address 0x8004A169... — a vanity address reflecting the EIP number. The deployment uses an upgradeable proxy pattern for future governance, with presigned upgrade transactions for trustless administration.",
    type: "deployment",
    highlight: true,
    link: {
      label: "View on Etherscan",
      url: "https://etherscan.io/address/0x8004A169",
    },
  },
  {
    date: "Q2 2025",
    title: "Demo Agent & Verification Tools",
    description:
      "A reference demo agent is built showcasing end-to-end ERC-8004 integration — registering on-chain, exposing an MCP server, serving an A2A agent card, and accumulating verifiable reputation. The demo includes a registration script, tools for querying reputation, and full TypeScript implementation.",
    type: "community",
  },
  {
    date: "Q3 2025",
    title: "Integrated into BNB Chain AI Toolkit",
    description:
      "ERC-8004 becomes a foundational standard within the BNB Chain AI Toolkit, providing the trust layer for 78 AI agents. Every agent in the toolkit can be registered on-chain, building a decentralized web of verifiable agent identity and reputation across BNB Chain and beyond.",
    type: "milestone",
    highlight: true,
  },
];

// ─── W3AG Timeline ───────────────────────────────────────────────────────────

export const w3agTimeline: TimelineEvent[] = [
  {
    date: "Q2 2024",
    title: "Web3 Accessibility Gap Analysis",
    description:
      "A comprehensive audit reveals that existing WCAG 2.1 guidelines don't address Web3-specific interaction patterns — wallet connection flows, transaction signing, gas estimation, token approvals, and cross-chain switching. Over 1 billion people with disabilities are effectively excluded from DeFi.",
    type: "milestone",
    highlight: true,
  },
  {
    date: "Q3 2024",
    title: "W3AG 1.0 Draft Specification",
    description:
      "The Web3 Accessibility Guidelines 1.0 draft defines 50+ success criteria organized into four principles (Perceivable, Operable, Understandable, Robust) — directly modeled after WCAG but purpose-built for blockchain UX. Each criterion includes specific techniques and failure conditions for Web3 patterns.",
    type: "technical",
  },
  {
    date: "Q4 2024",
    title: "Three-Level Conformance Model",
    description:
      "A tiered conformance framework is established: Level A (Essential — removes severe barriers), Level AA (Enhanced — recommended baseline for production), and Level AAA (Optimal — best possible experience). The model maps 14 guidelines across 4 principles with clear success criteria at each level.",
    type: "technical",
    highlight: true,
    codeSnippet: `// W3AG Conformance Levels
Level A   — Essential:  "All DeFi apps MUST meet"
  → Gas estimation visible before signing
  → Addresses have accessible text alternatives
  → Wallet selection is keyboard-navigable

Level AA  — Enhanced:   "Production apps SHOULD meet"
  → Transaction status announced to screen readers
  → CLI alternatives for critical operations
  → Non-visual CAPTCHA alternatives

Level AAA — Optimal:    "Accessibility-focused apps"
  → Multi-modal transaction confirmation
  → Predictive gas estimation with audio cues
  → Full voice-control support for DeFi`,
  },
  {
    date: "Q1 2025",
    title: "Accessible React Components",
    description:
      "A library of production-ready, WCAG-compliant React components is built, including GasEstimator (accessible gas prediction with screen reader support), NetworkSwitcher (keyboard-navigable chain selection), TokenApprovalDialog (clear risk warnings with ARIA roles), and 7 more accessible Web3 primitives.",
    type: "technical",
    highlight: true,
  },
  {
    date: "Q2 2025",
    title: "Automated Compliance Checker",
    description:
      "W3AG validation tools are developed for automated conformance testing — scanning DeFi interfaces for accessibility violations specific to Web3 patterns. The checker evaluates keyboard navigation, ARIA semantics, transaction clarity, and time-sensitive operation handling.",
    type: "community",
  },
  {
    date: "Q3 2025",
    title: "Guidelines, Techniques & Tools Published",
    description:
      "The complete W3AG specification is published: 14 guidelines with detailed techniques, 10 accessible React components, testing checklists, and a React + wagmi integration guide. The standard covers Perceivable (address display, transaction clarity), Operable (wallet connect, signing), Understandable (error prevention, risk), and Robust (AT compatibility, alternative access).",
    type: "milestone",
    highlight: true,
  },
];

// ─── ERC-8004 Registry Details ───────────────────────────────────────────────

export const erc8004Registries: RegistryInfo[] = [
  {
    title: "Identity Registry",
    description:
      "ERC-721-based agent handles that give every AI agent a portable, censorship-resistant on-chain identity. Agents are immediately browsable and transferable with any NFT-compatible application. Supports MCP, A2A, ENS, DID, and wallet endpoints.",
    icon: "🪪",
    capabilities: [
      "ERC-721 token-based agent identity (agentId)",
      "Flexible agentURI pointing to registration file",
      "On-chain metadata with reserved agentWallet key",
      "EIP-712 / ERC-1271 wallet verification",
      "Multi-chain registration support",
    ],
  },
  {
    title: "Reputation Registry",
    description:
      "A standard interface for posting and fetching feedback signals. Scoring occurs both on-chain (for composability) and off-chain (for sophisticated algorithms), enabling an ecosystem of specialized agent scoring services, auditor networks, and insurance pools.",
    icon: "⭐",
    capabilities: [
      "Signed feedback with value decimals (0-18 precision)",
      "Tag-based filtering (tag1, tag2) for composability",
      "Sybil-resistant aggregation via client filtering",
      "Revocable feedback with append-only responses",
      "IPFS-backed off-chain evidence with hash integrity",
    ],
  },
  {
    title: "Validation Registry",
    description:
      "Generic hooks for requesting and recording independent validator checks — supporting stake-secured re-execution, zkML verifiers, TEE oracles, and trusted judges. Enables verifiable proof that an agent's output is correct.",
    icon: "✅",
    capabilities: [
      "Request/response validation workflow",
      "Supports stake-secured, zkML, TEE validation",
      "Progressive validation states (soft / hard finality)",
      "On-chain queryable validation summaries",
      "Composable with reputation signals",
    ],
  },
];

// ─── W3AG Conformance Levels ─────────────────────────────────────────────────

export const w3agConformanceLevels: ConformanceLevel[] = [
  {
    level: "A",
    name: "Essential",
    description:
      "Minimum accessibility — removes the most severe barriers. Every DeFi application must meet these criteria to be usable by people with disabilities.",
    examples: [
      "Gas estimation visible before transaction signing",
      "Blockchain addresses have accessible text alternatives",
      "Wallet selection modal is keyboard-navigable",
      "Transaction types are clearly labeled",
      "No auto-triggered transactions on page load",
      "Color is not the sole indicator for token values",
    ],
    criteriaCount: 22,
    target: "All Web3 applications",
  },
  {
    level: "AA",
    name: "Enhanced",
    description:
      "Recommended baseline for production — addresses significant barriers. This is the standard that all shipped DeFi products should target for a professional, inclusive experience.",
    examples: [
      "Transaction status changes announced to screen readers",
      "CLI alternatives provided for critical on-chain operations",
      "Non-visual CAPTCHA alternatives for faucets and claims",
      "Gas estimate descriptions include text alternatives",
      "Accessible table markup for portfolio dashboards",
      "Focus management in multi-step transaction flows",
    ],
    criteriaCount: 18,
    target: "Production DeFi applications",
  },
  {
    level: "AAA",
    name: "Optimal",
    description:
      "Enhanced accessibility — the best possible experience. Targeted at accessibility-focused projects that want to set the standard for inclusive Web3 design.",
    examples: [
      "Multi-modal transaction confirmation (visual + audio + haptic)",
      "Predictive gas estimation with audio/vibration cues",
      "Full voice-control support for all DeFi interactions",
      "Real-time sign language interpretation for key flows",
      "Adaptive UI complexity based on user preference",
      "Complete screen reader narration for chart data",
    ],
    criteriaCount: 12,
    target: "Accessibility-focused applications",
  },
];

// ─── W3AG Accessible Components ─────────────────────────────────────────────

export const w3agComponents: AccessibleComponent[] = [
  {
    name: "GasEstimator",
    description:
      "Accessible gas estimation widget with screen reader announcements, keyboard navigation, and clear visual/text alternatives for estimated costs. Announces gas price changes via ARIA live regions.",
    criteria: [
      "1.2.3 (AA): Gas estimates include text descriptions",
      "1.4.1 (A): Color not sole indicator for gas levels",
      "4.1.2 (A): Dynamic gas updates announced to AT",
    ],
    principle: "Perceivable",
  },
  {
    name: "NetworkSwitcher",
    description:
      "Keyboard-navigable network/chain selector with clear focus indicators, ARIA labels, and predictable behavior. Supports all input methods including switches and voice control.",
    criteria: [
      "2.1.1 (A): Fully keyboard-navigable selection",
      "2.1.2 (A): Focus trapped appropriately in dropdown",
      "3.2.1 (A): No unexpected context changes on selection",
    ],
    principle: "Operable",
  },
  {
    name: "TokenApprovalDialog",
    description:
      "WCAG-compliant approval dialog with clear risk warnings, descriptive error messages, and semantic HTML. Ensures users understand exactly what they're approving and the associated risks.",
    criteria: [
      "3.3.1 (A): Descriptive error messages on invalid input",
      "3.4.1 (A): Unverified contracts visually and textually flagged",
      "4.1.1 (A): Proper ARIA roles for dialog controls",
    ],
    principle: "Understandable",
  },
];

// ─── Hero Cards ──────────────────────────────────────────────────────────────

export const standardOverviews: StandardOverview[] = [
  {
    id: "erc-8004",
    title: "ERC-8004",
    subtitle: "Agent Trust Registry",
    description:
      "An Ethereum EIP for on-chain AI agent identity, reputation, and trust validation. Three registries enable verifiable discovery and trust without centralized authorities.",
    anchorId: "erc-8004-section",
    iconEmoji: "🛡️",
    stats: [
      { label: "Registries", value: "3" },
      { label: "Status", value: "EIP Draft" },
      { label: "Networks", value: "Mainnet" },
      { label: "ERC Deps", value: "721 · 712 · 1271" },
    ],
  },
  {
    id: "w3ag",
    title: "W3AG",
    subtitle: "Web3 Accessibility Guidelines",
    description:
      "The first open standard for making Web3 applications accessible to people with disabilities. 50+ success criteria across 3 conformance levels, modeled after WCAG for crypto-native UX.",
    anchorId: "w3ag-section",
    iconEmoji: "♿",
    stats: [
      { label: "Criteria", value: "52+" },
      { label: "Guidelines", value: "14" },
      { label: "Components", value: "10" },
      { label: "Principles", value: "4" },
    ],
  },
];
