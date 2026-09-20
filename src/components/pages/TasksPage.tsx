import React, { useState } from 'react';
import { 
  Trello, 
  Calendar, 
  Sparkles, 
  Users, 
  User, 
  CheckSquare, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Tag, 
  AlertCircle,
  TrendingUp,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Task {
  id: string;
  title: string;
  desc: string;
  status: 'Todo' | 'InProgress' | 'InReview' | 'Done';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  type: 'personal' | 'team';
  dueDate: string;
  assignee: string;
  aiPriorityScore?: number; // 0-100 assigned during AI optimization
}

const INITIAL_TASKS: Task[] = [
  { id: 'TSK-201', title: 'Implement JWT session invalidation', desc: 'Add redis key blacklisting endpoint on authentication signouts.', status: 'Todo', priority: 'High', type: 'team', dueDate: '2026-07-22', assignee: 'Alex Mercer' },
  { id: 'TSK-202', title: 'Update project package.json sub-dependencies', desc: 'Secure vulnerable npm packages reported by OWASP audit.', status: 'InProgress', priority: 'Critical', type: 'team', dueDate: '2026-07-20', assignee: 'Sarah Connor' },
  { id: 'TSK-203', title: 'Draft API security reference wiki', desc: 'Document route parameter validators and rate limits.', status: 'InReview', priority: 'Medium', type: 'personal', dueDate: '2026-07-19', assignee: 'You' },
  { id: 'TSK-204', title: 'Revamp Monaco Editor search shortcuts', desc: 'Add cmd+k custom modal command routing logic.', status: 'Done', priority: 'Low', type: 'personal', dueDate: '2026-07-17', assignee: 'You' },
  { id: 'TSK-205', title: 'Configure staging cluster secret injection', desc: 'Set up vault token decryption for runner pipelines.', status: 'Todo', priority: 'High', type: 'team', dueDate: '2026-07-26', assignee: 'Elena Rostova' }
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [viewMode, setViewMode] = useState<'kanban' | 'scrum' | 'calendar'>('kanban');
  const [scopeMode, setScopeMode] = useState<'all' | 'personal' | 'team'>('all');
  const [isPrioritizing, setIsPrioritizing] = useState(false);
  const [currentCalendarDate, setCurrentCalendarDate] = useState(new Date(2026, 6, 18)); // July 2026 based on mock clock

  const handleUpdateStatus = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
  };

  const handleAIPrioritise = () => {
    setIsPrioritizing(true);
    setTimeout(() => {
      setTasks(prev => {
        return prev.map(t => {
          let score = 50;
          if (t.priority === 'Critical') score += 40;
          if (t.priority === 'High') score += 25;
          if (t.priority === 'Medium') score += 10;
          if (t.dueDate <= '2026-07-20') score += 10;
          return {
            ...t,
            aiPriorityScore: score
          };
        }).sort((a, b) => (b.aiPriorityScore || 0) - (a.aiPriorityScore || 0));
      });
      setIsPrioritizing(false);
    }, 1200);
  };

  const filteredTasks = tasks.filter(t => {
    if (scopeMode === 'personal') return t.type === 'personal';
    if (scopeMode === 'team') return t.type === 'team';
    return true;
  });

  const columns: { id: Task['status']; title: string; color: string }[] = [
    { id: 'Todo', title: 'Backlog / Todo', color: 'border-white/5' },
    { id: 'InProgress', title: 'In Progress', color: 'border-brand-cyan/20' },
    { id: 'InReview', title: 'In QA & Review', color: 'border-brand-purple/25' },
    { id: 'Done', title: 'Completed', color: 'border-green-500/20' }
  ];

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentCalendarDate(new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1));
  };

  const renderCalendarGrid = () => {
    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const blanks = Array(firstDay).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalSlots = [...blanks, ...days];

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between bg-black/40 border border-white/5 p-3 rounded-xl">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            🗓️ {monthNames[month]} {year}
          </span>
          <div className="flex items-center gap-1">
            <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/5 text-slate-400 hover:text-white rounded transition-colors cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-1">{d}</div>
          ))}

          {totalSlots.map((day, idx) => {
            if (day === null) {
              return <div key={`blank-${idx}`} className="bg-white/[0.01] rounded-lg aspect-square" />;
            }
            const dateStr = `2026-07-${day < 10 ? '0' : ''}${day}`;
            const dayTasks = tasks.filter(t => t.dueDate === dateStr);

            return (
              <div 
                key={`day-${day}`} 
                className={`bg-bg-dark-900 border text-left p-2 rounded-xl aspect-square flex flex-col justify-between transition-all relative ${
                  day === 18 && month === 6 ? 'border-brand-cyan shadow-[0_0_15px_rgba(0,212,255,0.15)] bg-brand-cyan/5' : 'border-white/5'
                }`}
              >
                <span className={`text-[10px] font-mono font-bold ${
                  day === 18 && month === 6 ? 'text-brand-cyan bg-brand-cyan/10 px-1 rounded' : 'text-slate-400'
                }`}>
                  {day}
                </span>

                <div className="space-y-1 overflow-y-auto max-h-12 scrollbar-none mt-1">
                  {dayTasks.map(task => (
                    <div 
                      key={task.id} 
                      className={`text-[8.5px] p-0.5 rounded truncate font-mono select-none ${
                        task.status === 'Done' 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/15'
                          : 'bg-brand-purple/10 text-brand-purple-light border border-brand-purple-light/15'
                      }`}
                      title={`${task.id}: ${task.title}`}
                    >
                      {task.id}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const totalCompleted = tasks.filter(t => t.status === 'Done').length;
  const progressPercent = Math.round((totalCompleted / tasks.length) * 100);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg-dark-950 text-slate-200 p-6 space-y-6 overflow-y-auto">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Trello className="w-5 h-5 text-brand-purple-light" />
            Interactive Task Workspace
          </h1>
          <p className="text-xs text-slate-400">
            Organize personal cards, Scrum backlogs, sprint boards, and calendar schedules.
          </p>
        </div>

        {/* Task views switches */}
        <div className="flex items-center gap-2 bg-black/40 border border-white/5 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'kanban' ? 'bg-brand-purple/15 border border-brand-purple-light/25 text-brand-purple-light' : 'text-slate-400 hover:text-white'
            }`}
          >
            Kanban Board
          </button>
          <button 
            onClick={() => setViewMode('scrum')}
            className={`px-3 py-1.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'scrum' ? 'bg-brand-purple/15 border border-brand-purple-light/25 text-brand-purple-light' : 'text-slate-400 hover:text-white'
            }`}
          >
            Scrum Backlog
          </button>
          <button 
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 rounded-md text-[10.5px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              viewMode === 'calendar' ? 'bg-brand-purple/15 border border-brand-purple-light/25 text-brand-purple-light' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sprint Calendar
          </button>
        </div>
      </div>

      {/* Stats and scope panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-dark-900 border border-white/5 p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Context Scope:</span>
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 p-0.5 rounded-lg">
            <button 
              onClick={() => setScopeMode('all')}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-all ${scopeMode === 'all' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              All Tasks
            </button>
            <button 
              onClick={() => setScopeMode('personal')}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-all ${scopeMode === 'personal' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              My Tasks
            </button>
            <button 
              onClick={() => setScopeMode('team')}
              className={`px-2.5 py-1 rounded text-[10px] font-semibold cursor-pointer transition-all ${scopeMode === 'team' ? 'bg-white/5 text-white' : 'text-slate-500 hover:text-slate-300'}`}
            >
              Team Work
            </button>
          </div>
        </div>

        {/* Progress Tracker bar */}
        <div className="flex items-center gap-4 flex-1 max-w-sm justify-end">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block uppercase font-bold">Sprint Progress</span>
            <span className="text-xs font-bold text-white font-mono">{progressPercent}% done</span>
          </div>
          <div className="w-24 bg-slate-800 h-2 rounded overflow-hidden border border-white/5">
            <div className="bg-gradient-to-r from-brand-cyan to-brand-purple h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }} />
          </div>

          <button 
            onClick={handleAIPrioritise}
            disabled={isPrioritizing}
            className="flex items-center gap-1 px-3 py-1.5 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/20 text-brand-cyan font-bold text-xs rounded-lg transition-all cursor-pointer shadow-lg shadow-brand-cyan/5"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isPrioritizing ? 'animate-spin' : ''}`} />
            <span>{isPrioritizing ? 'Prioritizing...' : 'AI Prioritize'}</span>
          </button>
        </div>
      </div>

      {/* MAIN SCREEN DISPATCH */}
      <AnimatePresence mode="wait">
        
        {viewMode === 'kanban' && (
          <motion.div 
            key="kanban"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            {columns.map(col => {
              const colTasks = filteredTasks.filter(t => t.status === col.id);
              return (
                <div key={col.id} className="bg-black/20 border border-white/5 rounded-2xl p-4 flex flex-col space-y-4 min-h-[400px]">
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <span className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${col.id === 'Done' ? 'bg-green-400' : col.id === 'InProgress' ? 'bg-brand-cyan' : 'bg-slate-400'}`} />
                      {col.title}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                      {colTasks.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[500px]">
                    {colTasks.length === 0 ? (
                      <div className="h-24 border border-dashed border-white/5 rounded-xl flex items-center justify-center text-[11px] text-slate-600 font-mono">
                        No active items
                      </div>
                    ) : (
                      colTasks.map(task => (
                        <div 
                          key={task.id}
                          className="bg-bg-dark-900 border border-white/5 hover:border-white/10 rounded-xl p-3.5 space-y-3 shadow-md group hover:bg-white/[0.01] transition-all cursor-pointer relative"
                        >
                          {task.aiPriorityScore && (
                            <div className="absolute top-2 right-2 flex items-center gap-1 text-[8.5px] bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/20 px-1.5 py-0.5 rounded font-mono font-black animate-pulse">
                              <Zap className="w-2.5 h-2.5" />
                              SCORE: {task.aiPriorityScore}
                            </div>
                          )}

                          <div className="space-y-1">
                            <span className="text-[9.5px] font-mono font-bold text-slate-500 block">{task.id}</span>
                            <span className="font-bold text-xs text-white leading-tight block group-hover:text-brand-cyan transition-colors">{task.title}</span>
                            <p className="text-[10.5px] text-slate-400 leading-relaxed block">{task.desc}</p>
                          </div>

                          <div className="flex items-center justify-between border-t border-white/5 pt-2.5">
                            <div className="flex items-center gap-1.5">
                              <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[9px] font-bold text-slate-400">
                                {task.assignee[0]}
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">{task.assignee}</span>
                            </div>

                            <span className={`text-[9.5px] font-mono font-bold ${task.priority === 'Critical' ? 'text-red-400' : task.priority === 'High' ? 'text-amber-400' : 'text-slate-500'}`}>
                              {task.priority}
                            </span>
                          </div>

                          {/* Quick transitions buttons */}
                          <div className="flex justify-end gap-1 border-t border-white/5 pt-2 mt-1 hidden group-hover:flex">
                            {col.id !== 'Todo' && (
                              <button 
                                onClick={() => handleUpdateStatus(task.id, 'Todo')}
                                className="text-[8.5px] font-bold uppercase tracking-wider text-slate-500 hover:text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/5 cursor-pointer"
                              >
                                Todo
                              </button>
                            )}
                            {col.id !== 'InProgress' && (
                              <button 
                                onClick={() => handleUpdateStatus(task.id, 'InProgress')}
                                className="text-[8.5px] font-bold uppercase tracking-wider text-brand-cyan hover:bg-brand-cyan/10 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 cursor-pointer"
                              >
                                Prog
                              </button>
                            )}
                            {col.id !== 'InReview' && (
                              <button 
                                onClick={() => handleUpdateStatus(task.id, 'InReview')}
                                className="text-[8.5px] font-bold uppercase tracking-wider text-brand-purple-light hover:bg-brand-purple/10 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 cursor-pointer"
                              >
                                QA
                              </button>
                            )}
                            {col.id !== 'Done' && (
                              <button 
                                onClick={() => handleUpdateStatus(task.id, 'Done')}
                                className="text-[8.5px] font-bold uppercase tracking-wider text-green-400 hover:bg-green-400/10 px-1.5 py-0.5 rounded bg-white/5 border border-white/5 cursor-pointer"
                              >
                                Done
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {viewMode === 'scrum' && (
          <motion.div 
            key="scrum"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-bg-dark-900 border border-white/5 rounded-2xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/40 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <th className="py-3 px-4 w-28">Task ID</th>
                    <th className="py-3 px-4">Sprint Goal Target</th>
                    <th className="py-3 px-4 w-36">Status</th>
                    <th className="py-3 px-4 w-28">Priority</th>
                    <th className="py-3 px-4 w-32">Assignee</th>
                    <th className="py-3 px-4 w-32">Target Deadline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs">
                  {filteredTasks.map(t => (
                    <tr key={t.id} className="hover:bg-white/[0.01] transition-all">
                      <td className="py-3 px-4 font-mono font-bold text-slate-400">{t.id}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{t.title}</span>
                        <span className="text-[11px] text-slate-400 block mt-0.5 leading-relaxed">{t.desc}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          t.status === 'Done' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-bold font-mono text-[10.5px] ${t.priority === 'Critical' ? 'text-red-400' : 'text-slate-400'}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{t.assignee}</td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{t.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {viewMode === 'calendar' && (
          <motion.div 
            key="calendar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {renderCalendarGrid()}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
