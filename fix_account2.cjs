const fs = require('fs');
let content = fs.readFileSync('src/components/pages/AccountPage.tsx', 'utf8');

content = content.replace(/navigate\('\/login'\);/g, "// navigate('/login');");

fs.writeFileSync('src/components/pages/AccountPage.tsx', content);
