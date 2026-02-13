/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 Every bug fixed is a lesson learned 🎓
 */

import { useState } from 'react';
import { FullStackPlayground, PlaygroundFile } from '@/components/FullStackPlayground';
import { ArrowLeft, Rocket, Sparkles, Zap, FileCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '@/hooks/useSEO';
import TemplateSelector from '@/components/Sandbox/TemplateSelector';
import { SandboxTemplate } from '@/utils/sandboxTemplates';
import { ContractTemplate } from '@/utils/contractTemplates';

// Demo files for the full-stack playground
const demoFiles: PlaygroundFile[] = [
  {
    id: 'component',
    name: 'WalletButton',
    language: 'typescript',
    icon: 'react',
    code: `// Editable React Component - Try changing colors or text!
function WalletButton() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    
    // Simulate wallet connection
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a demo address (replace with window.ethereum.request in production)
    const fakeAddress = '0x' + Array.from({length: 40}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
    
    setAddress(fakeAddress);
    setConnected(true);
    setLoading(false);
  };

  const disconnect = () => {
    setConnected(false);
    setAddress('');
  };

  const shortenAddress = (addr) => {
    return addr.slice(0, 6) + '...' + addr.slice(-4);
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">
        🦊 Wallet Connect Demo
      </h2>
      
      {!connected ? (
        <button
          onClick={connectWallet}
          disabled={loading}
          className="w-full py-3 px-6 bg-[#F0B90B] hover:bg-[#d4a20a] text-black font-semibold rounded-xl shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {loading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">Connected!</span>
            </div>
            <div className="font-mono text-sm bg-white dark:bg-[#0a0a0a] p-2 rounded border">
              {shortenAddress(address)}
            </div>
          </div>
          
          <button
            onClick={disconnect}
            className="w-full py-2 px-4 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-medium rounded-lg transition-colors"
          >
            Disconnect
          </button>
        </div>
      )}
      
      <p className="mt-4 text-sm text-gray-500 text-center">
        ✏️ Try editing the code on the left!
      </p>
    </div>
  );
}

// Required for react-live
render(<WalletButton />);`
  },
  {
    id: 'contract',
    name: 'WalletRegistry',
    language: 'solidity',
    icon: 'contract',
    code: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title WalletRegistry
 * @dev Simple contract to register connected wallets
 */
contract WalletRegistry {
    // Mapping of registered addresses
    mapping(address => bool) public isRegistered;
    mapping(address => uint256) public registrationTime;
    
    // Array of all registered addresses
    address[] public registeredWallets;
    
    // Events
    event WalletRegistered(address indexed wallet, uint256 timestamp);
    event WalletUnregistered(address indexed wallet);
    
    /**
     * @dev Register the sender's wallet
     */
    function register() external {
        require(!isRegistered[msg.sender], "Already registered");
        
        isRegistered[msg.sender] = true;
        registrationTime[msg.sender] = block.timestamp;
        registeredWallets.push(msg.sender);
        
        emit WalletRegistered(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Unregister the sender's wallet
     */
    function unregister() external {
        require(isRegistered[msg.sender], "Not registered");
        
        isRegistered[msg.sender] = false;
        registrationTime[msg.sender] = 0;
        
        emit WalletUnregistered(msg.sender);
    }
    
    /**
     * @dev Get total registered wallets count
     */
    function getTotalRegistered() external view returns (uint256) {
        return registeredWallets.length;
    }
    
    /**
     * @dev Check if an address is registered
     */
    function checkRegistration(address wallet) external view returns (bool, uint256) {
        return (isRegistered[wallet], registrationTime[wallet]);
    }
}`
  },
  {
    id: 'styles',
    name: 'styles',
    language: 'css',
    icon: 'style',
    code: `/* Custom styles for the wallet component */
/* Try editing these values! */

.wallet-container {
  background: linear-gradient(135deg, #F0B90B 0%, #d4a20a 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(240, 185, 11, 0.3);
}

.wallet-button {
  background: white;
  color: #F0B90B;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.wallet-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.address-display {
  font-family: 'Monaco', 'Menlo', monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 12px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
}

/* Animation for loading state */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading {
  animation: pulse 1.5s infinite;
}`
  }
];

export default function FullStackDemoPage() {
  useSEO({
    title: 'Full-Stack Web3 Demo',
    description: 'Interactive full-stack Web3 demo with editable React components, smart contract integration, and live preview. Experience blockchain development hands-on.',
    path: '/fullstack'
  });

  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [files, setFiles] = useState<PlaygroundFile[]>(demoFiles);

  const handleLoadTemplate = (template: SandboxTemplate) => {
    // Convert workspace template files to PlaygroundFiles
    const newFiles: PlaygroundFile[] = template.files.map((file, index) => ({
      id: `file-${index}`,
      name: file.name.replace(/\.[^/.]+$/, ''), // Remove extension for display
      language: file.language as 'typescript' | 'javascript' | 'solidity' | 'css' | 'html' | 'json',
      icon: file.language === 'solidity' ? 'contract' as const : 
            file.language === 'css' ? 'style' as const : 'react' as const,
      code: file.content
    }));
    if (newFiles.length > 0) {
      setFiles(newFiles);
    }
    setShowTemplateSelector(false);
  };

  const handleLoadContractTemplate = (template: ContractTemplate) => {
    // Add contract as a new Solidity file to the playground
    const contractFile: PlaygroundFile = {
      id: `contract-${Date.now()}`,
      name: template.name.replace(/[^a-zA-Z0-9]/g, ''),
      language: 'solidity',
      icon: 'contract',
      code: template.code
    };
    
    // Replace existing Solidity file or add new one
    const hasSolidity = files.some(f => f.language === 'solidity');
    if (hasSolidity) {
      setFiles(files.map(f => f.language === 'solidity' ? contractFile : f));
    } else {
      setFiles([...files, contractFile]);
    }
    setShowTemplateSelector(false);
  };

  return (
    <>
      {showTemplateSelector && (
        <TemplateSelector
          onClose={() => setShowTemplateSelector(false)}
          onSelect={handleLoadTemplate}
          onContractSelect={handleLoadContractTemplate}
          showContractTemplates={true}
        />
      )}
      <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* Header */}
        <div className="bg-neutral-900 dark:bg-black text-white border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Link 
              to="/examples" 
              className="inline-flex items-center gap-2 text-gray-400 hover:text-[#F0B90B] mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Examples
            </Link>
            
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-[#F0B90B]/10 rounded-xl">
                <Rocket className="w-8 h-8 text-[#F0B90B]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Full-Stack Playground</h1>
                <p className="text-gray-400">Edit React + Solidity + CSS with live preview</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setShowTemplateSelector(true)}
                className="px-4 py-1.5 bg-[#F0B90B] text-black hover:bg-[#F0B90B]/90 rounded-full text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FileCode className="w-4 h-4" />
                Load Template (46 available)
              </button>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#F0B90B]" /> Live Preview
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-sm flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#F0B90B]" /> Multi-File Editor
            </span>
            <span className="px-3 py-1 bg-[#F0B90B]/20 text-[#F0B90B] rounded-full text-sm">React</span>
            <span className="px-3 py-1 bg-[#F0B90B]/10 text-[#F0B90B] rounded-full text-sm">Solidity</span>
            <span className="px-3 py-1 bg-[#F0B90B]/10 text-[#F0B90B] rounded-full text-sm">CSS</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="mb-8 p-4 bg-[#F0B90B]/5 dark:bg-[#F0B90B]/10 border border-[#F0B90B]/20 dark:border-[#F0B90B]/20 rounded-xl">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#F0B90B] mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                🎉 New! Full-Stack Code Editing
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                Edit the React component and see changes instantly! The Solidity contract shows the backend logic. 
                Switch between files using the tabs above the editor.
              </p>
            </div>
          </div>
        </div>

        {/* The Playground */}
        <FullStackPlayground
          title="Wallet Connect Example"
          description="A complete wallet connection flow with React frontend and Solidity smart contract. Edit any file to see live changes!"
          files={files}
        />

        {/* Next Steps */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
            <div className="text-2xl mb-2">1️⃣</div>
            <h4 className="font-semibold mb-1">Edit the React Code</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Try changing button colors, text, or add new features to the WalletButton component.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
            <div className="text-2xl mb-2">2️⃣</div>
            <h4 className="font-semibold mb-1">View the Contract</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Switch to the Solidity tab to see the smart contract that would power this on-chain.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-[#0a0a0a] rounded-xl shadow-sm border border-gray-200 dark:border-white/10">
            <div className="text-2xl mb-2">3️⃣</div>
            <h4 className="font-semibold mb-1">Customize Styles</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Edit the CSS file to change colors, animations, and styling of components.
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
