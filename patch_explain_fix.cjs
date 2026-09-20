const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Add Explain Fix modal state
content = content.replace(
  `const [commitDropdownOpen, setCommitDropdownOpen] = useState(false);`,
  `const [commitDropdownOpen, setCommitDropdownOpen] = useState(false);\n  const [explainModalOpen, setExplainModalOpen] = useState(false);\n  const [isExplaining, setIsExplaining] = useState(false);`
);

// Add Explain Fix Button to AI Fix Panel
content = content.replace(
  `<button 
                      onClick={handleRunTests}`,
  `<button 
                      onClick={() => {
                        setExplainModalOpen(true);
                        setIsExplaining(true);
                        setTimeout(() => setIsExplaining(false), 1500);
                      }} 
                      className="px-4 py-2 bg-[#1b2938] text-white text-[13px] font-bold rounded hover:bg-[#2a3f54] transition-colors flex items-center gap-2"
                    >
                      <Info className="w-4 h-4"/>
                      Explain Fix
                    </button>
                    <button 
                      onClick={handleRunTests}`
);

const explainFixModal = `
      {/* Explain Fix Modal */}
      {explainModalOpen && selectedFinding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#0b1523] border border-[#1b2938] rounded-[11px] p-6 max-w-2xl w-full shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4 shrink-0">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Wand2 className="w-5 h-5 text-[#00c79e]"/> Fix Explanation</h2>
              <button onClick={() => setExplainModalOpen(false)} className="text-[#8eaccb] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2 flex flex-col gap-5 text-[#8eaccb] text-[13px] leading-[1.6]">
              {isExplaining ? (
                <div className="flex flex-col items-center justify-center h-48 gap-3">
                  <Activity className="w-8 h-8 animate-spin text-[#2684ff]" />
                  <span className="text-white font-medium">Generating explanation...</span>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="text-white font-bold mb-1">Problem</h3>
                    <p>The code dynamically concatenated user-controlled data directly into the SQL query string, which is vulnerable to SQL Injection.</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Change</h3>
                    <p>The patch replaces string interpolation with parameterized queries (prepared statements).</p>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Why this works</h3>
                    <p>Parameterized queries force the database to treat the user input strictly as data, not as executable code. This completely eliminates the possibility of the input altering the structure of the SQL command.</p>
                  </div>
                  <div className="bg-[#060d16] border border-[#1b2938] rounded-md p-4 mt-2">
                    <h3 className="text-white font-bold mb-3 border-b border-[#1b2938] pb-2">Validation Results</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between"><span className="text-[#627d9c]">Syntax</span> <span className="text-[#00c79e] font-semibold flex items-center gap-1"><Check className="w-3 h-3"/> Passed</span></div>
                      <div className="flex justify-between"><span className="text-[#627d9c]">Tests</span> <span className="text-[#00c79e] font-semibold flex items-center gap-1"><Check className="w-3 h-3"/> Passed</span></div>
                      <div className="flex justify-between"><span className="text-[#627d9c]">Security re-scan</span> <span className="text-[#00c79e] font-semibold flex items-center gap-1"><Check className="w-3 h-3"/> Passed</span></div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex justify-end mt-4 pt-4 border-t border-[#1b2938] shrink-0">
              <button onClick={() => setExplainModalOpen(false)} className="px-4 py-2 bg-[#1b2938] text-white rounded font-bold text-[13px] hover:bg-[#2a3f54] transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  `{/* Auto Fix Modal */}`,
  `${explainFixModal}\n\n      {/* Auto Fix Modal */}`
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
