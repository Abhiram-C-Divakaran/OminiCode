const fs = require('fs');
let code = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Replace h-screen w-screen with h-full w-full
code = code.replace(/h-screen w-screen/g, 'h-full w-full');

fs.writeFileSync('src/components/pages/BugChecker.tsx', code);
