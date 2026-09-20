const fs = require('fs');
let content = fs.readFileSync('src/components/pages/AccountPage.tsx', 'utf8');

// The AccountPage checks if !user then navigate('/login')
const authCheckRegex = /if \(\!user\) \{\s*navigate\('\/login'\);\s*\}/g;
content = content.replace(authCheckRegex, '');

fs.writeFileSync('src/components/pages/AccountPage.tsx', content);
