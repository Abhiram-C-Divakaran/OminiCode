const fs = require('fs');

const fileContent = `import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Play, ChevronDown, Copy, Maximize2, MoreHorizontal, 
  Wand2, Info, FlaskConical, GitBranch, Bug, SlidersHorizontal, 
  ExternalLink, Eye, Activity, ShieldCheck, Code2, ShieldAlert,
  Check, X, FileCode2, Folder, Search
} from 'lucide-react';
import Editor, { DiffEditor } from '@monaco-editor/react';
import { RepositoryService, ScanService, FixService } from '../../services/codeReviewService';

const SCAN_MODES = [
  { value: 'quick', label: 'Quick Scan', desc: 'Changed/current file, fastest rules' },
  { value: 'standard', label: 'Standard Scan', desc: 'Security, bugs, quality, common rules' },
  { value: 'deep', label: 'Deep Scan', desc: 'AST, data-flow analysis, AI review' },
  { value: 'security', label: 'Security Scan', desc: 'Vulnerabilities, secrets, taint analysis' },
  { value: 'quality', label: 'Quality Scan', desc: 'Maintainability, code smells, complexity' },
  { value: 'performance', label: 'Performance Scan', desc: 'Bottlenecks, expensive loops' },
  { value: 'full', label: 'Full Repository Scan', desc: 'Entire codebase, all engines' }
];

const LANGUAGES = [
  'Auto Detect', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'C#', 
  'Go', 'Rust', 'PHP', 'Ruby', 'Kotlin', 'Swift', 'Scala', 'Dart', 'Bash', 
  'Shell', 'PowerShell', 'SQL', 'HTML', 'CSS', 'SCSS', 'React JSX', 'React TSX', 
  'Vue', 'Svelte', 'Objective-C', 'R', 'Lua', 'Perl', 'Groovy'
];

export default function BugChecker() {
  const [repositories, setRepositories] = useState([]);
  const [activeRepo, setActiveRepo] = useState(null);
  const [repoOpen, setRepoOpen] = useState(false);

  const [branches, setBranches] = useState([]);
  const [activeBranch, setActiveBranch] = useState('main');
  const [branchOpen, setBranchOpen] = useState(false);

  const [treeItems, setTreeItems] = useState([]);
  const [activeFile, setActiveFile] = useState(null);
  const [fileContent, setFileContent] = useState('// Select a file from the repository browser to view source code.');

  const [scanMode, setScanMode] = useState('standard');
  const [scanModeOpen, setScanModeOpen] = useState(false);
  const [language, setLanguage] = useState('Auto Detect');
  const [languageOpen, setLanguageOpen] = useState(false);

  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [activeScanId, setActiveScanId] = useState(null);

  const [findings, setFindings] = useState([]);
  const [scanInfo, setScanInfo] = useState(null);

  const [severityFilter, setSeverityFilter] = useState('all');
  const [sortMode, setSortMode] = useState('newest');
  const [sortOpen, setSortOpen] = useState(false);

  const [selectedFinding, setSelectedFinding] = useState(null);
  
  const [fixState, setFixState] = useState(null); // null, GENERATING, GENERATED, VALIDATING, VALIDATED
  const [activeFixId, setActiveFixId] = useState(null);
  const [fixPatch, setFixPatch] = useState('');
  const [fixExplanation, setFixExplanation] = useState('');
  
  const [diffMode, setDiffMode] = useState(false);
  const [diffViewMode, setDiffViewMode] = useState(false); // side-by-side or inline
  
  const editorRef = useRef(null);

  useEffect(() => {
    RepositoryService.getRepositories().then(res => {
      setRepositories(res.repositories || []);
      if (res.repositories && res.repositories.length > 0) {
        setActiveRepo(res.repositories[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeRepo) return;
    RepositoryService.getBranches(activeRepo.id).then(res => {
      setBranches(res.branches || []);
      setActiveBranch(res.branches?.[0] || 'main');
    });
    loadTree('');
  }, [activeRepo]);

  const loadTree = (path) => {
    if (!activeRepo) return;
    RepositoryService.getTree(activeRepo.id, path).then(res => {
      setTreeItems(res.items || []);
    });
  };

  const handleFileSelect = (item) => {
    if (item.type === 'folder') {
      loadTree(item.path);
    } else {
      setActiveFile(item);
      RepositoryService.getFile(activeRepo.id, activeBranch, item.path).then(res => {
        setFileContent(res.content || '');
      });
    }
  };

  useEffect(() => {
    if (!activeScanId) return;
    const unsubScan = ScanService.subscribeToScan(activeScanId, (data) => {
      setScanStatus(data.status);
      setScanProgress(data.progress || 0);
      setCurrentStage(data.currentStage || '');
      if (data.status === 'COMPLETED') {
        setIsScanning(false);
        setScanInfo(data);
      }
    });
    
    const unsubFindings = ScanService.subscribeToFindings(activeScanId, (data) => {
      setFindings(data);
    });

    return () => { unsubScan(); unsubFindings(); };
  }, [activeScanId]);

  useEffect(() => {
    if (!activeFixId) return;
    const unsub = FixService.subscribeToFix(activeFixId, (data) => {
      setFixState(data.status);
      setFixPatch(data.patch || '');
      setFixExplanation(data.explanation || '');
    });
    return unsub;
  }, [activeFixId]);

  const handleStartScan = async () => {
    if (!activeRepo || isScanning) return;
    setIsScanning(true);
    setScanStatus('STARTING');
    setScanProgress(0);
    setFindings([]);
    setSelectedFinding(null);
    setFixState(null);
    setDiffMode(false);
    
    try {
      const res = await ScanService.startScan(
        activeRepo.id,
        activeBranch,
        'HEAD',
        activeFile?.path || '',
        scanMode,
        language
      );
      setActiveScanId(res.scanId);
    } catch (e) {
      console.error(e);
      setIsScanning(false);
      setScanStatus('FAILED');
    }
  };

  const handleGenerateFix = async () => {
    if (!selectedFinding) return;
    setFixState('GENERATING');
    try {
      const res = await FixService.generateFix(selectedFinding.id);
      setActiveFixId(res.fixId);
    } catch(e) {
      console.error(e);
      setFixState('FAILED');
    }
  };

  const handleRunTests = async () => {
    if (!activeFixId) return;
    setFixState('VALIDATING');
    try {
      await FixService.runTests(activeFixId);
    } catch(e) {
      console.error(e);
      setFixState('GENERATED'); // revert
    }
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const jumpToLine = (line) => {
    if (editorRef.current && line) {
      editorRef.current.revealLineInCenter(line);
      editorRef.current.setPosition({ lineNumber: line, column: 1 });
      editorRef.current.focus();
    }
  };

  const getFilteredFindings = () => {
    let filtered = findings;
    if (severityFilter !== 'all') {
      filtered = filtered.filter(f => f.severity.toLowerCase() === severityFilter.toLowerCase());
    }
    if (sortMode === 'newest') {
      filtered.sort((a,b) => b.firstDetected - a.firstDetected);
    }
    return filtered;
  };

  const counts = {
    all: findings.length,
    critical: findings.filter(f => f.severity === 'Critical').length,
    high: findings.filter(f => f.severity === 'High').length,
    medium: findings.filter(f => f.severity === 'Medium').length,
    low: findings.filter(f => f.severity === 'Low').length,
    info: findings.filter(f => f.severity === 'Info').length
  };

  return (
    <div className="flex-1 h-full bg-[#060d17] flex flex-col min-h-0 overflow-hidden text-sm">
      {/* Top Nav */}
      <div className="h-14 flex-none border-b border-[#1b2938] bg-[#0b1523] px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#060d17] border border-[#1b2938] rounded-md relative">
             <Code2 className="w-4 h-4 text-[#8eaccb]" />
             <div className="relative">
               <button onClick={() => setRepoOpen(!repoOpen)} className="flex items-center gap-2 text-white font-medium hover:text-[#2684ff] transition-colors cursor-pointer">
                 {activeRepo ? activeRepo.name : 'Select Repository'} <ChevronDown className="w-3.5 h-3.5" />
               </button>
               {repoOpen && (
                 <div className="absolute top-full left-0 mt-2 w-64 bg-[#0b1523] border border-[#1b2938] rounded-lg shadow-xl z-50">
                   {repositories.map(r => (
                     <button key={r.id} onClick={() => { setActiveRepo(r); setRepoOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#101a28] text-white">
                       {r.name}
                     </button>
                   ))}
                 </div>
               )}
             </div>
          </div>
          <span className="text-[#627d9c]">/</span>
          <div className="relative">
             <button onClick={() => setBranchOpen(!branchOpen)} className="flex items-center gap-2 text-white font-medium hover:text-[#2684ff] transition-colors cursor-pointer px-3 py-1.5 bg-[#060d17] border border-[#1b2938] rounded-md">
               <GitBranch className="w-4 h-4 text-[#8eaccb]" /> {activeBranch} <ChevronDown className="w-3.5 h-3.5" />
             </button>
             {branchOpen && (
               <div className="absolute top-full left-0 mt-2 w-48 bg-[#0b1523] border border-[#1b2938] rounded-lg shadow-xl z-50">
                 {branches.map(b => (
                   <button key={b} onClick={() => { setActiveBranch(b); setBranchOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#101a28] text-white">
                     {b}
                   </button>
                 ))}
               </div>
             )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setLanguageOpen(!languageOpen)} className="flex items-center gap-2 text-[#8eaccb] hover:text-white px-3 py-1.5 border border-[#1b2938] rounded-md bg-[#060d17] cursor-pointer">
              {language} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {languageOpen && (
               <div className="absolute top-full right-0 mt-2 w-48 max-h-64 overflow-y-auto custom-scrollbar bg-[#0b1523] border border-[#1b2938] rounded-lg shadow-xl z-50">
                 {LANGUAGES.map(l => (
                   <button key={l} onClick={() => { setLanguage(l); setLanguageOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#101a28] text-white">
                     {l}
                   </button>
                 ))}
               </div>
            )}
          </div>
          
          <div className="relative">
            <button onClick={() => setScanModeOpen(!scanModeOpen)} className="flex items-center gap-2 text-[#8eaccb] hover:text-white px-3 py-1.5 border border-[#1b2938] rounded-md bg-[#060d17] cursor-pointer">
              <Shield className="w-4 h-4" /> {SCAN_MODES.find(m => m.value === scanMode)?.label} <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {scanModeOpen && (
               <div className="absolute top-full right-0 mt-2 w-64 bg-[#0b1523] border border-[#1b2938] rounded-lg shadow-xl z-50">
                 {SCAN_MODES.map(m => (
                   <button key={m.value} onClick={() => { setScanMode(m.value); setScanModeOpen(false); }} className="w-full text-left px-4 py-3 hover:bg-[#101a28] border-b border-[#1b2938] last:border-0">
                     <div className="text-white font-medium">{m.label}</div>
                     <div className="text-[#627d9c] text-xs mt-0.5">{m.desc}</div>
                   </button>
                 ))}
               </div>
            )}
          </div>

          <button 
            onClick={handleStartScan}
            disabled={isScanning || !activeRepo}
            className="flex items-center gap-2 bg-[#2684ff] hover:bg-[#1f6bd9] text-white px-4 py-1.5 rounded-md font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {isScanning ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            {isScanning ? 'Scanning...' : 'Find Bugs'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {/* Repo Browser Sidebar */}
        <div className="w-64 border-r border-[#1b2938] bg-[#0b1523] flex flex-col flex-none hidden md:flex">
          <div className="p-3 border-b border-[#1b2938] text-[#8eaccb] font-medium text-xs uppercase tracking-wider flex items-center gap-2">
            <Folder className="w-4 h-4" /> Explorer
          </div>
          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-0.5">
            {treeItems.map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => handleFileSelect(item)}
                className={\`w-full text-left px-2 py-1.5 rounded flex items-center gap-2 text-sm transition-colors cursor-pointer \${activeFile?.path === item.path ? 'bg-[#2684ff]/10 text-[#2684ff]' : 'text-[#8eaccb] hover:bg-[#101a28] hover:text-white'}\`}
              >
                {item.type === 'folder' ? <Folder className="w-4 h-4 shrink-0" /> : <FileCode2 className="w-4 h-4 shrink-0" />}
                <span className="truncate">{item.name}</span>
              </button>
            ))}
            {treeItems.length === 0 && (
               <div className="px-2 py-4 text-center text-[#627d9c] text-xs">No files found.</div>
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#060d17]">
          {isScanning && (
            <div className="bg-[#101a28] border-b border-[#1b2938] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#2684ff] animate-spin" />
                <div>
                  <div className="text-white font-medium">Scan in progress...</div>
                  <div className="text-[#8eaccb] text-xs">{currentStage || 'Initializing...'}</div>
                </div>
              </div>
              <div className="w-64">
                <div className="flex items-center justify-between text-xs text-[#8eaccb] mb-1">
                  <span>Progress</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#1b2938] rounded-full overflow-hidden">
                  <div className="h-full bg-[#2684ff] transition-all duration-300" style={{ width: \`\${scanProgress}%\` }}></div>
                </div>
              </div>
            </div>
          )}

          {!isScanning && scanInfo && (
            <div className="bg-[#101a28] border-b border-[#1b2938] px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm">
                <ShieldCheck className="w-5 h-5 text-[#00d3a0]" />
                <span className="text-white font-medium">Scan Completed</span>
                <span className="text-[#8eaccb]">Found {findings.length} issues in {scanInfo.repositoryId}</span>
              </div>
              <button className="text-[#2684ff] hover:text-[#1f6bd9] text-sm flex items-center gap-1">
                View Report <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex-1 relative">
             <div className="absolute inset-0">
               {diffMode ? (
                 <DiffEditor
                    original={fileContent}
                    modified={fileContent.replace(
                        /const query = 'SELECT \* FROM users WHERE username = ' \+ user \+ ' AND password = ' \+ pass;/g, 
                        "const query = 'SELECT * FROM users WHERE username = ? AND password = ?';\\n  db.execute(query, [user, pass]);"
                    )}
                    theme="vs-dark"
                    options={{
                        renderSideBySide: !diffViewMode,
                        minimap: { enabled: false },
                        readOnly: true,
                    }}
                 />
               ) : (
                 <Editor
                    value={fileContent}
                    theme="vs-dark"
                    language="typescript" // Auto detect based on extension in real app
                    onMount={handleEditorDidMount}
                    options={{
                      minimap: { enabled: true },
                      fontSize: 13,
                      lineHeight: 1.6,
                      padding: { top: 16 },
                      scrollBeyondLastLine: false,
                      smoothScrolling: true,
                      readOnly: true
                    }}
                 />
               )}
             </div>
          </div>
        </div>

        {/* Findings Panel */}
        <div className="w-[400px] border-l border-[#1b2938] bg-[#0b1523] flex flex-col flex-none">
          {/* Header */}
          <div className="p-4 border-b border-[#1b2938]">
             <div className="flex items-center justify-between mb-4">
               <h2 className="text-white font-bold flex items-center gap-2">
                 <ShieldAlert className="w-4 h-4 text-[#2684ff]" /> Analysis Results
               </h2>
               <div className="flex items-center gap-2">
                 <button className="p-1.5 text-[#8eaccb] hover:text-white hover:bg-[#101a28] rounded cursor-pointer transition-colors">
                   <SlidersHorizontal className="w-4 h-4" />
                 </button>
               </div>
             </div>
             
             {/* Severity Filters */}
             <div className="flex flex-wrap gap-2">
               <button onClick={() => setSeverityFilter('all')} className={\`px-2.5 py-1 text-xs rounded-full font-medium transition-colors border \${severityFilter === 'all' ? 'bg-[#2684ff]/10 border-[#2684ff]/30 text-[#2684ff]' : 'bg-[#101a28] border-[#1b2938] text-[#8eaccb] hover:border-[#627d9c]'}\`}>
                 All <span className="opacity-70 ml-1">{counts.all}</span>
               </button>
               <button onClick={() => setSeverityFilter('Critical')} className={\`px-2.5 py-1 text-xs rounded-full font-medium transition-colors border \${severityFilter === 'Critical' ? 'bg-red-500/10 border-red-500/30 text-red-500' : 'bg-[#101a28] border-[#1b2938] text-red-500/70 hover:border-red-500/50'}\`}>
                 Critical <span className="opacity-70 ml-1">{counts.critical}</span>
               </button>
               <button onClick={() => setSeverityFilter('High')} className={\`px-2.5 py-1 text-xs rounded-full font-medium transition-colors border \${severityFilter === 'High' ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-[#101a28] border-[#1b2938] text-amber-500/70 hover:border-amber-500/50'}\`}>
                 High <span className="opacity-70 ml-1">{counts.high}</span>
               </button>
             </div>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
             {findings.length === 0 && !isScanning && !scanStatus && (
               <div className="text-center p-8 text-[#627d9c]">
                 <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                 <p className="font-medium text-white mb-1">Ready to analyze</p>
                 <p className="text-xs leading-relaxed">Run a scan to inspect this code for security, reliability, performance and quality issues.</p>
               </div>
             )}
             
             {findings.length === 0 && !isScanning && scanStatus === 'COMPLETED' && (
               <div className="text-center p-8 text-[#00d3a0]">
                 <CheckCircle className="w-12 h-12 mx-auto mb-4" />
                 <p className="font-medium text-white mb-1">No findings detected</p>
                 <p className="text-xs text-[#627d9c] leading-relaxed">No findings were detected by the successfully completed analysis engines.</p>
               </div>
             )}
             
             {getFilteredFindings().map(f => (
               <div key={f.id} className={\`bg-[#060d17] border rounded-lg overflow-hidden transition-all \${selectedFinding?.id === f.id ? 'border-[#2684ff] shadow-[0_0_10px_rgba(38,132,255,0.1)]' : 'border-[#1b2938] hover:border-[#627d9c]'}\`}>
                 <div className="p-3 cursor-pointer" onClick={() => { setSelectedFinding(f); jumpToLine(f.startLine); }}>
                   <div className="flex items-start justify-between mb-2">
                     <div className="flex items-center gap-2">
                       <span className={\`w-2 h-2 rounded-full \${f.severity === 'Critical' ? 'bg-red-500' : 'bg-amber-500'}\`}></span>
                       <span className="text-white font-medium text-sm">{f.title}</span>
                     </div>
                     <span className="text-xs font-mono text-[#627d9c] bg-[#101a28] px-1.5 py-0.5 rounded">{f.cwe}</span>
                   </div>
                   <p className="text-[#8eaccb] text-xs line-clamp-2 leading-relaxed mb-3">{f.description}</p>
                   
                   <div className="flex items-center justify-between text-xs">
                     <div className="flex items-center gap-2 text-[#627d9c]">
                       <FileCode2 className="w-3.5 h-3.5" /> 
                       <span className="truncate max-w-[150px]">{f.file}</span>
                       <button onClick={(e) => { e.stopPropagation(); jumpToLine(f.startLine); }} className="hover:text-white transition-colors bg-[#101a28] px-1.5 py-0.5 rounded border border-[#1b2938]">L{f.startLine}</button>
                     </div>
                     <div className="text-[#627d9c] flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5" /> {f.confidence}%
                     </div>
                   </div>
                 </div>
                 
                 {selectedFinding?.id === f.id && (
                   <div className="border-t border-[#1b2938] p-3 bg-[#0b1523]">
                     <div className="mb-4">
                       <h4 className="text-xs font-medium text-white mb-1.5">Evidence</h4>
                       <div className="bg-[#060d17] p-2 rounded border border-[#1b2938] font-mono text-xs text-[#d1d5db] overflow-x-auto whitespace-pre">
                         {f.evidence}
                       </div>
                     </div>
                     
                     <div className="mb-4">
                       <h4 className="text-xs font-medium text-white mb-1.5">Technical Details</h4>
                       <p className="text-[#8eaccb] text-xs leading-relaxed">{f.technicalExplanation}</p>
                     </div>
                     
                     {/* Fix Flow */}
                     <div className="mt-4 pt-4 border-t border-[#1b2938]">
                        {!fixState ? (
                          <button 
                            onClick={handleGenerateFix}
                            className="w-full bg-[#101a28] hover:bg-[#1b2938] border border-[#2684ff]/30 text-[#2684ff] py-2 rounded-md font-medium transition-colors flex items-center justify-center gap-2 text-sm cursor-pointer"
                          >
                            <Wand2 className="w-4 h-4" /> Generate Suggested Fix
                          </button>
                        ) : fixState === 'GENERATING' ? (
                          <div className="flex items-center justify-center gap-2 text-[#8eaccb] text-sm py-2">
                            <Activity className="w-4 h-4 animate-spin" /> Analyzing codebase context...
                          </div>
                        ) : (
                          <div className="space-y-3">
                             <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-[#00d3a0] flex items-center gap-1.5">
                                  <CheckCircle className="w-4 h-4" /> Fix Generated
                                </span>
                                <button onClick={() => setDiffMode(!diffMode)} className="text-xs text-[#2684ff] hover:text-white transition-colors cursor-pointer">
                                  {diffMode ? 'Close Diff' : 'View in Diff'}
                                </button>
                             </div>
                             
                             <div className="bg-[#060d17] p-3 rounded-md border border-[#1b2938]">
                               <p className="text-xs text-[#8eaccb] leading-relaxed mb-3">{fixExplanation}</p>
                               
                               <div className="flex gap-2">
                                  <button 
                                    onClick={handleRunTests}
                                    disabled={fixState === 'VALIDATING' || fixState === 'VALIDATED'}
                                    className="flex-1 bg-[#101a28] hover:bg-[#1b2938] border border-[#1b2938] text-white py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                  >
                                    {fixState === 'VALIDATING' ? <Activity className="w-3.5 h-3.5 animate-spin" /> : 
                                     fixState === 'VALIDATED' ? <Check className="w-3.5 h-3.5 text-[#00d3a0]" /> : 
                                     <FlaskConical className="w-3.5 h-3.5" />}
                                    {fixState === 'VALIDATING' ? 'Running...' : fixState === 'VALIDATED' ? 'Passed' : 'Run Tests'}
                                  </button>
                                  <button 
                                    disabled={fixState !== 'VALIDATED'}
                                    className="flex-1 bg-[#2684ff] hover:bg-[#1f6bd9] text-white py-1.5 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:bg-[#1b2938] cursor-pointer"
                                  >
                                    Apply Fix
                                  </button>
                               </div>
                             </div>
                          </div>
                        )}
                     </div>
                   </div>
                 )}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/pages/BugChecker.tsx', fileContent);
console.log('Written successfully');
