const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Add commit dropdown state
content = content.replace(
  `const [commitModalOpen, setCommitModalOpen] = useState(false);`,
  `const [commitModalOpen, setCommitModalOpen] = useState(false);\n  const [commitDropdownOpen, setCommitDropdownOpen] = useState(false);`
);

// Click outside close
content = content.replace(
  `if (!(event.target as Element).closest('.diff-dropdown')) {`,
  `if (!(event.target as Element).closest('.commit-dropdown')) {\n        setCommitDropdownOpen(false);\n      }\n      if (!(event.target as Element).closest('.diff-dropdown')) {`
);

const commitSplitButton = `
                  <div className="flex items-stretch commit-dropdown relative">
                    <button onClick={() => setCommitModalOpen(true)} className="px-4 py-2 bg-[#00d3a0] text-[#060d17] text-[13px] font-bold rounded-l hover:bg-[#00c79e] transition-colors flex items-center gap-2">
                      <GitBranch className="w-4 h-4" />
                      Commit Auto-Fix
                    </button>
                    <div className="w-px bg-[#060d17]/20" />
                    <button onClick={() => setCommitDropdownOpen(!commitDropdownOpen)} className="px-2 bg-[#00d3a0] text-[#060d17] rounded-r hover:bg-[#00c79e] transition-colors flex items-center justify-center">
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    {commitDropdownOpen && (
                      <div className="absolute right-0 bottom-full mb-2 w-56 bg-[#0a1421] border border-[#1b2938] rounded-md shadow-xl z-50 py-1">
                        <button onClick={() => { setCommitModalOpen(true); setCommitDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white">Commit to Current Branch</button>
                        <button onClick={() => { setCommitModalOpen(true); setCommitDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white">Create New Branch</button>
                        <button onClick={() => { setCommitModalOpen(true); setCommitDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white">Create Pull Request</button>
                        <div className="h-px bg-[#1b2938] my-1" />
                        <button onClick={() => { navigator.clipboard.writeText(selectedFinding.suggestedPatch || ''); showToast('Patch copied', 'success'); setCommitDropdownOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white">Copy Patch</button>
                        <button onClick={() => { setCommitDropdownOpen(false); showToast('Downloading patch...', 'info'); }} className="w-full text-left px-4 py-2 hover:bg-[#1b2938] text-[13px] text-white">Download Patch</button>
                      </div>
                    )}
                  </div>
`;

content = content.replace(
  /<button onClick=\{\(\) => setCommitModalOpen\(true\)\} className="px-4 py-2 bg-\[#00d3a0\] text-\[#060d17\] text-\[13px\] font-bold rounded hover:bg-\[#00c79e\] transition-colors flex items-center gap-2">[\s\S]*?<\/button>/,
  commitSplitButton
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
