const fs = require('fs');
let code = fs.readFileSync('src/components/DemoVideo.tsx', 'utf8');

// Replace the mock UI frames with IDE-like layouts
// Step 1:
const step0Regex = /\{\/\* FRAME 1.*?\{activeStep === 0 && \([\s\S]*?<\/motion\.div>\s*\)\}/s;
const step0Replacement = `{/* FRAME 1: Repo Scan Initializing */}
              {activeStep === 0 && (
                <motion.div 
                  key="step0"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex bg-[#0f0f11] text-left"
                >
                  <div className="w-48 bg-bg-dark-900 border-r border-white/5 p-3 flex flex-col gap-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Explorer</span>
                    <div className="flex items-center gap-2 text-[11px] text-white bg-white/5 p-1.5 rounded cursor-pointer border border-white/5">
                      <FileCode className="w-3.5 h-3.5 text-brand-cyan" /> server.ts
                    </div>
                  </div>
                  <div className="flex-1 p-4 font-mono text-[11px] text-slate-300 relative">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3">
                      <span className="text-slate-500">server.ts</span>
                      <RefreshCw className="w-3 h-3 text-brand-cyan animate-spin ml-auto" />
                      <span className="text-[9px] text-brand-cyan">WyrmSentry Scanning...</span>
                    </div>
                    <div><span className="text-brand-purple-light">import</span> express <span className="text-brand-purple-light">from</span> <span className="text-green-400">'express'</span>;</div>
                    <br/>
                    <div><span className="text-brand-purple-light">const</span> app = express();</div>
                    <br/>
                    <div>app.post(<span className="text-green-400">'/api/data'</span>, (req, res) =&gt; {</div>
                    <div className="pl-4"><span className="text-brand-purple-light">const</span> user = req.body.user;</div>
                    <div className="pl-4"><span className="text-brand-purple-light">const</span> query = <span className="text-green-400">"SELECT * FROM admins WHERE u = '"</span> + user + <span className="text-green-400">"'"</span>;</div>
                    <div className="pl-4">db.execute(query);</div>
                    <div>});</div>
                    <div className="absolute inset-0 bg-brand-cyan/5 animate-pulse pointer-events-none" />
                  </div>
                </motion.div>
              )}`;

const step1Regex = /\{\/\* FRAME 2.*?\{activeStep === 1 && \([\s\S]*?<\/motion\.div>\s*\)\}/s;
const step1Replacement = `{/* FRAME 2: Deep Security Audit */}
              {activeStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex bg-[#0f0f11] text-left"
                >
                  <div className="w-48 bg-bg-dark-900 border-r border-white/5 p-3 flex flex-col gap-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Explorer</span>
                    <div className="flex items-center gap-2 text-[11px] text-white bg-red-500/10 p-1.5 rounded border border-red-500/20">
                      <FileCode className="w-3.5 h-3.5 text-red-400" /> server.ts
                    </div>
                  </div>
                  <div className="flex-1 p-4 font-mono text-[11px] text-slate-300 relative">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3">
                      <span className="text-slate-500">server.ts</span>
                      <Shield className="w-3 h-3 text-amber-400 animate-pulse ml-auto" />
                      <span className="text-[9px] text-amber-400">Vulnerability Detected</span>
                    </div>
                    <div><span className="text-brand-purple-light">import</span> express <span className="text-brand-purple-light">from</span> <span className="text-green-400">'express'</span>;</div>
                    <br/>
                    <div><span className="text-brand-purple-light">const</span> app = express();</div>
                    <br/>
                    <div>app.post(<span className="text-green-400">'/api/data'</span>, (req, res) =&gt; {</div>
                    <div className="pl-4"><span className="text-brand-purple-light">const</span> user = req.body.user;</div>
                    <div className="pl-4 bg-red-500/20 border-l-2 border-red-500 py-0.5 relative group">
                      <span className="text-brand-purple-light">const</span> query = <span className="text-green-400">"SELECT * FROM admins WHERE u = '"</span> + user + <span className="text-green-400">"'"</span>;
                      <div className="absolute left-0 bottom-full mb-1 bg-red-500/90 text-white text-[9px] px-2 py-1 rounded shadow-lg whitespace-nowrap">CRITICAL: SQL Injection vulnerability</div>
                    </div>
                    <div className="pl-4">db.execute(query);</div>
                    <div>});</div>
                  </div>
                </motion.div>
              )}`;

const step2Regex = /\{\/\* FRAME 3.*?\{activeStep === 2 && \([\s\S]*?<\/motion\.div>\s*\)\}/s;
const step2Replacement = `{/* FRAME 3: Smart AI Patches */}
              {activeStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex bg-[#0f0f11] text-left"
                >
                  <div className="flex-1 p-4 font-mono text-[11px] text-slate-300 relative border-r border-white/5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3">
                      <span className="text-slate-500">server.ts (Diff)</span>
                      <Sparkles className="w-3 h-3 text-brand-purple-light animate-spin ml-auto" />
                      <span className="text-[9px] text-brand-purple-light">Generating Patch</span>
                    </div>
                    <div className="pl-4 bg-red-500/10 text-red-400 py-0.5 opacity-60 line-through decoration-red-500/50">
                      <span className="text-red-400/50">const</span> query = "SELECT * FROM admins WHERE u = '" + user + "'";
                    </div>
                    <div className="pl-4 bg-green-500/10 text-green-400 py-0.5 border-l-2 border-green-500">
                      <span className="text-green-400 font-bold">+</span> <span className="text-green-400">const</span> query = <span className="text-green-300">"SELECT * FROM admins WHERE u = ?"</span>;
                    </div>
                    <div className="pl-4 bg-green-500/10 text-green-400 py-0.5 border-l-2 border-green-500">
                      <span className="text-green-400 font-bold">+</span> db.execute(query, [user]);
                    </div>
                  </div>
                  <div className="w-48 bg-bg-dark-900 p-3 flex flex-col gap-3">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="w-3 h-3"/> AI Assistant</span>
                    <div className="bg-brand-purple/10 border border-brand-purple-light/20 p-2 rounded-lg text-[10px] text-slate-300">
                      I replaced the string concatenation with a parameterized query to prevent SQL injection payloads.
                    </div>
                    <button className="bg-brand-purple hover:bg-brand-purple-light text-white text-[10px] font-bold py-1.5 rounded transition-all mt-auto cursor-pointer">
                      Apply Fix
                    </button>
                  </div>
                </motion.div>
              )}`;

const step3Regex = /\{\/\* FRAME 4.*?\{activeStep === 3 && \([\s\S]*?<\/motion\.div>\s*\)\}/s;
const step3Replacement = `{/* FRAME 4: Dialogue / Completing */}
              {activeStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex bg-[#0f0f11] text-left"
                >
                  <div className="flex-1 p-4 font-mono text-[11px] text-slate-300 relative border-r border-white/5">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3">
                      <span className="text-slate-500">server.ts</span>
                      <CheckCircle className="w-3 h-3 text-green-400 ml-auto" />
                      <span className="text-[9px] text-green-400">Secure</span>
                    </div>
                    <div><span className="text-brand-purple-light">import</span> express <span className="text-brand-purple-light">from</span> <span className="text-green-400">'express'</span>;</div>
                    <br/>
                    <div><span className="text-brand-purple-light">const</span> app = express();</div>
                    <br/>
                    <div>app.post(<span className="text-green-400">'/api/data'</span>, (req, res) =&gt; {</div>
                    <div className="pl-4"><span className="text-brand-purple-light">const</span> user = req.body.user;</div>
                    <div className="pl-4"><span className="text-brand-purple-light">const</span> query = <span className="text-green-300">"SELECT * FROM admins WHERE u = ?"</span>;</div>
                    <div className="pl-4">db.execute(query, [user]);</div>
                    <div>});</div>
                  </div>
                  <div className="w-48 bg-bg-dark-900 p-3 flex flex-col gap-3">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Sparkles className="w-3 h-3"/> AI Assistant</span>
                    <div className="bg-brand-cyan/10 border border-brand-cyan/20 p-2 rounded-lg text-[10px] text-brand-cyan font-medium">
                      Code safety rating 100%. Patch successfully applied and merged.
                    </div>
                  </div>
                </motion.div>
              )}`;

code = code.replace(step0Regex, step0Replacement);
code = code.replace(step1Regex, step1Replacement);
code = code.replace(step2Regex, step2Replacement);
code = code.replace(step3Regex, step3Replacement);

fs.writeFileSync('src/components/DemoVideo.tsx', code);
