import { NextRequest, NextResponse } from 'next/server'

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

// Pattern-based static analyzer (works without API key as fallback)
function staticAnalysis(code: string): AnalysisResult {
  const lines = code.split('\n')
  const vulnerabilities: Vulnerability[] = []
  const gasOptimizations: GasOptimization[] = []

  // Reentrancy detection
  let hasNonReentrant = code.includes('nonReentrant') || code.includes('ReentrancyGuard')
  let externalCallBeforeStateUpdate = false
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lineNum = i + 1

    // Reentrancy: external call before state update
    if (line.match(/\.call\{value:/) || line.match(/\.call\.value\(/) || line.match(/\.transfer\(/) || line.match(/\.send\(/)) {
      // Look ahead for state changes
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].match(/balances\[.*\]\s*[-+]?=/) || lines[j].match(/\w+\s*[-+]?=\s*\d/)) {
          if (!hasNonReentrant) {
            externalCallBeforeStateUpdate = true
            vulnerabilities.push({
              type: 'Reentrancy Vulnerability',
              severity: 'Critical',
              line: lineNum,
              description: 'External call detected before state update. This pattern is vulnerable to reentrancy attacks where the called contract can recursively call back into this function before the state is updated.',
              fix: 'Apply Checks-Effects-Interactions pattern: update state BEFORE external calls, or use OpenZeppelin\'s ReentrancyGuard with the nonReentrant modifier.'
            })
            break
          }
        }
      }
    }

    // tx.origin usage
    if (line.match(/tx\.origin/)) {
      vulnerabilities.push({
        type: 'tx.origin Authentication',
        severity: 'High',
        line: lineNum,
        description: 'Using tx.origin for authentication is dangerous. It can be exploited via phishing attacks where a user is tricked into calling a malicious contract.',
        fix: 'Replace tx.origin with msg.sender for authentication checks.'
      })
    }

    // Unchecked external call
    if (line.match(/\.call\(/) && !lines.slice(Math.max(0, i - 2), i + 3).some(l => l.includes('require') || l.includes('success'))) {
      vulnerabilities.push({
        type: 'Unchecked External Call',
        severity: 'High',
        line: lineNum,
        description: 'External call return value is not checked. Failed calls will not revert the transaction.',
        fix: 'Always check the return value: (bool success, ) = target.call(...); require(success, "Call failed");'
      })
    }

    // Missing access control
    if (line.match(/function\s+\w+.*public/) && !line.match(/view|pure|onlyOwner|onlyAdmin|require\(/)) {
      const funcBody = lines.slice(i, Math.min(i + 10, lines.length)).join(' ')
      if ((funcBody.includes('selfdestruct') || funcBody.includes('suicide')) && !funcBody.includes('require(')) {
        vulnerabilities.push({
          type: 'Missing Access Control',
          severity: 'Critical',
          line: lineNum,
          description: 'Critical function lacks access control. Anyone can call this function to destroy the contract.',
          fix: 'Add access control: use OpenZeppelin\'s Ownable contract with onlyOwner modifier, or implement role-based access control.'
        })
      }
    }

    // Integer overflow (pre-0.8.0)
    const pragmaMatch = code.match(/pragma\s+solidity\s+\^?(\d+\.\d+\.\d+)/)
    if (pragmaMatch) {
      const version = pragmaMatch[1].split('.').map(Number)
      if (version[0] === 0 && version[1] < 8) {
        if (line.match(/[+\-*]\s*=/) || line.match(/[+\-*]\s+\w+/)) {
          vulnerabilities.push({
            type: 'Potential Integer Overflow/Underflow',
            severity: 'High',
            line: lineNum,
            description: 'Solidity version below 0.8.0 does not have built-in overflow checks. Arithmetic operations may overflow or underflow.',
            fix: 'Upgrade to Solidity ^0.8.0 for automatic overflow checks, or use OpenZeppelin\'s SafeMath library.'
          })
          break
        }
      }
    }

    // Hardcoded addresses
    if (line.match(/0x[a-fA-F0-9]{40}/)) {
      vulnerabilities.push({
        type: 'Hardcoded Address',
        severity: 'Medium',
        line: lineNum,
        description: 'Hardcoded address detected. This makes the contract inflexible and could lead to issues if the address needs to change.',
        fix: 'Make the address configurable through a setter function with proper access control, or pass it via constructor.'
      })
    }

    // Block timestamp dependence
    if (line.match(/block\.timestamp|now/) && !line.match(/\/\//)) {
      vulnerabilities.push({
        type: 'Timestamp Dependence',
        severity: 'Low',
        line: lineNum,
        description: 'Using block.timestamp for critical logic. Miners can manipulate timestamps within ~15 seconds.',
        fix: 'For high-stakes logic, use block numbers or external oracles. For non-critical timing, this is acceptable.'
      })
    }

    // Weak randomness
    if (line.match(/keccak256.*block\.(timestamp|difficulty|number|coinbase)/) || line.match(/blockhash/)) {
      vulnerabilities.push({
        type: 'Weak Randomness',
        severity: 'High',
        line: lineNum,
        description: 'Using block variables for randomness is predictable and can be manipulated by miners.',
        fix: 'Use Chainlink VRF or commit-reveal schemes for secure randomness generation.'
      })
    }

    // Gas Optimizations
    if (line.match(/for\s*\(.*\.length/)) {
      gasOptimizations.push({
        line: lineNum,
        issue: 'Array length accessed in loop condition',
        suggestion: 'Cache array.length in a local variable before the loop to save gas on each iteration.',
        estimatedSavings: '~100 gas per iteration'
      })
    }

    if (line.match(/public\s+\w+\s*=/) && !line.match(/constant|immutable/)) {
      const varMatch = line.match(/(\w+)\s+public\s+(\w+)/)
      if (varMatch && (line.includes('constant') === false)) {
        // Skip for now to reduce noise
      }
    }

    if (line.match(/string\s+public/) || line.match(/string\s+memory/)) {
      gasOptimizations.push({
        line: lineNum,
        issue: 'String type used',
        suggestion: 'Consider using bytes32 for fixed-length strings to save significant gas.',
        estimatedSavings: '~20,000 gas on storage'
      })
    }

    if (line.match(/require\([^,]+\)\s*;/)) {
      gasOptimizations.push({
        line: lineNum,
        issue: 'Require without error message',
        suggestion: 'Add descriptive error messages to require statements for better debugging (or use custom errors in 0.8.4+ for gas savings).',
        estimatedSavings: 'Custom errors save ~50 gas vs string messages'
      })
    }
  }

  // Check for missing SPDX
  if (!code.includes('SPDX-License-Identifier')) {
    vulnerabilities.push({
      type: 'Missing SPDX License Identifier',
      severity: 'Low',
      line: 1,
      description: 'Contract is missing SPDX license identifier. This is a best practice and required by some compilers.',
      fix: 'Add // SPDX-License-Identifier: MIT (or appropriate license) at the top of the file.'
    })
  }

  // Check for missing pragma
  if (!code.includes('pragma solidity')) {
    vulnerabilities.push({
      type: 'Missing Pragma Directive',
      severity: 'Medium',
      line: 1,
      description: 'No pragma directive found. The compiler version is unspecified.',
      fix: 'Add pragma solidity ^0.8.0; (or appropriate version) at the top of the file.'
    })
  }

  // Calculate summary
  const critical = vulnerabilities.filter(v => v.severity === 'Critical').length
  const high = vulnerabilities.filter(v => v.severity === 'High').length
  const medium = vulnerabilities.filter(v => v.severity === 'Medium').length
  const low = vulnerabilities.filter(v => v.severity === 'Low').length

  let overallRisk: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low'
  if (critical > 0) overallRisk = 'Critical'
  else if (high > 0) overallRisk = 'High'
  else if (medium > 0) overallRisk = 'Medium'

  // Generate recommendations
  const recommendations: string[] = []
  if (critical > 0) {
    recommendations.push('Address all Critical vulnerabilities before any deployment. These can lead to total loss of funds.')
  }
  if (!hasNonReentrant && externalCallBeforeStateUpdate) {
    recommendations.push('Implement OpenZeppelin\'s ReentrancyGuard for all functions with external calls.')
  }
  if (vulnerabilities.length > 0) {
    recommendations.push('Conduct a professional audit before mainnet deployment, even after fixing all detected issues.')
  }
  if (gasOptimizations.length > 3) {
    recommendations.push('Consider implementing the suggested gas optimizations to reduce deployment and execution costs.')
  }
  recommendations.push('Add comprehensive unit tests with tools like Foundry or Hardhat covering edge cases.')
  recommendations.push('Use OpenZeppelin\'s battle-tested contracts as a foundation for common patterns (ERC20, Ownable, etc.).')

  return {
    summary: {
      totalIssues: vulnerabilities.length,
      critical,
      high,
      medium,
      low,
      gasOptimizations: gasOptimizations.length
    },
    vulnerabilities,
    gasOptimizations,
    overallRisk,
    recommendations
  }
}

// MiMo AI-powered analysis (when API key available)
async function aiAnalysis(code: string): Promise<AnalysisResult | null> {
  const apiKey = process.env.MIMO_API_KEY
  if (!apiKey) return null

  try {
    const response = await fetch('https://api-mimo.xiaomi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mimo-large',
        messages: [
          {
            role: 'system',
            content: 'You are an expert smart contract security auditor. Analyze the provided Solidity code and return a JSON response with vulnerabilities, gas optimizations, and recommendations. Use this exact format: {"vulnerabilities":[{"type":"","severity":"Critical|High|Medium|Low","line":1,"description":"","fix":""}],"gasOptimizations":[{"line":1,"issue":"","suggestion":"","estimatedSavings":""}],"recommendations":[""]}. Only return JSON, no markdown.'
          },
          {
            role: 'user',
            content: `Analyze this Solidity contract:\n\n${code}`
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    })

    if (!response.ok) return null
    
    const data = await response.json()
    const content = data.choices?.[0]?.message?.content
    if (!content) return null

    const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, '').trim())
    
    const critical = parsed.vulnerabilities.filter((v: Vulnerability) => v.severity === 'Critical').length
    const high = parsed.vulnerabilities.filter((v: Vulnerability) => v.severity === 'High').length
    const medium = parsed.vulnerabilities.filter((v: Vulnerability) => v.severity === 'Medium').length
    const low = parsed.vulnerabilities.filter((v: Vulnerability) => v.severity === 'Low').length

    let overallRisk: 'Critical' | 'High' | 'Medium' | 'Low' = 'Low'
    if (critical > 0) overallRisk = 'Critical'
    else if (high > 0) overallRisk = 'High'
    else if (medium > 0) overallRisk = 'Medium'

    return {
      summary: {
        totalIssues: parsed.vulnerabilities.length,
        critical,
        high,
        medium,
        low,
        gasOptimizations: parsed.gasOptimizations.length
      },
      vulnerabilities: parsed.vulnerabilities,
      gasOptimizations: parsed.gasOptimizations,
      overallRisk,
      recommendations: parsed.recommendations
    }
  } catch (error) {
    console.error('MiMo API error:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Invalid code input' }, { status: 400 })
    }

    if (code.length > 50000) {
      return NextResponse.json({ error: 'Code too long. Max 50,000 characters.' }, { status: 400 })
    }

    // Try AI analysis first, fallback to static analysis
    let result = await aiAnalysis(code)
    if (!result) {
      result = staticAnalysis(code)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
