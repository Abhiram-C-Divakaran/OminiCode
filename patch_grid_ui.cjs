const fs = require('fs');

const appContent = `import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
  Shield, Search, Bell, FolderGit2, Users, Code2, ShieldCheck, Activity, 
  CalendarDays, ListChecks, CircleAlert, BookOpen, Crown, MoreHorizontal, 
  LayoutDashboard, ChevronDown, UserPlus 
} from 'lucide-react';
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
    <div className="flex flex-col h-screen w-full bg-[#060d17] text-[#f8fafc] font-sans overflow-hidden selection:bg-[#2684ff]/30 box-border">
      {/* Top Header */}
      <header className="h-[62px] bg-[#070e18] border-b border-[#1b2938] flex items-center justify-between px-5 select-none shrink-0 z-20 gap-4 min-w-0">
        <div className="flex items-center gap-4 shrink-0 min-w-0">
          <div onClick={() => navigate('/')} className="flex items-center gap-2.5 cursor-pointer group shrink-0">
            <div className="flex items-center justify-center">
              <Shield className="w-[22px] h-[22px] text-[#2684ff]" strokeWidth={2} />
            </div>
            <span className="font-bold text-[20px] text-white tracking-tight hidden sm:block">WyrmSentry</span>
          </div>
          
          <div className="h-5 w-px bg-[#1b2938] mx-2 hidden sm:block shrink-0" />
          
          <div className="flex items-center gap-3 text-[14px] shrink-0 min-w-0">
            <span className="text-[#8eaccb] hidden md:block truncate">WyrmSentry-Core</span>
            <span className="text-[#627d9c] hidden md:block shrink-0">/</span>
            <div className="flex items-center gap-1.5 text-[#00d3a0] bg-[#00d3a0]/10 px-2 py-0.5 rounded border border-[#00d3a0]/20 font-mono text-[12px] cursor-pointer whitespace-nowrap shrink-0">
              main <ChevronDown className="w-3 h-3" />
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center max-w-[500px] min-w-[150px] mx-4 relative group hidden lg:flex shrink">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-[15px] w-[15px] text-[#8eaccb]" />
          </div>
          <input 
            type="text" 
            placeholder="Search code, issues, or run commands..." 
            className="block w-full pl-9 pr-10 py-[7px] border border-[#1b2938] rounded-md leading-5 bg-[#0b1523] text-[#f8fafc] placeholder-[#627d9c] focus:outline-none focus:border-[#2684ff] text-[13px] transition-all shadow-sm min-w-0"
          />
          <div className="absolute inset-y-0 right-[25px] flex items-center pointer-events-none">
            <span className="text-[10px] font-mono text-[#8eaccb] border border-[#1b2938] rounded px-1.5 py-0.5 bg-[#08111e]">⌘K</span>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-5 shrink-0">
          <button className="hidden md:flex items-center gap-2 text-[14px] text-[#8eaccb] hover:text-white transition-colors whitespace-nowrap shrink-0">
            <UserPlus className="w-[15px] h-[15px]" /> Invite
          </button>
          <button className="hidden md:flex items-center gap-2 text-[14px] text-[#8eaccb] hover:text-white transition-colors whitespace-nowrap shrink-0">
            <BookOpen className="w-[15px] h-[15px]" /> Docs
          </button>
          
          <div className="relative cursor-pointer hover:text-white text-[#8eaccb] transition-colors ml-1 shrink-0">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute -top-1 -right-1.5 bg-[#2684ff] text-white text-[9px] font-bold px-[5px] py-[1px] rounded-full leading-none">3</span>
          </div>
          
          <div className="h-6 w-px bg-[#1b2938] mx-1 hidden sm:block shrink-0" />
          
          <div className="flex items-center gap-3 cursor-pointer group shrink-0">
            <div className="w-[30px] h-[30px] rounded-full bg-indigo-500 overflow-hidden shrink-0">
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Aarav Mehta" className="w-full h-full object-cover" />
            </div>
            <div className="flex-col justify-center hidden sm:flex shrink-0">
              <span className="text-[13px] font-bold text-white leading-tight whitespace-nowrap">Aarav Mehta</span>
              <span className="text-[11px] text-[#627d9c] leading-tight">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body - CSS Grid Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[205px_minmax(0,1fr)] min-h-0 w-full overflow-hidden">
        {/* Navigation Sidebar */}
        <nav className="bg-[#070e18] border-r border-[#1b2938] flex-col justify-between py-5 shrink-0 hidden md:flex overflow-y-auto min-h-0">
          <div className="flex flex-col w-full min-h-0">
            
            <div className="text-[10px] font-bold text-[#627d9c] mb-2 px-4 tracking-wider uppercase shrink-0">MAIN</div>
            
            <div className="flex flex-col gap-[2px] px-2.5 shrink-0">
              {[
                { id: 'dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-[15px] h-[15px]" />, label: 'Dashboard' },
                { id: 'repo', path: '/repo', icon: <FolderGit2 className="w-[15px] h-[15px]" />, label: 'Repositories' },
                { id: 'review', path: '/review', icon: <Code2 className="w-[15px] h-[15px]" />, label: 'Code Review' },
                { id: 'security', path: '/security', icon: <ShieldCheck className="w-[15px] h-[15px]" />, label: 'Security Center' },
                { id: 'devops', path: '/devops', icon: <Activity className="w-[15px] h-[15px]" />, label: 'DevOps Monitor' },
              ].map(tab => {
                const isActive = location.pathname.startsWith(tab.path);
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.path)}
                    className={\`px-3 py-2 rounded-[7px] transition-all flex items-center gap-3 cursor-pointer w-full text-[14px] min-w-0 \${
                      isActive
                        ? 'bg-[#0d59be] text-white font-semibold'
                        : 'text-[#8eaccb] hover:text-white hover:bg-white/[0.03] font-medium'
                    }\`}
                  >
                    <span className={\`shrink-0 \${isActive ? 'text-white' : 'text-[#8eaccb]'}\`}>{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="h-[24px] shrink-0" />
            
            <div className="text-[10px] font-bold text-[#627d9c] mb-2 px-4 tracking-wider uppercase shrink-0">WORKSPACE</div>

            <div className="flex flex-col gap-[2px] px-2.5 shrink-0">
              {[
                { id: 'team', path: '/team', icon: <Users className="w-[15px] h-[15px]" />, label: 'Team' },
                { id: 'standup', path: '/standup', icon: <CalendarDays className="w-[15px] h-[15px]" />, label: 'Standups' },
                { id: 'tasks', path: '/tasks', icon: <ListChecks className="w-[15px] h-[15px]" />, label: 'Tasks' },
                { id: 'issues', path: '/issues', icon: <CircleAlert className="w-[15px] h-[15px]" />, label: 'Issues' },
                { id: 'docs', path: '/docs', icon: <BookOpen className="w-[15px] h-[15px]" />, label: 'Docs' },
              ].map(tab => {
                const isActive = location.pathname.startsWith(tab.path);
                return (
                  <button
                    key={tab.id}
                    onClick={() => navigate(tab.path)}
                    className={\`px-3 py-2 rounded-[7px] transition-all flex items-center gap-3 cursor-pointer w-full text-[14px] min-w-0 \${
                      isActive
                        ? 'bg-[#0d59be] text-white font-semibold'
                        : 'text-[#8eaccb] hover:text-white hover:bg-white/[0.03] font-medium'
                    }\`}
                  >
                    <span className={\`shrink-0 \${isActive ? 'text-white' : 'text-[#8eaccb]'}\`}>{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex flex-col gap-3 px-3 mt-4 shrink-0">
            {/* Card 1 */}
            <div className="bg-[#0b1523] border border-[#1b2938] rounded-[10px] p-3.5 flex flex-col gap-2.5 shrink-0">
              <div className="flex items-center gap-2">
                <Crown className="w-[14px] h-[14px] text-[#ffc400] shrink-0" />
                <span className="text-[13px] font-semibold text-white leading-none truncate">Enterprise Plan</span>
              </div>
              <div className="space-y-1.5 mt-1">
                <div className="text-[11px] text-[#8eaccb] leading-none truncate">42 / 100 AI Scans Used</div>
                <div className="w-full bg-[#1b2938] h-[5px] rounded-full overflow-hidden shrink-0">
                  <div className="bg-[#2684ff] h-full w-[42%]" />
                </div>
              </div>
              <button className="text-left text-[12px] font-semibold text-[#2684ff] hover:text-[#2684ff]/80 mt-1 truncate">Manage Plan &rarr;</button>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0b1523] border border-[#1b2938] rounded-[10px] p-3.5 flex flex-col gap-2.5 shrink-0">
              <div className="flex items-start justify-between">
                <div className="w-[8px] h-[8px] rounded-full bg-[#00d3a0] mt-[3px] shrink-0" />
                <MoreHorizontal className="w-[14px] h-[14px] text-[#627d9c] cursor-pointer shrink-0" />
              </div>
              <div className="text-[12px] font-medium text-[#8eaccb] leading-tight break-words">All Systems Operational</div>
              <button className="text-left text-[12px] font-semibold text-[#2684ff] hover:text-[#2684ff]/80 truncate">View Status &rarr;</button>
            </div>
          </div>
        </nav>

        {/* Dynamic Outlet Component */}
        <main className="flex flex-col min-w-0 min-h-0 bg-[#060d17] overflow-hidden w-full">
          <Outlet />
        </main>
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
  Wand2, Info, FlaskConical, GitBranch, Bug, SlidersHorizontal, 
  ExternalLink, Eye, Activity, ShieldCheck, Code2, ShieldAlert
} from 'lucide-react';

export default function BugChecker() {
  return (
    <div className="flex flex-col h-full w-full min-w-0 bg-[#060d17] text-[#f8fafc]">
      {/* Main Header */}
      <div className="min-h-[73px] shrink-0 border-b border-[#1b2938] flex flex-wrap lg:flex-nowrap items-center justify-between px-4 lg:px-[24px] py-4 lg:py-0 z-10 bg-[#060d17] gap-4 min-w-0 w-full">
        <div className="flex items-center gap-3.5 shrink-0 min-w-0">
          <div className="w-[42px] h-[42px] rounded-full bg-[#0b1523] border border-[#1b2938] flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-[#2684ff]" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-[21px] font-bold text-white tracking-tight leading-tight truncate">Code Review Analyzer</h1>
            <p className="text-[13px] text-[#8eaccb] mt-[1px] truncate">AI-Powered Code Analysis & Security Review</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button className="flex items-center justify-between gap-2 px-3.5 py-[9px] bg-[#0b1523] border border-[#1b2938] rounded-md text-[13px] text-[#f8fafc] hover:bg-[#101827] transition-colors whitespace-nowrap shrink-0">
            <span>Standard Scan</span>
            <ChevronDown className="w-[14px] h-[14px] text-[#627d9c]" />
          </button>
          
          <button className="flex items-center justify-between gap-2 px-3.5 py-[9px] bg-[#0b1523] border border-[#1b2938] rounded-md text-[13px] text-[#f8fafc] hover:bg-[#101827] transition-colors whitespace-nowrap shrink-0">
            <span>JavaScript</span>
            <ChevronDown className="w-[14px] h-[14px] text-[#627d9c]" />
          </button>

          <button className="flex items-center gap-2 px-4 py-[9px] bg-[#00d3a0] text-[#060d17] font-bold text-[13px] rounded-md hover:bg-[#00c79e] transition-colors whitespace-nowrap shrink-0 lg:ml-2">
            <Wand2 className="w-4 h-4" />
            Auto-Fix All
          </button>

          <button className="flex items-center gap-2 px-5 py-[9px] bg-[#2684ff] text-white font-bold text-[13px] rounded-md hover:bg-[#1e88ff] transition-colors whitespace-nowrap shrink-0">
            <Play className="w-4 h-4 fill-current" />
            Find Bugs
          </button>
        </div>
      </div>

      {/* Main Content Layout - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-[24px] py-5 min-w-0 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] gap-[20px] w-full max-w-[1800px] mx-auto items-start min-w-0">
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5 min-w-0 w-full">
            
            {/* Code Editor Panel */}
            <div className="border border-[#1b2938] rounded-[11px] overflow-hidden flex flex-col bg-[#0b1523] min-w-0">
              <div className="h-[48px] flex items-center justify-between px-4 border-b border-[#1b2938] bg-[#0b1523] shrink-0 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-[18px] h-[18px] rounded-sm bg-[#ffc400] text-[#060d17] flex items-center justify-center font-bold text-[10px] font-mono leading-none shrink-0">JS</div>
                  <span className="text-[14px] font-bold text-[#f8fafc] truncate">code-snippet.js</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#8eaccb] shrink-0">
                  <button className="p-1 hover:text-white transition-colors rounded"><Copy className="w-[15px] h-[15px]" /></button>
                  <button className="p-1 hover:text-white transition-colors rounded"><Maximize2 className="w-[15px] h-[15px]" /></button>
                  <div className="w-px h-4 bg-[#1b2938] mx-1" />
                  <button className="p-1 hover:text-white transition-colors rounded"><MoreHorizontal className="w-[15px] h-[15px]" /></button>
                </div>
              </div>
              
              <div className="font-mono text-[13px] leading-[1.6] overflow-x-auto bg-[#060d16] py-3 min-w-0 custom-scrollbar">
                <table className="w-max border-collapse min-w-full">
                  <tbody>
                    <tr><td className="w-12 text-right pr-4 text-[#627d9c] select-none">1</td><td className="whitespace-pre"><span className="text-[#2684ff]">function</span> <span className="text-[#f8fafc]">processPayment</span>(user, amount) {'{'}</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#627d9c] select-none">2</td><td className="whitespace-pre">  <span className="text-[#2684ff]">const</span> query = <span className="text-[#ffad00]">"UPDATE balance SET amount = amount - "</span> + amount + <span className="text-[#ffad00]">" "</span></td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#627d9c] select-none">3</td><td className="whitespace-pre">  db.execute(query);</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#627d9c] select-none">4</td><td className="whitespace-pre"> </td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#627d9c] select-none">5</td><td className="whitespace-pre">  <span className="text-[#2684ff]">if</span> (amount &gt; <span className="text-[#00c79e]">1000</span>) {'{'}</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#627d9c] select-none">6</td><td className="whitespace-pre">    console.log(<span className="text-[#ffad00]">"Large payment processing..."</span>);</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#627d9c] select-none">7</td><td className="whitespace-pre">  {'}'}</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#627d9c] select-none">8</td><td className="whitespace-pre">  <span className="text-[#2684ff]">return</span> <span className="text-[#2684ff]">true</span>;</td></tr>
                    <tr><td className="w-12 text-right pr-4 text-[#627d9c] select-none">9</td><td className="whitespace-pre">{'}'}</td></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* AI Suggested Fix Panel */}
            <div className="border border-[#1b2938] rounded-[11px] flex flex-col overflow-hidden bg-[#0a1421] min-w-0">
              <div className="min-h-[56px] px-5 py-3 flex flex-wrap items-center gap-2.5 shrink-0 min-w-0">
                <Wand2 className="w-[18px] h-[18px] text-[#f8fafc] shrink-0" />
                <h3 className="font-bold text-white text-[16px] truncate">AI Suggested Fix</h3>
                <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#00d3a0] border border-[#00d3a0]/40 px-2 py-0.5 rounded-full ml-1 shrink-0">
                  <ShieldCheck className="w-[12px] h-[12px]" /> SAFE
                </span>
              </div>
              <div className="h-px bg-[#1b2938] w-full shrink-0" />
              
              <div className="flex flex-col 2xl:flex-row border-b border-[#1b2938] min-w-0">
                {/* Original Code */}
                <div className="flex-1 flex flex-col border-b 2xl:border-b-0 2xl:border-r border-[#1b2938] bg-[#060d16] min-w-0 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#1b2938] text-[#8eaccb] text-[13px] font-medium bg-[#0b1523] truncate shrink-0">
                    Original Code
                  </div>
                  <div className="py-3 font-mono text-[13px] leading-[1.6] overflow-x-auto custom-scrollbar min-w-0">
                    <table className="w-max border-collapse min-w-full">
                      <tbody>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">1</td><td className="whitespace-pre px-1"><span className="text-[#2684ff]">function</span> <span className="text-[#f8fafc]">processPayment</span>(user, amount) {'{'}</td></tr>
                        <tr className="bg-[#ff4d56]/20"><td className="w-10 text-right pr-3 text-[#ff4d56] select-none font-bold">-</td><td className="whitespace-pre px-1 text-red-50"><span className="text-[#1e88ff]">const</span> query = <span className="text-[#ffad00]">"UPDATE balance SET amount = amount - "</span> + amount + <span className="text-[#ffad00]">" "</span></td></tr>
                        <tr className="bg-[#ff4d56]/20"><td className="w-10 text-right pr-3 text-[#ff4d56] select-none font-bold">-</td><td className="whitespace-pre px-1 text-red-50">db.execute(query);</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">4</td><td className="whitespace-pre px-1"> </td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">5</td><td className="whitespace-pre px-1">  <span className="text-[#2684ff]">if</span> (amount &gt; <span className="text-[#00c79e]">1000</span>) {'{'}</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">6</td><td className="whitespace-pre px-1">    console.log(<span className="text-[#ffad00]">"Large payment processing..."</span>);</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">7</td><td className="whitespace-pre px-1">  {'}'}</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">8</td><td className="whitespace-pre px-1">  <span className="text-[#2684ff]">return</span> <span className="text-[#2684ff]">true</span>;</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">9</td><td className="whitespace-pre px-1">{'}'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Suggested Code */}
                <div className="flex-1 flex flex-col bg-[#060d16] min-w-0 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#1b2938] text-[#00d3a0] text-[13px] font-medium bg-[#0b1523] truncate shrink-0">
                    + AI Suggested Change
                  </div>
                  <div className="py-3 font-mono text-[13px] leading-[1.6] overflow-x-auto custom-scrollbar min-w-0">
                    <table className="w-max border-collapse min-w-full">
                      <tbody>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">1</td><td className="whitespace-pre px-1"><span className="text-[#2684ff]">function</span> <span className="text-[#f8fafc]">processPayment</span>(user, amount) {'{'}</td></tr>
                        <tr className="bg-[#00d3a0]/20"><td className="w-10 text-right pr-3 text-[#00d3a0] select-none font-bold">+</td><td className="whitespace-pre px-1 text-green-50"><span className="text-[#1e88ff]">const</span> query = <span className="text-[#ffad00]">"UPDATE balance SET amount = amount - ? WHERE user_id = ?"</span>;</td></tr>
                        <tr className="bg-[#00d3a0]/20"><td className="w-10 text-right pr-3 text-[#00d3a0] select-none font-bold">+</td><td className="whitespace-pre px-1 text-green-50">db.execute(query, [amount, user.id]);</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">4</td><td className="whitespace-pre px-1"> </td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">5</td><td className="whitespace-pre px-1">  <span className="text-[#2684ff]">if</span> (amount &gt; <span className="text-[#00c79e]">1000</span>) {'{'}</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">6</td><td className="whitespace-pre px-1">    console.log(<span className="text-[#ffad00]">"Large payment processing..."</span>);</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">7</td><td className="whitespace-pre px-1">  {'}'}</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">8</td><td className="whitespace-pre px-1">  <span className="text-[#2684ff]">return</span> <span className="text-[#2684ff]">true</span>;</td></tr>
                        <tr><td className="w-10 text-right pr-3 text-[#627d9c] select-none">9</td><td className="whitespace-pre px-1">{'}'}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="p-4 flex flex-wrap items-center justify-between bg-[#0b1523] gap-4 shrink-0 min-w-0">
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#1b2938] rounded-md text-[13px] text-[#f8fafc] hover:bg-[#101827] transition-colors bg-[#08111e] whitespace-nowrap">
                    <Info className="w-4 h-4" /> Explain Fix
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 border border-[#1b2938] rounded-md text-[13px] text-[#f8fafc] hover:bg-[#101827] transition-colors bg-[#08111e] whitespace-nowrap">
                    <FlaskConical className="w-4 h-4" /> Run Tests
                  </button>
                </div>
                
                <div className="flex shrink-0">
                  <button className="flex items-center gap-2 px-5 py-[9px] bg-[#2684ff] text-white font-medium text-[13px] rounded-l-md hover:bg-[#1e88ff] transition-colors whitespace-nowrap">
                    <GitBranch className="w-[15px] h-[15px]" /> Commit Auto-Fix
                  </button>
                  <div className="w-px bg-white/20" />
                  <button className="px-2.5 py-[9px] bg-[#2684ff] text-white rounded-r-md hover:bg-[#1e88ff] transition-colors flex items-center justify-center">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* AI Summary Panel */}
            <div className="flex flex-col gap-3 mt-2 min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <Activity className="w-[18px] h-[18px] text-[#f8fafc] shrink-0" />
                <h3 className="font-bold text-white text-[16px] truncate">AI Summary</h3>
              </div>
              <div className="text-[#8eaccb] text-[13px]">
                Analysis complete. Detailed metrics are available in the expanded view.
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - 35% */}
          <div className="flex flex-col gap-4 min-w-0 w-full lg:sticky lg:top-0 pb-10">
            
            {/* Analysis Results Header */}
            <div className="flex flex-col gap-3.5 min-w-0">
              <div className="flex justify-between items-center px-1 min-w-0 gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Bug className="w-[18px] h-[18px] text-[#ffc400] shrink-0" />
                  <h2 className="text-[17px] font-bold text-white tracking-tight truncate">Analysis Results</h2>
                </div>
                <span className="px-2.5 py-1 bg-[#ff4d56]/20 text-[#ff4d56] text-[11px] font-semibold rounded-md border border-[#ff4d56]/20 whitespace-nowrap shrink-0">
                  1 Issue Found
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                  <button className="px-3.5 py-1.5 bg-[#2684ff] text-white text-[12px] font-semibold rounded-md">All (1)</button>
                  <button className="px-3.5 py-1.5 text-[#8eaccb] hover:text-white hover:bg-[#0a1421] text-[12px] font-semibold rounded-md transition-colors border border-transparent">Critical (1)</button>
                  <button className="px-3.5 py-1.5 text-[#8eaccb] hover:text-white hover:bg-[#0a1421] text-[12px] font-semibold rounded-md transition-colors border border-transparent">High (0)</button>
                  <button className="px-3.5 py-1.5 text-[#8eaccb] hover:text-white hover:bg-[#0a1421] text-[12px] font-semibold rounded-md transition-colors border border-transparent hidden 2xl:block">Medium (0)</button>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button className="p-1.5 border border-[#1b2938] rounded-md text-[#8eaccb] hover:text-white hover:bg-[#0a1421] transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 border border-[#1b2938] rounded-md text-[#8eaccb] hover:text-white hover:bg-[#0a1421] transition-colors">
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Critical Issue Card */}
            <div className="border border-[#ff4d56] rounded-[10px] bg-[#0a1421] flex flex-col mt-1 min-w-0">
              <div className="px-5 pt-5 pb-4 border-b border-[#1b2938] flex flex-col gap-4 bg-[#0a1421] rounded-t-[10px] min-w-0">
                <div className="flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="bg-[#ff4d56] text-white text-[11px] font-bold px-2 py-[2px] rounded-[4px] leading-tight shrink-0">Critical</span>
                    <h3 className="text-[17px] font-bold text-white tracking-tight truncate">SQL Injection</h3>
                  </div>
                  <a href="#" className="flex items-center gap-1.5 text-[#2684ff] text-[12px] font-semibold hover:underline whitespace-nowrap shrink-0">
                    CWE-89 <ExternalLink className="w-[13px] h-[13px]" />
                  </a>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <span className="flex items-center gap-1.5 text-[11px] text-[#8eaccb] font-medium bg-[#060d17] px-2.5 py-1 rounded-md border border-[#1b2938] whitespace-nowrap">
                    <Code2 className="w-[13px] h-[13px] text-[#627d9c]" /> Line 2
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px] text-[#8eaccb] font-medium bg-[#060d17] px-2.5 py-1 rounded-md border border-[#1b2938] whitespace-nowrap">
                    <ShieldAlert className="w-[13px] h-[13px] text-[#627d9c]" /> Security
                  </span>
                </div>
              </div>

              <div className="px-5 py-5 flex flex-col gap-[18px] text-[13px] text-[#8eaccb] min-w-0">
                <p className="leading-[1.6] break-words whitespace-normal">
                  User-controlled input is concatenated into a SQL query string, which can lead to SQL Injection.
                </p>

                <div className="min-w-0">
                  <h4 className="text-[#f8fafc] font-bold mb-[6px] text-[14px] truncate">Why is this a problem?</h4>
                  <p className="leading-[1.6] break-words whitespace-normal">
                    An attacker can manipulate the SQL query by providing malicious input in the amount parameter, potentially accessing or modifying data they shouldn't.
                  </p>
                </div>

                <div className="min-w-0 overflow-hidden">
                  <h4 className="text-[#f8fafc] font-bold mb-[8px] text-[14px] truncate">Example Attack:</h4>
                  <div className="bg-[#3a0a0e] border border-[#ff4d56]/20 rounded-md p-3 font-mono text-[13px] text-[#ffad00] overflow-x-auto custom-scrollbar">
                    <span className="whitespace-nowrap">amount = "0; DROP TABLE users; --"</span>
                  </div>
                </div>

                <div className="min-w-0">
                  <h4 className="text-[#f8fafc] font-bold mb-[6px] text-[14px] truncate">Recommendation</h4>
                  <p className="leading-[1.6] break-words whitespace-normal">
                    Use parameterized queries (prepared statements) to separate SQL code from user input.
                  </p>
                </div>
              </div>

              <div className="px-5 py-[18px] border-t border-[#1b2938] bg-[#0a1421] rounded-b-[10px] shrink-0">
                <div className="flex">
                  <button className="flex-1 flex items-center justify-center gap-2 px-4 py-[9px] bg-[#2684ff] text-white font-bold text-[13px] rounded-l-md hover:bg-[#1e88ff] transition-colors whitespace-nowrap">
                    <Eye className="w-4 h-4" /> View in Diff
                  </button>
                  <div className="w-px bg-white/20" />
                  <button className="px-3.5 py-[9px] bg-[#2684ff] text-white rounded-r-md hover:bg-[#1e88ff] transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Scan Information Panel */}
            <div className="border border-[#1b2938] rounded-[10px] bg-[#0b1523] flex flex-col mt-2 min-w-0">
              <div className="px-5 py-4 border-b border-[#1b2938] flex items-center gap-2.5 shrink-0">
                <Info className="w-[16px] h-[16px] text-[#8eaccb]" />
                <h3 className="font-bold text-white text-[15px] truncate">Scan Information</h3>
              </div>
              <div className="px-5 py-4 flex flex-col gap-3">
                 <div className="flex justify-between text-[13px]">
                   <span className="text-[#627d9c]">Status</span>
                   <span className="text-[#00c79e] font-semibold">Completed</span>
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

