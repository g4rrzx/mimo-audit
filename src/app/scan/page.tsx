'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Vulnerability {
  type: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low'
  line: number
  description: string
  fix: string
}

interface GasOptimization {
  line: number
  issue: string
  suggestion: string
  estimatedSavings: string
}

interface AnalysisResult {
  summary: {
    totalIssues: number
    critical: number
    high: number
    medium: number
    low: number
    gasOptimizations: number
  }
  vulnerabilities: Vulnerability[]
  gasOptimizations: GasOptimization[]
  overallRisk: 'Critical' | 'High' | 'Medium' | 'Low'
  recommendations: string[]
}

export default function ScanPage() {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState('')

  const handleScan = async () => {
    if (!code.trim()) {
      setError('Please paste your Solidity code')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      if (!response.ok) {
        throw new Error('Analysis failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError('Failed to analyze contract. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'text-red-400 bg-red-500/10 border-red-500/30'
      case 'High': return 'text-orange-400 bg-orange-500/10 border-orange-500/30'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'Low': return 'text-blue-400 bg-blue-500/10 border-blue-500/30'
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MA</span>
            </div>
            <span className="text-white font-semibold text-xl">MiMo Audit</span>
          </Link>
          <div className="text-purple-300 text-sm">
            Powered by Xiaomi MiMo AI
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">Smart Contract Scanner</h1>
          <p className="text-slate-400 mb-8">Paste your Solidity code below for AI-powered security analysis</p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-4">
              <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                <label className="block text-white font-semibold mb-3">Solidity Code</label>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="// SPDX-License-Identifier: MIT&#10;pragma solidity ^0.8.0;&#10;&#10;contract MyContract {&#10;    // Your code here&#10;}"
                  className="w-full h-96 bg-slate-950 border border-slate-700 rounded-lg p-4 text-slate-300 font-mono text-sm focus:outline-none focus:border-purple-500 resize-none"
                />
                
                {error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleScan}
                  disabled={loading}
                  className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-slate-700 disabled:to-slate-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-purple-500/50 disabled:shadow-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Scan Contract'
                  )}
                </button>
              </div>

              {/* Example Contracts */}
              <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                <h3 className="text-white font-semibold mb-3">Quick Examples</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setCode(EXAMPLE_VULNERABLE)}
                    className="w-full text-left px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm transition-colors"
                  >
                    Vulnerable Contract (Reentrancy)
                  </button>
                  <button
                    onClick={() => setCode(EXAMPLE_SAFE)}
                    className="w-full text-left px-4 py-2 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg text-slate-300 text-sm transition-colors"
                  >
                    Safe Contract (Best Practices)
                  </button>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-4">
              {!result && !loading && (
                <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-12 backdrop-blur-sm text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-400">Paste your Solidity code and click "Scan Contract" to begin analysis</p>
                </div>
              )}

              {result && (
                <>
                  {/* Summary Card */}
                  <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(result.overallRisk)}`}>
                        {result.overallRisk} Risk
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-slate-950/50 rounded-lg p-4">
                        <div className="text-3xl font-bold text-white mb-1">{result.summary.totalIssues}</div>
                        <div className="text-slate-400 text-sm">Total Issues</div>
                      </div>
                      <div className="bg-slate-950/50 rounded-lg p-4">
                        <div className="text-3xl font-bold text-purple-400 mb-1">{result.summary.gasOptimizations}</div>
                        <div className="text-slate-400 text-sm">Gas Optimizations</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-400">{result.summary.critical}</div>
                        <div className="text-slate-400 text-xs">Critical</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-400">{result.summary.high}</div>
                        <div className="text-slate-400 text-xs">High</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{result.summary.medium}</div>
                        <div className="text-slate-400 text-xs">Medium</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{result.summary.low}</div>
                        <div className="text-slate-400 text-xs">Low</div>
                      </div>
                    </div>
                  </div>

                  {/* Vulnerabilities */}
                  {result.vulnerabilities.length > 0 && (
                    <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-white mb-4">Vulnerabilities Found</h3>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {result.vulnerabilities.map((vuln, idx) => (
                          <div key={idx} className="bg-slate-950/50 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold border ${getSeverityColor(vuln.severity)}`}>
                                    {vuln.severity}
                                  </span>
                                  <span className="text-slate-500 text-xs">Line {vuln.line}</span>
                                </div>
                                <h4 className="text-white font-semibold">{vuln.type}</h4>
                              </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-3">{vuln.description}</p>
                            <div className="bg-slate-900 border border-slate-700 rounded p-3">
                              <div className="text-green-400 text-xs font-semibold mb-1">Recommended Fix:</div>
                              <p className="text-slate-300 text-xs font-mono">{vuln.fix}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gas Optimizations */}
                  {result.gasOptimizations.length > 0 && (
                    <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-white mb-4">Gas Optimizations</h3>
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {result.gasOptimizations.map((opt, idx) => (
                          <div key={idx} className="bg-slate-950/50 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-slate-500 text-xs">Line {opt.line}</span>
                              <span className="text-green-400 text-xs font-semibold">{opt.estimatedSavings}</span>
                            </div>
                            <p className="text-slate-400 text-sm mb-2">{opt.issue}</p>
                            <p className="text-slate-300 text-xs">{opt.suggestion}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendations */}
                  {result.recommendations.length > 0 && (
                    <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm">
                      <h3 className="text-xl font-bold text-white mb-4">Recommendations</h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                            <span className="text-purple-400 mt-1">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const EXAMPLE_VULNERABLE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableBank {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount);
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success);
        balances[msg.sender] -= amount;
    }
}`

const EXAMPLE_SAFE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract SafeBank is ReentrancyGuard {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    function withdraw(uint256 amount) public nonReentrant {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
    }
}`
