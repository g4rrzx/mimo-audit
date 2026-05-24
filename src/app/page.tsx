import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Header */}
      <header className="border-b border-purple-500/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MA</span>
            </div>
            <span className="text-white font-semibold text-xl">MiMo Audit</span>
          </div>
          <Link 
            href="/scan"
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            Launch Scanner
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-purple-300 text-sm font-medium">Powered by Xiaomi MiMo AI</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Smart Contract
            <br />
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Security Scanner
            </span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            AI-powered vulnerability detection for Solidity smart contracts. 
            Get instant security reports with severity ratings, fix suggestions, and gas optimization tips.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Link 
              href="/scan"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-purple-500/50"
            >
              Start Scanning
            </Link>
            <a 
              href="#features"
              className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white rounded-lg font-semibold text-lg transition-colors border border-slate-700"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-4xl font-bold text-purple-400 mb-2">15+</div>
            <div className="text-slate-300">Vulnerability Types</div>
          </div>
          <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-4xl font-bold text-pink-400 mb-2">&lt;30s</div>
            <div className="text-slate-300">Average Scan Time</div>
          </div>
          <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 text-center backdrop-blur-sm">
            <div className="text-4xl font-bold text-purple-400 mb-2">100%</div>
            <div className="text-slate-300">Open Source</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Comprehensive Security Analysis
          </h2>
          <p className="text-slate-400 text-center mb-12 text-lg">
            Powered by Xiaomi MiMo's advanced AI models
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Vulnerability Detection</h3>
              <p className="text-slate-400">
                Identifies reentrancy, overflow, access control issues, and 12+ other critical vulnerabilities
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Severity Ratings</h3>
              <p className="text-slate-400">
                Critical, High, Medium, Low classifications with CVSS-style scoring for prioritization
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Fix Suggestions</h3>
              <p className="text-slate-400">
                Actionable code snippets and best practices to remediate each vulnerability
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Gas Optimization</h3>
              <p className="text-slate-400">
                Identifies inefficient patterns and suggests optimizations to reduce deployment and execution costs
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Analysis</h3>
              <p className="text-slate-400">
                Leverages Xiaomi MiMo's reasoning capabilities for context-aware security insights
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/50 border border-purple-500/20 rounded-xl p-6 backdrop-blur-sm hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Instant Results</h3>
              <p className="text-slate-400">
                Get comprehensive security reports in under 30 seconds with no signup required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-2xl p-12 text-center backdrop-blur-sm">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Secure Your Smart Contracts?
          </h2>
          <p className="text-slate-300 text-lg mb-8">
            Start scanning in seconds. No registration, no credit card required.
          </p>
          <Link 
            href="/scan"
            className="inline-block px-10 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold text-lg transition-all shadow-lg shadow-purple-500/50"
          >
            Launch Scanner Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-8">
        <div className="container mx-auto px-4 text-center text-slate-400">
          <p className="mb-2">Built with Xiaomi MiMo AI • Open Source • MIT License</p>
          <p className="text-sm">For educational and research purposes. Always conduct professional audits before mainnet deployment.</p>
        </div>
      </footer>
    </div>
  )
}
