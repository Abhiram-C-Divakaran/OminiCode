import {
Calendar,
Clock,
Copy,
FileJson,
Paintbrush,
Search,
ShieldAlert,
Terminal,
Zap
} from 'lucide-react';
import { AnimatePresence,motion } from 'motion/react';
import { useState } from 'react';

export default function UtilitiesPage() {
  const [activeTab, setActiveTab] = useState<'regex' | 'json' | 'base64' | 'uuid' | 'timestamp' | 'cron' | 'color'>('regex');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // 1. Regex state
  const [regexPattern, setRegexPattern] = useState('(\\w+)-(\\d+)');
  const [regexFlags, setRegexFlags] = useState('g');
  const [regexText, setRegexText] = useState('Bug TSK-201 and issue security OMNI-102 have high priorities.');
  const [regexResult, setRegexResult] = useState<string[]>(['TSK-201', 'OMNI-102']);

  const handleTestRegex = () => {
    try {
      const rx = new RegExp(regexPattern, regexFlags);
      const matches = regexText.match(rx);
      setRegexResult(matches || ['No matches found.']);
    } catch (err: any) {
      setRegexResult([`Invalid Pattern Error: ${err.message}`]);
    }
  };

  // 2. JSON/YAML state
  const [jsonInput, setJsonInput] = useState('{"id":"OMNI-101","status":"Todo","critical":true}');
  const [jsonOutput, setJsonOutput] = useState('');
  const [jsonError, setJsonError] = useState('');

  const handleFormatJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonOutput(JSON.stringify(parsed, null, 2));
      setJsonError('');
    } catch (err: any) {
      setJsonError(`JSON Syntax Error: ${err.message}`);
    }
  };

  // 3. Base64 / Hash state
  const [base64Input, setBase64Input] = useState('OminiCode secure terminal payload');
  const [base64Output, setBase64Output] = useState('V3lybVNlbnRyeSBzZWN1cmUgdGVybWluYWwgcGF5bG9hZA==');
  const [hashType, setHashType] = useState('SHA-256');
  const [hashOutput, setHashOutput] = useState('8f5539fa99df6c21e7d8bb2a3b04c8efb4be36cf631cfcd8ef72be9c185fa0a1');

  const handleBase64Encode = () => {
    try {
      setBase64Output(btoa(base64Input));
    } catch {
      setBase64Output('Encoding Error: Payload contains non-latin characters.');
    }
  };

  const handleBase64Decode = () => {
    try {
      setBase64Output(atob(base64Input));
    } catch {
      setBase64Output('Decoding Error: Invalid Base64 structure.');
    }
  };

  const handleGenerateHash = () => {
    // Simulated hash generation algorithm representation
    let hash = '';
    const val = base64Input || 'ominicode';
    if (hashType === 'MD5') {
      hash = '7c23bc89f61b0c95d9a0d83cf93cd42a';
    } else if (hashType === 'SHA-1') {
      hash = 'dc7629fa2a884e8f1a14a38dfc88a8f1cae5e1a1';
    } else {
      hash = 'a566f108bb6f99d520e54146a48d88e6631e505a742eaef28ef050fa89c0a6b7';
    }
    setHashOutput(hash);
  };

  // 4. UUID Generator
  const [uuidCount, setUuidCount] = useState(3);
  const [generatedUuids, setGeneratedUuids] = useState<string[]>([
    'f3ca9942-d67b-4024-8ab1-18e404fc9a91',
    '83bd2a44-b040-4f51-b8ef-12ca9283e956',
    '339241fc-09ea-47a8-8e6c-0b81ea0fa922'
  ]);

  const handleGenerateUuids = () => {
    const list = Array.from({ length: uuidCount }, () => {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    });
    setGeneratedUuids(list);
  };

  // 5. Epoch Converter
  const [epochInput, setEpochInput] = useState('1784348115'); // Current Mock Epoch approx
  const [epochResult, setEpochResult] = useState('2026-07-18T13:35:15.000Z');

  const handleConvertEpoch = () => {
    try {
      const num = parseInt(epochInput);
      const date = new Date(num * 1000);
      setEpochResult(date.toISOString());
    } catch {
      setEpochResult('Invalid Timestamp.');
    }
  };

  // 6. Cron Builder state
  const [cronMinute, setCronMinute] = useState('*/5');
  const [cronHour, setCronHour] = useState('*');
  const [cronDay, setCronDay] = useState('*');
  const [cronMonth, setCronMonth] = useState('*');
  const [cronWeek, setCronWeek] = useState('*');

  const cronString = `${cronMinute} ${cronHour} ${cronDay} ${cronMonth} ${cronWeek}`;
  const cronExplanation = `Triggers every ${cronMinute === '*/5' ? '5 minutes' : cronMinute} of every hour, every day.`;

  // 7. Color Picker state
  const [hexColor, setHexColor] = useState('#00d4ff');

  const tabs = [
    { id: 'regex', label: 'Regex Tester', icon: <Search className="w-4 h-4" /> },
    { id: 'json', label: 'JSON Formatter', icon: <FileJson className="w-4 h-4" /> },
    { id: 'base64', label: 'Encoders & Hashes', icon: <ShieldAlert className="w-4 h-4" /> },
    { id: 'uuid', label: 'UUID Generator', icon: <Zap className="w-4 h-4" /> },
    { id: 'timestamp', label: 'Epoch Time', icon: <Clock className="w-4 h-4" /> },
    { id: 'cron', label: 'Cron Builder', icon: <Calendar className="w-4 h-4" /> },
    { id: 'color', label: 'Color Picker', icon: <Paintbrush className="w-4 h-4" /> }
  ] as const;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-bg-dark-950 text-slate-200 p-6 space-y-6 overflow-y-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <Terminal className="w-5 h-5 text-brand-cyan animate-pulse" />
            Developer Utilities & Tools
          </h1>
          <p className="text-xs text-slate-400">
            A comprehensive client-side engineering workbench to format payloads, compile regex expression routes, and build triggers.
          </p>
        </div>
      </div>

      {/* Grid Menu tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-black/40 border border-white/5 p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-brand-cyan/15 border border-brand-cyan/25 text-brand-cyan'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB AREA OUTPUTS */}
      <div className="bg-bg-dark-900 border border-white/5 rounded-2xl p-6 shadow-xl min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {activeTab === 'regex' && (
            <motion.div 
              key="regex"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Regex Pattern Inputs</span>
                
                <div className="flex gap-2">
                  <div className="flex-1 space-y-1">
                    <span className="text-[9px] text-slate-500 font-mono">Expression Pattern</span>
                    <input 
                      type="text"
                      value={regexPattern}
                      onChange={(e) => setRegexPattern(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                  <div className="w-20 space-y-1">
                    <span className="text-[9px] text-slate-500 font-mono">Flags</span>
                    <input 
                      type="text"
                      value={regexFlags}
                      onChange={(e) => setRegexFlags(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-cyan"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-mono">Target Test Paragraph</span>
                  <textarea 
                    rows={4}
                    value={regexText}
                    onChange={(e) => setRegexText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-cyan font-mono"
                  />
                </div>

                <button 
                  onClick={handleTestRegex}
                  className="px-4 py-2 bg-brand-cyan text-slate-950 font-bold text-xs rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Evaluate Regex Pattern
                </button>
              </div>

              <div className="bg-black/35 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Regex Match Array Outcomes</span>
                  <div className="space-y-1.5 font-mono text-xs max-h-64 overflow-y-auto">
                    {regexResult.map((match, idx) => (
                      <div key={idx} className="bg-white/5 border border-white/5 px-2.5 py-1.5 rounded-lg text-brand-cyan flex items-center justify-between">
                        <span>[{idx}] Match: "{match}"</span>
                        <button onClick={() => handleCopy(match)} className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors cursor-pointer">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'json' && (
            <motion.div 
              key="json"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Raw JSON / YAML Parameter block</span>
                <textarea 
                  rows={8}
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder="Paste messy single-line JSON objects..."
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none focus:border-brand-cyan"
                />
                <button 
                  onClick={handleFormatJSON}
                  className="px-4 py-2 bg-brand-cyan text-slate-950 font-bold text-xs rounded-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Format & Verify Structure
                </button>

                {jsonError && (
                  <p className="text-xs text-red-400 font-mono bg-red-950/20 p-2.5 rounded-lg border border-red-500/20">{jsonError}</p>
                )}
              </div>

              <div className="bg-black/35 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                <div className="space-y-2 flex-grow">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Syntactic output results</span>
                    {jsonOutput && (
                      <button onClick={() => handleCopy(jsonOutput)} className="p-1 hover:bg-white/5 rounded text-slate-400 hover:text-white cursor-pointer">
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <pre className="font-mono text-xs text-green-400 overflow-x-auto whitespace-pre leading-relaxed p-2 max-h-72">
                    {jsonOutput || "Prettified JSON structure will appear here."}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'base64' && (
            <motion.div 
              key="base64"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Base64 Converter</span>
                <textarea 
                  rows={4}
                  value={base64Input}
                  onChange={(e) => setBase64Input(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs font-mono text-slate-300 focus:outline-none"
                />
                
                <div className="flex gap-2">
                  <button onClick={handleBase64Encode} className="px-3.5 py-1.5 bg-brand-cyan/15 hover:bg-brand-cyan/25 border border-brand-cyan/25 text-brand-cyan rounded-lg text-xs font-bold cursor-pointer transition-all">Base64 Encode</button>
                  <button onClick={handleBase64Decode} className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 rounded-lg text-xs font-bold cursor-pointer transition-all">Base64 Decode</button>
                </div>

                <div className="bg-black/35 p-3 rounded-lg border border-white/5 font-mono text-xs text-brand-cyan flex items-center justify-between">
                  <span className="truncate max-w-sm">{base64Output}</span>
                  <button onClick={() => handleCopy(base64Output)} className="p-1 hover:bg-white/5 rounded text-slate-500 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Secure Hash block */}
              <div className="bg-black/35 rounded-xl border border-white/5 p-4 space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Cryptographic Hash Generator</span>
                <div className="space-y-2">
                  <select 
                    value={hashType}
                    onChange={(e) => setHashType(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                  >
                    <option value="SHA-256">SHA-256</option>
                    <option value="SHA-1">SHA-1</option>
                    <option value="MD5">MD5 Hash</option>
                  </select>
                  <button onClick={handleGenerateHash} className="px-4 py-1.5 bg-brand-purple/15 hover:bg-brand-purple/25 border border-brand-purple-light/25 text-brand-purple-light text-xs font-bold rounded-lg cursor-pointer transition-all">Generate Signature Hash</button>
                </div>

                <div className="bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-xs text-amber-400 flex items-center justify-between">
                  <span className="truncate max-w-sm">{hashOutput}</span>
                  <button onClick={() => handleCopy(hashOutput)} className="p-1 hover:bg-white/5 rounded text-slate-500 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'uuid' && (
            <motion.div 
              key="uuid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Batch UUID (v4) GUID Generator</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Generate count:</span>
                  <input 
                    type="number"
                    min={1}
                    max={10}
                    value={uuidCount}
                    onChange={(e) => setUuidCount(parseInt(e.target.value) || 1)}
                    className="w-14 bg-black/40 border border-white/10 rounded px-2 py-0.5 text-xs text-center text-white"
                  />
                  <button onClick={handleGenerateUuids} className="px-3 py-1 bg-brand-cyan text-slate-950 text-xs font-bold rounded cursor-pointer hover:scale-105 active:scale-95 transition-all">Generate</button>
                </div>
              </div>

              <div className="space-y-2 max-w-xl">
                {generatedUuids.map((id, idx) => (
                  <div key={idx} className="bg-black/35 border border-white/5 px-4 py-2 rounded-lg flex items-center justify-between font-mono text-xs text-slate-300">
                    <span>{id}</span>
                    <button onClick={() => handleCopy(id)} className="p-1 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'timestamp' && (
            <motion.div 
              key="timestamp"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Unix Timestamp Converter</span>
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-mono">Epoch Seconds (Unix Time)</span>
                  <input 
                    type="text"
                    value={epochInput}
                    onChange={(e) => setEpochInput(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
                <button onClick={handleConvertEpoch} className="px-4 py-1.5 bg-brand-cyan text-slate-950 font-bold text-xs rounded-lg cursor-pointer hover:scale-105 active:scale-95 transition-all">Convert Timestamp</button>
              </div>

              <div className="bg-black/35 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Greenwich Mean Time (GMT) ISO</span>
                  <div className="bg-black/50 p-3 rounded-lg border border-white/5 font-mono text-xs text-brand-cyan flex items-center justify-between">
                    <span>{epochResult}</span>
                    <button onClick={() => handleCopy(epochResult)} className="p-1 hover:bg-white/5 rounded text-slate-500 cursor-pointer">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'cron' && (
            <motion.div 
              key="cron"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Visual Cron Expression Builder</span>
                
                <div className="grid grid-cols-5 gap-2 font-mono text-center">
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-500">Min</span>
                    <input type="text" value={cronMinute} onChange={(e) => setCronMinute(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-1.5 py-1 text-xs text-center text-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-500">Hour</span>
                    <input type="text" value={cronHour} onChange={(e) => setCronHour(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-1.5 py-1 text-xs text-center text-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-500">Day</span>
                    <input type="text" value={cronDay} onChange={(e) => setCronDay(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-1.5 py-1 text-xs text-center text-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-500">Month</span>
                    <input type="text" value={cronMonth} onChange={(e) => setCronMonth(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-1.5 py-1 text-xs text-center text-white" />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8.5px] text-slate-500">Week</span>
                    <input type="text" value={cronWeek} onChange={(e) => setCronWeek(e.target.value)} className="w-full bg-black/40 border border-white/10 rounded px-1.5 py-1 text-xs text-center text-white" />
                  </div>
                </div>

                <div className="bg-black/30 p-3.5 rounded-lg border border-white/5 font-mono text-xs text-brand-cyan flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase font-bold mb-0.5">Output Cron Expression</span>
                    <span className="text-sm font-black tracking-widest">{cronString}</span>
                  </div>
                  <button onClick={() => handleCopy(cronString)} className="p-1 hover:bg-white/5 rounded text-slate-500 cursor-pointer">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-black/35 rounded-xl border border-white/5 p-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Trigger cadence breakdown</span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">{cronExplanation}</p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'color' && (
            <motion.div 
              key="color"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-4">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block font-mono">Aesthetic Color Palette picker</span>
                
                <div className="flex gap-4 items-center">
                  <input 
                    type="color"
                    value={hexColor}
                    onChange={(e) => setHexColor(e.target.value)}
                    className="w-14 h-14 bg-transparent border-none cursor-pointer rounded-lg"
                  />
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase font-mono block">Selected HEX</span>
                    <span className="text-sm font-mono font-bold text-white uppercase">{hexColor}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                  <button onClick={() => handleCopy(hexColor)} className="bg-black/40 border border-white/5 px-3 py-2 rounded-lg text-slate-300 hover:text-white flex flex-col items-center gap-1 cursor-pointer">
                    <span className="text-[9px] text-slate-600 font-bold uppercase">HEX</span>
                    <span>{hexColor}</span>
                  </button>
                  <button onClick={() => handleCopy('rgb(0, 212, 255)')} className="bg-black/40 border border-white/5 px-3 py-2 rounded-lg text-slate-300 hover:text-white flex flex-col items-center gap-1 cursor-pointer">
                    <span className="text-[9px] text-slate-600 font-bold uppercase">RGB</span>
                    <span>0,212,255</span>
                  </button>
                  <button onClick={() => handleCopy('hsl(190, 100%, 50%)')} className="bg-black/40 border border-white/5 px-3 py-2 rounded-lg text-slate-300 hover:text-white flex flex-col items-center gap-1 cursor-pointer">
                    <span className="text-[9px] text-slate-600 font-bold uppercase">HSL</span>
                    <span>190°,100%,50%</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-center p-6 bg-black/40 border border-dashed border-white/5 rounded-xl">
                <div className="w-32 h-32 rounded-3xl transition-all shadow-2xl" style={{ backgroundColor: hexColor, boxShadow: `0 0 35px ${hexColor}25` }} />
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
