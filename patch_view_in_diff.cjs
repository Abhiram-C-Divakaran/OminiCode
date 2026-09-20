const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

content = content.replace(
  `const scanDropdownRef = useRef<HTMLDivElement>(null);`,
  `const scanDropdownRef = useRef<HTMLDivElement>(null);
  const diffPanelRef = useRef<HTMLDivElement>(null);
  
  const handleViewInDiff = (finding: Finding, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFinding(finding);
    setTimeout(() => {
      diffPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };`
);

content = content.replace(
  `<button className="flex-1 flex items-center justify-center gap-2 px-4 py-[9px] bg-[#2684ff] text-white font-bold text-[13px] rounded-l-md hover:bg-[#1e88ff] transition-colors whitespace-nowrap">
                    <Eye className="w-4 h-4" /> View in Diff
                  </button>`,
  `<button onClick={(e) => handleViewInDiff(finding, e)} className="flex-1 flex items-center justify-center gap-2 px-4 py-[9px] bg-[#2684ff] text-white font-bold text-[13px] rounded-l-md hover:bg-[#1e88ff] transition-colors whitespace-nowrap">
                    <Eye className="w-4 h-4" /> View in Diff
                  </button>`
);

content = content.replace(
  `{selectedFinding && (
              <div className="border border-[#1b2938] rounded-[11px] flex flex-col overflow-hidden bg-[#0a1421] min-w-0">`,
  `{selectedFinding && (
              <div ref={diffPanelRef} className="border border-[#1b2938] rounded-[11px] flex flex-col overflow-hidden bg-[#0a1421] min-w-0">`
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
