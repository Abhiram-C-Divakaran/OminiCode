const fs = require('fs');
let content = fs.readFileSync('src/components/pages/WorkspacePage.tsx', 'utf8');

content = content.replace(
  /if \(activeFilePath && !openTabs.includes\(activeFilePath\)\) \{\s*setOpenTabs\(prev => \[\.\.\.prev, activeFilePath\]\);\s*\}/g,
  `if (activeFilePath) {
      setOpenTabs(prev => prev.includes(activeFilePath) ? prev : [...prev, activeFilePath]);
    }`
);

fs.writeFileSync('src/components/pages/WorkspacePage.tsx', content);
