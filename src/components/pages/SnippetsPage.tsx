import React, { useState } from 'react';
import { 
  FileCode, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  Tag, 
  Share2, 
  Code,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
}

const INITIAL_SNIPPETS: Snippet[] = [
  {
    id: 'SNP-01',
    title: 'Parameterized Secure PostgreSQL Query',
    description: 'Avoid basic string concatenation variables which are prone to SQL injection exploits.',
    language: 'typescript',
    tags: ['Database', 'Security', 'SQL'],
    code: `import { Client } from 'pg';

export async function fetchUserSecure(userId: string) {
  const client = new Client();
  await client.connect();
  
  // Safe parameterized query payload
  const query = 'SELECT id, email, role FROM users WHERE id = $1';
  const values = [userId];
  
  const res = await client.query(query, values);
  await client.end();
  return res.rows[0];
}`
  },
  {
    id: 'SNP-02',
    title: 'Regex pattern validator for OAuth Redirect URLs',
    description: 'Ensures absolute URLs mapped for authentication callbacks adhere exclusively to sub-domains.',
    language: 'typescript',
    tags: ['Auth', 'Security', 'Regex'],
    code: `export function isValidRedirect(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Allow local development and specific production subdomains strictly
    const allowedPatterns = [
      /^localhost(:\\d+)?$/,
      /^([a-z0-9-]+\\.)?wyrmsentry\\.ai$/
    ];
    
    return allowedPatterns.some(regex => regex.test(parsed.hostname));
  } catch {
    return false;
  }
}`
  },
  {
    id: 'SNP-03',
    title: 'Go HTTP client middleware with adaptive backoff',
    description: 'Resilient API queries featuring structured context timeouts and exponential retries.',
    language: 'go',
    tags: ['Go', 'DevOps', 'API'],
    code: `package middleware

import (
	"context"
	"time"
	"net/http"
)

func WithAdaptiveBackoff(req *http.Request, maxRetries int) (*http.Response, error) {
	backoff := 500 * time.Millisecond
	for i := 0; i < maxRetries; i++ {
		resp, err := http.DefaultClient.Do(req)
		if err == nil && resp.StatusCode < 500 {
			return resp, nil
		}
		time.Sleep(backoff)
		backoff *= 2
	}
	return nil, context.DeadlineExceeded
}`
  }
];

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState<Snippet[]>(INITIAL_SNIPPETS);
  const [activeSnippet, setActiveSnippet] = useState<Snippet | null>(INITIAL_SNIPPETS[0]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New snippet state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newLang, setNewLang] = useState('typescript');
  const [newTags, setNewTags] = useState('Security, Helper');

  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newCode) return;

    const fresh: Snippet = {
      id: `SNP-0${snippets.length + 1}`,
      title: newTitle,
      description: newDesc,
      code: newCode,
      language: newLang,
      tags: newTags.split(',').map(s => s.trim()).filter(Boolean)
    };

    setSnippets([fresh, ...snippets]);
    setActiveSnippet(fresh);

    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewCode('');
    setNewTags('Security, Helper');
    setShowCreateModal(false);
  };

  const handleCopyCode = (snippet: Snippet) => {
    navigator.clipboard.writeText(snippet.code);
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const allTags = ['All', ...Array.from(new Set(snippets.flatMap(s => s.tags)))];

  const filteredSnippets = snippets.filter(s => {
    const matchesSearch = 
      s.title.toLowerCase().includes(search.toLowerCase()) || 
      s.description.toLowerCase().includes(search.toLowerCase()) || 
      s.code.toLowerCase().includes(search.toLowerCase());
    
    const matchesTag = activeTag === 'All' || s.tags.includes(activeTag);

    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg-dark-950 text-slate-200 p-6 space-y-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileCode className="w-5 h-5 text-brand-cyan" />
            Code Snippet Library
          </h1>
          <p className="text-xs text-slate-400">
            Save, tag, structure, and instantly grab secure boilerplate modules approved by AI audit guidelines.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 font-bold text-xs rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Snippet
        </button>
      </div>

      {/* Tag filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search snippet code, titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-cyan transition-all"
          />
        </div>

        {/* Horizontal tag scroll container */}
        <div className="md:col-span-3 flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-3 py-1 rounded-full text-[10.5px] font-bold transition-all cursor-pointer border ${
                activeTag === tag
                  ? 'bg-brand-cyan/15 border-brand-cyan/35 text-brand-cyan'
                  : 'bg-white/5 border-white/5 hover:border-white/10 text-slate-400'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Snippet Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List Column */}
        <div className="lg:col-span-4 bg-bg-dark-900 border border-white/5 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-white/5 pb-2">Snippet Catalog</span>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredSnippets.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono text-center py-8">No matching code snippets.</p>
            ) : (
              filteredSnippets.map(snip => {
                const isActive = activeSnippet?.id === snip.id;
                return (
                  <button
                    key={snip.id}
                    onClick={() => setActiveSnippet(snip)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer block relative group ${
                      isActive 
                        ? 'bg-brand-cyan/5 border-brand-cyan/25 shadow-[0_0_15px_rgba(0,212,255,0.05)]' 
                        : 'bg-black/20 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[9.5px] font-mono font-bold text-slate-500 uppercase">{snip.language}</span>
                      <span className="text-[9.5px] font-mono text-slate-600 font-bold">{snip.id}</span>
                    </div>
                    <span className={`font-bold text-xs block truncate mt-1 ${isActive ? 'text-white' : 'text-slate-300'}`}>{snip.title}</span>
                    <p className="text-[10.5px] text-slate-500 mt-1 line-clamp-1 leading-normal">{snip.description}</p>
                    
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {snip.tags.map(t => (
                        <span key={t} className="text-[8.5px] bg-slate-800 text-slate-400 border border-white/5 px-1 py-0.2 rounded font-mono font-semibold">{t}</span>
                      ))}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Code Display Panel */}
        <div className="lg:col-span-8 bg-bg-dark-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          {activeSnippet ? (
            <div className="flex flex-col">
              {/* Monospace Code window heading */}
              <div className="bg-bg-dark-950 border-b border-white/5 px-6 py-4 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-extrabold text-white tracking-tight">{activeSnippet.title}</h3>
                  <p className="text-xs text-slate-400">{activeSnippet.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyCode(activeSnippet)}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-[10.5px] font-bold"
                  >
                    {copiedId === activeSnippet.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === activeSnippet.id ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                </div>
              </div>

              {/* Code text block */}
              <div className="p-4 bg-black/50 font-mono text-xs overflow-x-auto relative min-h-[300px]">
                <pre className="text-slate-300 leading-relaxed leading-6 selection:bg-brand-purple/20">
                  <code>{activeSnippet.code}</code>
                </pre>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-center text-slate-500 font-mono text-xs">
              Select an item in the snippet registry to view secure boilerplates.
            </div>
          )}
        </div>
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative bg-bg-dark-900 border border-white/10 rounded-xl max-w-xl w-full p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Code className="w-4 h-4 text-brand-cyan" />
                  Register Custom Code Snippet
                </h3>
              </div>

              <form onSubmit={handleCreateSnippet} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Snippet Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Memory leak preventative buffer flush"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Short Description</label>
                  <input 
                    type="text"
                    placeholder="Briefly state why this snippet complies with system safety guidelines."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Boilerplate Code block</label>
                  <textarea 
                    rows={6}
                    required
                    placeholder="// write or paste code block here..."
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan placeholder-slate-600 font-mono leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Language</label>
                    <select
                      value={newLang}
                      onChange={(e) => setNewLang(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="typescript">TypeScript</option>
                      <option value="go">Golang</option>
                      <option value="python">Python</option>
                      <option value="sql">SQL Query</option>
                      <option value="yaml">DevOps YAML</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Tags (comma separated)</label>
                    <input 
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-xs font-bold rounded-lg transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-cyan text-slate-950 font-bold text-xs rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-brand-cyan/15"
                  >
                    Save Snippet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
