const fetch = require('node-fetch');
async function run() {
  const res = await fetch('http://localhost:3000/api/ai/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filePath: 'code-snippet.cpp',
      code: "int main() { return 0; }",
      language: 'cpp',
      rules: []
    })
  });
  const text = await res.text();
  console.log("Response:", res.status, text);
}
run();
