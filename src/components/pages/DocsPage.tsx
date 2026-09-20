/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Terminal, 
  Cpu, 
  Play, 
  CheckCircle, 
  FileCode, 
  Info,
  ChevronRight,
  Clipboard,
  Bot
} from 'lucide-react';

interface DocsPageProps {
  onNavigate: (view: string) => void;
}

const DOCS_NAV = [
  { id: 'start', label: 'Getting Started', category: 'General' },
  { id: 'ast', label: 'Abstract Syntax Trees (AST)', category: 'General' },
  { id: 'sec', label: 'Vulnerability Mitigations', category: 'Security' },
  { id: 'api', label: 'REST API endpoints', category: 'API Reference' }
];

const DOC_CONTENT: Record<string, { title: string, content: string, code?: string }> = {
  start: {
    title: 'Integrating CodeSight AI Reviewer',
    content: 'Learn how to connect your public/private repositories into our scanning cluster. Start reviewing security, complexity, and language distributions automatically.',
    code: '# Install CodeSight CLI\nnpm install -g @codesight/cli\n\n# Securely authenticate session\ncodesight auth:login --token=ghp_827f...\n\n# Audit project files\ncodesight scan .'
  },
  ast: {
    title: 'AST Core Scanning Mechanics',
    content: 'We parse your target javascript, python, or go files into high-fidelity Abstract Syntax Trees (AST). The trees are traversed by AI models to evaluate variables, unparameterized database queries, and redundant loop patterns.',
    code: '{\n  "type": "Program",\n  "body": [\n    {\n      "type": "VariableDeclaration",\n      "declarations": [\n        { "id": "user", "init": "sql_input" }\n      ]\n    }\n  ]\n}'
  },
  sec: {
    title: 'Automated Vulnerability Patching',
    content: 'When critical CVE configurations or secret leaks are discovered during traversal, AI outputs formatted unified patch files. Mark suggestions as resolved to automatically trigger code replacement routines.',
    code: '<<<<<<< CURRENT_CODE\nstripe.Charge.create(amount, "usd")\n=======\nstripe.Charge.create(\n  amount=amount,\n  currency="usd",\n  timeout=5.0\n)\n>>>>>>> CODESIGHT_PROPOSAL'
  },
  api: {
    title: 'SaaS REST API Documentation',
    content: 'Invoke codesight scanning services directly within external CI/CD hooks. Configure continuous inspection triggers easily using REST endpoints.',
    code: 'curl -X POST https://api.codesight.ai/v1/scan \\\n  -H "Authorization: Bearer sk_live_..." \\\n  -d \'{"repo": "facebook/react", "branch": "master"}\''
  }
};

export default function DocsPage({ onNavigate }: DocsPageProps) {
  const [activeNode, setActiveNode] = useState('start');
  const [searchQuery, setSearchQuery] = useState('');
  
  // API Playground states
  const [apiMethod, setApiMethod] = useState('POST');
  const [apiEndpoint, setApiEndpoint] = useState('/v1/scan');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [callingApi, setCallingApi] = useState(false);

  const handleTriggerApi = () => {
    setCallingApi(true);
    setApiResponse(null);
    setTimeout(() => {
      setCallingApi(false);
      setApiResponse(JSON.stringify({
        status: "successful_scan",
        scan_id: "scan_82fa8cf29",
        findings: [
          { level: "Critical", component: "jwt_provider.go", issue: "Hardcoded secret cryptographic signature salt." }
        ],
        health_index: "94/100",
        duration: "1.24s"
      }, null, 2));
    }, 1000);
  };

  const filteredNav = DOCS_NAV.filter(nav => 
    nav.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const doc = DOC_CONTENT[activeNode] || DOC_CONTENT.start;

  return (
    <div className="flex-1 flex min-h-0 bg-bg-dark-950 text-slate-200">
      
      {/* Left Sidebar: Docs index */}
      <div className="w-64 border-r border-white/5 bg-black/20 flex flex-col justify-between hidden md:flex" data-physics="sidebar">
        <div className="p-4 space-y-4">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Search Guide</span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter index..."
                className="w-full bg-black/40 border border-white/10 rounded-lg px-2.5 py-1.5 pl-8 text-xs text-slate-200 focus:outline-none focus:border-brand-cyan/50"
              />
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-600" />
            </div>
          </div>

          <div className="space-y-4">
            {['General', 'Security', 'API Reference'].map(cat => {
              const nodes = filteredNav.filter(n => n.category === cat);
              if (nodes.length === 0) return null;
              return (
                <div key={cat} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block px-2.5">{cat}</span>
                  {nodes.map(node => {
                    const isActive = node.id === activeNode;
                    return (
                      <button
                        key={node.id}
                        onClick={() => setActiveNode(node.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                          isActive 
                            ? 'bg-brand-cyan/10 border border-brand-cyan/25 text-brand-cyan font-bold' 
                            : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                        }`}
                      >
                        <span className="truncate">{node.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-black/30">
          <button 
            onClick={() => onNavigate('editor')}
            className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Terminal className="w-4 h-4 text-brand-cyan" />
            <span>Open Playground IDE</span>
          </button>
        </div>
      </div>

      {/* Right Column: Documentation viewer & API Playground */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-4xl">
        
        {/* Title Node */}
        <div className="space-y-3 border-b border-white/5 pb-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[10px] font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Developer Center</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">{doc.title}</h1>
          <p className="text-xs text-slate-400 leading-relaxed font-sans">{doc.content}</p>
        </div>

        {/* Code Block Example */}
        {doc.code && (
          <div className="bg-bg-dark-900 border border-white/5 rounded-xl overflow-hidden shadow-2xl" data-physics="card">
            <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between font-mono text-[10px] text-slate-400">
              <span className="font-bold uppercase tracking-widest text-[9px] flex items-center gap-1">
                <FileCode className="w-3.5 h-3.5 text-brand-cyan" />
                Sample Implementation Snippet
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(doc.code || '')}
                className="p-1 px-2.5 rounded bg-black/50 hover:bg-black/80 border border-white/10 hover:text-white transition-all text-[10px] flex items-center gap-1 cursor-pointer"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Copy</span>
              </button>
            </div>
            <pre className="p-4 bg-black/20 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto text-left">
              {doc.code}
            </pre>
          </div>
        )}

        {/* API Playground Section */}
        {activeNode === 'api' && (
          <div className="bg-bg-dark-900 border border-white/5 rounded-xl p-5 space-y-4 shadow-2xl relative" data-physics="card">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />
            
            <div className="flex items-center gap-1.5 text-brand-cyan font-bold text-xs uppercase tracking-wider">
              <Terminal className="w-4 h-4" />
              <span>Interactive REST API Playground</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Test and configure live simulated REST audits to external CI pipelines. Click Trigger API Request to check the results.
            </p>

            <div className="flex flex-col md:flex-row items-center gap-3 bg-black/30 p-2 rounded-lg border border-white/5">
              <div className="flex gap-1.5 bg-black/40 p-1 rounded border border-white/5 font-mono text-[11px]">
                <span className="text-green-400 font-bold px-1.5">POST</span>
                <span className="text-slate-500 font-medium">https://api.codesight.ai</span>
              </div>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="flex-1 w-full bg-black/40 border border-white/5 rounded px-2.5 py-1.5 font-mono text-[11px] text-slate-300 focus:outline-none focus:border-brand-cyan/50"
              />
              <button
                onClick={handleTriggerApi}
                disabled={callingApi}
                className="w-full md:w-auto px-5 py-1.5 rounded bg-brand-cyan hover:bg-brand-cyan/85 text-slate-950 font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Call API</span>
              </button>
            </div>

            {callingApi && (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-2">
                <div className="w-6 h-6 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
                <span className="text-[10px] text-slate-500 font-mono">POST dispatch in execution...</span>
              </div>
            )}

            {apiResponse && (
              <div className="space-y-1 text-left animate-in fade-in zoom-in-95 duration-200">
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block font-mono">Response Payload (200 OK)</span>
                <pre className="p-3 bg-black/50 border border-white/5 rounded-lg font-mono text-[10.5px] text-green-400 overflow-x-auto leading-relaxed">
                  {apiResponse}
                </pre>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
