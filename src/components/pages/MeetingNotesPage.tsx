import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Calendar, 
  Clock, 
  Users, 
  Award, 
  Share2, 
  FileEdit,
  ClipboardCheck,
  Zap,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MeetingNote {
  id: string;
  title: string;
  date: string;
  attendees: string[];
  rawNotes: string;
  summary: string;
  actionItems: { text: string; done: boolean }[];
  decisions: string[];
  category: 'Sprint Planning' | 'Daily Standup' | 'Architecture Sync' | 'Security Triage';
}

const INITIAL_NOTES: MeetingNote[] = [
  {
    id: 'MTG-041',
    title: 'WyrmSentry v2.0 Scope Alignment',
    date: '2026-07-16',
    attendees: ['Alex Mercer', 'Sarah Connor', 'You', 'Marcus Vance'],
    rawNotes: 'Discussing the database schema design. Sarah is concerned about open port vulnerability vectors. Marcus requests to ensure the UI supports high-density charts for DevOps monitoring. We decided to use standard PostgreSQL in the cloud and bind ports strictly to container interfaces.',
    summary: 'The engineering team aligned on the architectural roadmap for the WyrmSentry v2.0 platform. Identified security hardening vectors and integrated DevOps log terminals to secure backend configurations.',
    actionItems: [
      { text: 'Bind cloud PostgreSQL instance to container interfaces strictly', done: true },
      { text: 'Implement high-density Chart widgets in DevOps workspace', done: false }
    ],
    decisions: [
      'Use production PostgreSQL on Cloud Run container deployment structures.',
      'Enforce SSL parameter encryption for all database connections.'
    ],
    category: 'Architecture Sync'
  },
  {
    id: 'MTG-045',
    title: 'Post-Mortem: OAuth Redirect Flaw',
    date: '2026-07-14',
    attendees: ['Sarah Connor', 'Marcus Vance'],
    rawNotes: 'Discovered that unsanitized URL redirect patterns in Auth Provider could leak session tokens. Immediate fix is to add regex whitelist mapping. Review complete and merged.',
    summary: 'Conducted a deep review of the open redirect warning identified by DracoScanner. Implemented string pattern validators to secure oauth redirect endpoints.',
    actionItems: [
      { text: 'Add redirect URL regex check to production environments', done: true },
      { text: 'Draft secure oauth redirection guidelines in documentation wiki', done: true }
    ],
    decisions: [
      'Reject all absolute URLs in auth redirection unless explicitly whitelisted in env.'
    ],
    category: 'Security Triage'
  }
];

export default function MeetingNotesPage() {
  const [notes, setNotes] = useState<MeetingNote[]>(INITIAL_NOTES);
  const [activeNote, setActiveNote] = useState<MeetingNote | null>(INITIAL_NOTES[0]);
  
  // Note creation inputs
  const [newTitle, setNewTitle] = useState('');
  const [newRaw, setNewRaw] = useState('');
  const [newAttendees, setNewAttendees] = useState('Alex Mercer, Sarah Connor, You');
  const [newCategory, setNewCategory] = useState<MeetingNote['category']>('Sprint Planning');
  const [isSummarising, setIsSummarising] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const freshNote: MeetingNote = {
      id: `MTG-0${40 + notes.length + 1}`,
      title: newTitle,
      date: new Date().toISOString().split('T')[0],
      attendees: newAttendees.split(',').map(s => s.trim()).filter(Boolean),
      rawNotes: newRaw,
      summary: '',
      actionItems: [],
      decisions: [],
      category: newCategory
    };

    setNotes([freshNote, ...notes]);
    setActiveNote(freshNote);
    
    // Clear inputs
    setNewTitle('');
    setNewRaw('');
    setNewCategory('Sprint Planning');
    setShowCreateModal(false);
  };

  const handleAISummarise = (noteId: string) => {
    setIsSummarising(true);
    setTimeout(() => {
      setNotes(prev => prev.map(note => {
        if (note.id !== noteId) return note;

        const summaryText = `[AI-GENERATED EXECUTIVE BULLETIN]
During this "${note.category}" sync, the engineering team formulated actions to execute and protect target goals:

- Contextual Summary: High-priority code issues were prioritized. Discussed resource efficiency pipelines and verified current system dependencies.`;

        const autoActionItems = [
          { text: `Complete architectural task list drafted in "${note.title}"`, done: false },
          { text: `Incorporate AI patch recommendations into next build run`, done: false }
        ];

        const autoDecisions = [
          `Approved technical approach drafted during the meeting.`,
          `Set milestone target to match standard code safety compliance parameters.`
        ];

        const updated = {
          ...note,
          summary: summaryText,
          actionItems: autoActionItems,
          decisions: autoDecisions
        };

        if (activeNote && activeNote.id === noteId) {
          setActiveNote(updated);
        }

        return updated;
      }));
      setIsSummarising(false);
    }, 1100);
  };

  const handleToggleActionItem = (noteId: string, idx: number) => {
    setNotes(prev => prev.map(note => {
      if (note.id !== noteId) return note;
      const updatedActions = [...note.actionItems];
      updatedActions[idx].done = !updatedActions[idx].done;
      const updated = { ...note, actionItems: updatedActions };
      if (activeNote && activeNote.id === noteId) {
        setActiveNote(updated);
      }
      return updated;
    }));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg-dark-950 text-slate-200 p-6 space-y-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-cyan" />
            Meeting Notes & AI Summarizer
          </h1>
          <p className="text-xs text-slate-400">
            Write daily sync agendas, architectural logs, and use AI to extract action plans and decisions.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-cyan text-slate-950 hover:bg-brand-cyan/90 font-bold text-xs rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Meeting Notes
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: List of notes */}
        <div className="lg:col-span-4 bg-bg-dark-900 border border-white/5 rounded-2xl p-4 space-y-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block border-b border-white/5 pb-2">Meeting Logs timeline</span>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {notes.map(note => {
              const isActive = activeNote?.id === note.id;
              return (
                <button
                  key={note.id}
                  onClick={() => setActiveNote(note)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer block relative ${
                    isActive 
                      ? 'bg-brand-cyan/5 border-brand-cyan/25 shadow-[0_0_15px_rgba(0,212,255,0.05)]' 
                      : 'bg-black/20 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9.5px] font-mono font-bold text-slate-500">{note.id}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded border border-white/5 font-mono">{note.category}</span>
                  </div>
                  <span className={`font-bold text-xs block truncate mt-1.5 ${isActive ? 'text-white' : 'text-slate-300'}`}>{note.title}</span>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2 font-mono">
                    <Calendar className="w-3 h-3 text-slate-600" />
                    <span>{note.date}</span>
                    <span>•</span>
                    <Users className="w-3 h-3 text-slate-600" />
                    <span>{note.attendees.length} members</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Note Details & AI Summary Box */}
        <div className="lg:col-span-8 bg-bg-dark-900 border border-white/5 rounded-2xl p-6 space-y-6">
          {activeNote ? (
            <div className="space-y-6">
              {/* Note metadata */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <span className="inline-block text-[9px] bg-brand-cyan/15 text-brand-cyan font-bold px-2 py-0.5 rounded border border-brand-cyan/25 font-mono uppercase tracking-wider">{activeNote.category}</span>
                  <h2 className="text-md font-extrabold text-white tracking-tight">{activeNote.title}</h2>
                  <p className="text-[10px] text-slate-400 font-mono">Date: {activeNote.date} | Attendees: {activeNote.attendees.join(', ')}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleAISummarise(activeNote.id)}
                    disabled={isSummarising}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-purple/15 hover:bg-brand-purple/25 border border-brand-purple-light/25 text-brand-purple-light font-bold text-xs rounded-lg transition-all cursor-pointer"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isSummarising ? 'animate-spin' : ''}`} />
                    <span>{isSummarising ? 'Processing Note...' : 'AI Summarize'}</span>
                  </button>
                </div>
              </div>

              {/* Raw Transcript */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Raw Meeting transcripts & Agendas</span>
                <div className="bg-black/30 border border-white/5 rounded-xl p-4 text-xs leading-relaxed text-slate-300 font-mono whitespace-pre-wrap">
                  {activeNote.rawNotes || "No transcript provided yet. Click AI Summarize or write additional outlines."}
                </div>
              </div>

              {/* AI Bulletins & summaries */}
              {activeNote.summary && (
                <div className="space-y-5 border-t border-white/5 pt-5">
                  <div className="bg-brand-purple/5 border border-brand-purple-light/15 rounded-xl p-4.5 space-y-4">
                    <div className="flex items-center gap-1.5 text-xs text-brand-purple-light font-bold">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>AEGIS AI BULLETIN EXTRACTOR</span>
                    </div>

                    <div className="text-xs text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                      {activeNote.summary}
                    </div>

                    {/* Action Items List */}
                    {activeNote.actionItems.length > 0 && (
                      <div className="space-y-2 border-t border-white/5 pt-4">
                        <span className="text-[10.5px] uppercase font-extrabold tracking-wider text-slate-400 block flex items-center gap-1">
                          <ClipboardCheck className="w-3.5 h-3.5 text-green-400" />
                          Action Items Check-off
                        </span>
                        <div className="space-y-1.5">
                          {activeNote.actionItems.map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleToggleActionItem(activeNote.id, idx)}
                              className="w-full text-left flex items-start gap-2 text-xs py-1 text-slate-300 hover:text-white transition-all cursor-pointer"
                            >
                              <span className={`w-4 h-4 rounded border mt-0.5 flex-shrink-0 flex items-center justify-center transition-all ${
                                item.done ? 'bg-green-500/20 border-green-400 text-green-400' : 'border-white/20 hover:border-brand-cyan'
                              }`}>
                                {item.done && '✓'}
                              </span>
                              <span className={item.done ? 'line-through text-slate-500' : ''}>{item.text}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Decisions log */}
                    {activeNote.decisions.length > 0 && (
                      <div className="space-y-2 border-t border-white/5 pt-4">
                        <span className="text-[10.5px] uppercase font-extrabold tracking-wider text-slate-400 block flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-brand-cyan" />
                          Architectural Decisions Log
                        </span>
                        <ul className="list-disc pl-4 space-y-1.5 text-xs text-slate-300 leading-relaxed">
                          {activeNote.decisions.map((dec, idx) => (
                            <li key={idx} className="marker:text-brand-cyan">{dec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-center text-slate-500 font-mono">
              Select or draft a meeting note to initialize AI insights.
            </div>
          )}
        </div>
      </div>

      {/* Draft Modal */}
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
                  <Bookmark className="w-4 h-4 text-brand-cyan" />
                  New Meeting Agenda Outline
                </h3>
                <button 
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 rotate-45" />
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Meeting Topic</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. CI/CD runner docker container migration"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-cyan placeholder-slate-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Raw Outlines / Developer notes</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="We discussed pipeline build times. Alex claims caching gradle dependencies shaved 4 minutes off production build runs..."
                    value={newRaw}
                    onChange={(e) => setNewRaw(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan placeholder-slate-600 font-mono leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Category</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan"
                    >
                      <option value="Sprint Planning">Sprint Planning</option>
                      <option value="Daily Standup">Daily Standup</option>
                      <option value="Architecture Sync">Architecture Sync</option>
                      <option value="Security Triage">Security Triage</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block">Attendees</label>
                    <input 
                      type="text"
                      placeholder="Alex Mercer, Sarah Connor, You"
                      value={newAttendees}
                      onChange={(e) => setNewAttendees(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan placeholder-slate-600"
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
                    Register Meeting
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
