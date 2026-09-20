const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Add toast state
content = content.replace(
  `const [commitMessage, setCommitMessage] = useState('');`,
  `const [commitMessage, setCommitMessage] = useState('');\n  const [toast, setToast] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);`
);

// Add showToast helper
content = content.replace(
  `const filteredLanguages = LANGUAGES.filter(l => l.toLowerCase().includes(languageSearch.toLowerCase()));`,
  `const filteredLanguages = LANGUAGES.filter(l => l.toLowerCase().includes(languageSearch.toLowerCase()));\n\n  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {\n    setToast({ message, type });\n    setTimeout(() => setToast(null), 3000);\n  };`
);

// Trigger toasts
content = content.replace(`setIsScanning(true);`, `setIsScanning(true);\n    showToast('Scan started', 'info');`);
content = content.replace(`// Toast success`, `showToast('Auto-Fix committed successfully', 'success');`);
content = content.replace(`// Toast error`, `showToast('Failed to commit fix', 'error');`);

// Toast render component
content = content.replace(
  `{/* Auto Fix Modal */}`,
  `{toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={\`flex items-center gap-2 px-4 py-3 rounded-md shadow-lg text-[13px] font-bold text-white \${toast.type === 'success' ? 'bg-[#00c79e]' : toast.type === 'error' ? 'bg-[#ff4d56]' : 'bg-[#2684ff]'}\`}>
            {toast.type === 'success' && <Check className="w-4 h-4" />}
            {toast.type === 'error' && <ShieldAlert className="w-4 h-4" />}
            {toast.type === 'info' && <Info className="w-4 h-4" />}
            {toast.message}
          </div>
        </div>
      )}\n\n      {/* Auto Fix Modal */}`
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
