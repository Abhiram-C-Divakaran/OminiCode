const fs = require('fs');

const appContent = `import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Search, Bell, FolderGit2, Users, Lock, Calendar, ListTodo, AlertCircle, Terminal, UserPlus, BookOpen, Crown, MoreHorizontal, LayoutDashboard, Code2, ShieldCheck, Activity, ChevronDown, CheckCircle, CircleCheck } from 'lucide-react';
import { AuthProvider } from './context/AuthContext';
import { ReviewProvider } from './context/ReviewContext';
import LandingPage from './components/pages/LandingPage';
import BugChecker from './components/pages/BugChecker';
import RepoAnalysisPage from './components/pages/RepoAnalysisPage';
import TeamCollabPage from './components/pages/TeamCollabPage';
import SecurityCenterPage from './components/pages/SecurityCenterPage';
import StandupPage from './components/pages/StandupPage';
import TasksPage from './components/pages/TasksPage';
import IssuesPage from './components/pages/IssuesPage';
import DocsPage from './components/pages/DocsPage';
import UtilitiesPage from './components/pages/UtilitiesPage';
import SnippetsPage from './components/pages/SnippetsPage';
import DevOpsPage from './components/pages/DevOpsPage';

function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-screen bg-[#070d17] text-slate-300 font-sans overflow-hidden">
      {/* Top Header */}
      <header className="h-[68px] bg-[#070d17] border-b border-[#1d2939] flex items-center justify-between px-6 select-none shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div onClick={() => navigate('/')} className="flex items-center gap-3 cursor-pointer group">
            <div className="w-8 h-8 flex items-center justify-center text-[#00d4ff]">
              <Shield className="w-7 h-7 text-[#1d78ff]" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight">WyrmSentry</span>
          </div>
          
          <div className="h-5 w-px bg-[#1d2939] mx-2" />
          
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[#94a3b8]">WyrmSentry-Core</span>
            <span className="text-[#64748b]">/</span>
            <div className="flex items-center gap-1.5 text-[#00c98d] bg-[#00c98d]/10 px-2 py-1 rounded border border-[#00c98d]/20 font-mono text-xs cursor-pointer">
              main <ChevronDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-[470px] mx-8 relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-[#64748b]" />
          </div>
          <input 
            type="text" 
            placeholder="Search code, issues, or run commands..." 
            className="block w-full pl-10 pr-10 py-1.5 border border-[#1d2939] rounded-lg leading-6 bg-[#0b1320] text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#1d78ff] focus:ring-1 focus:ring-[#1d78ff] text-sm transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <span className="text-[10px] font-mono text-[#64748b] border border-[#1d2939] rounded px-1.5 py-0.5 bg-[#101827]">⌘K</span>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors">
            <UserPlus className="w-4 h-4" /> Invite
          </button>
          <button className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-white transition-colors">
            <BookOpen className="w-4 h-4" /> Docs
          </button>
          
          <div className="relative cursor-pointer hover:text-white text-[#94a3b8] transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1.5 bg-[#1d78ff] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#070d17] leading-none">3</span>
          </div>
          
          <div className="flex items-center gap-3 ml-2 cursor-pointer border-l border-[#1d2939] pl-5">
            <div className="w-8 h-8 rounded-full bg-indigo-500 overflow-hidden border border-white/10 flex-shrink-0">
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Aarav Mehta" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white leading-tight">Aarav Mehta</span>
              <span className="text-[11px] text-[#64748b] leading-tight mt-0.5">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex min-h-0 relative z-10">
        {/* Navigation Sidebar */}
        <nav className="w-[205px] bg-[#070d17] border-r border-[#1d2939] flex flex-col justify-between py-5 flex-shrink-0">
          <div className="flex flex-col gap-1 w-full px-3 overflow-y-auto scrollbar-none">
            
            <div className="text-[10px] font-bold text-[#64748b] mb-2 px-3 tracking-wider">MAIN</div>
            
            {[
              { id: 'dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
              { id: 'repo', path: '/repo', icon: <FolderGit2 className="w-4 h-4" />, label: 'Repositories' },
              { id: 'review', path: '/review', icon: <Code2 className="w-4 h-4" />, label: 'Code Review' },
              { id: 'security', path: '/security', icon: <ShieldCheck className="w-4 h-4" />, label: 'Security Center' },
              { id: 'devops', path: '/devops', icon: <Activity className="w-4 h-4" />, label: 'DevOps Monitor' },
            ].map(tab => {
              const isActive = location.pathname.startsWith(tab.path);
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={\`relative px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 cursor-pointer w-full text-sm font-medium \${
                    isActive
                      ? 'text-white bg-[#1473e6]/20'
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.03]'
                  }\`}
                >
                  <span className={isActive ? 'text-[#1d78ff]' : ''}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}

            <div className="h-px bg-[#1d2939] my-4 mx-3" />
            
            <div className="text-[10px] font-bold text-[#64748b] mb-2 px-3 tracking-wider">WORKSPACE</div>

            {[
              { id: 'team', path: '/team', icon: <Users className="w-4 h-4" />, label: 'Team' },
              { id: 'standup', path: '/standup', icon: <Calendar className="w-4 h-4" />, label: 'Standups' },
              { id: 'tasks', path: '/tasks', icon: <ListTodo className="w-4 h-4" />, label: 'Tasks' },
              { id: 'issues', path: '/issues', icon: <AlertCircle className="w-4 h-4" />, label: 'Issues' },
              { id: 'docs', path: '/docs', icon: <BookOpen className="w-4 h-4" />, label: 'Docs' },
              { id: 'snippets', path: '/snippets', icon: <Code2 className="w-4 h-4" />, label: 'Snippets' },
              { id: 'utilities', path: '/utilities', icon: <Terminal className="w-4 h-4" />, label: 'Utilities' },
            ].map(tab => {
              const isActive = location.pathname.startsWith(tab.path);
              return (
                <button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  className={\`relative px-3 py-2.5 rounded-lg transition-all flex items-center gap-3 cursor-pointer w-full text-sm font-medium \${
                    isActive
                      ? 'text-white bg-[#1473e6]/20'
                      : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.03]'
                  }\`}
                >
                  <span className={isActive ? 'text-[#1d78ff]' : ''}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex flex-col gap-3 px-3 mt-4">
            {/* Card 1 */}
            <div className="bg-[#0b1320] border border-[#1d2939] rounded-xl p-3.5 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-[#f6b600]" />
                <span className="text-xs font-semibold text-white">Enterprise Plan</span>
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] text-[#94a3b8]">42 / 100 AI Scans Used</div>
                <div className="w-full bg-[#1d2939] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#1d78ff] h-full w-[42%]" />
                </div>
              </div>
              <button className="text-left text-xs font-semibold text-[#1d78ff] hover:text-[#1d78ff]/80">Manage Plan &rarr;</button>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0b1320] border border-[#1d2939] rounded-xl p-3.5 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="w-2 h-2 rounded-full bg-[#00c98d] mt-1 shrink-0" />
                <MoreHorizontal className="w-4 h-4 text-[#64748b] cursor-pointer" />
              </div>
              <div className="text-xs text-[#94a3b8] leading-tight pr-2">All Systems Operational</div>
              <button className="text-left text-xs font-semibold text-[#1d78ff] hover:text-[#1d78ff]/80">View Status &rarr;</button>
            </div>
          </div>
        </nav>

        {/* Dynamic Outlet Component */}
        <div className="flex-grow flex flex-col min-h-0 bg-[#070d17]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ReviewProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route element={<DashboardLayout />}>
              <Route path="/review" element={<BugChecker />} />
              <Route path="/repo" element={<RepoAnalysisPage />} />
              <Route path="/team" element={<TeamCollabPage />} />
              <Route path="/security" element={<SecurityCenterPage />} />
              <Route path="/standup" element={<StandupPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/devops" element={<DevOpsPage />} />
              <Route path="/docs" element={<DocsPage />} />
              <Route path="/utilities" element={<UtilitiesPage />} />
              <Route path="/snippets" element={<SnippetsPage />} />
              <Route path="/dashboard" element={<Navigate to="/review" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ReviewProvider>
      </AuthProvider>
    </Router>
  );
}
`;

fs.writeFileSync('src/App.tsx', appContent);

const bugCheckerContent = `import React from 'react';
import { 
  Shield, Play, ChevronDown, Copy, Maximize2, MoreHorizontal, 
  Wand2, Info, FlaskConical, GitCommit, Bug, SlidersHorizontal, 
  ExternalLink, Eye, Clock, BarChart3, ChevronRight, CheckCircle2, ShieldAlert, Code2
} from 'lucide-react';

export default function BugChecker() {
  return (
    <div className="flex flex-col h-full overflow-hidden text-slate-300">
      {/* Main Header */}
      <div className="h-[72px] shrink-0 border-b border-[#1d2939] bg-[#070d17] flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#1473e6]/20 border border-[#1473e6]/30 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#1d78ff]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Code Review Analyzer</h1>
            <p className="text-[13px] text-[#94a3b8] mt-0.5">AI-Powered Code Analysis & Security Review</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center justify-between gap-3 px-3 py-2 bg-[#0b1320] border border-[#1d2939] rounded-lg text-sm text-[#f8fafc] hover:bg-[#101827] transition-colors w-[160px]">
            <span>Standard Scan</span>
            <ChevronDown className="w-4 h-4 text-[#64748b]" />
          </button>
          
          <button className="flex items-center justify-between gap-3 px-3 py-2 bg-[#0b1320] border border-[#1d2939] rounded-lg text-sm text-[#f8fafc] hover:bg-[#101827] transition-colors w-[140px]">
            <span>JavaScript</span>
            <ChevronDown className="w-4 h-4 text-[#64748b]" />
          </button>

          <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00c98d] text-[#070d17] font-bold text-[13px] rounded-lg hover:bg-[#00c98d]/90 transition-colors shadow-sm ml-2">
            <Wand2 className="w-4 h-4" />
            Auto-Fix All
          </button>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-[#1d78ff] text-white font-bold text-[13px] rounded-lg hover:bg-[#1473e6] transition-colors shadow-[0_0_15px_rgba(29,120,255,0.3)]">
            <Play className="w-4 h-4 fill-current" />
            Find Bugs
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#070d17]">
        <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-5">
          
          {/* LEFT COLUMN - 65% */}
          <div className="flex-[0_0_65%] flex flex-col gap-5 min-w-0">
            
            {/* Code Editor Panel */}
            <div className="bg-[#0b1320] border border-[#1d2939] rounded-xl overflow-hidden flex flex-col shadow-sm">
              <div className="h-[46px] flex items-center justify-between px-4 border-b border-[#1d2939] bg-[#0d1624]">
                <div className="flex items-center gap-2.5">
                  <div className="w-[18px] h-[18px] rounded-sm bg-[#f6b600] text-[#070d17] flex items-center justify-center font-bold text-[9px] font-mono leading-none">JS</div>
                  <span className="text-sm font-semibold text-[#f8fafc]">code-snippet.js</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#94a3b8]">
                  <button className="p-1 hover:text-white transition-colors rounded hover:bg-white/5"><Copy className="w-4 h-4" /></button>
                  <button className="p-1 hover:text-white transition-colors rounded hover:bg-white/5"><Maximize2 className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-[#1d2939] mx-1" />
                  <button className="p-1 hover:text-white transition-colors rounded hover:bg-white/5"><MoreHorizontal className="w-4 h-4" /></button>
                </div>
              </div>
              
              <div className="py-4 font-mono text-[13px] leading-relaxed overflow-x-auto bg-[#070d17]">
                <table className="w-full border-collapse">
                  <tbody>
                    <tr><td className="w-12 text-right pr-4 text-[#64748b] select-none">1</td><td className="whitespace-pre"><span className="text-[#1d78ff]">function</span> <span className="text-[#f8fafc]">processPayment</span>(user, amount) {'{'}</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#64748b] select-none">2</td><td className="whitespace-pre">  <span className="text-[#1d78ff]">const</span> query = <span className="text-[#f6b600] text-opacity-90">"UPDATE balance SET amount = amount - "</span> + amount + <span className="text-[#f6b600] text-opacity-90">" "</span></td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#64748b] select-none">3</td><td className="whitespace-pre">  db.execute(query);</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#64748b] select-none">4</td><td className="whitespace-pre"> </td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#64748b] select-none">5</td><td className="whitespace-pre">  <span className="text-[#1d78ff]">if</span> (amount &gt; <span className="text-[#00c98d]">1000</span>) {'{'}</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#64748b] select-none">6</td><td className="whitespace-pre">    console.log(<span className="text-[#f6b600] text-opacity-90">"Large payment processing..."</span>);</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#64748b] select-none">7</td><td className="whitespace-pre">  {'}'}</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#64748b] select-none">8</td><td className="whitespace-pre">  <span className="text-[#1d78ff]">return</span> <span className="text-[#1d78ff]">true</span>;</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#64748b] select-none">9</td><td className="whitespace-pre">{'}'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Suggested Fix Panel */}
            <div className="bg-[#0b1320] border border-[#1d2939] rounded-xl flex flex-col shadow-sm">
              <div className="p-4 flex items-center gap-2.5">
                <Wand2 className="w-4 h-4 text-[#f8fafc]" />
                <h3 className="font-bold text-white text-[15px]">AI Suggested Fix</h3>
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#00c98d] bg-[#00c98d]/10 border border-[#00c98d]/20 px-2 py-0.5 rounded-full ml-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Safe
                </span>
              </div>
              <div className="h-px bg-[#1d2939] w-full" />
              
              <div className="flex border-b border-[#1d2939]">
                {/* Original Code */}
                <div className="flex-[0.45] flex flex-col border-r border-[#1d2939] bg-[#070d17]">
                  <div className="px-4 py-2.5 border-b border-[#1d2939] text-[#94a3b8] text-xs font-semibold bg-[#0b1320]">
                    Original Code
                  </div>
                  <div className="py-4 font-mono text-[13px] leading-[1.6] overflow-x-auto">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">1</td><td className="whitespace-pre px-1"><span className="text-[#1d78ff]">function</span> <span className="text-[#f8fafc]">processPayment</span>(user, amount) {'{'}</td></tr>
                        <tr className="bg-[#ef4444]/15"><td className="w-10 text-right pr-3 text-[#ef4444] select-none">2</td><td className="whitespace-pre px-1 text-red-200">- <span className="text-[#1d78ff]">const</span> query = <span className="text-[#f6b600] text-opacity-90">"UPDATE balance SET amount = amount - "</span> + amount + <span className="text-[#f6b600] text-opacity-90">" "</span></td></tr>
                        <tr className="bg-[#ef4444]/15"><td className="w-10 text-right pr-3 text-[#ef4444] select-none">3</td><td className="whitespace-pre px-1 text-red-200">- db.execute(query);</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">4</td><td className="whitespace-pre px-1"> </td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">5</td><td className="whitespace-pre px-1">  <span className="text-[#1d78ff]">if</span> (amount &gt; <span className="text-[#00c98d]">1000</span>) {'{'}</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">6</td><td className="whitespace-pre px-1">    console.log(<span className="text-[#f6b600] text-opacity-90">"Large payment processing..."</span>);</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">7</td><td className="whitespace-pre px-1">  {'}'}</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">8</td><td className="whitespace-pre px-1">  <span className="text-[#1d78ff]">return</span> <span className="text-[#1d78ff]">true</span>;</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">9</td><td className="whitespace-pre px-1">{'}'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Suggested Code */}
                <div className="flex-[0.55] flex flex-col bg-[#070d17]">
                  <div className="px-4 py-2.5 border-b border-[#1d2939] text-[#00c98d] text-xs font-semibold bg-[#0b1320] flex items-center gap-1.5">
                    <span className="text-[#00c98d] font-bold text-base leading-none relative top-[-1px]">+</span> AI Suggested Change
                  </div>
                  <div className="py-4 font-mono text-[13px] leading-[1.6] overflow-x-auto">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">1</td><td className="whitespace-pre px-1"><span className="text-[#1d78ff]">function</span> <span className="text-[#f8fafc]">processPayment</span>(user, amount) {'{'}</td></tr>
                        <tr className="bg-[#00c98d]/15"><td className="w-10 text-right pr-3 text-[#00c98d] select-none">2</td><td className="whitespace-pre px-1 text-green-100">+ <span className="text-[#1d78ff]">const</span> query = <span className="text-[#f6b600] text-opacity-90">"UPDATE balance SET amount = amount - ? WHERE user_id = ?"</span>;</td></tr>
                        <tr className="bg-[#00c98d]/15"><td className="w-10 text-right pr-3 text-[#00c98d] select-none">3</td><td className="whitespace-pre px-1 text-green-100">+ db.execute(query, [amount, user.id]);</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">4</td><td className="whitespace-pre px-1"> </td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">5</td><td className="whitespace-pre px-1">  <span className="text-[#1d78ff]">if</span> (amount &gt; <span className="text-[#00c98d]">1000</span>) {'{'}</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">6</td><td className="whitespace-pre px-1">    console.log(<span className="text-[#f6b600] text-opacity-90">"Large payment processing..."</span>);</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">7</td><td className="whitespace-pre px-1">  {'}'}</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">8</td><td className="whitespace-pre px-1">  <span className="text-[#1d78ff]">return</span> <span className="text-[#1d78ff]">true</span>;</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#64748b] select-none">9</td><td className="whitespace-pre px-1">{'}'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="p-4 flex items-center justify-between bg-[#0b1320] rounded-b-xl">
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#1d2939] rounded-lg text-sm text-[#f8fafc] font-medium hover:bg-[#101827] transition-colors">
                    <Info className="w-4 h-4" /> Explain Fix
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#1d2939] rounded-lg text-sm text-[#f8fafc] font-medium hover:bg-[#101827] transition-colors">
                    <FlaskConical className="w-4 h-4" /> Run Tests
                  </button>
                </div>
                
                <div className="flex">
                  <button className="flex items-center gap-2 px-6 py-2 bg-[#1d78ff] text-white font-semibold text-sm rounded-l-lg hover:bg-[#1473e6] transition-colors shadow-sm">
                    <GitCommit className="w-4 h-4" /> Commit Auto-Fix
                  </button>
                  <div className="w-px bg-white/20" />
                  <button className="px-2 py-2 bg-[#1d78ff] text-white rounded-r-lg hover:bg-[#1473e6] transition-colors flex items-center justify-center">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* AI Summary Panel */}
            <div className="flex flex-col gap-3 mt-1">
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-5 h-5 text-[#f8fafc]" />
                <h3 className="font-bold text-white text-[15px]">AI Summary</h3>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                {/* Metric 1 */}
                <div className="bg-[#0b1320] border border-[#1d2939] rounded-xl p-4 flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-2">
                     <ShieldAlert className="w-5 h-5 text-[#ef4444]" />
                  </div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[#94a3b8] text-[13px] font-semibold">Vulnerabilities</span>
                    <span className="text-[#ef4444] font-bold text-[17px]">1 Critical</span>
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="bg-[#0b1320] border border-[#1d2939] rounded-xl p-4 flex flex-col justify-center gap-2 relative overflow-hidden">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                       <path className="fill-none stroke-[#1d2939] stroke-[5]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                       <path className="fill-none stroke-[#00c98d] stroke-[5] stroke-linecap-round" strokeDasharray="78, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                     </svg>
                  </div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[#94a3b8] text-[13px] font-semibold">Code Quality Score</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-white font-bold text-[17px]">78 <span className="text-[#64748b] text-[13px] font-normal">/ 100</span></span>
                      <span className="text-[#00c98d] text-[11px] font-bold">Good</span>
                    </div>
                  </div>
                </div>

                {/* Metric 3 */}
                <div className="bg-[#0b1320] border border-[#1d2939] rounded-xl p-4 flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-2">
                     <BarChart3 className="w-5 h-5 text-[#00c98d]" />
                  </div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[#94a3b8] text-[13px] font-semibold">Complexity</span>
                    <span className="text-[#1d78ff] font-bold text-[17px]">Low</span>
                  </div>
                </div>

                {/* Metric 4 */}
                <div className="bg-[#0b1320] border border-[#1d2939] rounded-xl p-4 flex flex-col justify-center gap-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#1d78ff]" />
                  </div>
                  <div className="flex flex-col gap-0.5 mt-1">
                    <span className="text-[#94a3b8] text-[13px] font-semibold">Estimated Effort</span>
                    <span className="text-white font-bold text-[17px]">15 min</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - 35% */}
          <div className="flex-[0_0_35%] flex flex-col gap-5 min-w-0">
            
            {/* Analysis Results Header */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2.5">
                  <Bug className="w-[18px] h-[18px] text-[#f6b600]" />
                  <h2 className="text-[17px] font-bold text-white">Analysis Results</h2>
                </div>
                <span className="px-2.5 py-1 bg-[#ef4444]/15 text-[#ef4444] text-[11px] font-semibold rounded-full border border-[#ef4444]/20">
                  1 Issue Found
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="px-3.5 py-1.5 bg-[#1d78ff]/20 text-[#1d78ff] border border-[#1d78ff]/30 text-xs font-semibold rounded-lg shadow-sm">All (1)</button>
                  <button className="px-3.5 py-1.5 text-[#94a3b8] hover:text-white hover:bg-[#101827] text-xs font-semibold rounded-lg transition-colors border border-transparent">Critical (1)</button>
                  <button className="px-3.5 py-1.5 text-[#94a3b8] hover:text-white hover:bg-[#101827] text-xs font-semibold rounded-lg transition-colors border border-transparent">High (0)</button>
                  <button className="px-3.5 py-1.5 text-[#94a3b8] hover:text-white hover:bg-[#101827] text-xs font-semibold rounded-lg transition-colors border border-transparent">Medium (0)</button>
                  <button className="px-3.5 py-1.5 text-[#94a3b8] hover:text-white hover:bg-[#101827] text-xs font-semibold rounded-lg transition-colors border border-transparent hidden xl:block">Low (0)</button>
                </div>
                <div className="flex items-center gap-1.5">
                  <button className="p-1.5 border border-[#1d2939] rounded-md text-[#94a3b8] hover:text-white hover:bg-[#101827] transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 border border-[#1d2939] rounded-md text-[#94a3b8] hover:text-white hover:bg-[#101827] transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex flex-col gap-4">
              
              {/* Critical Issue Card */}
              <div className="border border-[#ef4444]/80 rounded-xl bg-[#0b1320] flex flex-col shadow-sm">
                <div className="p-5 border-b border-[#1d2939] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#ef4444] text-white text-[11px] font-bold px-2 py-0.5 rounded leading-tight">Critical</span>
                      <h3 className="text-[17px] font-bold text-white tracking-tight">SQL Injection</h3>
                    </div>
                    <a href="#" className="flex items-center gap-1 text-[#1d78ff] text-[13px] font-semibold hover:underline">
                      CWE-89 <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[11px] text-[#94a3b8] font-medium bg-[#070d17] px-2 py-1 rounded border border-[#1d2939]">
                      <Code2 className="w-3.5 h-3.5 text-[#64748b]" /> Line 2
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-[#94a3b8] font-medium bg-[#070d17] px-2 py-1 rounded border border-[#1d2939]">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#ef4444]" /> Security
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col gap-5 text-[13px] text-[#94a3b8]">
                  <p className="leading-[1.6]">
                    User-controlled input is concatenated into a SQL query<br />
                    string, which can lead to SQL Injection.
                  </p>

                  <div>
                    <h4 className="text-[#f8fafc] font-bold mb-1.5 text-[14px]">Why is this a problem?</h4>
                    <p className="leading-[1.6]">
                      An attacker can manipulate the SQL query by providing<br />
                      malicious input in the amount parameter, potentially<br />
                      accessing or modifying data they shouldn't.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-[#f8fafc] font-bold mb-2 text-[14px]">Example Attack:</h4>
                    <div className="bg-[#1a1114] border border-[#ef4444]/20 rounded-lg p-3 font-mono text-[13px] text-[#ef4444]">
                      amount = "0; DROP TABLE users; --"
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[#f8fafc] font-bold mb-1.5 text-[14px]">Recommendation</h4>
                    <p className="leading-[1.6]">
                      Use parameterized queries (prepared statements) to<br />
                      separate SQL code from user input.
                    </p>
                  </div>
                </div>

                <div className="p-5 border-t border-[#1d2939] bg-[#0b1320] rounded-b-xl">
                  <div className="flex">
                    <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1d78ff] text-white font-semibold text-sm rounded-l-lg hover:bg-[#1473e6] transition-colors">
                      <Eye className="w-4 h-4" /> View in Diff
                    </button>
                    <div className="w-px bg-white/20" />
                    <button className="px-3 py-2.5 bg-[#1d78ff] text-white rounded-r-lg hover:bg-[#1473e6] transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scan Information Panel */}
              <div className="border border-[#1d2939] rounded-xl bg-[#0b1320] flex flex-col">
                <div className="px-5 py-4 border-b border-[#1d2939] flex items-center gap-2">
                  <Info className="w-[18px] h-[18px] text-[#f8fafc]" />
                  <h3 className="font-bold text-white text-[15px]">Scan Information</h3>
                </div>
                <div className="p-5 text-[13px] flex flex-col gap-3.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748b]">Scan Type</span>
                    <span className="text-[#f8fafc] font-medium">Standard Scan</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748b]">Language</span>
                    <span className="text-[#f8fafc] font-medium">JavaScript</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748b]">Scan Time</span>
                    <span className="text-[#f8fafc] font-medium">May 25, 2025 10:42 AM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748b]">Analysis Engine</span>
                    <span className="text-[#f8fafc] font-medium">WyrmSentry AI v2.1</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748b]">Files Analyzed</span>
                    <span className="text-[#f8fafc] font-medium">1</span>
                  </div>
                  <div className="h-px bg-[#1d2939] w-full my-0.5" />
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748b]">Status</span>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#00c98d] bg-[#00c98d]/10 border border-[#00c98d]/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
`;

fs.writeFileSync('src/components/pages/BugChecker.tsx', bugCheckerContent);

