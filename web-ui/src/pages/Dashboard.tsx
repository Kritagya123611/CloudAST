import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';
import { GitBranch, Plus, LogOut, LayoutGrid, Clock, Server, Activity } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   STYLES (Unchanged)
───────────────────────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #060606;
    --card:    #0b0b0b;
    --border:  rgba(255,255,255,0.08);
    --orange:  #E8500A;
    --orange2: #FF7235;
    --text:    #F0F0F0;
    --muted:   #666666;
    --muted2:  #8A8A8A;
    --sans:    'DM Sans', sans-serif;
    --mono:    'DM Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--sans); -webkit-font-smoothing: antialiased; }

  .grid-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px);
    background-size: 40px 40px; mask-image: linear-gradient(to bottom, black 0%, transparent 60%); -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 60%);
  }

  .dash-nav {
    position: sticky; top: 0; z-index: 100; display: flex; justify-content: space-between; align-items: center;
    padding: 0 32px; height: 64px; background: rgba(6, 6, 6, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid var(--border);
  }

  .btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; background: transparent; color: var(--muted2); font-family: var(--sans); font-weight: 500; font-size: 0.85rem; border: 1px solid transparent; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
  .btn-ghost:hover { color: var(--text); background: rgba(255,255,255,0.05); border-color: var(--border); }

  .btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: var(--orange); color: #fff; font-family: var(--sans); font-weight: 600; font-size: 0.85rem; border: none; border-radius: 4px; cursor: pointer; transition: all 0.2s; }
  .btn-primary:hover:not(:disabled) { background: var(--orange2); box-shadow: 0 4px 15px rgba(232,80,10,.3); transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

  .project-card {
    background: var(--card); border: 1px solid var(--border); border-radius: 6px; padding: 24px; transition: all 0.2s ease;
    cursor: pointer; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: space-between; min-height: 200px;
  }
  .project-card:hover { border-color: rgba(232,80,10,.4); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .project-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: var(--orange); transform: scaleX(0); transform-origin: left; transition: transform 0.3s ease; }
  .project-card:hover::before { transform: scaleX(1); }

  .card-new { border: 1px dashed var(--muted); background: transparent; align-items: center; justify-content: center; color: var(--muted2); }
  .card-new:hover { border-color: var(--text); color: var(--text); background: rgba(255,255,255,0.02); }

  .badge-mono { font-family: var(--mono); font-size: 0.7rem; padding: 4px 8px; border-radius: 3px; background: rgba(255,255,255,0.05); color: var(--muted2); border: 1px solid var(--border); letter-spacing: 0.05em; }
  .badge-active { background: rgba(39, 200, 64, 0.1); color: #27C840; border-color: rgba(39, 200, 64, 0.2); }
`;

// Helper function to format timestamps nicely
function timeAgo(dateString: string) {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " mins ago";
    return Math.floor(seconds) + " seconds ago";
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    
    // Database State
    const [blueprints, setBlueprints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        const el = document.createElement('style'); el.textContent = STYLE; document.head.appendChild(el);
        return () => { document.head.removeChild(el); };
    }, []);

    // ── DB FETCH: Load User's Blueprints ──
    useEffect(() => {
        if (!user) return;
        
        const fetchBlueprints = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('blueprints')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error("Error fetching blueprints:", error);
            } else {
                setBlueprints(data || []);
            }
            setLoading(false);
        };

        fetchBlueprints();
    }, [user]);

    const handleSignOut = async () => {
        await logout(); 
        navigate('/'); 
    };

    // ── DB INSERT: Create a New Blank Blueprint ──
const handleCreateNew = () => {
        // Just send them to a blank canvas! 
        // They will save it to the database later using the Studio's Save button.
        navigate('/studio');
    };

    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <div className="grid-bg" />

            {/* ── TOP NAVIGATION ── */}
            <nav className="dash-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                        <div style={{ width: 24, height: 24, borderRadius: 3, background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <GitBranch size={12} color="#fff" strokeWidth={2.5} />
                        </div>
                        <span style={{ fontFamily: 'var(--display)', fontSize: '1.2rem', letterSpacing: '.08em', color: 'var(--text)' }}>
                            CLOUDAST
                        </span>
                    </Link>
                    <div style={{ width: '1px', height: 24, background: 'var(--border)' }} />
                    <span style={{ fontFamily: 'var(--sans)', fontWeight: 500, fontSize: '0.9rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <LayoutGrid size={16} color="var(--muted2)" /> Workspaces
                    </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--muted)', paddingRight: '12px', borderRight: '1px solid var(--border)' }}>
                        {user?.email || 'sysadmin@local'}
                    </span>
                    <button className="btn-ghost" onClick={handleSignOut} title="Sign Out">
                        <LogOut size={16} /> <span className="hide-sm">Sign Out</span>
                    </button>
                </div>
            </nav>

            {/* ── MAIN CONTENT ── */}
            <main style={{ padding: '60px 40px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
                
                {/* Header Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ fontSize: '2rem', fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>Infrastructure Blueprints</h1>
                        <p style={{ margin: 0, color: 'var(--muted2)', fontSize: '0.95rem' }}>Manage and compile your visual AWS architecture graphs.</p>
                    </div>
                    <button className="btn-primary" onClick={handleCreateNew} disabled={creating}>
                        <Plus size={16} /> {creating ? 'Initializing...' : 'New Canvas'}
                    </button>
                </div>

                {/* Project Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    
                    {/* Create New Card */}
                    <div className="project-card card-new" onClick={handleCreateNew} style={{ pointerEvents: creating ? 'none' : 'auto' }}>
                        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                            {creating ? <Activity size={24} className="blink" /> : <Plus size={24} />}
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 500, margin: 0 }}>
                            {creating ? 'Initializing Node...' : 'Initialize New Canvas'}
                        </h3>
                        <p style={{ fontSize: '0.8rem', marginTop: 8, textAlign: 'center', opacity: 0.7 }}>Start a blank architecture graph</p>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', color: 'var(--muted2)' }}>
                            Fetching resources...
                        </div>
                    )}

                    {/* Mapped REAL Projects from Supabase */}
                    {!loading && blueprints.map(proj => (
                        <div key={proj.id} className="project-card" onClick={() => navigate('/studio')}>
                            
                            {/* Card Top */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ width: 40, height: 40, borderRadius: 6, background: 'rgba(232,80,10,0.1)', border: '1px solid rgba(232,80,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--orange)' }}>
                                    <Server size={20} />
                                </div>
                                <span className={`badge-mono ${proj.status === 'active' ? 'badge-active' : ''}`}>
                                    {proj.status === 'active' ? '● ONLINE' : 'IDLE'}
                                </span>
                            </div>

                            {/* Card Middle */}
                            <div style={{ marginTop: 24, marginBottom: 24 }}>
                                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '0 0 8px 0' }}>{proj.name}</h3>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                    <span className="badge-mono">{proj.region}</span>
                                    <span style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>
                                        <Activity size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}/>
                                        {proj.nodes_count || 0} Nodes
                                    </span>
                                </div>
                            </div>

                            {/* Card Bottom */}
                            <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', color: 'var(--muted)', fontSize: '0.75rem', fontFamily: 'var(--sans)' }}>
                                <Clock size={12} style={{ marginRight: 6 }} /> Last modified {timeAgo(proj.updated_at)}
                            </div>
                            
                        </div>
                    ))}

                </div>
            </main>
        </div>
    );
}