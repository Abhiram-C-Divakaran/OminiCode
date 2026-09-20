import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Users, 
  GitBranch, 
  Bell, 
  Code, 
  ShieldAlert, 
  Activity, 
  Hash, 
  Plus, 
  Search,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMsg {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  time: string;
  role: string;
}

interface ActivityEvent {
  id: string;
  developer: string;
  type: 'push' | 'pr' | 'alert' | 'build';
  desc: string;
  time: string;
}

const CHANNELS = [
  { id: 'general', name: 'general-sync' },
  { id: 'security', name: 'security-alerts' },
  { id: 'git-stream', name: 'git-pipelines' },
  { id: 'standups', name: 'daily-standups' }
];

const INITIAL_MESSAGES: Record<string, ChatMsg[]> = {
  'general': [
    { id: '1', sender: 'Sarah Connor', avatar: 'S', text: 'I am auditing the newly flagged open redirect routes. Code is pushed to branch sec/oauth-fix.', time: '09:12 AM', role: 'Security Auditor' },
    { id: '2', sender: 'Alex Mercer', avatar: 'A', text: 'Thanks Sarah. Marcus, can you queue up a manual AST analysis run once those patches land?', time: '09:14 AM', role: 'Lead Architect' },
    { id: '3', sender: 'Marcus Vance', avatar: 'M', text: '@Alex absolutely, queueing an automated scan now. Will keep you posted.', time: '09:15 AM', role: 'QA Auditor' }
  ],
  'security': [
    { id: '1', sender: 'AI Sentinel AI', avatar: '🐉', text: '🚨 CRITICAL VULNERABILITY ALERT: Potential SQL injection in jwt_provider handler.', time: '08:42 AM', role: 'Guardian System Daemon' },
    { id: '2', sender: 'Sarah Connor', avatar: 'S', text: 'Acknowledged. Applying parameter binding refactors right away.', time: '08:44 AM', role: 'Security Auditor' }
  ],
  'git-stream': [
    { id: '1', sender: 'DevOps Pipeline runner', avatar: '⚙️', text: '✅ Pipeline build CI-1094 completed successfully for commit "Merge pull request #45".', time: '10:04 AM', role: 'Guardian System Runner' }
  ],
  'standups': [
    { id: '1', sender: 'Alex Mercer', avatar: 'A', text: 'Standup update: Refactoring jwt provider logic today. No major blockers.', time: '09:00 AM', role: 'Lead Architect' }
  ]
};

const ACTIVITY_FEED: ActivityEvent[] = [
  { id: 'act-01', developer: 'Sarah Connor', type: 'push', desc: 'pushed 3 commits to sec/oauth-fix', time: '14m ago' },
  { id: 'act-02', developer: 'AI Core', type: 'alert', desc: 'flagged open redirect warning in src/auth/jwt_provider.go', time: '1h ago' },
  { id: 'act-03', developer: 'Alex Mercer', type: 'pr', desc: 'opened pull request #45: "Sanitize URL redirects"', time: '2h ago' },
  { id: 'act-04', developer: 'Elena Rostova', type: 'build', desc: 'deployed build CI-1091 to Staging Cluster', time: '1d ago' }
];

export default function TeamCollabPage() {
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [messages, setMessages] = useState<Record<string, ChatMsg[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [activities, setActivities] = useState<ActivityEvent[]>(ACTIVITY_FEED);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannel]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText) return;

    const freshMsg: ChatMsg = {
      id: String(Date.now()),
      sender: 'You',
      avatar: 'Y',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      role: 'Staff Engineer'
    };

    setMessages(prev => ({
      ...prev,
      [activeChannel]: [...(prev[activeChannel] || []), freshMsg]
    }));
    setInputText('');

    // Trigger dummy activity feedback sometimes
    if (activeChannel === 'general') {
      setTimeout(() => {
        const reply: ChatMsg = {
          id: String(Date.now() + 1),
          sender: 'Alex Mercer',
          avatar: 'A',
          text: 'Great update! Merging into standard integration staging files now.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          role: 'Lead Architect'
        };
        setMessages(prev => ({
          ...prev,
          general: [...prev.general, reply]
        }));
      }, 1000);
    }
  };

  const channelMessages = messages[activeChannel] || [];

  return (
    <div className="flex-grow flex min-h-0 bg-bg-dark-950 text-slate-200">
      
      {/* 3 Column Layout inside collaboration page */}
      <div className="flex-1 flex min-h-0 relative">
        
        {/* Left Column: Channels selector rail */}
        <aside className="w-60 border-r border-white/5 bg-bg-dark-900 flex flex-col justify-between flex-shrink-0">
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-brand-cyan" />
                Collaborators
              </span>
              <span className="text-[10px] font-mono text-slate-500 font-extrabold bg-white/5 px-2 py-0.2 rounded border border-white/5">4 Online</span>
            </div>

            {/* Channels List */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block mb-2 px-2">CHANNELS</span>
              {CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeChannel === ch.id
                      ? 'bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan shadow-sm shadow-brand-cyan/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
                  }`}
                >
                  <Hash className="w-4 h-4 text-slate-500" />
                  <span>{ch.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Members list */}
          <div className="p-4 border-t border-white/5 space-y-3">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-widest block px-2">TEAM DIRECTORY</span>
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {[
                { name: 'Alex Mercer', role: 'Architect', color: 'bg-brand-cyan' },
                { name: 'Sarah Connor', role: 'Security', color: 'bg-red-400' },
                { name: 'Marcus Vance', role: 'QA Lead', color: 'bg-brand-purple-light' },
                { name: 'Elena Rostova', role: 'DevOps', color: 'bg-amber-400' }
              ].map(member => (
                <div key={member.name} className="flex items-center gap-2 px-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-slate-950 font-mono ${member.color}`}>
                    {member.name[0]}
                  </div>
                  <div className="text-left min-w-0">
                    <span className="text-[11px] font-bold text-white block truncate leading-none">{member.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono block mt-0.5 leading-none">{member.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Column: Chat Stream */}
        <main className="flex-1 flex flex-col bg-black/10 min-w-0 border-r border-white/5">
          {/* Active channel head */}
          <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-bg-dark-900">
            <div className="flex items-center gap-2">
              <Hash className="w-5 h-5 text-slate-500" />
              <span className="font-extrabold text-sm text-white font-mono uppercase">
                {CHANNELS.find(c => c.id === activeChannel)?.name}
              </span>
            </div>
          </div>

          {/* Messages block */}
          <div className="flex-grow p-6 overflow-y-auto space-y-4">
            {channelMessages.map(msg => (
              <div key={msg.id} className="flex gap-3.5 max-w-2xl text-left select-text">
                <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold text-slate-400 font-mono text-sm flex-shrink-0">
                  {msg.avatar}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-xs text-white leading-none">{msg.sender}</span>
                    <span className="text-[9px] bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-slate-500 font-mono font-bold leading-none">{msg.role}</span>
                    <span className="text-[9px] text-slate-500 font-mono leading-none">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">{msg.text}</p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input field footer */}
          <form onSubmit={handleSendMessage} className="p-4 bg-bg-dark-900 border-t border-white/5 flex gap-3">
            <input 
              type="text"
              placeholder={`Write message to #${CHANNELS.find(c => c.id === activeChannel)?.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan placeholder-slate-600"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-brand-cyan hover:bg-brand-cyan/90 text-slate-950 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </main>

        {/* Right Column: Real-Time Team Activity Feed */}
        <aside className="w-72 border-l border-white/5 bg-bg-dark-900/40 flex flex-col p-4 flex-shrink-0 hidden xl:flex">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-white/5 pb-2 mb-3">Live Integration Feed</span>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {activities.map(act => (
              <div key={act.id} className="flex gap-2.5 text-xs text-left">
                <div className="w-6 h-6 rounded bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[9px] text-slate-400 flex-shrink-0">
                  {act.developer[0]}
                </div>
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-300 block">{act.developer}</span>
                  <span className="text-[11px] text-slate-400 block leading-relaxed">{act.desc}</span>
                  <span className="text-[9.5px] text-slate-500 block font-mono">{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

      </div>
    </div>
  );
}
