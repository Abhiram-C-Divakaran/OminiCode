import { useAuth } from '../../context/AuthContext';
import { Activity,ArrowRight,Bell,BookOpen,ChevronDown,CircleAlert,Code2,FileCode2,FolderGit2,Menu,Search,Settings2,ShieldCheck,Sparkles,Users,X } from 'lucide-react';
import React,{ useEffect,useRef,useState } from 'react';
import { Outlet,useLocation,useNavigate } from 'react-router-dom';
import OminiCodeLogo from '../brand/OminiCodeLogo';
import './Dashboard.css';

const navigation = [
  {label:'Code Review', path:'/review', icon:Code2},
  {label:'Repositories', path:'/repo', icon:FolderGit2},
  {label:'Security Center', path:'/security', icon:ShieldCheck},
  {label:'DevOps Monitor', path:'/devops', icon:Activity},
  {label:'Team', path:'/team', icon:Users},
  {label:'Issues', path:'/issues', icon:CircleAlert},
];
const commands = [...navigation, {label:'Tasks',path:'/tasks',icon:FileCode2}, {label:'Standups',path:'/standup',icon:Users}, {label:'Documentation',path:'/docs',icon:BookOpen}, {label:'Code Scanner',path:'/review/scan',icon:ShieldCheck}, {label:'Snippets',path:'/snippets',icon:Code2}];
export function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [logoutError,setLogoutError] = useState('');
  const name = user?.displayName || user?.email || 'Account';
  const initials = name.slice(0,2).toUpperCase();
  const location = useLocation();
  const [overlay,setOverlay] = useState<string|null>(null);
  const [search,setSearch] = useState('');
  const [menu,setMenu] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(()=> { if(overlay) dialog.current?.showModal(); else dialog.current?.close(); },[overlay]);
  useEffect(()=> { const handler=(e:KeyboardEvent)=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();setOverlay('Search');}};window.addEventListener('keydown',handler);return()=>window.removeEventListener('keydown',handler); },[]);
  const go = (path:string)=>{navigate(path);setOverlay(null);setMenu(false);};
  return <div className="oc-dashboard">
    <header className="oc-topbar"><div className="oc-top-brand"><button className="oc-menu oc-icon" aria-label="Toggle navigation" onClick={()=>setMenu(!menu)}><Menu size={19}/></button><button className="oc-logo" aria-label="OminiCode home" onClick={()=>go('/')}><OminiCodeLogo size={32} /></button></div><button className="oc-command" onClick={()=>setOverlay('Search')}><Search size={17}/><span>Search code, files, issues, or run commands…</span><kbd>⌘ K</kbd></button><div className="oc-top-actions"><button className="oc-icon" aria-label="Notifications" onClick={()=>setOverlay('Notifications')}><Bell size={18}/></button><button className="oc-docs" onClick={()=>go('/docs')}><BookOpen size={16}/>Docs</button><span className="oc-top-divider"/><button className="oc-profile" onClick={()=>setOverlay('Account')}><span className="oc-avatar">{initials}</span><span><strong>{name}</strong><small>Personal account</small></span><ChevronDown size={13}/></button></div></header>
    <div className="oc-body"><aside className={`oc-sidebar ${menu?'oc-sidebar-open':''}`}><nav aria-label="Workspace navigation">{navigation.map(({label,path,icon:Icon},i)=><React.Fragment key={path}>{i===4&&<div className="oc-nav-divider"/>}<button aria-current={location.pathname.startsWith(path)?'page':undefined} className={location.pathname.startsWith(path)?'active':''} onClick={()=>go(path)}><Icon size={18}/><span>{label}</span></button></React.Fragment>)}<button onClick={()=>setOverlay('Settings')}><Settings2 size={18}/><span>Settings</span></button></nav><div className="oc-upgrade"><div><Sparkles size={16}/><strong>Upgrade to Pro</strong></div><p>Unlock advanced security scans, team features, and more.</p><button onClick={()=>setOverlay('Plans')}>View Plans<ArrowRight size={14}/></button></div><div className="oc-sidebar-foot"><span/> OminiCode workspace <small>v1.0</small></div></aside><main className="oc-main"><Outlet/></main></div>
    <dialog ref={dialog} className="oc-dialog" aria-label={overlay||'Workspace dialog'} onCancel={()=>setOverlay(null)} onClose={()=>setOverlay(null)} onClick={e=>{if(e.target===e.currentTarget)setOverlay(null);}}><button className="oc-close oc-icon" aria-label="Close dialog" onClick={()=>setOverlay(null)}><X size={19}/></button><h2>{overlay==='Plans'?'A little more possibility.':overlay}</h2>{overlay==='Search'?<><label className="oc-dialog-search"><Search size={17}/><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a tool or run a command…" aria-label="Search workspace commands"/></label><div className="oc-command-results">{commands.filter(c=>c.label.toLowerCase().includes(search.toLowerCase())).map(({label,path,icon:Icon})=><button key={path} onClick={()=>go(path)}><Icon size={17}/>{label}<ArrowRight size={14}/></button>)}{!commands.some(c=>c.label.toLowerCase().includes(search.toLowerCase()))&&<p>No matching commands. Try “repository” or “scan”.</p>}</div></>:overlay==='Notifications'?<p>You’re all caught up. New workspace notifications will appear here.</p>:overlay==='Plans'?<><p>You’re using the free local workspace. Pro plans are not available for purchase yet.</p><a className="oc-solid" href="https://github.com/Abhiram-C-Divakaran/OminiCode/issues" target="_blank" rel="noreferrer">Ask about team plans<ArrowRight size={15}/></a></>:overlay==='Account'?<><div className="oc-account"><span className="oc-avatar">{initials}</span><div><strong>{name}</strong><p>{user?.email}</p></div></div><button className="oc-solid" onClick={async()=>{try{await logout();navigate('/login', {replace:true});}catch{setLogoutError('Unable to sign out. Please try again.');}}}>Sign out</button><p role="alert">{logoutError}</p></>:<><p>Your workspace uses a midnight theme and the server’s configured Groq provider.</p><div className="oc-setting-row"><span>AI model</span><strong>GPT-OSS 120B</strong></div><div className="oc-setting-row"><span>Appearance</span><strong>Midnight</strong></div><button className="oc-solid" onClick={()=>go('/docs')}>Open documentation<ArrowRight size={15}/></button></>}</dialog>
  </div>;
}

