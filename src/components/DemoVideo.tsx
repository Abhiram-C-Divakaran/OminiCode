import { CheckCircle,FileCode,ShieldAlert,Sparkles } from 'lucide-react';
import { AnimatePresence,motion } from 'motion/react';
import { useEffect,useState } from 'react';

export default function DemoVideo() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-[#0b0c11] aspect-video w-full max-w-4xl mx-auto group">
      
      {/* Top OS Bar */}
      <div className="h-8 bg-[#1a1b26] border-b border-white/5 flex items-center px-4 gap-2 z-20 relative">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>
        <div className="mx-auto text-[10px] font-mono text-slate-500 font-medium tracking-wider uppercase">
          OminiCode Code Analysis
        </div>
      </div>

      <div className="absolute inset-0 top-8 bg-[#0f0f11] overflow-hidden">
        <AnimatePresence mode="wait">
          {activeStep === 0 && (
            <motion.div 
              key="step0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center relative"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,212,255,0.05)_0%,transparent_70%)]" />
              <ShieldAlert className="w-16 h-16 text-brand-cyan mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(0,212,255,0.3)]" />
              <div className="text-xl font-bold text-white mb-2">Initiating Deep Scan</div>
              <div className="flex gap-1">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-brand-cyan"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full p-8 font-mono text-sm text-slate-300 flex flex-col"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-4 text-xs">
                <FileCode className="w-4 h-4 text-red-400" />
                <span className="text-slate-400">authController.ts</span>
                <span className="ml-auto text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded">Critical: SQL Injection</span>
              </div>
              <div className="space-y-2">
                <div>const userId = req.body.id;</div>
                <div className="bg-red-500/20 border-l-2 border-red-500 pl-4 py-1 text-red-200">
                  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
                </div>
                <div>db.execute(query);</div>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full p-8 font-mono text-sm text-slate-300 flex flex-col"
            >
              <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-4 text-xs">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                <span className="text-slate-400">AI Suggested Patch</span>
              </div>
              <div className="space-y-2">
                <div>const userId = req.body.id;</div>
                <div className="bg-red-500/10 border-l-2 border-red-500/50 pl-4 py-1 text-red-400/50 line-through">
                  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
                </div>
                <div className="bg-green-500/20 border-l-2 border-green-500 pl-4 py-1 text-green-300">
                  const query = "SELECT * FROM users WHERE id = $1";<br/>
                  db.execute(query, [userId]);
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <CheckCircle className="w-16 h-16 text-emerald-400 mb-6 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]" />
              <div className="text-xl font-bold text-white mb-2">Repository Secured</div>
              <p className="text-slate-400 text-sm">Vulnerabilities patched successfully.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
