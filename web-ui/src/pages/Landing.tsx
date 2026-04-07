import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, ReactNode } from 'react';
import { Terminal, GitBranch, ArrowRight, Database, Network, Code2, Cpu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
/* ─────────────────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,400;0,500;1,400&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:       #050505;
    --bg2:      #0e0e0e;
    --border:   rgba(255,255,255,0.08);
    --border2:  rgba(255,255,255,0.04);
    --orange:   #E8500A;
    --orange2:  #FF7235;
    --dim:      rgba(232,80,10,0.08);
    --text:     #EFEFEF;
    --muted:    #5A5A5A;
    --muted2:   #8A8A8A;
    --sans:     'DM Sans', sans-serif;
    --mono:     'DM Mono', monospace;
    --display:  'Bebas Neue', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }

  @keyframes blink   { 0%,100%{opacity:1}50%{opacity:0} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0}to{opacity:1} }
  @keyframes ticker  { from{transform:translateX(0)}to{transform:translateX(-50%)} }

  .blink   { animation: blink 1s step-end infinite; }
  .fade-up { animation: fadeUp .65s cubic-bezier(.22,1,.36,1) both; }

  .nav-pill {
    font-family: var(--mono);
    font-size: .68rem;
    letter-spacing: .08em;
    color: var(--muted2);
    cursor: pointer;
    transition: color .2s;
    text-decoration: none;
    background: none; border: none;
  }
  .nav-pill:hover { color: var(--text); }

  .btn-fire {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 22px;
    background: var(--orange);
    color: #fff;
    font-family: var(--sans); font-weight: 600; font-size: .83rem;
    letter-spacing: .01em;
    border: none; border-radius: 3px; cursor: pointer;
    transition: background .18s, transform .18s, box-shadow .18s;
    position: relative; overflow: hidden;
  }
  .btn-fire:hover { background: var(--orange2); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(232,80,10,.35); }

  .btn-ghost {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px;
    background: transparent;
    color: var(--muted2);
    font-family: var(--sans); font-weight: 500; font-size: .83rem;
    border: 1px solid var(--border);
    border-radius: 3px; cursor: pointer;
    transition: color .2s, border-color .2s;
  }
  .btn-ghost:hover { color: var(--text); border-color: rgba(255,255,255,.18); }

  .feat-card {
    background: var(--bg2);
    border: 1px solid var(--border2);
    border-radius: 6px;
    padding: 32px;
    position: relative;
    overflow: hidden;
    transition: border-color .25s, transform .25s;
    z-index: 2;
  }
  .feat-card::after {
    content:'';
    position:absolute; top:0; left:0; right:0; height:2px;
    background: linear-gradient(90deg, transparent, var(--orange), transparent);
    opacity:0; transition:opacity .3s;
  }
  .feat-card:hover { border-color: rgba(232,80,10,.3); transform: translateY(-3px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .feat-card:hover::after { opacity:1; }

  .feat-icon {
    width: 42px; height: 42px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 4px;
    background: var(--dim);
    border: 1px solid rgba(232,80,10,.15);
    color: var(--orange);
    margin-bottom: 20px;
    transition: background .2s;
  }
  .feat-card:hover .feat-icon { background: rgba(232,80,10,.2); }

  .tag {
    font-family: var(--mono); font-size: .65rem; letter-spacing: .1em;
    padding: 3px 8px; border-radius: 2px;
    background: rgba(232,80,10,.1);
    color: var(--orange2);
    border: 1px solid rgba(232,80,10,.18);
  }

  .ticker-wrap { overflow:hidden; white-space:nowrap; border-top:1px solid var(--border2); border-bottom:1px solid var(--border2); }
  .ticker-track { display:inline-flex; gap:56px; animation:ticker 30s linear infinite; padding:12px 0; }
  .ticker-item { font-family:var(--mono); font-size:.7rem; color:var(--muted); letter-spacing:.08em; }
  .ticker-sep  { color:var(--orange); opacity:.6; }

  .term-wrap {
    background: #080808;
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 28px 70px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.03);
  }
  .term-bar {
    background: #111;
    border-bottom: 1px solid rgba(255,255,255,.08);
    padding: 12px 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .term-dot { width:12px; height:12px; border-radius:50%; }

  .noise {
    position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.03;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
    background-size:150px;
  }

  .grid-bg {
    position:absolute; inset:0; z-index:0;
    background-image:
      linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px);
    background-size:60px 60px;
    mask-image: linear-gradient(to bottom, black 0%, transparent 90%);
    -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 90%);
  }

  .hero-glow {
    position: absolute;
    top: 40%; left: 50%;
    transform: translate(-50%, -50%);
    width: 60vw; height: 60vw;
    background: radial-gradient(circle, rgba(232,80,10,0.12) 0%, transparent 60%);
    filter: blur(60px);
    z-index: 0;
    pointer-events: none;
  }

  @media (max-width:768px){
    .hide-sm { display:none !important; }
    .col-sm  { flex-direction:column !important; }
  }
`;

/* ─────────────────────────────────────────────────────────────
   TYPEWRITER HOOK
───────────────────────────────────────────────────────────── */
const useTypewriter = (text: string, speed = 60, delay = 0) => {
  const [out, setOut] = useState('');
  const [go, setGo] = useState(false);
  
  useEffect(() => { 
    const t = setTimeout(() => setGo(true), delay); 
    return () => clearTimeout(t); 
  }, [delay]);
  
  useEffect(() => {
    if (!go) return;
    let i = 0;
    const iv = setInterval(() => {
      if (i < text.length) { setOut(text.slice(0, ++i)); }
      else clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [go, text, speed]);
  
  return out;
};

/* ─────────────────────────────────────────────────────────────
   ACTUAL ARCHITECTURE FEATURES
───────────────────────────────────────────────────────────── */
const TICKS = [
  '<ReactFlowProvider />','Supabase_Auth.getSession()','buildAST(nodes, edges)',
  'generator.toTerraform()','PostgreSQL_RLS_Policies','useNodesState()',
  'monaco-editor/react','Vite_HMR_Enabled'
];

const FEATURES = [
  {
    icon: <Network size={20} />,
    tag: 'react-flow',
    title: 'Visual Node Canvas',
    body: "Built on React Flow. Drag and drop AWS components (VPCs, EC2s, RDS) onto an infinite, pan-able canvas. Features custom nodes with auto-snapping and logical edge connection routing.",
  },
  {
    icon: <Cpu size={20} />,
    tag: 'ast-compiler',
    title: 'Live AST Translation',
    body: "A custom-built Abstract Syntax Tree parser running in the browser. It traverses your visual graph and translates relationships into raw HashiCorp Configuration Language (HCL) in real-time.",
  },
  {
    icon: <Database size={20} />,
    tag: 'supabase-pg',
    title: 'Cloud Persistence',
    body: "Fully integrated with Supabase PostgreSQL and OAuth. Your infrastructure blueprints are saved as JSON state to your account, protected by Row Level Security (RLS) policies.",
  },
  {
    icon: <Code2 size={20} />,
    tag: 'monaco-editor',
    title: 'Bidirectional IDE',
    body: "Embedded Monaco Editor (the engine behind VS Code) provides syntax-highlighted output. As you move nodes on the canvas, the code editor updates instantly without page refreshes.",
  },
];

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  // Typewriters
  const typedHero = useTypewriter("DRAWN, NOT TYPED.", 70, 500);
  const typedCmd = useTypewriter('react2aws compile --target terraform', 40, 1500);
  const isCmdDone = typedCmd.length >= 'react2aws compile --target terraform'.length;

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLE;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  return (
    <>
      <div className="noise" aria-hidden />

      {/* ── NAV ── */}
      <nav style={{
        position:'fixed', top:0, left:0, right:0, zIndex:200,
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'0 40px', height:60,
        background:'rgba(5,5,5,.8)',
        backdropFilter:'blur(16px)',
        borderBottom:'1px solid rgba(255,255,255,.05)',
      }}>
        <div onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
          <div style={{
            width:28, height:28, borderRadius:4,
            background:'var(--orange)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <GitBranch size={14} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily:'var(--display)', fontSize:'1.4rem', letterSpacing:'.08em', color:'var(--text)' }}>
            REACT2AWS
          </span>
        </div>

        <div className="hide-sm" style={{ display:'flex', gap:32 }}>
          {['Architecture','Supabase DB','React Flow Docs'].map(l => (
            <button key={l} className="nav-pill">{l}</button>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {/* If there is NO user, show the Sign In button */}
          {!user && (
            <button className="nav-pill hide-sm" onClick={() => navigate('/login')}>Sign in</button>
          )}
          
          {/* Change button action based on auth state */}
          <button className="btn-fire" onClick={() => navigate(user ? '/dashboard' : '/login')}>
            {user ? 'Go to Dashboard' : 'Open Studio'} <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position:'relative', minHeight:'100vh',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'100px 24px 60px',
        textAlign:'center', overflow:'hidden',
      }}>
        {/* The rich backgrounds */}
        <div className="hero-glow" />
        <div className="grid-bg" />
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:1, height:150, background:'linear-gradient(to bottom, var(--orange), transparent)', opacity:0.4 }} />

        {/* Badge */}
        <div className="fade-up" style={{ animationDelay:'0ms', marginBottom:24, zIndex: 10 }}>
          <span style={{
            fontFamily:'var(--mono)', fontSize:'.7rem', letterSpacing:'.12em',
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'6px 14px',
            border:'1px solid rgba(232,80,10,.3)', borderRadius:3,
            background:'rgba(232,80,10,.08)', color:'var(--orange2)',
          }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:'var(--orange)', animation:'pulse 2s ease infinite' }} />
            BETA BUILD · SUPABASE CONNECTED
          </span>
        </div>

        {/* Headline (Resized and Typewriter added) */}
        <h1 className="fade-up" style={{
          animationDelay:'100ms',
          fontFamily:'var(--display)',
          fontSize:'clamp(3rem, 8vw, 6.5rem)', // Scaled down from 13vw
          letterSpacing:'.04em', lineHeight:.95,
          color:'var(--text)', maxWidth:1000, marginBottom:32,
          position: 'relative', zIndex: 10
        }}>
          INFRASTRUCTURE<br />
          <span style={{ color:'var(--orange)' }}>
            {typedHero}
            <span className="blink" style={{ color: 'var(--orange2)', marginLeft: '8px' }}>|</span>
          </span>
        </h1>

        {/* Sub */}
        <p className="fade-up" style={{
          animationDelay:'200ms',
          fontFamily:'var(--sans)', fontWeight:400,
          fontSize:'1.1rem', lineHeight:1.7,
          color:'var(--muted2)', maxWidth:550, marginBottom:48,
          position: 'relative', zIndex: 10
        }}>
          A developer tool combining the visual power of <span style={{ color: '#fff' }}>React Flow</span> with the persistence of <span style={{ color: '#3ECF8E' }}>Supabase</span>. Design AWS architecture visually and generate raw code instantly.
        </p>

        {/* CTAs */}
        <div className="fade-up col-sm" style={{ animationDelay:'300ms', display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center', marginBottom:60, zIndex: 10 }}>
          <button className="btn-fire" style={{ fontSize:'.95rem', padding:'14px 28px' }} onClick={() => navigate('/dashboard')}>
            Launch App <ArrowRight size={16} />
          </button>
          <button className="btn-ghost" style={{ fontSize:'.95rem', padding:'14px 24px' }} onClick={() => window.open('https://github.com', '_blank')}>
            <Terminal size={16} /> View GitHub Repo
          </button>
        </div>

        {/* Real Terminal Output */}
        <div className="fade-up term-wrap" style={{ animationDelay:'400ms', width:'100%', maxWidth:700, textAlign:'left', zIndex: 10 }}>
          <div className="term-bar">
            <div className="term-dot" style={{ background:'#FF5F56' }} />
            <div className="term-dot" style={{ background:'#FEBC2E' }} />
            <div className="term-dot" style={{ background:'#27C840' }} />
            <span style={{ fontFamily:'var(--mono)', fontSize:'.7rem', color:'var(--muted)', marginLeft:12 }}>
              src/compiler/ast.ts
            </span>
          </div>
          <div style={{ padding:'24px', fontFamily:'var(--mono)', fontSize:'.8rem', lineHeight:1.9, color:'#777' }}>
            <div>
              <span style={{ color:'var(--orange2)' }}>~</span>
              <span style={{ color:'var(--muted2)' }}> $ </span>
              <span style={{ color:'var(--text)' }}>{typedCmd}</span>
              {!isCmdDone && <span className="blink" style={{ display:'inline-block', width:8, height:16, background:'var(--orange)', verticalAlign:'middle', marginLeft:4 }} />}
            </div>
            {isCmdDone && (
              <>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'.1s', color:'#3ECF8E', marginTop: 8 }}>
                  [info] Supabase session verified
                </div>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'.3s', color:'#4ADE80' }}>
                  [success] React Flow graph parsed: 4 Nodes, 3 Edges
                </div>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'.6s' }}>
                  <span style={{ color:'var(--orange2)' }}>▸</span>
                  {' '}Translating AST to HCL format...
                </div>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'.9s' }}>
                  <span style={{ color:'var(--orange2)' }}>▸</span>
                  {' '}Updating Monaco Editor state...
                </div>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'1.2s', marginTop: 8 }}>
                  <span className="blink" style={{ display:'inline-block', width:8, height:16, background:'var(--orange)', verticalAlign:'middle' }} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── TICKER (Actual Tech Stack) ── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKS, ...TICKS].map((t, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-sep">▸ </span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── FEATURES SECTION ── */}
      <section style={{ padding:'80px 32px 100px', maxWidth:1100, margin:'0 auto', position: 'relative' }}>
        
        <div style={{ textAlign:'center', marginBottom: 60 }}>
          <h2 style={{
            fontFamily:'var(--display)',
            fontSize:'clamp(2.5rem, 5vw, 4rem)',
            letterSpacing:'.06em', color:'var(--text)', lineHeight:.95,
          }}>
            THE ACTUAL <span style={{ color:'var(--orange)' }}>ARCHITECTURE.</span>
          </h2>
          <p style={{ fontFamily:'var(--sans)', color:'var(--muted2)', marginTop:16, maxWidth:500, margin:'16px auto 0' }}>
            No generic marketing fluff. Here is exactly how the React2AWS engine works under the hood.
          </p>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:20 }}>
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <span className="tag">{f.tag}</span>
              <h3 style={{
                fontFamily:'var(--display)',
                fontSize:'1.6rem', letterSpacing:'.05em',
                lineHeight:1.1, marginTop:16, marginBottom:12,
                color:'var(--text)',
              }}>{f.title}</h3>
              <p style={{ fontFamily:'var(--sans)', fontSize:'.85rem', color:'var(--muted2)', lineHeight:1.7 }}>{f.body}</p>
            </div>
          ))}
        </div>

      </section>

    </>
  );
}