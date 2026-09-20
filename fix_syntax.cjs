const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

content = content.replace(/potentially accessing or modifying data they shouldn't\.',/g, "potentially accessing or modifying data they shouldn\\'t.',");

fs.writeFileSync('server.ts', content);
