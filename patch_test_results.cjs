const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Add test results modal state
content = content.replace(
  `const [isExplaining, setIsExplaining] = useState(false);`,
  `const [isExplaining, setIsExplaining] = useState(false);\n  const [testModalOpen, setTestModalOpen] = useState(false);\n  const [testResults, setTestResults] = useState<any>(null);`
);

content = content.replace(
  `const handleRunTests = async () => {`,
  `const handleRunTests = async () => {
    if (testStatus === 'SUCCESS' && testResults) {
      setTestModalOpen(true);
      return;
    }`
);

content = content.replace(
  `await testService.runAffectedTests(selectedFinding.id);`,
  `const results = await testService.runAffectedTests(selectedFinding.id);
      setTestResults(results);`
);

const testResultsModal = `
      {/* Test Results Modal */}
      {testModalOpen && testResults && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#0b1523] border border-[#1b2938] rounded-[11px] p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><FlaskConical className="w-5 h-5 text-[#2684ff]"/> Test Results</h2>
              <button onClick={() => setTestModalOpen(false)} className="text-[#8eaccb] hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            
            <div className="flex flex-col gap-3 text-[13px]">
              <div className="flex justify-between border-b border-[#1b2938] pb-2"><span className="text-[#627d9c]">Total Tests</span> <span className="text-white font-semibold">{testResults.total}</span></div>
              <div className="flex justify-between border-b border-[#1b2938] pb-2"><span className="text-[#627d9c]">Passed</span> <span className="text-[#00c79e] font-semibold">{testResults.passed}</span></div>
              <div className="flex justify-between border-b border-[#1b2938] pb-2"><span className="text-[#627d9c]">Failed</span> <span className="text-[#ff4d56] font-semibold">{testResults.failed}</span></div>
              <div className="flex justify-between border-b border-[#1b2938] pb-2"><span className="text-[#627d9c]">Skipped</span> <span className="text-[#ffc400] font-semibold">{testResults.skipped}</span></div>
              <div className="flex justify-between pb-2"><span className="text-[#627d9c]">Duration</span> <span className="text-white font-semibold">{testResults.duration}s</span></div>
            </div>
            
            <div className="flex justify-end mt-4 pt-4 border-t border-[#1b2938]">
              <button onClick={() => setTestModalOpen(false)} className="px-4 py-2 bg-[#1b2938] text-white rounded font-bold text-[13px] hover:bg-[#2a3f54] transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
`;

content = content.replace(
  `{/* Explain Fix Modal */}`,
  `${testResultsModal}\n\n      {/* Explain Fix Modal */}`
);

// We should also allow "Clicking after completion opens test results" for the button.
content = content.replace(
  `{testStatus === 'SUCCESS' ? 'Tests Passed' : (testStatus === 'RUNNING' ? 'Running Tests...' : 'Run Tests')}`,
  `{testStatus === 'SUCCESS' ? 'Tests Passed (View)' : (testStatus === 'RUNNING' ? 'Running Tests...' : 'Run Tests')}`
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
