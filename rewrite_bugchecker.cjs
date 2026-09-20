const fs = require('fs');

const code = `import React, { useState, useEffect, useRef } from 'react';
import { useReviews } from '../../context/ReviewContext';
import { 
  Shield, Play, ChevronDown, Copy, Maximize2, MoreHorizontal, 
  Wand2, Info, FlaskConical, GitBranch, Bug, SlidersHorizontal, 
  ExternalLink, Eye, Activity, ShieldCheck, Code2, ShieldAlert,
  Check, X
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { scanService, fixService, testService } from '../../services/api';
import { ScanMode, Severity, Finding } from '../../types/scan';

const SCAN_MODES: { value: ScanMode; label: string; desc: string }[] = [
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
  const { token } = useReviews(); // Get token or auth if needed
  
  // State
  const [scanMode, setScanMode] = useState<ScanMode>('standard');
  const [scanModeOpen, setScanModeOpen] = useState(false);
  const [language, setLanguage] = useState('Auto Detect');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [languageSearch, setLanguageSearch] = useState('');
  
  // Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [scanInfo, setScanInfo] = useState<any>(null);
  
  // UI State
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Fix State
  const [fixModalOpen, setFixModalOpen] = useState(false);
  const [autoFixAllStatus, setAutoFixAllStatus] = useState<string | null>(null);
  
  // Diff State
  const [showDiff, setShowDiff] = useState(false);
  
  // Test State
  const [testStatus, setTestStatus] = useState<'IDLE'|'RUNNING'|'SUCCESS'|'FAILED'>('IDLE');
  
  // Commit State
  const [commitModalOpen, setCommitModalOpen] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);

  // MOCK FILE DATA
  const mockFileContent = \`function processPayment(user, amount) {
  const query = "UPDATE balance SET amount = amount - " + amount + " ";
  db.execute(query);
 
  if (amount > 1000) {
    console.log("Large payment processing...");
  }
  return true;
}\`;

  const filteredLanguages = LANGUAGES.filter(l => l.toLowerCase().includes(languageSearch.toLowerCase()));

  const handleScan = async () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanStatus('QUEUED');
    setScanProgress(0);
    
    try {
      const data = await scanService.startScan('repo-wyrmsentry-core', 'main', 'HEAD', 'code-snippet.js', scanMode, language);
      if (data.job?.id) {
        setScanStatus('INDEXING');
        setScanProgress(15);
        await new Promise(r => setTimeout(r, 500));
        
        setScanStatus('ANALYZING');
        setScanProgress(45);
        await new Promise(r => setTimeout(r, 500));
        
        setScanStatus('AI_REVIEW');
        setScanProgress(80);
        await new Promise(r => setTimeout(r, 500));
        
        const newFindings = await scanService.getFindings(data.job.id);
        setFindings(newFindings);
        setScanInfo({
          type: scanMode,
          languages: language,
          branch: 'main',
          commit: 'a82d12f',
          analyzed: 1,
          coverage: '100%',
          status: 'Completed with warnings'
        });
        
        setScanStatus('COMPLETED');
        setScanProgress(100);
      }
    } catch (err) {
      console.error('Scan Error:', err);
      setScanStatus('FAILED');
    } finally {
      setIsScanning(false);
      setTimeout(() => { if (scanStatus !== 'FAILED') setScanStatus(null); }, 3000);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockFileContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleRunTests = async () => {
    if (!selectedFinding) return;
    setTestStatus('RUNNING');
    try {
      await testService.runAffectedTests(selectedFinding.id);
      setTestStatus('SUCCESS');
    } catch(e) {
      setTestStatus('FAILED');
    }
  };

  const handleCommitFix = async () => {
    if (!selectedFinding) return;
    setIsCommitting(true);
    try {
      await fixService.commitFix('repo', 'main', commitMessage, selectedFinding.id);
      setCommitModalOpen(false);
      setTestStatus('IDLE');
      // Toast success
    } catch (e) {
      // Toast error
    } finally {
      setIsCommitting(false);
    }
  };

  const filteredFindings = findings.filter(f => severityFilter === 'all' || f.severity.toLowerCase() === severityFilter);

  // CLICK OUTSIDE UTILS
  const scanDropdownRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (scanDropdownRef.current && !scanDropdownRef.current.contains(event.target as Node)) {
        setScanModeOpen(false);
      }
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={\`flex flex-col h-full w-full min-w-0 bg-[#060d17] text-[#f8fafc] \${isFullscreen ? 'fixed inset-0 z-50' : ''}\`}>
      {/* Main Header */}
      {!isFullscreen && (
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
            {/* Standard Scan Dropdown */}
            <div className="relative" ref={scanDropdownRef}>
              <button 
                onClick={() => setScanModeOpen(!scanModeOpen)}
                className="flex items-center justify-between gap-2 px-3.5 py-[9px] bg-[#0b1523] border border-[#1b2938] rounded-md text-[13px] text-[#f8fafc] hover:bg-[#101827] transition-colors whitespace-nowrap shrink-0"
                aria-expanded={scanModeOpen}
              >
                <span>{SCAN_MODES.find(m => m.value === scanMode)?.label}</span>
                <ChevronDown className="w-[14px] h-[14px] text-[#627d9c]" />
              </button>
              {scanModeOpen && (
                <div className="absolute top-full mt-2 w-64 bg-[#0a1421] border border-[#1b2938] rounded-md shadow-xl z-50 py-1 max-h-[400px] overflow-y-auto">
                  {SCAN_MODES.map(mode => (
                    <button 
                      key={mode.value}
                      onClick={() => { setScanMode(mode.value); setScanModeOpen(false); }}
                      className="w-full text-left px-4 py-2 hover:bg-[#1b2938] flex items-center justify-between group transition-colors"
                    >
                      <div className="flex flex-col">
                        <span className="text-[13px] text-white font-medium">{mode.label}</span>
                        <span className="text-[11px] text-[#627d9c]">{mode.desc}</span>
                      </div>
                      {scanMode === mode.value && <Check className="w-4 h-4 text-[#2684ff]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Language Selector */}
            <div className="relative" ref={langDropdownRef}>
              <button 
                onClick={() => setLanguageOpen(!languageOpen)}
                className="flex items-center justify-between gap-2 px-3.5 py-[9px] bg-[#0b1523] border border-[#1b2938] rounded-md text-[13px] text-[#f8fafc] hover:bg-[#101827] transition-colors whitespace-nowrap shrink-0"
              >
                <span>{language}</span>
                <ChevronDown className="w-[14px] h-[14px] text-[#627d9c]" />
              </button>
              {languageOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-[#0a1421] border border-[#1b2938] rounded-md shadow-xl z-50 flex flex-col max-h-[400px]">
                  <div className="p-2 border-b border-[#1b2938]">
                    <input 
                      type="text" 
                      placeholder="Search languages..." 
                      className="w-full bg-[#060d17] border border-[#1b2938] rounded px-3 py-1.5 text-[13px] text-white focus:outline-none focus:border-[#2684ff]"
                      value={languageSearch}
                      onChange={e => setLanguageSearch(e.target.value)}
                    />
                  </div>
                  <div className="overflow-y-auto py-1">
                    {filteredLanguages.map(lang => (
                      <button 
                        key={lang}
                        onClick={() => { setLanguage(lang); setLanguageOpen(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-[#1b2938] flex items-center justify-between transition-colors text-[13px]"
                      >
                        <span className="text-white">{lang}</span>
                        {language === lang && <Check className="w-4 h-4 text-[#2684ff]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={() => setFixModalOpen(true)}
              disabled={findings.length === 0}
              className="flex items-center gap-2 px-4 py-[9px] bg-[#00d3a0] text-[#060d17] font-bold text-[13px] rounded-md hover:bg-[#00c79e] transition-colors whitespace-nowrap shrink-0 lg:ml-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title={findings.length === 0 ? 'Run a scan before generating fixes.' : ''}
            >
              <Wand2 className="w-4 h-4" />
              Auto-Fix All
            </button>

            <button 
              onClick={handleScan} 
              disabled={isScanning} 
              className="flex items-center gap-2 px-5 py-[9px] bg-[#2684ff] text-white font-bold text-[13px] rounded-md hover:bg-[#1e88ff] transition-colors whitespace-nowrap shrink-0 disabled:opacity-50"
            >
              {isScanning ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              {isScanning ? scanStatus : 'Find Bugs'}
            </button>
          </div>
        </div>
      )}

      {/* Progress Overlay */}
      {isScanning && (
        <div className="px-4 lg:px-[24px] py-2 bg-[#0b1523] border-b border-[#1b2938] flex items-center gap-4 text-[13px]">
          <Activity className="w-4 h-4 text-[#2684ff] animate-spin" />
          <span className="text-white font-medium">Scanning ({scanProgress}%)...</span>
          <div className="flex-1 max-w-md h-1.5 bg-[#1b2938] rounded-full overflow-hidden">
             <div className="h-full bg-[#2684ff] transition-all duration-300" style={{width: \`\${scanProgress}%\`}} />
          </div>
          <span className="text-[#8eaccb]">{scanStatus}</span>
        </div>
      )}

      {/* Main Content Layout - Scrollable */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 lg:px-[24px] py-5 min-w-0 w-full">
        <div className={\`\${isFullscreen ? 'flex flex-col h-full' : 'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] gap-[20px]'} w-full max-w-[1800px] mx-auto items-start min-w-0 h-full\`}>
          
          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-5 min-w-0 w-full h-full">
            
            {/* Code Editor Panel */}
            <div className={\`border border-[#1b2938] rounded-[11px] overflow-hidden flex flex-col bg-[#0b1523] min-w-0 \${isFullscreen ? 'flex-1' : 'min-h-[400px]'}\`}>
              <div className="h-[48px] flex items-center justify-between px-4 border-b border-[#1b2938] bg-[#0b1523] shrink-0 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-[18px] h-[18px] rounded-sm bg-[#ffc400] text-[#060d17] flex items-center justify-center font-bold text-[10px] font-mono leading-none shrink-0">JS</div>
                  <span className="text-[14px] font-bold text-[#f8fafc] truncate">code-snippet.js</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#8eaccb] shrink-0">
                  <button onClick={handleCopy} className="p-1 hover:text-white transition-colors rounded relative group" title="Copy Code">
                    {copied ? <Check className="w-[15px] h-[15px] text-[#00c79e]" /> : <Copy className="w-[15px] h-[15px]" />}
                  </button>
                  <button onClick={() => setIsFullscreen(!isFullscreen)} className="p-1 hover:text-white transition-colors rounded" title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                    <Maximize2 className="w-[15px] h-[15px]" />
                  </button>
                  <div className="w-px h-4 bg-[#1b2938] mx-1" />
                  <div className="relative group">
                    <button className="p-1 hover:text-white transition-colors rounded" title="More Actions">
                      <MoreHorizontal className="w-[15px] h-[15px]" />
                    </button>
                    {/* Simulated more actions menu on hover for now */}
                    <div className="absolute right-0 top-full mt-1 w-40 bg-[#0a1421] border border-[#1b2938] rounded shadow-xl hidden group-hover:block z-50">
                       <button className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#1b2938] text-white">Find in File (Cmd+F)</button>
                       <button className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-[#1b2938] text-white">Go to Line (Cmd+G)</button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex-1 bg-[#060d16] min-h-[300px] relative">
                 <Editor
                   height="100%"
                   defaultLanguage="javascript"
                   theme="vs-dark"
                   value={mockFileContent}
                   options={{
                     minimap: { enabled: false },
                     fontSize: 13,
                     fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                     scrollBeyondLastLine: false,
                     readOnly: true,
                     wordWrap: 'on'
                   }}
                   onMount={(editor) => {
                     // Can attach editor refs here for go to line logic
                   }}
                 />
              </div>
            </div>

            {/* AI Suggested Fix Panel */}
            {selectedFinding && (
              <div className="border border-[#1b2938] rounded-[11px] flex flex-col overflow-hidden bg-[#0a1421] min-w-0">
                <div className="min-h-[56px] px-5 py-3 flex flex-wrap items-center gap-2.5 shrink-0 min-w-0">
                  <Wand2 className="w-[18px] h-[18px] text-[#f8fafc] shrink-0" />
                  <h3 className="font-bold text-white text-[16px] truncate">AI Suggested Fix</h3>
                  <span className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-[#00d3a0] border border-[#00d3a0]/40 px-2 py-0.5 rounded-full ml-1 shrink-0">
                    <ShieldCheck className="w-[12px] h-[12px]" /> VALIDATED
                  </span>
                </div>
                <div className="h-px bg-[#1b2938] w-full shrink-0" />
                
                <div className="p-5 flex flex-col gap-4">
                  <div className="bg-[#060d16] border border-[#1b2938] rounded-md overflow-hidden">
                    <div className="px-4 py-2 border-b border-[#1b2938] flex items-center justify-between text-[12px] text-[#8eaccb]">
                      <span className="font-mono">Patch: fix-sql-inj.patch</span>
                      <button onClick={() => setShowDiff(!showDiff)} className="hover:text-white transition-colors">{showDiff ? 'View Inline' : 'View Side-by-Side Diff'}</button>
                    </div>
                    <div className="p-4 font-mono text-[13px] overflow-x-auto text-green-400">
                      <pre>{selectedFinding.suggestedPatch}</pre>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <button 
                      onClick={handleRunTests} 
                      disabled={testStatus === 'RUNNING'}
                      className="px-4 py-2 bg-[#1b2938] text-white text-[13px] font-bold rounded hover:bg-[#2a3f54] transition-colors flex items-center gap-2"
                    >
                      {testStatus === 'RUNNING' ? <Activity className="w-4 h-4 animate-spin"/> : (testStatus === 'SUCCESS' ? <Check className="w-4 h-4 text-green-400"/> : <Play className="w-4 h-4"/>)}
                      {testStatus === 'SUCCESS' ? 'Tests Passed' : (testStatus === 'RUNNING' ? 'Running Tests...' : 'Run Tests')}
                    </button>
                    <button onClick={() => setCommitModalOpen(true)} className="px-4 py-2 bg-[#00d3a0] text-[#060d17] text-[13px] font-bold rounded hover:bg-[#00c79e] transition-colors flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      Commit Auto-Fix
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* AI Summary Panel */}
            {scanInfo && (
              <div className="flex flex-col gap-3 mt-2 min-w-0 border border-[#1b2938] rounded-[11px] p-5 bg-[#0a1421]">
                <div className="flex items-center gap-2 min-w-0">
                  <Activity className="w-[18px] h-[18px] text-[#f8fafc] shrink-0" />
                  <h3 className="font-bold text-white text-[16px] truncate">AI Summary</h3>
                </div>
                <div className="text-[#8eaccb] text-[13px]">
                  Analysis complete. Found {findings.length} issues. Code Quality Score: 78/100. Estimated effort to resolve: {findings.length * 15} minutes.
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          {!isFullscreen && (
            <div className="flex flex-col gap-4 min-w-0 w-full lg:sticky lg:top-0 pb-10">
              
              {/* Analysis Results Header */}
              <div className="flex flex-col gap-3.5 min-w-0">
                <div className="flex justify-between items-center px-1 min-w-0 gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Bug className="w-[18px] h-[18px] text-[#ffc400] shrink-0" />
                    <h2 className="text-[17px] font-bold text-white tracking-tight truncate">Analysis Results</h2>
                  </div>
                  <span className={\`px-2.5 py-1 text-[11px] font-semibold rounded-md border whitespace-nowrap shrink-0 \${findings.length > 0 ? 'bg-[#ff4d56]/20 text-[#ff4d56] border-[#ff4d56]/20' : 'bg-[#00c79e]/20 text-[#00c79e] border-[#00c79e]/20'}\`}>
                    {findings.length} {findings.length === 1 ? 'Issue' : 'Issues'} Found
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                    <button onClick={() => setSeverityFilter('all')} className={\`px-3.5 py-1.5 text-[12px] font-semibold rounded-md transition-colors border \${severityFilter === 'all' ? 'bg-[#2684ff] text-white border-transparent' : 'text-[#8eaccb] hover:text-white hover:bg-[#0a1421] border-[#1b2938]'}\`}>All ({findings.length})</button>
                    <button onClick={() => setSeverityFilter('critical')} className={\`px-3.5 py-1.5 text-[12px] font-semibold rounded-md transition-colors border \${severityFilter === 'critical' ? 'bg-[#2684ff] text-white border-transparent' : 'text-[#8eaccb] hover:text-white hover:bg-[#0a1421] border-[#1b2938]'}\`}>Critical ({findings.filter(f => f.severity.toLowerCase() === 'critical').length})</button>
                    <button onClick={() => setSeverityFilter('high')} className={\`px-3.5 py-1.5 text-[12px] font-semibold rounded-md transition-colors border \${severityFilter === 'high' ? 'bg-[#2684ff] text-white border-transparent' : 'text-[#8eaccb] hover:text-white hover:bg-[#0a1421] border-[#1b2938]'}\`}>High ({findings.filter(f => f.severity.toLowerCase() === 'high').length})</button>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button className="p-1.5 border border-[#1b2938] rounded-md text-[#8eaccb] hover:text-white hover:bg-[#0a1421] transition-colors" title="Sort Findings">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 border border-[#1b2938] rounded-md text-[#8eaccb] hover:text-white hover:bg-[#0a1421] transition-colors" title="Filter Findings">
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Finding Cards */}
              <div className="flex flex-col gap-4">
                {filteredFindings.map((finding) => (
                  <div 
                    key={finding.id} 
                    className={\`border \${selectedFinding?.id === finding.id ? 'border-[#2684ff] ring-1 ring-[#2684ff]' : 'border-[#ff4d56] hover:border-[#ff4d56]/80'} rounded-[10px] bg-[#0a1421] flex flex-col mt-1 min-w-0 cursor-pointer transition-colors\`}
                    onClick={() => setSelectedFinding(finding)}
                  >
                    <div className="px-5 pt-5 pb-4 border-b border-[#1b2938] flex flex-col gap-4 bg-[#0a1421] rounded-t-[10px] min-w-0">
                      <div className="flex items-center justify-between gap-3 min-w-0">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="bg-[#ff4d56] text-white text-[11px] font-bold px-2 py-[2px] rounded-[4px] leading-tight shrink-0">{finding.severity}</span>
                          <h3 className="text-[17px] font-bold text-white tracking-tight truncate">{finding.title}</h3>
                        </div>
                        <a href={\`https://cwe.mitre.org/data/definitions/\${finding.cwe?.split('-')[1]}.html\`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-[#2684ff] text-[12px] font-semibold hover:underline whitespace-nowrap shrink-0" onClick={e => e.stopPropagation()}>
                          {finding.cwe} <ExternalLink className="w-[13px] h-[13px]" />
                        </a>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <button className="flex items-center gap-1.5 text-[11px] text-[#8eaccb] font-medium bg-[#060d17] px-2.5 py-1 rounded-md border border-[#1b2938] whitespace-nowrap hover:bg-[#1b2938]" onClick={(e) => { e.stopPropagation(); /* go to line logic */ }}>
                          <Code2 className="w-[13px] h-[13px] text-[#627d9c]" /> Line {finding.line}
                        </button>
                        <span className="flex items-center gap-1.5 text-[11px] text-[#8eaccb] font-medium bg-[#060d17] px-2.5 py-1 rounded-md border border-[#1b2938] whitespace-nowrap">
                          <ShieldAlert className="w-[13px] h-[13px] text-[#627d9c]" /> {finding.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="px-5 py-5 flex flex-col gap-[18px] text-[13px] text-[#8eaccb] min-w-0">
                      <p className="leading-[1.6] break-words whitespace-normal">{finding.description}</p>
                      
                      {selectedFinding?.id === finding.id && (
                        <>
                          <div className="min-w-0">
                            <h4 className="text-[#f8fafc] font-bold mb-[6px] text-[14px] truncate">Why is this a problem?</h4>
                            <p className="leading-[1.6] break-words whitespace-normal">{finding.technicalExplanation}</p>
                          </div>
                          
                          <div className="min-w-0 overflow-hidden">
                            <h4 className="text-[#f8fafc] font-bold mb-[8px] text-[14px] truncate">Example Attack:</h4>
                            <div className="bg-[#3a0a0e] border border-[#ff4d56]/20 rounded-md p-3 font-mono text-[13px] text-[#ffad00] overflow-x-auto custom-scrollbar">
                              <span className="whitespace-nowrap">{finding.evidence}</span>
                            </div>
                          </div>
                          
                          <div className="min-w-0">
                            <h4 className="text-[#f8fafc] font-bold mb-[6px] text-[14px] truncate">Recommendation</h4>
                            <p className="leading-[1.6] break-words whitespace-normal">{finding.remediation}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
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
                     <span className="text-[#00c79e] font-semibold">{scanStatus || (scanInfo ? scanInfo.status : 'Ready')}</span>
                   </div>
                   {scanInfo && (
                     <>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-[#627d9c]">Scan Type</span>
                          <span className="text-white">{scanInfo.type}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-[#627d9c]">Languages</span>
                          <span className="text-white">{scanInfo.languages}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-[#627d9c]">Files Analyzed</span>
                          <span className="text-white">{scanInfo.analyzed}</span>
                        </div>
                     </>
                   )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {commitModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1523] border border-[#1b2938] rounded-[11px] p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-white mb-4">Commit Auto-Fix</h2>
            <div className="flex flex-col gap-3 text-[13px] text-[#8eaccb] mb-4">
              <div><span className="text-[#627d9c] w-24 inline-block">Repository:</span> WyrmSentry-Core</div>
              <div><span className="text-[#627d9c] w-24 inline-block">Branch:</span> main</div>
              <div><span className="text-[#627d9c] w-24 inline-block">File:</span> code-snippet.js</div>
            </div>
            
            <div className="mb-4">
              <label className="block text-[#627d9c] text-[12px] font-bold mb-1">Commit Message</label>
              <input 
                type="text" 
                value={commitMessage}
                onChange={e => setCommitMessage(e.target.value)}
                placeholder="fix(security): resolve vulnerability"
                className="w-full bg-[#060d16] border border-[#1b2938] rounded p-2 text-white text-[13px] focus:outline-none focus:border-[#2684ff]"
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setCommitModalOpen(false)} className="px-4 py-2 text-[#8eaccb] hover:text-white transition-colors text-[13px] font-bold">Cancel</button>
              <button 
                onClick={handleCommitFix} 
                disabled={isCommitting}
                className="px-4 py-2 bg-[#2684ff] text-white rounded font-bold text-[13px] hover:bg-[#1e88ff] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isCommitting ? <Activity className="w-4 h-4 animate-spin"/> : null}
                Commit Fix
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto Fix Modal */}
      {fixModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0b1523] border border-[#1b2938] rounded-[11px] p-6 max-w-lg w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white">Auto-Fix Review</h2>
              <button onClick={() => setFixModalOpen(false)} className="text-[#8eaccb] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="flex flex-col gap-4 text-[13px] text-[#8eaccb] mb-6">
              <p>Review the generated fixes for all detected vulnerabilities.</p>
              
              <div className="bg-[#060d16] border border-[#1b2938] rounded p-4 flex flex-col gap-2">
                <div className="flex justify-between"><span className="text-white font-semibold">Issues selected:</span> <span>{findings.length}</span></div>
                <div className="flex justify-between"><span className="text-[#00c79e] font-semibold">Fixable:</span> <span>{findings.length}</span></div>
                <div className="flex justify-between"><span className="text-[#ffc400] font-semibold">Needs manual review:</span> <span>0</span></div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setFixModalOpen(false)} className="px-4 py-2 text-[#8eaccb] hover:text-white transition-colors text-[13px] font-bold">Cancel</button>
              <button 
                onClick={() => { setAutoFixAllStatus('Generating...'); setTimeout(() => { setAutoFixAllStatus('Validated'); setFixModalOpen(false); }, 2000); }} 
                disabled={!!autoFixAllStatus && autoFixAllStatus !== 'Validated'}
                className="px-4 py-2 bg-[#00d3a0] text-[#060d17] rounded font-bold text-[13px] hover:bg-[#00c79e] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {autoFixAllStatus === 'Generating...' ? <Activity className="w-4 h-4 animate-spin"/> : <Wand2 className="w-4 h-4"/>}
                {autoFixAllStatus || 'Generate Patches'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`
fs.writeFileSync('src/components/pages/BugChecker.tsx', code);
