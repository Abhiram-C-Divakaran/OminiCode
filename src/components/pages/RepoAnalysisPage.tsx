
import React, { useState, useEffect } from 'react';
import { Github, FolderGit2, AlertCircle, ArrowRight, FileCode, CheckCircle2, Loader2, GitCommit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useReviews } from '../../context/ReviewContext';

export default function RepoAnalysisPage() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('gh_token'));
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const [files, setFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  
  const { setCode, setLanguage, setFilePath } = useReviews();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) fetchRepos();
    
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'GITHUB_AUTH_SUCCESS') {
        localStorage.setItem('gh_token', e.data.token);
        setToken(e.data.token);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [token]);

  const connectGitHub = async () => {
    try {
      const res = await fetch('/api/auth/github/url');
      const data = await res.json();
      window.open(data.url, 'gh_oauth', 'width=600,height=700');
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/github/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      });
      const data = await res.json();
      if (Array.isArray(data)) setRepos(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const fetchFiles = async (repo: any) => {
    setSelectedRepo(repo);
    setLoadingFiles(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${repo.owner.login}/${repo.name}/contents`, {
        headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setFiles(data.filter((f: any) => f.type === 'file' && !f.name.startsWith('.')));
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingFiles(false);
  };

  const analyzeFile = async (file: any) => {
    try {
      const res = await fetch('/api/github/file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, owner: selectedRepo.owner.login, repo: selectedRepo.name, path: file.path })
      });
      const data = await res.json();
      
      let ext = file.name.split('.').pop() || 'typescript';
      const langMap: Record<string, string> = { ts: 'typescript', tsx: 'typescript', js: 'javascript', jsx: 'javascript', py: 'python', java: 'java', cpp: 'cpp', c: 'c', rs: 'rust', go: 'go' };
      
      setCode(data.content);
      setLanguage(langMap[ext] || ext);
      setFilePath(file.path);
      
      // Store current repo context for Auto-Fix commit
      localStorage.setItem('gh_active_repo', JSON.stringify({ owner: selectedRepo.owner.login, repo: selectedRepo.name, path: file.path, branch: selectedRepo.default_branch }));
      
      navigate('/review');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8 w-full pb-24 h-full overflow-y-auto custom-scrollbar">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <FolderGit2 className="w-6 h-6 text-brand-cyan" />
          Repositories & Pull Requests
        </h1>
        <p className="text-sm text-slate-400">
          Connect your GitHub account to analyze repositories, review code, and auto-fix issues directly.
        </p>
      </div>

      {!token ? (
        <div className="bg-bg-dark-900 border border-white/5 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-brand-cyan/10 flex items-center justify-center">
            <Github className="w-8 h-8 text-brand-cyan" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Connect GitHub Account</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              Link your GitHub account to fetch your repositories and directly commit AI fixes to your branches.
            </p>
          </div>
          <button 
            onClick={connectGitHub}
            className="flex items-center gap-2 px-6 py-3 bg-brand-cyan text-black font-bold text-sm rounded-lg hover:bg-brand-cyan-light transition-colors"
          >
            <Github className="w-4 h-4" />
            Connect GitHub
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Repositories List */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Your Repositories</h3>
              <button onClick={() => { setToken(null); localStorage.removeItem('gh_token'); }} className="text-[10px] text-slate-500 hover:text-red-400">Disconnect</button>
            </div>
            
            <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-brand-cyan" /></div>
              ) : repos.map((repo) => (
                <button
                  key={repo.id}
                  onClick={() => fetchFiles(repo)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${selectedRepo?.id === repo.id ? 'bg-brand-cyan/10 border-brand-cyan/30' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                >
                  <div className="font-bold text-slate-200 text-sm truncate">{repo.name}</div>
                  <div className="text-[10px] text-slate-500 mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1"><GitCommit className="w-3 h-3" /> {repo.default_branch}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Files List */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-white text-sm">
              {selectedRepo ? `Files in ${selectedRepo.name}` : 'Select a repository'}
            </h3>
            
            {!selectedRepo ? (
               <div className="bg-black/20 border border-white/5 rounded-xl p-12 text-center text-slate-500 text-sm">
                 Select a repository from the left to view files available for AI review.
               </div>
            ) : (
               <div className="bg-bg-dark-900 border border-white/5 rounded-xl overflow-hidden">
                 {loadingFiles ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-6 h-6 animate-spin text-brand-cyan" /></div>
                 ) : files.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-sm">No supported files found in root.</div>
                 ) : (
                   <div className="divide-y divide-white/5">
                     {files.map(file => (
                       <div key={file.path} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors group">
                         <div className="flex items-center gap-3">
                           <FileCode className="w-4 h-4 text-slate-500" />
                           <span className="text-sm text-slate-300 font-mono">{file.path}</span>
                         </div>
                         <button 
                           onClick={() => analyzeFile(file)}
                           className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 px-3 py-1.5 bg-brand-cyan/20 text-brand-cyan font-bold text-xs rounded border border-brand-cyan/30 hover:bg-brand-cyan hover:text-black transition-all"
                         >
                           Analyze
                           <ArrowRight className="w-3 h-3" />
                         </button>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
