import {
Activity,
AlertCircle,
CheckCircle,
CloudLightning,
Cpu,
Database,
GitBranch,
Play,
Power,
Terminal,
XCircle
} from 'lucide-react';
import { useEffect,useRef,useState } from 'react';
import { DevOpsService,Environment,LogEvent,MetricSample,PipelineRun } from '../../services/devopsService';

export default function DevOpsPage() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [activeEnv, setActiveEnv] = useState<string | null>(null);
  
  const [telemetry, setTelemetry] = useState<MetricSample | null>(null);
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>([]);
  const [logs, setLogs] = useState<LogEvent[]>([]);
  
  const [isStreaming, setIsStreaming] = useState(true);
  const [triggerState, setTriggerState] = useState<'DEFAULT' | 'SUBMITTING' | 'SUCCESS' | 'ERROR'>('DEFAULT');
  const [triggerError, setTriggerError] = useState('');
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = DevOpsService.subscribeToEnvironments((envs) => {
      setEnvironments(envs);
      if (!activeEnv && envs.length > 0) {
        setActiveEnv(envs[0].id);
      }
    });
    return unsub;
  }, [activeEnv]);

  useEffect(() => {
    if (!activeEnv) return;
    const unsub = DevOpsService.subscribeToEnvironmentTelemetry(activeEnv, (data) => {
      setTelemetry(data);
    });
    return unsub;
  }, [activeEnv]);

  useEffect(() => {
    const unsub = DevOpsService.subscribeToPipelineRuns((runs) => {
      setPipelineRuns(runs);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!isStreaming) return; // if paused, do not update the logs state or we can store them in a buffer.
    const unsub = DevOpsService.subscribeToLogs(activeEnv, (newLogs) => {
      setLogs(newLogs);
    });
    return unsub;
  }, [activeEnv, isStreaming]);

  useEffect(() => {
    if (isStreaming) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isStreaming]);

  const handleTriggerPipeline = async () => {
    setTriggerState('SUBMITTING');
    setTriggerError('');
    try {
      await DevOpsService.triggerPipeline('repo-1', 'main', activeEnv || 'production');
      setTriggerState('SUCCESS');
      setTimeout(() => setTriggerState('DEFAULT'), 3000);
    } catch (e: any) {
      setTriggerState('ERROR');
      setTriggerError(e.message || 'Failed to trigger');
      setTimeout(() => setTriggerState('DEFAULT'), 5000);
    }
  };

  const getEnvColor = (status: string) => {
    switch (status) {
      case 'HEALTHY': return 'bg-brand-cyan shadow-brand-cyan/20';
      case 'DEGRADED': return 'bg-amber-500 shadow-amber-500/20';
      case 'WARNING': return 'bg-yellow-400 shadow-yellow-400/20';
      case 'CRITICAL': return 'bg-red-500 shadow-red-500/20';
      case 'OFFLINE': return 'bg-slate-600';
      default: return 'bg-slate-600';
    }
  };

  const formatTime = (ts: number) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString();
  };

  const formatAgo = (ts: number) => {
    if (!ts) return 'Unknown';
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff/60)}m ago`;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[var(--color-background)] p-6 lg:p-8 custom-scrollbar">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">DevOps &amp; Deployment Pipelines</h1>
          <p className="text-slate-400 text-sm mt-1">Manage infrastructure, view live telemetry, and trigger CI/CD pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleTriggerPipeline}
            disabled={triggerState === 'SUBMITTING' || triggerState === 'SUCCESS'}
            className="flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 hover:bg-brand-cyan/20 text-brand-cyan rounded-lg border border-brand-cyan/30 transition-all font-bold text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {triggerState === 'SUBMITTING' ? <Activity className="w-4 h-4 animate-spin" /> : 
             triggerState === 'SUCCESS' ? <CheckCircle className="w-4 h-4" /> : 
             triggerState === 'ERROR' ? <XCircle className="w-4 h-4 text-red-400" /> : 
             <Play className="w-4 h-4" />}
            {triggerState === 'SUBMITTING' ? 'Triggering...' : 
             triggerState === 'SUCCESS' ? 'Pipeline Started' : 
             triggerState === 'ERROR' ? 'Retry' : 'Trigger Main Pipeline'}
          </button>
        </div>
      </div>
      
      {triggerError && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4" /> {triggerError}
        </div>
      )}

      {/* Environments Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {environments.map(node => (
          <button
            key={node.id}
            onClick={() => setActiveEnv(node.id)}
            className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
              activeEnv === node.id 
                ? 'bg-brand-cyan/5 border-brand-cyan/25 shadow-[0_0_15px_rgba(0,212,255,0.05)]' 
                : 'bg-bg-dark-900 border-white/5 hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs font-bold text-white block">{node.name}</span>
              <span className={`w-2 h-2 rounded-full ${node.status !== 'OFFLINE' && 'animate-pulse'} shadow-[0_0_8px_currentColor] ${getEnvColor(node.status)}`} />
            </div>
            <span className="text-[10px] font-mono text-slate-500 block">{node.endpoint}</span>
            <div className="flex items-center justify-between mt-2">
              <span className="text-[9.5px] font-bold text-brand-cyan uppercase tracking-wider block">View Telemetry</span>
              <span className="text-[9px] text-slate-500">Seen {formatAgo(node.lastHeartbeat)}</span>
            </div>
          </button>
        ))}
        {environments.length === 0 && (
          <div className="col-span-full p-4 border border-dashed border-white/10 rounded-xl text-center text-slate-500 text-sm">
            No environments configured.
          </div>
        )}
      </div>

      {/* Health Telemetry Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-bg-dark-900 border border-white/5 p-4 rounded-xl mb-6 relative">
        {!telemetry && (
          <div className="absolute inset-0 bg-bg-dark-900/80 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-xl">
             <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Telemetry Unavailable</span>
          </div>
        )}
        
        {/* CPU */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-brand-cyan" />
              Processor CPU Load
            </span>
            <span className="font-mono text-xs font-bold text-white">{telemetry?.cpu ?? 0}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
            <div className={`h-full transition-all duration-1000 ${telemetry && telemetry.cpu > 80 ? 'bg-red-400' : telemetry && telemetry.cpu > 50 ? 'bg-amber-400' : 'bg-brand-cyan'}`} style={{ width: `${telemetry?.cpu ?? 0}%` }} />
          </div>
        </div>

        {/* RAM */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-brand-purple-light" />
              Memory Pool (RAM)
            </span>
            <span className="font-mono text-xs font-bold text-white">{telemetry?.memory ?? 0}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
            <div className="h-full bg-brand-purple-light transition-all duration-1000" style={{ width: `${telemetry?.memory ?? 0}%` }} />
          </div>
        </div>

        {/* Disk */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <Database className="w-3.5 h-3.5 text-green-400" />
              Disk Storage Volume
            </span>
            <span className="font-mono text-xs font-bold text-white">{telemetry?.disk ?? 0}%</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
            <div className="h-full bg-green-400 transition-all duration-1000" style={{ width: `${telemetry?.disk ?? 0}%` }} />
          </div>
        </div>

        {/* Network */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
              <CloudLightning className="w-3.5 h-3.5 text-amber-400" />
              Network IO Speed
            </span>
            <span className="font-mono text-xs font-bold text-white">{telemetry?.network ?? 0} Mb/s</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded overflow-hidden">
            <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${((telemetry?.network ?? 0) / 1000) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Split Pipelines and Log Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* CI/CD list */}
        <div className="lg:col-span-5 bg-bg-dark-900 border border-white/5 rounded-2xl p-4.5 space-y-4">
          <span className="text-[10.5px] uppercase font-bold tracking-widest text-slate-400 block border-b border-white/5 pb-2">Active Runner History</span>
          
          <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar">
            {pipelineRuns.map(job => (
              <div key={job.id} className="p-3 bg-black/20 border border-white/5 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-white/10 transition-colors cursor-pointer">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9.5px] font-extrabold text-slate-500">{job.id}</span>
                    <span className="font-bold text-white truncate block max-w-44">{job.commitMessage}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                    <GitBranch className="w-3 h-3 text-slate-600" />
                    <span>{job.branch}</span>
                    <span>•</span>
                    <span>{job.duration || (job.status === 'RUNNING' ? 'In progress' : '')}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-right space-y-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                    job.status === 'SUCCESS' 
                      ? 'bg-green-500/15 text-green-400' 
                      : job.status === 'FAILED' 
                      ? 'bg-red-500/15 text-red-400' 
                      : job.status === 'RUNNING'
                      ? 'bg-brand-cyan/15 text-brand-cyan animate-pulse'
                      : 'bg-slate-500/15 text-slate-400'
                  }`}>
                    {job.status}
                  </span>
                  <span className="text-[9.5px] text-slate-500 font-mono block">{formatTime(job.startedAt)}</span>
                </div>
              </div>
            ))}
            {pipelineRuns.length === 0 && (
               <div className="text-center text-slate-500 text-xs italic py-4">No runner history found.</div>
            )}
          </div>
        </div>

        {/* Collapsible log terminal */}
        <div className="lg:col-span-7 bg-bg-dark-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-bg-dark-950 border-b border-white/5 px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-brand-cyan" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Daemon Logstream Tracer</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsStreaming(!isStreaming)}
                className={`p-1 hover:bg-white/5 rounded transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase ${
                  isStreaming ? 'text-brand-cyan' : 'text-slate-500'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{isStreaming ? 'Streaming' : 'Paused'}</span>
              </button>
              <button
                onClick={() => setLogs([])}
                className="text-[10px] font-bold text-slate-500 hover:text-white cursor-pointer"
              >
                Clear View
              </button>
            </div>
          </div>
          <div className="p-4 bg-black/60 font-mono text-[11px] text-slate-300 min-h-[300px] max-h-[300px] overflow-y-auto space-y-1 custom-scrollbar">
            {logs.length === 0 ? (
              <p className="text-slate-500 italic">No log outputs streaming inside this tracer thread...</p>
            ) : (
              logs.map((log, idx) => (
                <div key={log.id} className="whitespace-pre-wrap leading-relaxed select-text flex gap-2">
                  <span className="text-slate-600 font-extrabold flex-shrink-0">[{formatTime(log.timestamp)}]</span>
                  <span className={`font-bold flex-shrink-0 ${
                    log.severity === 'ERROR' ? 'text-red-400' :
                    log.severity === 'WARN' ? 'text-amber-400' :
                    'text-brand-cyan'
                  }`}>{log.severity}</span>
                  <span className="text-slate-300 break-all">{log.message}</span>
                </div>
              ))
            )}
            <div ref={logsEndRef} />
          </div>
        </div>

      </div>
    </div>
  );
}
