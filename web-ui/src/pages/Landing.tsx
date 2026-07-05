import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Terminal, GitBranch, ArrowRight, Database, Network, Code2, Cpu, Zap, Box, HardDrive, Layers, FileCode2, Check, BarChart3, Search, CloudLightning } from 'lucide-react';

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

  .feat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }

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

  .code-window {
    background: #0a0a0a; border: 1px solid var(--border); border-radius: 12px;
    width: 100%; max-width: 850px; margin: 40px auto 0;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.02), 0 30px 80px rgba(0,0,0,0.8), 0 0 60px var(--dim);
    overflow: hidden; text-align: left;
  }
  .code-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; background: #111; border-bottom: 1px solid var(--border);
  }
  .code-dots { display: flex; gap: 8px; }
  .code-dot { width: 10px; height: 10px; border-radius: 50%; background: #333; }
  .code-title { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 0.75rem; color: var(--muted2); }

  .syn-tag { color: #E8500A; }
  .syn-attr { color: #A78BFA; }
  .syn-val { color: #34D399; }
  .syn-text { color: #EFEFEF; }

  .step-container { display: flex; justify-content: space-between; align-items: flex-start; position: relative; max-width: 900px; margin: 60px auto; }
  .step-line { position: absolute; top: 32px; left: 10%; right: 10%; height: 1px; background: linear-gradient(90deg, transparent, var(--orange), transparent); opacity: 0.5; z-index: 0; }
  .step-item { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; width: 30%; text-align: center; }
  .step-icon { 
    width: 64px; height: 64px; border-radius: 50%; background: var(--bg); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center; color: var(--orange); margin-bottom: 20px;
    box-shadow: 0 0 0 6px var(--bg);
  }
  .step-num { position: absolute; top: -5px; right: 25px; background: var(--orange); color: #000; font-family: var(--mono); font-size: 0.65rem; font-weight: bold; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid var(--bg); }

  .resource-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 8px;
    padding: 24px; position: relative; transition: all 0.2s;
  }
  .resource-card:hover { border-color: rgba(232,80,10,0.4); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
  .aws-badge { position: absolute; top: 20px; right: 20px; font-family: var(--mono); font-size: 0.6rem; color: var(--muted); border: 1px solid var(--border); padding: 2px 6px; border-radius: 4px; }

  @media (max-width:850px){
    .feat-grid { grid-template-columns: 1fr; }
  }

  @media (max-width:768px){
    .hide-sm { display:none !important; }
    .col-sm  { flex-direction:column !important; }
    .step-container { flex-direction: column; gap: 40px; align-items: center; }
    .step-line { display: none; }
    .step-item { width: 100%; }
  }
`;

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

const TICKS = [
  '<ReactFlowProvider />','Supabase_Auth.getSession()','buildAST(nodes, edges)',
  'generator.toTerraform()','PostgreSQL_RLS_Policies','GlueCrawlerEngine',
  'aws_athena_workgroup','monaco-editor/react','Vite_HMR_Enabled'
];

const FEATURES = [
  {
    icon: <Network size={20} />,
    tag: 'react-flow',
    title: 'Visual Node Canvas',
    body: "Built on React Flow. Drag and drop AWS components (VPCs, Subnets, Security Groups) onto an infinite canvas. Features custom nodes with auto-snapping and logical hierarchy nesting support.",
  },
  {
    icon: <Cpu size={20} />,
    tag: 'ast-compiler',
    title: 'Modern Analytics Routing',
    body: "Fully maps out Serverless Data Pipelines. Write simple structural JSX tags, and watch the compiler synthesize full metadata catalogs, crawl loops, and serverless querying workgroups natively.",
  },
  {
    icon: <CloudLightning size={20} />,
    tag: 'aws-sdk',
    title: 'Direct Account Ingestion',
    body: "Zero manual friction. CloudAST interfaces directly with AWS infrastructure tokens right inside the dashboard workspace, deploying production-ready stacks into your real cloud stack with a single click.",
  },
  {
    icon: <Code2 size={20} />,
    tag: 'monaco-editor',
    title: 'Bidirectional IDE Workspace',
    body: "Embedded Monaco Editor provides state-highlighted output. Moving canvas blocks translates into raw Terraform blocks and polyglot infrastructure files synchronously.",
  },
];

const SUPPORTED_RESOURCES = [
  { name: 'VPC & Subnets', icon: <Network size={24} color="#60A5FA" />, desc: 'Virtual networks complete with custom isolated Subnets and Security Group rule generation.' },
  { name: 'S3 Storage Sinks', icon: <HardDrive size={24} color="#38BDF8" />, desc: 'Encrypted buckets locked down with strict public access blocks and automated access logs.' },
  { name: 'Glue Catalog Database', icon: <Database size={24} color="#34D399" />, desc: 'Central metadata catalog database structures that store schemas discovered across raw target files.' },
  { name: 'Glue Schema Crawlers', icon: <Layers size={24} color="#FBBF24" />, desc: 'Automated schedulers that wake up, scan raw S3 folders, and dynamically structure columns using IAM roles.' },
  { name: 'Athena SQL Workspace', icon: <Search size={24} color="#A78BFA" />, desc: 'Serverless execution workgroups allowing standard relational SQL queries straight against unstructured data logs.' },
  { name: 'Lambda Engine', icon: <Zap size={24} color="#818CF8" />, desc: 'Serverless compute triggers with dynamic timeout tracking and custom gateway configurations.' }
];

export default function Landing() {
  const navigate = useNavigate();
  const typedHero = useTypewriter("BUILT LIKE COMPONENTS", 70, 500);
  const typedCmd = useTypewriter('CloudAST compile --target terraform', 40, 1500);
  const isCmdDone = typedCmd.length >= 'CloudAST compile --target terraform'.length;

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
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '0 40px', height: 60,
  background: 'rgba(5,5,5,.8)',
  backdropFilter: 'blur(16px)',
  borderBottom: '1px solid rgba(255,255,255,.05)',
}}>
        <div onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
          <span style={{ fontFamily:'var(--display)', fontSize:'1.4rem', letterSpacing:'.08em', color:'var(--text)' }}>
              CloudAST
          </span>
        </div>

        <div className="hide-sm" style={{ display:'flex', gap:32 }}>
          {['Architecture','Data Pipelines','React Flow Docs'].map(l => (
            <button key={l} className="nav-pill">{l}</button>
          ))}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <button className="btn-fire" onClick={() => navigate('/dashboard')}>
            Go to Dashboard <ArrowRight size={14} />
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
        <div className="hero-glow" />
        <div className="grid-bg" />
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:1, height:150, background:'linear-gradient(to bottom, var(--orange), transparent)', opacity:0.4 }} />
        <div className="fade-up" style={{ animationDelay:'0ms', marginBottom:24, zIndex: 10 }}>
        </div>

        <h1 className="fade-up" style={{
          animationDelay:'100ms',
          fontFamily:'var(--display)',
          fontSize:'clamp(3rem, 8vw, 6.5rem)',
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

        <p className="fade-up" style={{
          animationDelay:'200ms',
          fontFamily:'var(--sans)', fontWeight:400,
          fontSize:'1.2rem', lineHeight:1.7,
          color:'var(--muted2)', maxWidth:600, marginBottom:48,
          position: 'relative', zIndex: 10
        }}>
          Architect enterprise <span style={{ color: '#3ECF8E' }}>AWS</span> environments using familiar <span style={{ color: '#ffffff' }}>React (JSX)</span> or a bidirectional visual canvas. Instantly compile your topologies into production-ready <span style={{ color: '#ffffff' }}>Terraform and IAM policies.</span>
        </p>

        <div className="fade-up col-sm" style={{ animationDelay:'300ms', display:'flex', gap:16, flexWrap:'wrap', justifyContent:'center', marginBottom:60, zIndex: 10 }}>
          <button className="btn-fire" style={{ fontSize:'.95rem', padding:'14px 28px' }} onClick={() => navigate('/dashboard')}>
            Launch Studio <ArrowRight size={16} />
          </button>
          <button className="btn-ghost" style={{ fontSize:'.95rem', padding:'14px 24px' }} onClick={() => window.open('https://github.com/Kritagya123611/CloudAST', '_blank')}>
            <Terminal size={16} /> View GitHub Repo
          </button>
        </div>

        <div className="fade-up term-wrap" style={{ animationDelay:'400ms', width:'100%', maxWidth: 850, minHeight: 280, textAlign:'left', zIndex: 10 }}>
          <div className="term-bar">
            <div className="term-dot" style={{ background:'#FF5F56' }} />
            <div className="term-dot" style={{ background:'#FEBC2E' }} />
            <div className="term-dot" style={{ background:'#27C840' }} />
            <span style={{ fontFamily:'var(--mono)', fontSize:'.7rem', color:'var(--muted)', marginLeft:12 }}>
              src/compiler/ast-orchestrator.ts
            </span>
          </div>
          <div style={{ padding:'24px', fontFamily:'var(--mono)', fontSize:'.85rem', lineHeight:1.9, color:'#777' }}>
            <div>
              <span style={{ color:'var(--orange2)' }}>~</span>
              <span style={{ color:'var(--muted2)' }}> $ </span>
              <span style={{ color:'var(--text)' }}>{typedCmd}</span>
              {!isCmdDone && <span className="blink" style={{ display:'inline-block', width:8, height:16, background:'var(--orange)', verticalAlign:'middle', marginLeft:4 }} />}
            </div>
            {isCmdDone && (
              <>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'.1s', color:'#3ECF8E', marginTop: 12 }}>
                  [info] Production secure session established via Supabase
                </div>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'.3s', color:'#4ADE80' }}>
                  [success] Abstract Syntax Tree parsed: Data Lake topology verified
                </div>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'.6s' }}>
                  <span style={{ color:'var(--orange2)' }}>▸</span>
                  {' '}Synthesizing AWS Glue metadata catalogs and Athena structural blocks...
                </div>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'.9s' }}>
                  <span style={{ color:'var(--orange2)' }}>▸</span>
                  {' '}Generating IAM structural permissions & HCL outputs...
                </div>
                <div style={{ animation:'fadeIn .3s both', animationDelay:'1.2s', marginTop: 12 }}>
                  <span className="blink" style={{ display:'inline-block', width:8, height:16, background:'var(--orange)', verticalAlign:'middle' }} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[...TICKS, ...TICKS].map((t, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-sep">▸ </span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── BOLD DIRECT-DEPLOY STATEMENT SECTION ── */}
      <section style={{ padding: '100px 24px 90px', textAlign: 'center', background: 'linear-gradient(to bottom, #050505, #0a0a0a)' }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <h2 className="section-title" style={{ fontFamily: 'var(--sans)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 600, color: 'var(--text)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
  Design it. Compile it.<br />
  Deploy it — <span style={{ color: 'var(--orange)' }}>without leaving the tab.</span>
</h2>
          <p className="section-desc" style={{ fontFamily: 'var(--sans)', color: 'var(--muted2)', fontSize: '1.15rem', lineHeight: 1.6, marginTop: 16, maxWidth: '650px', margin: '16px auto 0' }}>
            CloudAST now connects directly to your AWS account.
            No CLI installs, no copy-pasting configs. One click from canvas to live infrastructure.
          </p>
        </div>
      </section>

      {/* ── THE SYNTAX DEEP-DIVE PREVIEW ── */}
      <section style={{ padding: '0px 24px 100px', textAlign: 'center', position: 'relative' }}>
        <div className="code-window">
          <div className="code-header">
            <div className="code-dots">
              <div className="code-dot" style={{background: '#EF4444'}}/>
              <div className="code-dot" style={{background: '#F59E0B'}}/>
              <div className="code-dot" style={{background: '#10B981'}}/>
            </div>
            <div className="code-title"><FileCode2 size={14} color="#F59E0B" /> data-pipeline.jsx</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.7rem', color: '#E8500A', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={12} /> Live Compilation Active
            </div>
          </div>
          
          <div style={{ padding: '32px', fontFamily: 'var(--mono)', fontSize: '0.9rem', lineHeight: 1.8, overflowX: 'auto' }}>
            <div>
              <span className="syn-text">1&nbsp;&nbsp;</span>
              <span className="syn-text">&lt;</span><span className="syn-tag">Infrastructure</span><span className="syn-text">&gt;</span>
            </div>
            <div>
              <span className="syn-text">2&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="syn-text">&lt;</span><span className="syn-tag">S3</span> <span className="syn-attr">name</span><span className="syn-text">=</span><span className="syn-val">"rawLogsBucket"</span> <span className="syn-text">/&gt;</span>
            </div>
            <div>
              <span className="syn-text">3&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="syn-text">&lt;</span><span className="syn-tag">GlueCatalog</span> <span className="syn-attr">name</span><span className="syn-text">=</span><span className="syn-val">"logsCatalog"</span> <span className="syn-attr">databaseName</span><span className="syn-text">=</span><span className="syn-val">"prod_analytics"</span> <span className="syn-text">/&gt;</span>
            </div>
            <div>
              <span className="syn-text">4&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="syn-text">&lt;</span><span className="syn-tag">GlueCrawler</span> <span className="syn-attr">name</span><span className="syn-text">=</span><span className="syn-val">"s3Crawler"</span> <span className="syn-attr">targetBucket</span><span className="syn-text">=</span><span className="syn-val">"rawLogsBucket"</span> <span className="syn-attr">targetCatalogId</span><span className="syn-text">=</span><span className="syn-val">"logsCatalog"</span> <span className="syn-text">/&gt;</span>
            </div>
            <div>
              <span className="syn-text">5&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span className="syn-text">&lt;</span><span className="syn-tag">Athena</span> <span className="syn-attr">name</span><span className="syn-text">=</span><span className="syn-val">"queryEngine"</span> <span className="syn-attr">catalogDatabaseId</span><span className="syn-text">=</span><span className="syn-val">"logsCatalog"</span> <span className="syn-text">/&gt;</span>
            </div>
            <div>
              <span className="syn-text">6&nbsp;&nbsp;</span>
              <span className="syn-text">&lt;/</span><span className="syn-tag">Infrastructure</span><span className="syn-text">&gt;</span><span className="blink">_</span>
            </div>
          </div>

          <div style={{ padding: '16px 24px', background: '#111', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
            <span style={{ color: 'var(--text)' }}>&gt;_ Compiled Outputs:</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', padding: '4px 10px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.2)' }}><Check size={12}/> main.tf</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(255, 255, 255, 0.05)', padding: '4px 10px', borderRadius: '4px' }}>template.json (CloudFormation)</span>
          </div>
        </div>
      </section>

      {/* ── CORE COMPILER FEATURES ── */}
      <section style={{ padding:'60px 32px 100px', maxWidth:1100, margin:'0 auto', position: 'relative' }}>
        <div style={{ textAlign:'center', marginBottom: 60 }}>
          <h2 style={{ fontFamily:'var(--display)', fontSize:'clamp(2.5rem, 5vw, 4rem)', letterSpacing:'.06em', color:'var(--text)', lineHeight:.95 }}>
            THE ACTUAL <span style={{ color:'var(--orange)' }}>ARCHITECTURE.</span>
          </h2>
          <p style={{ fontFamily:'var(--sans)', color:'var(--muted2)', marginTop:16, maxWidth:500, margin:'16px auto 0' }}>
            No generic marketing fluff. Here is exactly how the CloudAST structural engine routes configurations under the hood.
          </p>
        </div>

        <div className="feat-grid">
          {FEATURES.map((f, i) => (
            <div key={i} className="feat-card">
              <div className="feat-icon">{f.icon}</div>
              <span className="tag">{f.tag}</span>
              <h3 style={{ fontFamily:'var(--display)', fontSize:'1.6rem', letterSpacing:'.05em', lineHeight:1.1, marginTop:16, marginBottom:12, color:'var(--text)' }}>
                {f.title}
              </h3>
              <p style={{ fontFamily:'var(--sans)', fontSize:'.85rem', color:'var(--muted2)', lineHeight:1.7 }}>
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── STEPS PIPELINE ── */}
      <section style={{ padding: '80px 24px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--sans)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 12px' }}>How It Works</h2>
          <p style={{ color: 'var(--muted2)', fontSize: '1.1rem' }}>Three steps from abstract definitions to working analytics clusters</p>
        </div>

        <div className="step-container">
          <div className="step-line" />
          
          <div className="step-item">
            <div className="step-icon"><Code2 size={28} /> <div className="step-num">1</div></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>Write JSX Blocks</h3>
            <p style={{ color: 'var(--muted2)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '240px' }}>Define infrastructure topologies using modular syntax trees and declarative parameters.</p>
          </div>

          <div className="step-item">
            <div className="step-icon"><Layers size={28} /> <div className="step-num">2</div></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>Auto-Compile</h3>
            <p style={{ color: 'var(--muted2)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '240px' }}>The background state loop automatically synthesizes structural relationships and dependencies.</p>
          </div>

          <div className="step-item">
            <div className="step-icon"><Zap size={28} /> <div className="step-num">3</div></div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '12px' }}>Direct Deployment</h3>
            <p style={{ color: 'var(--muted2)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '240px' }}>Hit deploy to fire native API payloads that spin up live environments instantly.</p>
          </div>
        </div>
      </section>

      {/* ── RESOURCE CARDS SHOWCASE ── */}
      <section style={{ padding: '100px 24px 120px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{ fontFamily: 'var(--sans)', fontSize: '2.5rem', fontWeight: 600, color: 'var(--text)', margin: '0 0 12px' }}>Supported Cloud Resources</h2>
          <p style={{ color: 'var(--muted2)', fontSize: '1.1rem' }}>Full analytical processing components backed by real compilers</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {SUPPORTED_RESOURCES.map((res, i) => (
            <div key={i} className="resource-card">
              <div className="aws-badge">AWS SPEC</div>
              <div style={{ marginBottom: '20px' }}>{res.icon}</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '10px' }}>{res.name}</h3>
              <p style={{ color: 'var(--muted2)', fontSize: '0.9rem', lineHeight: 1.5 }}>{res.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#050505', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:24, height:24, borderRadius:4, background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <GitBranch size={12} color="#fff" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily:'var(--display)', fontSize:'1.2rem', letterSpacing:'.08em', color:'var(--text)' }}>CloudAST Engine</span>
        </div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.75rem', color: 'var(--muted)' }}>
          © 2026 CloudAST Studio. Open Source via MIT License.
        </div>
      </footer>
    </>
  );
}