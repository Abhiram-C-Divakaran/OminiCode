const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Add Monaco editor instance state and Sort state
content = content.replace(
  `const [isFullscreen, setIsFullscreen] = useState(false);`,
  `const [isFullscreen, setIsFullscreen] = useState(false);\n  const [editorInstance, setEditorInstance] = useState<any>(null);\n  const [sortMode, setSortMode] = useState<string>('severity-desc');\n  const [sortMenuOpen, setSortMenuOpen] = useState(false);\n  const [filterMenuOpen, setFilterMenuOpen] = useState(false);`
);

// Click outside utils for sort and filter
content = content.replace(
  `const langDropdownRef = useRef<HTMLDivElement>(null);`,
  `const langDropdownRef = useRef<HTMLDivElement>(null);\n  const sortRef = useRef<HTMLDivElement>(null);\n  const filterRef = useRef<HTMLDivElement>(null);`
);

content = content.replace(
  `if (!(event.target as Element).closest('.diff-dropdown')) {`,
  `if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setSortMenuOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
      if (!(event.target as Element).closest('.diff-dropdown')) {`
);

// Apply sorting to filtered findings
content = content.replace(
  `const filteredFindings = findings.filter(f => severityFilter === 'all' || f.severity.toLowerCase() === severityFilter);`,
  `let filteredFindings = findings.filter(f => severityFilter === 'all' || f.severity.toLowerCase() === severityFilter);
  
  // Apply sorting
  filteredFindings = filteredFindings.sort((a, b) => {
    const sevScore = (s: string) => ({ 'critical': 4, 'high': 3, 'medium': 2, 'low': 1, 'info': 0 }[s.toLowerCase()] || 0);
    if (sortMode === 'severity-desc') return sevScore(b.severity) - sevScore(a.severity);
    if (sortMode === 'severity-asc') return sevScore(a.severity) - sevScore(b.severity);
    if (sortMode === 'confidence') return b.confidence - a.confidence;
    if (sortMode === 'file') return a.file.localeCompare(b.file);
    return 0; // Default order
  });
  
  const handleGoToLine = (line: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editorInstance) {
      editorInstance.revealLineInCenter(line);
      editorInstance.setSelection(new (window as any).monaco.Selection(line, 1, line, 100));
      editorInstance.focus();
    }
  };`
);

// Editor mount 
content = content.replace(
  `onMount={(editor) => {
                     // Can attach editor refs here for go to line logic
                   }}`,
  `onMount={(editor, monaco) => {
                     (window as any).monaco = monaco;
                     setEditorInstance(editor);
                   }}`
);

// Go to line in Finding Card
content = content.replace(
  `onClick={(e) => { e.stopPropagation(); /* go to line logic */ }}>`,
  `onClick={(e) => handleGoToLine(finding.line, e)}>`
);

// Replace Sort and Filter buttons with interactive dropdowns
content = content.replace(
  `                  <div className="flex items-center gap-1.5 shrink-0">
                    <button className="p-1.5 border border-[#1b2938] rounded-md text-[#8eaccb] hover:text-white hover:bg-[#0a1421] transition-colors" title="Sort Findings">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 border border-[#1b2938] rounded-md text-[#8eaccb] hover:text-white hover:bg-[#0a1421] transition-colors" title="Filter Findings">
                      <SlidersHorizontal className="w-4 h-4" />
                    </button>
                  </div>`,
  `                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="relative" ref={sortRef}>
                      <button onClick={() => setSortMenuOpen(!sortMenuOpen)} className="p-1.5 border border-[#1b2938] rounded-md text-[#8eaccb] hover:text-white hover:bg-[#0a1421] transition-colors" title="Sort Findings">
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      {sortMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-[#0a1421] border border-[#1b2938] rounded-md shadow-xl z-50 py-1">
                          <button onClick={() => { setSortMode('severity-desc'); setSortMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white flex justify-between">Severity: Highest First {sortMode === 'severity-desc' && <Check className="w-4 h-4" />}</button>
                          <button onClick={() => { setSortMode('severity-asc'); setSortMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white flex justify-between">Severity: Lowest First {sortMode === 'severity-asc' && <Check className="w-4 h-4" />}</button>
                          <button onClick={() => { setSortMode('confidence'); setSortMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white flex justify-between">Confidence: Highest {sortMode === 'confidence' && <Check className="w-4 h-4" />}</button>
                          <button onClick={() => { setSortMode('file'); setSortMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white flex justify-between">File Name {sortMode === 'file' && <Check className="w-4 h-4" />}</button>
                        </div>
                      )}
                    </div>
                    
                    <div className="relative" ref={filterRef}>
                      <button onClick={() => setFilterMenuOpen(!filterMenuOpen)} className="p-1.5 border border-[#1b2938] rounded-md text-[#8eaccb] hover:text-white hover:bg-[#0a1421] transition-colors relative" title="Filter Findings">
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                      {filterMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-64 bg-[#0a1421] border border-[#1b2938] rounded-md shadow-xl z-50 p-4">
                          <h4 className="text-white font-bold text-[14px] mb-3">Filters</h4>
                          
                          <div className="flex flex-col gap-2 mb-4">
                            <label className="text-[12px] text-[#627d9c] font-bold">Confidence</label>
                            <select className="bg-[#060d16] border border-[#1b2938] rounded px-2 py-1 text-white text-[13px]">
                              <option>All</option>
                              <option>&gt;= 50%</option>
                              <option>&gt;= 70%</option>
                              <option>&gt;= 90%</option>
                            </select>
                          </div>
                          
                          <div className="flex flex-col gap-2 mb-4">
                            <label className="text-[12px] text-[#627d9c] font-bold">Source Engine</label>
                            <select className="bg-[#060d16] border border-[#1b2938] rounded px-2 py-1 text-white text-[13px]">
                              <option>All Engines</option>
                              <option>WyrmSentry AI</option>
                              <option>CodeQL</option>
                              <option>ESLint</option>
                            </select>
                          </div>
                          
                          <div className="flex justify-between items-center mt-2">
                            <button onClick={() => setFilterMenuOpen(false)} className="text-[12px] text-[#8eaccb] hover:text-white">Reset Filters</button>
                            <button onClick={() => setFilterMenuOpen(false)} className="px-3 py-1.5 bg-[#2684ff] text-white text-[12px] rounded font-bold">Apply Filters</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>`
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
