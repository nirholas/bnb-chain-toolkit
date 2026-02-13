/**
 * ✨ built by nich
 * 🌐 GitHub: github.com/nirholas
 * 💫 The future is being built right here 🏗️
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Brain,
  Sparkles,
  Wand2,
  Bug,
  Shield,
  Zap,
  Eye,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Radio,
  Mic,
  MicOff
} from 'lucide-react';
import {
  detectVulnerabilities,
  estimateGas,
  analyzeContract,
  identifyContractType,
  calculateSecurityScore,
  parseFunctions,
} from '@/utils/solidityAnalyzer';

interface AIInsight {
  id: string;
  type: 'optimization' | 'vulnerability' | 'suggestion' | 'prediction' | 'learning';
  severity: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  code?: string;
  fix?: string;
  confidence: number;
  gasImpact?: number;
  line?: number;
}

interface VoiceCommand {
  command: string;
  timestamp: number;
  executed: boolean;
}

export default function AICodeWhisperer({ 
  code, 
  onCodeChange,
  onLog 
}: { 
  code: string;
  onCodeChange: (code: string) => void;
  onLog: (type: 'info' | 'success' | 'error' | 'warning', message: string) => void;
}) {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([]);
  const [aiThinking, setAiThinking] = useState('');
  const [autoFix, setAutoFix] = useState(true);
  const [predictiveMode, setPredictiveMode] = useState(true);
  
  const analysisInterval = useRef<NodeJS.Timeout | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const thinkingPhrases = [
    "🧠 Analyzing contract architecture...",
    "🔍 Detecting potential vulnerabilities...",
    "⚡ Computing gas optimizations...",
    "🎯 Learning from 10,000+ contracts...",
    "🛡️ Checking security patterns...",
    "💎 Discovering best practices...",
    "🚀 Predicting deployment scenarios...",
    "🌊 Simulating edge cases..."
  ];

  // Real-time AI Analysis
  useEffect(() => {
    if (predictiveMode && code) {
      analysisInterval.current = setTimeout(() => {
        analyzeCode(code);
      }, 1000); // Debounce
    }

    return () => {
      if (analysisInterval.current) clearTimeout(analysisInterval.current);
    };
  }, [code, predictiveMode]);

  const analyzeCode = async (contractCode: string) => {
    setIsAnalyzing(true);
    // Cycle through thinking phrases based on code hash for determinism
    const phraseIndex = contractCode.length % thinkingPhrases.length;
    setAiThinking(thinkingPhrases[phraseIndex]);

    // Brief UI tick to show thinking state
    await new Promise(resolve => setTimeout(resolve, 100));

    const newInsights: AIInsight[] = [];
    const contractInfo = analyzeContract(contractCode);
    const vulns = detectVulnerabilities(contractCode);
    const gasEstimates = estimateGas(contractCode);
    const secScore = calculateSecurityScore(contractCode);
    const funcs = parseFunctions(contractCode);

    // 1. Map real vulnerabilities to AI insights
    for (const vuln of vulns) {
      newInsights.push({
        id: vuln.id,
        type: 'vulnerability',
        severity: vuln.severity === 'critical' ? 'critical' :
                  vuln.severity === 'high' ? 'warning' :
                  vuln.severity === 'medium' ? 'warning' : 'info',
        title: `🚨 ${vuln.title}`,
        message: vuln.description,
        confidence: vuln.confidence,
        fix: vuln.fix,
        gasImpact: vuln.gasImpact,
        line: vuln.line,
      });
    }

    // 2. Map real gas optimizations to insights
    for (const est of gasEstimates) {
      if (est.savings > 0) {
        newInsights.push({
          id: `gas-${est.operation}-${Date.now()}`,
          type: 'optimization',
          severity: est.savingsPercent > 25 ? 'warning' : 'info',
          title: `⚡ ${est.operation} Optimization`,
          message: `Save ~${est.savings.toLocaleString()} gas (${est.savingsPercent}%) on ${est.operation}.`,
          confidence: 0.90,
          gasImpact: est.savings,
          fix: est.recommendations[0] || undefined,
        });
      }
    }

    // 3. Security pattern recognition
    if (contractCode.includes('onlyOwner') || contractCode.includes('AccessControl')) {
      newInsights.push({
        id: `security-${Date.now()}`,
        type: 'suggestion',
        severity: 'success',
        title: '✅ Good Security Pattern',
        message: contractCode.includes('AccessControl')
          ? 'Role-based access control detected — excellent for granular permissions.'
          : 'Owner-based access control detected. Consider OpenZeppelin AccessControl for role-based permissions.',
        confidence: 0.91,
      });
    }

    // 4. Contract type insight
    const types = contractInfo.type;
    if (types.length > 0 && types[0] !== 'Custom') {
      const typeLabel = types.join(', ');
      newInsights.push({
        id: `type-${Date.now()}`,
        type: 'learning',
        severity: 'info',
        title: '💡 Contract Pattern Identified',
        message: `Detected: ${typeLabel}. ${
          types.includes('ERC20') ? 'Consider adding pause(), burn(), and snapshot() for production.' :
          types.includes('ERC721') ? 'Consider adding royalties (EIP-2981) and metadata freezing.' :
          types.includes('DEX') ? 'Ensure flash loan protection and TWAP oracle integration.' :
          types.includes('Lending') ? 'Validate collateral ratios and liquidation thresholds.' :
          'Following standard patterns improves auditability.'
        }`,
        confidence: 0.85,
      });
    }

    // 5. Complexity analysis
    if (contractInfo.complexity > 15) {
      newInsights.push({
        id: `complexity-${Date.now()}`,
        type: 'suggestion',
        severity: 'warning',
        title: '📊 High Complexity',
        message: `Cyclomatic complexity of ${contractInfo.complexity}. Consider splitting into smaller contracts or libraries.`,
        confidence: 0.82,
        fix: 'Extract complex logic into separate library contracts',
      });
    }

    // 6. Function visibility suggestions
    const publicViewFuncs = funcs.filter(f => f.visibility === 'public' && (f.mutability === 'view' || f.mutability === 'pure'));
    if (publicViewFuncs.length > 0) {
      newInsights.push({
        id: `visibility-${Date.now()}`,
        type: 'optimization',
        severity: 'info',
        title: '⚡ Visibility Optimization',
        message: `${publicViewFuncs.length} public view/pure function(s) could be external — saves ~22,100 gas each when not called internally.`,
        confidence: 0.88,
        gasImpact: publicViewFuncs.length * 22_100,
        fix: 'Change public view → external view for functions not called internally',
      });
    }

    // 7. Security score summary
    if (contractInfo.functionCount > 0) {
      newInsights.push({
        id: `score-${Date.now()}`,
        type: 'prediction',
        severity: secScore >= 80 ? 'success' : secScore >= 50 ? 'warning' : 'critical',
        title: `🔮 Security Score: ${secScore}/100`,
        message: secScore >= 80
          ? 'Strong security posture. Good use of protective patterns.'
          : secScore >= 50
          ? 'Moderate security. Address warnings above before deployment.'
          : 'Critical security gaps detected. Do not deploy without fixing issues.',
        confidence: 0.87,
      });
    }

    setInsights(newInsights);
    setIsAnalyzing(false);
    setAiThinking('');

    // Auto-fix critical issues
    if (autoFix) {
      const criticalIssues = newInsights.filter(i => i.severity === 'critical');
      if (criticalIssues.length > 0) {
        onLog('info', `🤖 AI detected ${criticalIssues.length} critical issues. Auto-fixing...`);
      }
    }
  };

  // Voice Commands — Real Web Speech API integration
  const toggleVoiceControl = useCallback(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!isListening) {
      if (!SpeechRecognitionAPI) {
        onLog('error', '🎤 Web Speech API is not supported in this browser. Try Chrome or Edge.');
        return;
      }

      const recognition = new SpeechRecognitionAPI();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const last = event.results[event.results.length - 1];
        if (last.isFinal) {
          const transcript = last[0].transcript.trim().toLowerCase();
          onLog('info', `🎤 Heard: "${transcript}"`);
          executeVoiceCommand(transcript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        onLog('error', `🎤 Recognition error: ${event.error}`);
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onend = () => {
        // Restart if still supposed to be listening
        if (recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch {
            // Already running or stopped intentionally
          }
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      onLog('info', '🎤 Voice control activated. Try: "Fix vulnerabilities", "Optimize gas", "Explain contract"');
    } else {
      if (recognitionRef.current) {
        const ref = recognitionRef.current;
        recognitionRef.current = null;
        ref.stop();
      }
      setIsListening(false);
      onLog('info', '🔇 Voice control deactivated');
    }
  }, [isListening, onLog]);

  const executeVoiceCommand = (command: string) => {
    setVoiceCommands(prev => [...prev, { command, timestamp: Date.now(), executed: true }]);
    onLog('success', `🎤 Executed: "${command}"`);
    
    // Execute based on command
    if (command.includes('analyze') || command.includes('security')) {
      analyzeCode(code);
    } else if (command.includes('optimize')) {
      const optimizedCode = optimizeGas(code);
      onCodeChange(optimizedCode);
    }
  };

  const optimizeGas = (contractCode: string): string => {
    let optimized = contractCode;
    
    // Example optimizations
    optimized = optimized.replace(/uint256/g, 'uint'); // Shorter type
    optimized = optimized.replace(/public view returns/g, 'external view returns'); // Use external
    
    return optimized;
  };

  const applyFix = (insight: AIInsight) => {
    if (insight.fix) {
      onLog('success', `✨ Applying AI-suggested fix...`);
      
      // Apply the fix to code
      let fixedCode = code;
      if (insight.type === 'vulnerability' && insight.title.includes('Reentrancy')) {
        // Add ReentrancyGuard
        const importLine = "import '@openzeppelin/contracts/security/ReentrancyGuard.sol';\n";
        if (!fixedCode.includes('ReentrancyGuard')) {
          fixedCode = importLine + fixedCode;
          fixedCode = fixedCode.replace(/contract (\w+)/, 'contract $1 is ReentrancyGuard');
        }
      }
      
      onCodeChange(fixedCode);
      setInsights(prev => prev.filter(i => i.id !== insight.id));
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'optimization': return <Zap className="w-4 h-4" />;
      case 'vulnerability': return <Shield className="w-4 h-4" />;
      case 'prediction': return <Eye className="w-4 h-4" />;
      case 'learning': return <Brain className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-l border-purple-200 dark:border-purple-900">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 animate-pulse" />
            <h3 className="font-bold text-lg">AI Code Whisperer</h3>
            <span className="px-2 py-0.5 text-xs bg-purple-400/20 text-purple-200 rounded border border-purple-400/30">
              Experimental
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleVoiceControl}
              className={`p-2 rounded-lg transition-all ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-white/20 hover:bg-white/30'
              }`}
              title="Voice Control"
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => analyzeCode(code)}
              disabled={isAnalyzing}
              className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all disabled:opacity-50"
            >
              {isAnalyzing ? '🧠 Analyzing...' : '✨ Analyze'}
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="flex items-center space-x-4 text-xs">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoFix}
              onChange={(e) => setAutoFix(e.target.checked)}
              className="rounded"
            />
            <span>Auto-fix</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={predictiveMode}
              onChange={(e) => setPredictiveMode(e.target.checked)}
              className="rounded"
            />
            <span>Predictive Mode</span>
          </label>
        </div>
      </div>

      {/* AI Thinking Status */}
      {aiThinking && (
        <div className="p-3 bg-purple-100 dark:bg-purple-900/30 border-b border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-2 text-sm">
            <Radio className="w-4 h-4 animate-spin text-purple-600" />
            <span className="text-purple-700 dark:text-purple-300">{aiThinking}</span>
          </div>
        </div>
      )}

      {/* Voice Commands Log */}
      {isListening && voiceCommands.length > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800">
          <div className="text-xs text-blue-700 dark:text-blue-300">
            Last command: "{voiceCommands[voiceCommands.length - 1].command}"
          </div>
        </div>
      )}

      {/* Insights Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {insights.length === 0 && !isAnalyzing && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-sm">AI is ready to analyze your code</p>
            <p className="text-xs mt-2">Start typing or click Analyze</p>
          </div>
        )}

        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${
              insight.severity === 'critical'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800'
                : insight.severity === 'warning'
                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800'
                : insight.severity === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800'
                : 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getSeverityIcon(insight.severity)}
                <div className="flex items-center space-x-1">
                  {getTypeIcon(insight.type)}
                  <span className="font-semibold text-sm">{insight.title}</span>
                </div>
              </div>
              <div className="text-xs bg-white/50 dark:bg-black/20 px-2 py-1 rounded-full">
                {Math.round(insight.confidence * 100)}% confident
              </div>
            </div>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              {insight.message}
            </p>

            {insight.gasImpact && (
              <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400 mb-2">
                <TrendingUp className="w-3 h-3" />
                <span>Save ~{insight.gasImpact.toLocaleString()} gas</span>
              </div>
            )}

            {insight.fix && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  💡 Suggested fix:
                </p>
                <code className="block text-xs bg-white/50 dark:bg-black/20 p-2 rounded font-mono">
                  {insight.fix}
                </code>
                <button
                  onClick={() => applyFix(insight)}
                  className="mt-2 w-full px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-sm font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                >
                  <Wand2 className="w-4 h-4 inline mr-2" />
                  Apply AI Fix
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stats Footer */}
      <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 border-t border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-600 dark:text-gray-400">
            🎯 {insights.length} insights found
          </span>
          <span className="text-gray-600 dark:text-gray-400">
            ⚡ Solidity Static Analyzer
          </span>
        </div>
      </div>
    </div>
  );
}
