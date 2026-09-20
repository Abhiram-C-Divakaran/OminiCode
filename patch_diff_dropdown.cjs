const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Add state for Diff dropdowns tracking per finding
content = content.replace(
  `const [commitModalOpen, setCommitModalOpen] = useState(false);`,
  `const [commitModalOpen, setCommitModalOpen] = useState(false);\n  const [diffDropdownOpen, setDiffDropdownOpen] = useState<string | null>(null);`
);

// Close diff dropdown on outside click
content = content.replace(
  `if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLanguageOpen(false);
      }`,
  `if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLanguageOpen(false);
      }
      // Simplistic close for diff dropdowns:
      if (!(event.target as Element).closest('.diff-dropdown')) {
        setDiffDropdownOpen(null);
      }`
);

// Replace the hardcoded diff split button with an interactive one
content = content.replace(
  `<button className="px-3.5 py-[9px] bg-[#2684ff] text-white rounded-r-md hover:bg-[#1e88ff] transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </button>`,
  `<div className="relative diff-dropdown">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setDiffDropdownOpen(diffDropdownOpen === finding.id ? null : finding.id); }}
                      className="h-full px-3.5 py-[9px] bg-[#2684ff] text-white rounded-r-md hover:bg-[#1e88ff] transition-colors flex items-center justify-center"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    {diffDropdownOpen === finding.id && (
                      <div className="absolute right-0 bottom-full mb-2 w-48 bg-[#0a1421] border border-[#1b2938] rounded-md shadow-xl z-50 py-1" onClick={e => e.stopPropagation()}>
                        <button onClick={(e) => { setShowDiff(false); handleViewInDiff(finding, e); setDiffDropdownOpen(null); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white">View Side-by-Side Diff</button>
                        <button onClick={(e) => { setShowDiff(true); handleViewInDiff(finding, e); setDiffDropdownOpen(null); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white">View Inline Diff</button>
                        <button onClick={() => { setIsFullscreen(true); setDiffDropdownOpen(null); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white">Open Fullscreen Diff</button>
                        <button onClick={() => { navigator.clipboard.writeText(finding.suggestedPatch || ''); setDiffDropdownOpen(null); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white">Copy Patch</button>
                      </div>
                    )}
                  </div>`
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
