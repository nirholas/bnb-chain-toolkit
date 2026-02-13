/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Every bug fixed is a lesson learned 🎓
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  readonly VITE_INFURA_API_KEY?: string;
  readonly VITE_ALCHEMY_API_KEY?: string;
  readonly VITE_QUICKNODE_ENDPOINT?: string;
  readonly VITE_SOLANA_RPC_URL?: string;
  readonly VITE_OPENAI_API_KEY?: string;
  readonly VITE_ANTHROPIC_API_KEY?: string;
  readonly VITE_PLAUSIBLE_DOMAIN?: string;
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string;
  readonly VITE_ENABLE_AI_FEATURES?: string;
  readonly VITE_ENABLE_PREMIUM_FEATURES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Ethereum provider types
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
  selectedAddress?: string | null;
  chainId?: string;
}

interface Window {
  ethereum?: EthereumProvider;
  SpeechRecognition?: typeof SpeechRecognition;
  webkitSpeechRecognition?: typeof SpeechRecognition;
}

// Web Speech API types (not included in default DOM lib)
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare class SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
