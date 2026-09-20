require('dotenv').config();
const fetch = require('node-fetch');
async function run() {
  const res = await fetch('https://api.groq.com/openai/v1/models', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY }
  });
  const data = await res.json();
  console.log("Models:", data.data.map(m => m.id).join(', '));
}
run();
