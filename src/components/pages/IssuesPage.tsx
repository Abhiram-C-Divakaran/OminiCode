import {
AlertCircle,
AlertTriangle,
Bookmark,
Plus,
Search,
Sparkles,
X
} from 'lucide-react';
import { AnimatePresence,motion } from 'motion/react';
import React,{ useState } from 'react';

interface Issue {
  id: string;
  title: string;
  desc: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'QA/Review' | 'Done';
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  label: 'Bug' | 'Security' | 'Feature' | 'Enhancement' | 'Refactor';
  assignee: string;
  sprint: string;
  dueDate: string;
}

const INITIAL_ISSUES: Issue[] = [
  {
    id: 'OMNI-102',
    title: 'Sanitize URL redirects in Auth Provider',
    desc: 'Vulnerability scanner flagged possible open-redirect exploits inside oauth routing handlers.',
    status: 'Todo',
    priority: 'Critical',
    label: 'Security',
    assignee: 'Sarah Connor',
    sprint: 'Sprint 24',
    dueDate: '2026-07-22'
  },
  {
    id: 'OMNI-105',
    title: 'SQL Connection Pool timeout under extreme load',
    desc: 'Database connections are exhausted when handling more than 2,000 requests/sec. Need connection recycling.',
    status: 'In Progress',
    priority: 'High',
    label: 'Bug',
    assignee: 'Alex Mercer',
    sprint: 'Sprint 24',
    dueDate: '2026-07-20'
  },
  {
    id: 'OMNI-112',
    title: 'Implement drag-and-drop workspace layout presets',
    desc: 'Users want to drag panels around the workspace to save custom grids. Add grid layout helper.',
    status: 'Backlog',
    priority: 'Medium',
    label: 'Feature',
    assignee: 'Elena Rostova',
    sprint: 'Backlog',
    dueDate: '2026-08-05'
  },
  {
    id: 'OMNI-109',
    title: 'Optimize memory footprint of Monaco language parser',
    desc: 'TS compilation workers on the client thread leak small buffers. Needs garbage disposal optimization.',
    status: 'QA/Review',
    priority: 'High',
    label: 'Refactor',
    assignee: 'Marcus Vance',
    sprint: 'Sprint 24',
    dueDate: '2026-07-19'
  }
];

export default function IssuesPage({ onNavigate }: { onNavigate: (view: string) => void }) {
  const [issues, setIssues] = useState<Issue[]>(INITIAL_ISSUES);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [labelFilter, setLabelFilter] = useState<string>('All');
  
  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<Issue['priority']>('High');
  const [newLabel, setNewLabel] = useState<Issue['label']>('Bug');
  const [newAssignee, setNewAssignee] = useState('Sarah Connor');
  const [newSprint, setNewSprint] = useState('Sprint 24');
  const [newDueDate, setNewDueDate] = useState('2026-07-25');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newIssue: Issue = {
      id: `OMNI-${100 + issues.length + 1}`,
      title: newTitle,
      desc: newDesc || 'No details provided.',
      status: 'Todo',
      priority: newPriority,
      label: newLabel,
      assignee: newAssignee,
      sprint: newSprint,
      dueDate: newDueDate
    };

    setIssues([newIssue, ...issues]);
    
    // Reset
    setNewTitle('');
    setNewDesc('');
    setNewPriority('High');
    setNewLabel('Bug');
    setNewAssignee('Sarah Connor');
    setNewDueDate('2026-07-25');
    setShowCreateModal(false);
  };

  const handleAISuggestSummary = () => {
    if (!newTitle) return;
    setIsGeneratingAI(true);
    setTimeout(() => {
      setNewDesc(`[AI-GENERATED TASK SPECIFICATION]
OBJECTIVE: Securely implement and resolve issues related to "${newTitle}".

TECHNICAL INSIGHT:
- Context: Potential security risk or architectural bottleneck discovered during routine AST repository analysis.
- Scope: Audit the affected endpoints, ensure parameter sanitization, and confirm unit test coverage reaches >90%.
- Acceptance Criteria:
  1. No secrets exposed in configuration file.
  2. Memory buffers cleanly flushed on thread exit.
  3. Validate performance meets <100ms latency SLAs under 500 parallel queries.`);
      setIsGeneratingAI(false);
    }, 900);
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = 
      issue.title.toLowerCase().includes(search.toLowerCase()) || 
      issue.id.toLowerCase().includes(search.toLowerCase()) ||
      issue.desc.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || issue.priority === priorityFilter;
    const matchesLabel = labelFilter === 'All' || issue.label === labelFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesLabel;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg-dark-950 text-slate-200 p-6 space-y-6 overflow-y-auto">
      {/* Top action block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Bug & Issue Tracker
          </h1>
          <p className="text-xs text-slate-400">
            Monitor bugs, security tickets, sprint items, and task priorities for the engineering team.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 font-bold text-xs rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Security Issue
        </button>
      </div>

      {/* Filters & search panel */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-bg-dark-900 border border-white/5 p-4 rounded-xl">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input 
            type="text"
            placeholder="Search issues, text, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-brand-cyan transition-all"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan transition-all"
          >
            <option value="All">All Statuses</option>
            <option value="Backlog">Backlog</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="QA/Review">QA / In Review</option>
            <option value="Done">Done</option>
          </select>
        </div>

        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan transition-all"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <select
            value={labelFilter}
            onChange={(e) => setLabelFilter(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan transition-all"
          >
            <option value="All">All Labels</option>
            <option value="Bug">Bug</option>
            <option value="Security">Security</option>
            <option value="Feature">Feature</option>
            <option value="Enhancement">Enhancement</option>
            <option value="Refactor">Refactor</option>
          </select>
        </div>
      </div>

      {/* Issues Table list */}
      <div className="bg-bg-dark-900 border border-white/5 rounded-xl overflow-hidden shadow-inner">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th className="py-3 px-4 w-24">Issue Key</th>
                <th className="py-3 px-4">Summary</th>
                <th className="py-3 px-4 w-28">Status</th>
                <th className="py-3 px-4 w-28">Priority</th>
                <th className="py-3 px-4 w-28">Label</th>
                <th className="py-3 px-4 w-32">Assignee</th>
                <th className="py-3 px-4 w-32">Due Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono">
                    No matching issue tickets detected in this sprint window.
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue) => (
                  <tr key={issue.id} className="hover:bg-white/[0.01] transition-all group">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-400 group-hover:text-brand-cyan transition-colors">
                      {issue.id}
                    </td>
                    <td className="py-3.5 px-4 space-y-1">
                      <span className="font-bold text-white block group-hover:text-brand-cyan transition-colors">{issue.title}</span>
                      <span className="text-[11px] text-slate-400 block line-clamp-1 leading-relaxed">{issue.desc}</span>
                      <span className="inline-block text-[9px] bg-slate-800 text-slate-400 font-semibold px-1.5 py-0.5 rounded border border-white/5">
                        {issue.sprint}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        issue.status === 'Done'
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : issue.status === 'In Progress'
                          ? 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
                          : issue.status === 'QA/Review'
                          ? 'bg-brand-purple/10 text-brand-purple-light border-brand-purple/20'
                          : 'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${
                          issue.status === 'Done' ? 'bg-green-400' : issue.status === 'In Progress' ? 'bg-brand-cyan' : 'bg-brand-purple-light'
                        }`} />
                        {issue.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 font-bold text-[10.5px] ${
                        issue.priority === 'Critical' 
                          ? 'text-red-400' 
                          : issue.priority === 'High' 
                          ? 'text-amber-400' 
                          : 'text-slate-400'
                      }`}>
                        {issue.priority === 'Critical' && <AlertTriangle className="w-3.5 h-3.5 text-red-400" />}
                        {issue.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                        issue.label === 'Security'
                          ? 'bg-red-950/40 text-red-400 border-red-500/20'
                          : issue.label === 'Bug'
                          ? 'bg-amber-950/40 text-amber-400 border-amber-500/20'
                          : 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20'
                      }`}>
                        {issue.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-medium">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-mono text-[9px] text-slate-400 font-black">
                          {issue.assignee[0]}
                        </div>
                        <span className="truncate max-w-28">{issue.assignee}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                      {issue.dueDate}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal Box */}
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
              className="relative bg-bg-dark-900 border border-white/10 rounded-xl max-w-2xl w-full p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-brand-cyan" />
                  Create Security Issue Ticket
                </h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateIssue} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Issue Title</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. CSRF injection point in API router"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1.5 relative">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Issue Specifications</label>
                    <button
                      type="button"
                      onClick={handleAISuggestSummary}
                      disabled={!newTitle || isGeneratingAI}
                      className={`text-[9.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 px-2 py-0.5 rounded border transition-all ${
                        !newTitle 
                          ? 'text-slate-600 border-white/5 cursor-not-allowed bg-transparent' 
                          : 'text-brand-purple-light border-brand-purple-light/20 bg-brand-purple/5 hover:bg-brand-purple/15'
                      }`}
                    >
                      <Sparkles className={`w-3 h-3 ${isGeneratingAI ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingAI ? 'OminiCode drafting...' : 'AI Generate Spec'}</span>
                    </button>
                  </div>
                  <textarea 
                    rows={4}
                    placeholder="Specify the technical steps to reproduce, codebase paths, code lines, or expected criteria..."
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan placeholder-slate-600 font-mono leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Priority</label>
                    <select
                      value={newPriority}
                      onChange={(e) => setNewPriority(e.target.value as any)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="Critical">🔥 Critical</option>
                      <option value="High">⚠️ High</option>
                      <option value="Medium">⚡ Medium</option>
                      <option value="Low">🌱 Low</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Label</label>
                    <select
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value as any)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="Bug">Bug</option>
                      <option value="Security">Security Warning</option>
                      <option value="Feature">Feature Request</option>
                      <option value="Enhancement">Enhancement</option>
                      <option value="Refactor">Refactoring Item</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Sprint Window</label>
                    <select
                      value={newSprint}
                      onChange={(e) => setNewSprint(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="Sprint 24">Sprint 24 (Current)</option>
                      <option value="Sprint 25">Sprint 25 (Next)</option>
                      <option value="Backlog">Product Backlog</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Assignee</label>
                    <select
                      value={newAssignee}
                      onChange={(e) => setNewAssignee(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="Sarah Connor">Sarah Connor (Security Team)</option>
                      <option value="Alex Mercer">Alex Mercer (Lead Frontend)</option>
                      <option value="Elena Rostova">Elena Rostova (DevOps Engineer)</option>
                      <option value="Marcus Vance">Marcus Vance (QA Auditor)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Due Date</label>
                    <input 
                      type="date"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
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
                    Register Issue
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
