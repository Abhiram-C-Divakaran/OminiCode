/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Shield, 
  Zap, 
  Cpu, 
  Terminal, 
  GitPullRequest, 
  CheckCircle, 
  Play,
  Github,
  Award
} from 'lucide-react';
import DragonLogo from '../DragonLogo';
import DemoVideo from '../DemoVideo';

export default function LandingPage() {
  const navigate = useNavigate();
  const [demoCode, setDemoCode] = useState(`// Premium AI-Powered Analyzer
function processUserData(user) {
  const query = "SELECT * FROM users WHERE id = " + user.id;
  db.execute(query); // ⚠️ Critical security alert!
  
  if (user.age < 18) {
    return { status: "minor" }
  }
  return { status: "adult" }
}`);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const triggerDemoAnalysis = () => {
    setAnalyzing(true);
    setAiSuggestions([]);
    setTimeout(() => {
      setAnalyzing(false);
      setAiSuggestions([
        "🔴 SECURITY: SQL Injection vulnerability detected on line 3. Use parameterized queries or ORM to sanitize input.",
        "🟡 STYLE: Missing semicolons or explicit typing on parameter 'user'.",
        "🟢 QUALITY: Logical flow is optimal; consider adding early return guards."
      ]);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#080911] text-slate-300 font-sans selection:bg-brand-purple/30">
      {/* Navigation */}
      <nav className="border-b border-white/5 bg-[#080911]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <DragonLogo size={22} glow={true} />
            <span className="font-bold text-white tracking-tight text-base">WyrmSentry</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#041d2f] text-[#00a8ff] border border-[#00a8ff]/20 ml-1">AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">System Demo</a>
            <a href="#playground" className="hover:text-white transition-colors">Interactive Playground</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button onClick={() => navigate('/docs')} className="hover:text-white transition-colors bg-transparent border-none p-0">Docs</button>
            <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors bg-transparent border-none p-0">Dashboard</button>
          </div>

          <div className="flex items-center">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-4 py-1.5 bg-white text-black text-[13px] font-bold rounded-md shadow-sm hover:bg-slate-100 transition-all cursor-pointer"
            >Launch App</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 overflow-hidden relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00d2ff]/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18112e] border border-brand-purple/20 text-[10px] font-bold text-[#a78bfa] uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" />
            <span>Introducing WyrmSentry v2.0 Dragon-Eye AI Engine</span>
          </div>
          
          <h1 className="text-5xl md:text-[56px] font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
            Dragon-Eye Code Review, <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00d2ff] via-[#3a7bd5] to-[#8a2be2]">Unmatched Code Protection.</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Enlist WyrmSentry to patrol your codebases. Upload scripts, analyze complex repositories, receive intelligent security patches, and incinerate security bugs instantly.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-5 py-2.5 bg-[#6d28d9] text-white font-bold rounded-md shadow-[0_0_15px_rgba(109,40,217,0.3)] hover:bg-[#5b21b6] transition-all flex items-center gap-2 text-[13px] cursor-pointer"
            >Launch App <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-5 py-2.5 bg-[#1e2029] border border-white/5 text-white font-bold rounded-md hover:bg-white/5 transition-all flex items-center gap-2 text-[13px] cursor-pointer"
            >
              <Play className="w-4 h-4" /> Watch Demo Video
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Playground */}
      <section id="playground" className="py-24 relative max-w-4xl mx-auto px-6">
          <div className="relative">
            <div className="bg-[#0f111a] border border-white/10 rounded-2xl overflow-hidden relative shadow-2xl">
              <div className="flex items-center justify-between px-4 py-3 bg-[#11131c] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-4 px-2 py-1 bg-[#0b0c11] border border-white/5 rounded text-xs font-mono text-slate-400">
                    <span className="text-[#00d2ff] mr-1">{'>_'}</span>
                    wyrmsentry_preview_sandbox.js
                  </span>
                </div>
                <button 
                  onClick={triggerDemoAnalysis}
                  disabled={analyzing}
                  className="px-4 py-1.5 bg-[#251b43] border border-[#6d28d9]/30 text-[#a78bfa] hover:bg-[#32235c] rounded font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {analyzing ? (
                    <><Cpu className="w-3.5 h-3.5 animate-pulse" /> Analyzing...</>
                  ) : (
                    <><Cpu className="w-3.5 h-3.5" /> Analyze Snippet</>
                  )}
                </button>
              </div>
              
              <div className="grid md:grid-cols-2 bg-[#0b0c11]">
                <div className="p-4 border-r border-white/5">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Editable Demo Playground</div>
                  <textarea 
                    value={demoCode}
                    onChange={(e) => setDemoCode(e.target.value)}
                    className="w-full h-48 bg-transparent text-sm font-mono text-slate-300 focus:outline-none resize-none leading-relaxed"
                    spellCheck={false}
                  />
                </div>
                <div className="p-4 bg-[#0d0e15]">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">AI Suggestions Report</div>
                  
                  {aiSuggestions.length > 0 ? (
                    <div className="space-y-3">
                      {aiSuggestions.map((sug, i) => (
                        <div key={i} className="text-sm font-mono text-slate-300 p-2 bg-white/5 rounded border border-white/5">{sug}</div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-sm">
                      <Sparkles className="w-6 h-6 mb-2 opacity-50" />
                      Click "Analyze Snippet" to test our AI review model.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
      </section>

      {/* Video Demo Section */}
      <section id="demo" className="py-20 relative z-10 bg-[#080911]">
        <div className="max-w-5xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            <span className="text-red-500 mr-2">●</span>Guardian System Walkthrough
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Watch how WyrmSentry defends repositories, highlights vulnerabilities, compiles secure AST patches, and optimizes workflow metrics in real-time.
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <DemoVideo />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-[#0b0c11] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Engineered for High-Performance Teams</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Everything you need to audit, secure, and compile elegant code in seconds, packaged in an absolute premium user interface.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-[#12141c] border border-white/5 rounded-xl p-8 relative overflow-hidden group hover:border-white/10 transition-colors shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Vulnerability Guard</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Scan repositories for common CVEs, memory leaks, dependency risks, and secret leaks with full OWASP security compliance reporting.
              </p>
            </div>
            
            <div className="bg-[#12141c] border border-white/5 rounded-xl p-8 relative overflow-hidden group hover:border-white/10 transition-colors shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-[#00d2ff]/10 border border-[#00d2ff]/20 flex items-center justify-center mb-6">
                <Zap className="w-5 h-5 text-[#00d2ff]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Performance Auditing</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Detect computational complexity bottlenecks, memory allocations, and recommend fast micro-optimizations inside active editors.
              </p>
            </div>
            
            <div className="bg-[#12141c] border border-white/5 rounded-xl p-8 relative overflow-hidden group hover:border-white/10 transition-colors shadow-lg">
              <div className="w-12 h-12 rounded-lg bg-[#a78bfa]/10 border border-[#a78bfa]/20 flex items-center justify-center mb-6">
                <GitPullRequest className="w-5 h-5 text-[#a78bfa]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Pull Request Integration</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automatically review incoming pull requests with inline commentary, approve modifications, and output instant Merge Readiness Scores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#050608] py-16 px-6 text-slate-500 text-sm" data-physics="header">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4 col-span-1">
            <div className="flex items-center gap-2">
              <DragonLogo size={24} glow={false} />
              <span className="font-extrabold text-white tracking-tight">WyrmSentry</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-sm">
              Next-generation code auditing, powered by intelligent dragon-eyed AI models, built for premium engineers.
            </p>
          </div>
          
          <div className="space-y-4">
            <span className="font-bold text-white block">Resources</span>
            <button onClick={() => navigate('/docs')} className="block text-slate-400 hover:text-white cursor-pointer bg-transparent border-none p-0">Documentation</button>
            <a href="#demo" className="block text-slate-400 hover:text-white">API Playground</a>
            <a href="#demo" className="block text-slate-400 hover:text-white">Live Demo</a>
          </div>
          
          <div className="space-y-4">
            <span className="font-bold text-white block">Company</span>
            <a href="#" className="block text-slate-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="block text-slate-400 hover:text-white">Terms of Use</a>
            <a href="#" className="block text-slate-400 hover:text-white">Press Kit</a>
          </div>
          
          <div className="space-y-4">
            <span className="font-bold text-white block">Integrations</span>
            <span className="text-slate-400 flex items-center gap-2">
              <Github className="w-4 h-4" />
              <span>GitHub App</span>
            </span>
            <span className="text-slate-400 flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span>Vercel Deployments</span>
            </span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-600">
          <span>&copy; 2026 WyrmSentry AI, Inc. All rights reserved.</span>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-slate-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
