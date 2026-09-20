const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

content = content.replace(/overflow: hidden;/g, 'overflow-x: hidden;\n  overflow-y: auto;');

fs.writeFileSync('src/index.css', content);
