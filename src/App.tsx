import React, { useState } from 'react';
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
                    className={`px-3 py-2 rounded-[7px] transition-all flex items-center gap-3 cursor-pointer w-full text-[14px] min-w-0 ${
                      isActive
                        ? 'bg-[#0d59be] text-white font-semibold'
                        : 'text-[#8eaccb] hover:text-white hover:bg-white/[0.03] font-medium'
                    }`}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#8eaccb]'}`}>{tab.icon}</span>
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
                    className={`px-3 py-2 rounded-[7px] transition-all flex items-center gap-3 cursor-pointer w-full text-[14px] min-w-0 ${
                      isActive
                        ? 'bg-[#0d59be] text-white font-semibold'
                        : 'text-[#8eaccb] hover:text-white hover:bg-white/[0.03] font-medium'
                    }`}
                  >
                    <span className={`shrink-0 ${isActive ? 'text-white' : 'text-[#8eaccb]'}`}>{tab.icon}</span>
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
              <Route path="/security" element={<SecurityCenterPage onNavigate={() => {}} />} />
              <Route path="/standup" element={<StandupPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/issues" element={<IssuesPage onNavigate={() => {}} />} />
              <Route path="/devops" element={<DevOpsPage />} />
              <Route path="/docs" element={<DocsPage onNavigate={() => {}} />} />
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
