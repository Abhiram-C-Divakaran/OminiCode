const fs = require('fs');
let code = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Change BugFinder to Code Review Analyzer
code = code.replace(/<span className="font-extrabold text-lg text-white tracking-tight">BugFinder<\/span>/, '<span className="font-extrabold text-lg text-white tracking-tight">Code Review Analyzer</span>');
code = code.replace(/<BugPlay className="w-5 h-5" \/>/, '<ShieldAlert className="w-5 h-5" />');
code = code.replace(/import \{ Bug, Play, AlertCircle, CheckCircle2, ChevronRight, X, BugPlay \} from 'lucide-react';/, "import { Bug, Play, AlertCircle, CheckCircle2, ChevronRight, X, ShieldAlert } from 'lucide-react';");

fs.writeFileSync('src/components/pages/BugChecker.tsx', code);
