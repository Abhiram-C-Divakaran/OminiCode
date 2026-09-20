import 'dotenv/config';
import fetch from 'node-fetch';
async function run() {
  const res = await fetch('https://api.groq.com/openai/v1/models', {
    headers: { 'Authorization': 'Bearer ' + process.env.GROQ_API_KEY }
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
