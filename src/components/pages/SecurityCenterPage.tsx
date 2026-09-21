import { useAuth } from '../../context/AuthContext';
import {
Activity,
AlertTriangle,
Box,
ExternalLink,
Key,
Shield,
ShieldCheck,
TrendingUp
} from 'lucide-react';
import { useEffect,useState } from 'react';
import {
Area,
AreaChart,
CartesianGrid,Tooltip as RechartsTooltip,ResponsiveContainer,
XAxis,YAxis
} from 'recharts';
import {
RepositoryRisk,
SecurityCenterService,
SecurityEvent,
SecurityFinding,
SecurityScoreMetrics
} from '../../services/securityCenterService';

export default function SecurityCenterPage() {
  const { firebaseUser, isLoading: authLoading, signInWithGoogle } = useAuth();

  const [metrics, setMetrics] = useState<SecurityScoreMetrics | null>(null);
  const [repos, setRepos] = useState<RepositoryRisk[]>([]);
  const [findings, setFindings] = useState<SecurityFinding[]>([]);
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [trendData, setTrendData] = useState<{ name: string; critical: number; high: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');



  useEffect(() => {
    if (!firebaseUser) return;
    
    setLoading(true);
    setLoadError('');
    let unsubMetrics = () => {};
    let unsubRepos = () => {};
    let unsubFindings = () => {};
    let unsubEvents = () => {};
    let unsubTrends = () => {};

    try {
      unsubMetrics = SecurityCenterService.subscribeToOverview(m => setMetrics(m));
      unsubRepos = SecurityCenterService.subscribeToRepositories(r => setRepos(r));
      unsubFindings = SecurityCenterService.subscribeToFindings(f => setFindings(f));
      unsubTrends = SecurityCenterService.subscribeToTrends(t => setTrendData(t));
      unsubEvents = SecurityCenterService.subscribeToEvents(e => {
        setEvents(e);
        setLoading(false);
      }, () => { setLoading(false); setLoadError('Security data is unavailable. Check your Firebase configuration and access permissions.'); });
    } catch (e) {
      console.error(e);
    }

    return () => {
      unsubMetrics(); unsubRepos(); unsubFindings(); unsubEvents(); unsubTrends();
    };
  }, [firebaseUser]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  if (authLoading) {
    return (
      <div className="flex-1 h-full bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-[var(--color-text-secondary)] flex items-center gap-2">
          <Activity className="w-5 h-5 animate-spin" /> Verifying session...
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return (
      <div className="flex-1 h-full bg-[var(--color-background)] flex items-center justify-center p-8">
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-8 max-w-md w-full text-center">
          <Shield className="w-16 h-16 text-[var(--color-primary-indigo)] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Security Center</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">Sign in to view security metrics and findings.</p>
          <button 
            onClick={handleLogin}
            className="w-full bg-[var(--color-primary-indigo)] hover:bg-[#1f6bd9] text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (loading && !metrics) {
    return (
      <div className="flex-1 h-full bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-[var(--color-text-secondary)] flex items-center gap-2">
          <Activity className="w-5 h-5 animate-spin" /> Loading Security Center...
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="flex-1 h-full bg-[var(--color-background)] p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[500px] text-center">
          <ShieldCheck className="w-20 h-20 text-[var(--color-text-muted)] mb-6" />
          <h1 className="text-2xl font-bold text-white mb-2">Security Center</h1>
          <p className="text-[var(--color-text-secondary)] text-lg" role="status">{loadError || 'No security data available yet.'}</p>
        </div>
      </div>
    );
  }

  const scoreColor = metrics.securityScore >= 80 ? 'text-[var(--color-success)]' : metrics.securityScore >= 60 ? 'text-amber-400' : 'text-red-500';

  return (
    <div className="flex-1 h-full bg-[var(--color-background)] p-6 lg:p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Security Command Center</h1>
            <p className="text-[var(--color-text-secondary)] text-sm mt-1">Enterprise vulnerability and risk overview</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs font-mono bg-[var(--color-success)]/10 text-[var(--color-success)] px-2.5 py-1 rounded-full border border-[var(--color-success)]/20">
              <span className="w-1.5 h-1.5 bg-[var(--color-success)] rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
        </div>

        {/* Top KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Security Score Widget */}
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-5 relative overflow-hidden group">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-[var(--color-primary-indigo)]/5 rounded-full blur-2xl group-hover:bg-[var(--color-primary-indigo)]/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-4 relative">
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Security Score</h3>
              <ShieldCheck className={`w-5 h-5 ${scoreColor}`} />
            </div>
            <div className="flex items-baseline gap-2 relative">
              <span className={`text-4xl font-bold ${scoreColor}`}>{metrics.securityScore}</span>
              <span className="text-sm text-[var(--color-text-muted)]">/ 100</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-[var(--color-success)]">
              <TrendingUp className="w-3 h-3" /> +2 from last week
            </div>
          </div>

          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Active Vulnerabilities</h3>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{metrics.critical + metrics.high}</span>
            </div>
            <div className="mt-4 flex gap-4 text-xs">
              <span className="text-red-500 font-semibold">{metrics.critical} Critical</span>
              <span className="text-amber-400 font-semibold">{metrics.high} High</span>
            </div>
          </div>

          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Exposed Secrets</h3>
              <Key className="w-5 h-5 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{metrics.exposedSecrets}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-red-400">
              <TrendingUp className="w-3 h-3" /> Requires immediate action
            </div>
          </div>

          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-5">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Repositories at Risk</h3>
              <Box className="w-5 h-5 text-[var(--color-primary-indigo)]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{metrics.repositoriesAtRisk}</span>
              <span className="text-sm text-[var(--color-text-muted)]">/ {repos.length}</span>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              Across all teams
            </div>
          </div>
        </div>

        {/* Charts & Lists Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Finding Trends */}
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl p-5 lg:col-span-2 flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-6">Finding Trends (Last 5 Days)</h3>
            <div className="flex-1 w-full h-[250px]">
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCrit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: 'var(--color-panel)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="critical" stroke="#ef4444" fillOpacity={1} fill="url(#colorCrit)" strokeWidth={2} />
                    <Area type="monotone" dataKey="high" stroke="#f59e0b" fillOpacity={1} fill="url(#colorHigh)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[var(--color-text-muted)] text-sm">
                  Not enough historical data to display trends.
                </div>
              )}
            </div>
          </div>

          {/* Critical Action Queue / Events */}
          <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl flex flex-col overflow-hidden">
            <div className="p-4 border-b border-[var(--color-border)] flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Critical Action Queue</h3>
              <span className="bg-red-500/10 text-red-500 text-xs px-2 py-0.5 rounded font-medium">{events.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {events.length === 0 ? (
                <div className="p-4 text-center text-[var(--color-text-muted)] text-sm">No critical actions required.</div>
              ) : (
                <div className="space-y-1">
                  {events.map(evt => (
                    <div key={evt.id} className="p-3 hover:bg-[#101a28] rounded-lg transition-colors cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${evt.severity === 'critical' ? 'bg-red-500' : 'bg-amber-400'}`}></div>
                        <div>
                          <p className="text-sm text-white font-medium leading-tight group-hover:text-[var(--color-primary-indigo)] transition-colors">{evt.title}</p>
                          <div className="flex items-center gap-2 mt-1.5 text-xs text-[var(--color-text-muted)]">
                            <span className="font-mono">{evt.repositoryName}</span>
                            <span>•</span>
                            <span>{new Date(evt.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Repositories at Risk */}
        <div className="bg-[var(--color-panel)] border border-[var(--color-border)] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Repositories at Risk</h3>
            <button className="text-xs text-[var(--color-primary-indigo)] hover:text-[#1f6bd9] flex items-center gap-1">
              View All <ExternalLink className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-panel)] text-[var(--color-text-muted)] text-xs font-semibold uppercase">
                <tr>
                  <th className="px-5 py-3 font-medium">Repository</th>
                  <th className="px-5 py-3 font-medium">Owner Team</th>
                  <th className="px-5 py-3 font-medium text-center">Score</th>
                  <th className="px-5 py-3 font-medium">Critical</th>
                  <th className="px-5 py-3 font-medium">High</th>
                  <th className="px-5 py-3 font-medium text-right">Last Scan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {repos.map(repo => (
                  <tr key={repo.id} className="hover:bg-[#101a28] transition-colors group">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Box className="w-4 h-4 text-[var(--color-text-secondary)]" />
                        <span className="font-mono text-white font-medium group-hover:text-[var(--color-primary-indigo)] cursor-pointer">{repo.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-[var(--color-text-secondary)]">
                      {repo.ownerTeam}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border
                        ${repo.securityScore >= 80 ? 'bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20' : 
                          repo.securityScore >= 60 ? 'bg-amber-400/10 text-amber-400 border-amber-400/20' : 
                          'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                        {repo.securityScore}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${repo.criticalCount > 0 ? 'bg-red-500' : 'bg-[var(--color-border)]'}`}></div>
                        <span className={repo.criticalCount > 0 ? 'text-white' : 'text-[var(--color-text-muted)]'}>{repo.criticalCount}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${repo.highCount > 0 ? 'bg-amber-400' : 'bg-[var(--color-border)]'}`}></div>
                        <span className={repo.highCount > 0 ? 'text-white' : 'text-[var(--color-text-muted)]'}>{repo.highCount}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right text-[var(--color-text-muted)] text-xs">
                      {new Date(repo.lastScanAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {repos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-[var(--color-text-muted)]">No repositories at risk.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
