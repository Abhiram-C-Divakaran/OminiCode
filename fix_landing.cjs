const fs = require('fs');
let content = fs.readFileSync('src/components/pages/LandingPage.tsx', 'utf8');

// Replace Navbar
const oldNav = `<nav className="border-b border-white/5 bg-[#080911]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
              <DragonLogo size={24} glow={true} />
              <span className="font-extrabold text-white tracking-tight text-lg">WyrmSentry</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#041d2f] text-[#00a8ff] border border-[#00a8ff]/20 ml-2">AI</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
              <a href="#features" className="hover:text-white transition-colors">Features</a>
              <a href="#demo" className="hover:text-white transition-colors">System Demo</a>
              <a href="#playground" className="hover:text-white transition-colors">Interactive Playground</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <button onClick={() => navigate('/docs')} className="hover:text-white transition-colors bg-transparent border-none">Docs</button>
              <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors bg-transparent border-none">Dashboard</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/register')} 
              className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg shadow-sm hover:bg-slate-100 transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>`;

const newNav = `<nav className="border-b border-white/5 bg-[#080911]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <DragonLogo size={22} glow={true} />
            <span className="font-bold text-white tracking-tight text-base">WyrmSentry</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#041d2f] text-[#00a8ff] border border-[#00a8ff]/20 ml-1">AI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#demo" className="hover:text-white transition-colors">System Demo</a>
            <a href="#playground" className="hover:text-white transition-colors">Interactive Playground</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <button onClick={() => navigate('/docs')} className="hover:text-white transition-colors bg-transparent border-none p-0">Docs</button>
            <button onClick={() => navigate('/dashboard')} className="hover:text-white transition-colors bg-transparent border-none p-0">Dashboard</button>
          </div>

          <div className="flex items-center">
            <button 
              onClick={() => navigate('/register')} 
              className="px-4 py-1.5 bg-white text-black text-[13px] font-bold rounded-md shadow-sm hover:bg-slate-100 transition-all cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>`;

const oldHero = `<section className="pt-32 pb-20 overflow-hidden relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-purple/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00d2ff]/5 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18112e] border border-brand-purple/20 text-xs font-bold text-[#a78bfa] uppercase tracking-wide mb-8">
            <Sparkles className="w-3 h-3" />
            <span>Introducing WyrmSentry v2.0 Dragon-Eye AI Engine</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
            Dragon-Eye Code Review,<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00d2ff] via-[#3a7bd5] to-[#8a2be2]">Unmatched Code<br/>Protection.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
            Enlist WyrmSentry to patrol your codebases. Upload scripts, analyze complex repositories, receive intelligent security patches, and incinerate security bugs instantly.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/register')} 
              className="px-6 py-3 bg-[#6d28d9] text-white font-bold rounded-lg shadow-[0_0_20px_rgba(109,40,217,0.4)] hover:bg-[#5b21b6] transition-all flex items-center gap-2 text-sm"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-6 py-3 bg-[#1e2029] border border-white/5 text-white font-bold rounded-lg hover:bg-white/5 transition-all flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" /> Watch Demo Video
            </button>
          </div>
        </div>
      </section>`;

const newHero = `<section className="pt-24 pb-16 overflow-hidden relative text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-purple/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#00d2ff]/5 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18112e] border border-brand-purple/20 text-[10px] font-bold text-[#a78bfa] uppercase tracking-widest mb-6">
            <Sparkles className="w-3 h-3" />
            <span>Introducing WyrmSentry v2.0 Dragon-Eye AI Engine</span>
          </div>
          
          <h1 className="text-5xl md:text-[56px] font-extrabold text-white tracking-tight leading-[1.1] mb-6 max-w-3xl mx-auto">
            Dragon-Eye Code Review, <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00d2ff] via-[#3a7bd5] to-[#8a2be2]">Unmatched Code Protection.</span>
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
            Enlist WyrmSentry to patrol your codebases. Upload scripts, analyze complex repositories, receive intelligent security patches, and incinerate security bugs instantly.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => navigate('/register')} 
              className="px-5 py-2.5 bg-[#6d28d9] text-white font-bold rounded-md shadow-[0_0_15px_rgba(109,40,217,0.3)] hover:bg-[#5b21b6] transition-all flex items-center gap-2 text-[13px] cursor-pointer"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-5 py-2.5 bg-[#1e2029] border border-white/5 text-white font-bold rounded-md hover:bg-white/5 transition-all flex items-center gap-2 text-[13px] cursor-pointer"
            >
              <Play className="w-4 h-4" /> Watch Demo Video
            </button>
          </div>
        </div>
      </section>`;

content = content.replace(oldNav, newNav);
content = content.replace(oldHero, newHero);
fs.writeFileSync('src/components/pages/LandingPage.tsx', content);
