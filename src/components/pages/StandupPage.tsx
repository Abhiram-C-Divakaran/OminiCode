import React, { useState } from 'react';
import { 
  Users, 
  Sparkles, 
  FileText, 
  Check, 
  Copy, 
  Calendar, 
  Clock, 
  HelpCircle,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StandupLog {
  date: string;
  yesterday: string;
  today: string;
  blockers: string;
  aiOutput: string;
}

const HISTORIC_LOGS: StandupLog[] = [
  {
    date: '2026-07-17',
    yesterday: 'Finished the DracoScanner codebase file indexer and tested memory buffer flushes.',
    today: 'Will pair on URL routing parameters sanitization with Sarah.',
    blockers: 'Waiting for staging DB credential token deployment approval.',
    aiOutput: `🐉 **DAILY STANDUP UPDATES — 2026-07-17** 🐉
──────────────────────────────────────
👤 **Developer Session Update**

✅ **Yesterday:**
• Completed DracoScanner codebase file indexing protocols.
• Verified heap memory allocation metrics.

🚀 **Today's Focus:**
• Collaborate on JWT session validation fixes.
• Code-review active URL redirect sanitization vectors.

⚠️ **Blockers:**
• Pending DevOps approval for Staging DB credential token injection.`
  }
];

export default function StandupPage() {
  const [logs, setLogs] = useState<StandupLog[]>(HISTORIC_LOGS);
  
  // Form fields
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');
  const [blockers, setBlockers] = useState('');
  
  const [aiOutput, setAiOutput] = useState('');
  const [isSynthesising, setIsSynthesising] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleAISynthesise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!yesterday || !today) return;

    setIsSynthesising(true);
    setTimeout(() => {
      const formatted = `🐉 **DAILY STANDUP UPDATES — ${new Date().toISOString().split('T')[0]}** 🐉
──────────────────────────────────────
👤 **Developer Session Update**

✅ **Yesterday's Progress:**
• ${yesterday}

🚀 **Today's Agenda:**
• ${today}

⚠️ **Blockers & Impediments:**
• ${blockers || 'No critical blockers identified. Green pipelines overall.'}

💬 *Synthesized via WyrmSentry Standup Assistant.*`;

      setAiOutput(formatted);
      setIsSynthesising(false);

      // Save to logs
      const fresh: StandupLog = {
        date: new Date().toISOString().split('T')[0],
        yesterday,
        today,
        blockers,
        aiOutput: formatted
      };
      setLogs([fresh, ...logs]);
    }, 1200);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(aiOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg-dark-950 text-slate-200 p-6 space-y-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-cyan" />
            Daily Stand-Up Assistant
          </h1>
          <p className="text-xs text-slate-400">
            Formulate clean daily bullet updates and use AI to synthesize high-impact status digests for Slack/Teams.
          </p>
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form update */}
        <div className="lg:col-span-6 bg-bg-dark-900 border border-white/5 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-white/5 pb-3">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-white">Log Today's Standup</h2>
          </div>

          <form onSubmit={handleAISynthesise} className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                <CheckCircle className="w-3.5 h-3.5 text-green-400" />
                <span>What did you accomplish yesterday?</span>
              </div>
              <textarea 
                rows={3}
                required
                placeholder="e.g. Finished parsing the Git AST tree and resolved index limits."
                value={yesterday}
                onChange={(e) => setYesterday(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan placeholder-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                <TrendingUp className="w-3.5 h-3.5 text-brand-cyan" />
                <span>What are you focusing on today?</span>
              </div>
              <textarea 
                rows={3}
                required
                placeholder="e.g. Setting up the environment metrics, pairing with Alex on client telemetry."
                value={today}
                onChange={(e) => setToday(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan placeholder-slate-600"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-slate-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Any blockers or assistance required?</span>
              </div>
              <textarea 
                rows={2}
                placeholder="e.g. Waiting for AWS credentials to deploy production keys. (Leave empty if none)"
                value={blockers}
                onChange={(e) => setBlockers(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan placeholder-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSynthesising || !yesterday || !today}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                isSynthesising || !yesterday || !today
                  ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
                  : 'bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 shadow-lg shadow-brand-cyan/10'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isSynthesising ? 'animate-spin' : ''}`} />
              <span>{isSynthesising ? 'Synthesizing Status Bulletin...' : 'AI Synthesize Standup'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: AI Output */}
        <div className="lg:col-span-6 bg-bg-dark-900 border border-white/5 rounded-2xl p-6 flex flex-col justify-between space-y-6 min-h-[420px]">
          <div className="space-y-4 flex-grow">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-purple-light" />
                <span className="text-xs font-extrabold uppercase tracking-widest text-white">Synthesized Slack Bulletin</span>
              </div>

              {aiOutput && (
                <button
                  onClick={handleCopyToClipboard}
                  className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400 hover:text-white bg-white/5 px-2 py-1 rounded border border-white/10 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy to Slack'}</span>
                </button>
              )}
            </div>

            {aiOutput ? (
              <div className="bg-black/40 border border-white/5 rounded-xl p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
                {aiOutput}
              </div>
            ) : (
              <div className="flex-grow flex flex-col items-center justify-center text-center p-6 text-slate-500 font-mono text-xs h-64 border border-dashed border-white/5 rounded-xl">
                Fill out the status logs and click the synthesize button to generate a clean, executive daily digest.
              </div>
            )}
          </div>

          {/* History logs block */}
          <div className="space-y-2.5 border-t border-white/5 pt-4">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 block">Historic standup archive</span>
            <div className="space-y-1.5">
              {logs.map((log, index) => (
                <button
                  key={index}
                  onClick={() => setAiOutput(log.aiOutput)}
                  className="w-full text-left p-2.5 bg-black/20 hover:bg-black/35 border border-white/5 rounded-lg flex items-center justify-between text-xs transition-all cursor-pointer"
                >
                  <span className="font-mono text-slate-400">{log.date} Updates</span>
                  <span className="text-[10px] text-brand-cyan hover:underline font-bold uppercase tracking-wider">Load Update</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
