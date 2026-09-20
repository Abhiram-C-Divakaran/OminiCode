const fs = require('fs');

// Fix server.ts
let serverContent = fs.readFileSync('server.ts', 'utf8');

serverContent = serverContent.replace(
  `const app = express();`,
  `const app = express();\n\nconst getRedirectUri = (req: express.Request) => {\n  const host = req.get('host');\n  const protocol = req.headers['x-forwarded-proto'] || req.protocol;\n  return \`\${protocol}://\${host}\`;\n};`
);

serverContent = serverContent.replace(
  `const chatMessages = [`,
  `const chatMessages: any[] = [`
);

fs.writeFileSync('server.ts', serverContent);

// Fix App.tsx
let appContent = fs.readFileSync('src/App.tsx', 'utf8');
appContent = appContent.replace(/<SecurityCenterPage \/>/, `<SecurityCenterPage onNavigate={() => {}} />`);
appContent = appContent.replace(/<IssuesPage \/>/, `<IssuesPage onNavigate={() => {}} />`);
appContent = appContent.replace(/<DocsPage \/>/, `<DocsPage onNavigate={() => {}} />`);

fs.writeFileSync('src/App.tsx', appContent);

