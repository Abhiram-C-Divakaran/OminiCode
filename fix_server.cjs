const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

// The block starts with app.get('/api/repositories/:id/file'
// Let's just use string replacement

code = code.replace(
  /res\.json\(\{ content: "export function login\(user, pass\) \{\n  \/\/ TODO: hash password\n  const query = 'SELECT \* FROM users WHERE username = ' \+ user \+ ' AND password = ' \+ pass;\n  db\.execute\(query\);\n\}\n" \}\);/g,
  "res.json({ content: 'export function login(user, pass) {\\n  // TODO: hash password\\n  const query = \\'SELECT * FROM users WHERE username = \\' + user + \\' AND password = \\' + pass;\\n  db.execute(query);\\n}' });"
);

code = code.replace(
  /res\.json\(\{ content: "console\.log\('Hello WyrmSentry'\);\n" \}\);/g,
  "res.json({ content: 'console.log(\\'Hello WyrmSentry\\');\\n' });"
);

code = code.replace(
  /res\.json\(\{ content: "\/\/ File contents for " \+ path \+ "\n" \}\);/g,
  "res.json({ content: '// File contents for ' + path + '\\n' });"
);

code = code.replace(
  /patch: "@@ -1,4 \+1,4 @@\\n export function login\(user, pass\) \{\\n-  const query = 'SELECT \* FROM users WHERE username = ' \+ user \+ ' AND password = ' \+ pass;\\n-  db\.execute\(query\);\\n\+  const query = 'SELECT \* FROM users WHERE username = \? AND password = \?';\\n\+  db\.execute\(query, \[user, pass\]\);\\n \}\\n",/g,
  "patch: '@@ -1,4 +1,4 @@\\n export function login(user, pass) {\\n-  const query = \\'SELECT * FROM users WHERE username = \\' + user + \\' AND password = \\' + pass;\\n-  db.execute(query);\\n+  const query = \\'SELECT * FROM users WHERE username = ? AND password = ?\\';\\n+  db.execute(query, [user, pass]);\\n }\\n',"
);

fs.writeFileSync('server.ts', code);
