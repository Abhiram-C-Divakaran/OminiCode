const fs = require('fs');
let content = fs.readFileSync('src/components/pages/BugChecker.tsx', 'utf8');

// Replace standard Editor import with Editor and DiffEditor
content = content.replace(
  `import Editor from '@monaco-editor/react';`,
  `import Editor, { DiffEditor } from '@monaco-editor/react';`
);

// We need to add the modified code for Diff Editor
// Let's create a patched version of the code snippet for the Diff Editor to use.
content = content.replace(
  `const mockFileContent = \`function processPayment(user, amount) {`,
  `const mockFileContent = \`function processPayment(user, amount) {`
);

// Ensure the fix modal includes the Diff Editor when showing diff
const diffEditorCode = `
                  <div className="bg-[#060d16] border border-[#1b2938] rounded-md overflow-hidden flex flex-col h-[300px]">
                    <div className="px-4 py-2 border-b border-[#1b2938] flex items-center justify-between text-[12px] text-[#8eaccb] shrink-0">
                      <span className="font-mono">Patch: fix-sql-inj.patch</span>
                      <button onClick={() => setShowDiff(!showDiff)} className="hover:text-white transition-colors">{showDiff ? 'View Inline Diff' : 'View Side-by-Side Diff'}</button>
                    </div>
                    <div className="flex-1 relative">
                       <DiffEditor
                         height="100%"
                         language="javascript"
                         theme="vs-dark"
                         original={mockFileContent}
                         modified={mockFileContent.replace('const query = "UPDATE balance SET amount = amount - " + amount + " ";\\n  db.execute(query);', selectedFinding.suggestedPatch)}
                         options={{
                           renderSideBySide: !showDiff, // showDiff here toggles inline vs side-by-side
                           minimap: { enabled: false },
                           readOnly: true,
                           fontSize: 13,
                           fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                           wordWrap: 'on'
                         }}
                       />
                    </div>
                  </div>
`;

// Replace the old patch display with DiffEditor
content = content.replace(
  /<div className="bg-\[#060d16\] border border-\[#1b2938\] rounded-md overflow-hidden">[\s\S]*?<\/div>(\s*<div className="flex flex-wrap items-center gap-3">)/,
  diffEditorCode + '$1'
);

fs.writeFileSync('src/components/pages/BugChecker.tsx', content);
