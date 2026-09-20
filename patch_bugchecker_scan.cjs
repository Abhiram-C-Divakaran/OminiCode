const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

content = content.replace(
  /import \{ \n  Shield, Play, ChevronDown,/,
  `import { useReviews } from '../../context/ReviewContext';\nimport { \n  Shield, Play, ChevronDown,`
);

content = content.replace(
  /export default function BugChecker\(\) \{/,
  `export default function BugChecker() {\n  const { startRepositoryScan, isReviewing, scanStatus, scanProgress } = useReviews();\n\n  const handleScan = () => {\n    startRepositoryScan('repo-wyrmsentry-core', 'main');\n  };`
);

content = content.replace(
  /<button className="flex items-center gap-2 px-5 py-\[9px\] bg-\[#2684ff\] text-white font-bold text-\[13px\] rounded-md hover:bg-\[#1e88ff\] transition-colors whitespace-nowrap shrink-0">([\s\S]*?)<\/button>/,
  `<button onClick={handleScan} disabled={isReviewing} className="flex items-center gap-2 px-5 py-[9px] bg-[#2684ff] text-white font-bold text-[13px] rounded-md hover:bg-[#1e88ff] transition-colors whitespace-nowrap shrink-0 disabled:opacity-50">
            {isReviewing ? <Activity className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            {isReviewing ? scanStatus : 'Find Bugs'}
          </button>`
);

content = content.replace(
  /Status<\/span>\s*<span className="text-\[#00c79e\] font-semibold">Completed<\/span>/,
  `Status</span>\n                   <span className="text-[#00c79e] font-semibold">{scanStatus || 'Ready'}</span>`
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
