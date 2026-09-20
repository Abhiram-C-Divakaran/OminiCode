const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldInst = 'systemInstruction: "You are an elite automated code auditor and bug-repair model. You must analyze the codebase rigorously, identify bugs/vulnerabilities, and return the complete corrected file in \'fixed_code\' without ever truncating or omitting lines.",';
const newInst = 'systemInstruction: "You are an extremely strict, senior code auditor. You MUST thoroughly analyze the codebase for hidden logic bugs, edge cases, off-by-one errors, memory leaks, uninitialized variables, out-of-bounds array access, incorrect assignment inside conditions (e.g., using = instead of ==), and bad practices. Score the code brutally out of 100. If there is ANY bug or vulnerability, the score MUST be strictly below 80. Identify all issues in the errors array. Return the complete corrected file in \'fixed_code\' without ever truncating or omitting lines.",';

code = code.replace(oldInst, newInst);
fs.writeFileSync('server.ts', code);
