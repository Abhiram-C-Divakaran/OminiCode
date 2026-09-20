const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// The LogOut button
const logoutButtonRegex = /<button[\s\S]*?onClick=\{\(\) => \{\s*logout\(\);\s*navigate\('\/'\);\s*\}\}[\s\S]*?<\/button>/m;
content = content.replace(logoutButtonRegex, '');

// Also remove `logout` from useAuth if no longer needed, or just leave it since the button is gone
fs.writeFileSync('src/App.tsx', content);
