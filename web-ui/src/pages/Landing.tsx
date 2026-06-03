import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, GitBranch, Terminal, Zap, CheckCircle2, ChevronRight, Cloud, Code2, Layers, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500&family=Instrument+Sans:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black:   #0A0A0A;
    --off:     #111111;
    --panel:   #161616;
    --rule:    rgba(255,255,255,0.07);
    --rule2:   rgba(255,255,255,0.04);

    --fire:    #E84A00;
    --fire2:   #FF6B35;
    --green:   #00C896;
    --green2:  rgba(0,200,150,0.1);

    --text:    #F2F2F2;
    --dim:     #7A7A7A;
    --dimmer:  #3E3E3E;

    --syne:   'Syne', sans-serif;
    --sans:   'Instrument Sans', sans-serif;
    --mono:   'IBM Plex Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--text);
    font-family: var(--sans);
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-thumb { background: var(--dimmer); }

  /* ── ANIMATIONS ── */
  @keyframes blink   { 50% { opacity: 0; } }
  @keyframes rise    { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }
  @keyframes drift   { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes pulse-ring {
    0%   { box-shadow: 0 0 0 0 rgba(232,74,0,0.4); }
    70%  { box-shadow: 0 0 0 10px rgba(232,74,0,0); }
    100% { box-shadow: 0 0 0 0 rgba(232,74,0,0); }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  .rise { animation: rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
  .blink { animation: blink 1s step-end infinite; }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 300;
    height: 56px;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 32px;
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--rule);
  }

  .nav-logo {
    font-family: var(--syne);
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: var(--text);
    text-decoration: none;
    cursor: pointer;
    display: flex; align-items: center; gap: 10px;
  }

  .nav-logo-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--fire);
    animation: pulse-ring 2.5s ease infinite;
  }

  .nav-links {
    display: flex; gap: 28px;
  }

  .nav-link {
    font-family: var(--mono);
    font-size: 0.72rem;
    letter-spacing: 0.06em;
    color: var(--dim);
    text-decoration: none;
    background: none; border: none; cursor: pointer;
    transition: color 0.2s;
    padding: 0;
  }
  .nav-link:hover { color: var(--text); }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 20px;
    background: var(--fire);
    color: #fff;
    font-family: var(--sans); font-weight: 600; font-size: 0.82rem;
    letter-spacing: 0.01em;
    border: none; border-radius: 4px; cursor: pointer;
    transition: background 0.15s, transform 0.15s;
    white-space: nowrap;
  }
  .btn-primary:hover { background: var(--fire2); transform: translateY(-1px); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 18px;
    background: transparent;
    color: var(--dim);
    font-family: var(--sans); font-weight: 500; font-size: 0.82rem;
    border: 1px solid var(--rule); border-radius: 4px; cursor: pointer;
    transition: color 0.2s, border-color 0.2s;
  }
  .btn-outline:hover { color: var(--text); border-color: rgba(255,255,255,0.2); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column;
    align-items: flex-start; justify-content: center;
    padding: 100px 64px 60px;
    position: relative;
    overflow: hidden;
  }

  .hero-overline {
    font-family: var(--mono);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: var(--fire);
    margin-bottom: 28px;
    display: flex; align-items: center; gap: 10px;
  }

  .hero-overline-line {
    width: 32px; height: 1px; background: var(--fire); opacity: 0.6;
  }

  .hero-h1 {
    font-family: var(--syne);
    font-size: clamp(3.2rem, 7vw, 6.5rem);
    font-weight: 800;
    line-height: 0.92;
    letter-spacing: -0.02em;
    color: var(--text);
    max-width: 900px;
    margin-bottom: 32px;
  }

  .hero-h1 em {
    font-style: normal;
    color: var(--fire);
  }

  .hero-sub {
    font-family: var(--sans);
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--dim);
    line-height: 1.75;
    max-width: 520px;
    margin-bottom: 40px;
  }

  .hero-sub strong { color: var(--text); font-weight: 500; }

  .hero-actions {
    display: flex; align-items: center; gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 80px;
  }

  /* ── BIG GRID BG ── */
  .grid-bg {
    position: absolute; inset: 0; z-index: 0; pointer-events: none;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 72px 72px;
    -webkit-mask-image: linear-gradient(to bottom right, black 0%, transparent 70%);
    mask-image: linear-gradient(to bottom right, black 0%, transparent 70%);
  }

  /* ── TERMINAL ── */
  .terminal {
    background: #0C0C0C;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    overflow: hidden;
    width: 100%;
    max-width: 640px;
    box-shadow: 0 32px 80px rgba(0,0,0,0.8);
    position: relative; z-index: 10;
  }

  .terminal-bar {
    background: #141414;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    padding: 10px 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .t-dot { width: 10px; height: 10px; border-radius: 50%; }
  .terminal-body {
    padding: 20px 24px;
    font-family: var(--mono);
    font-size: 0.82rem;
    line-height: 2;
    color: #666;
    min-height: 200px;
  }

  /* ── TICKER ── */
  .ticker { overflow: hidden; border-top: 1px solid var(--rule2); border-bottom: 1px solid var(--rule2); }
  .ticker-track {
    display: inline-flex; gap: 48px; white-space: nowrap;
    animation: drift 28s linear infinite;
    padding: 11px 0;
  }
  .ticker-item { font-family: var(--mono); font-size: 0.68rem; color: var(--dimmer); letter-spacing: 0.06em; }
  .ticker-sep { color: var(--fire); opacity: 0.5; }

  /* ── SECTION ── */
  .section { padding: 100px 64px; }
  .section-inner { max-width: 1100px; margin: 0 auto; }

  .section-label {
    font-family: var(--mono);
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    color: var(--fire);
    margin-bottom: 16px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-label::before {
    content: '';
    display: block;
    width: 20px; height: 1px; background: var(--fire); opacity: 0.6;
  }

  .section-title {
    font-family: var(--syne);
    font-size: clamp(2rem, 4vw, 3.2rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.05;
    color: var(--text);
    margin-bottom: 16px;
  }

  .section-desc {
    font-family: var(--sans);
    font-size: 1rem;
    color: var(--dim);
    line-height: 1.7;
    max-width: 480px;
  }

  /* ── FEATURES GRID ── */
  .feat-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: var(--rule2);
    border: 1px solid var(--rule2);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 60px;
  }

  .feat-cell {
    background: var(--black);
    padding: 36px 32px;
    position: relative;
    transition: background 0.2s;
  }
  .feat-cell:hover { background: var(--off); }

  .feat-cell-num {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--dimmer);
    letter-spacing: 0.1em;
    margin-bottom: 24px;
  }

  .feat-tag {
    display: inline-block;
    font-family: var(--mono);
    font-size: 0.63rem;
    letter-spacing: 0.1em;
    color: var(--fire);
    background: rgba(232,74,0,0.1);
    border: 1px solid rgba(232,74,0,0.2);
    padding: 3px 8px;
    border-radius: 3px;
    margin-bottom: 16px;
  }

  .feat-cell h3 {
    font-family: var(--syne);
    font-size: 1.25rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 12px;
  }

  .feat-cell p {
    font-family: var(--sans);
    font-size: 0.875rem;
    color: var(--dim);
    line-height: 1.7;
  }

  /* ── NEW: DEPLOY SECTION ── */
  .deploy-banner {
    background: var(--off);
    border: 1px solid rgba(0,200,150,0.2);
    border-radius: 8px;
    padding: 48px;
    position: relative;
    overflow: hidden;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .deploy-banner::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
  }

  .deploy-badge {
    display: inline-flex; align-items: center; gap: 6px;
    font-family: var(--mono);
    font-size: 0.65rem;
    letter-spacing: 0.1em;
    color: var(--green);
    background: rgba(0,200,150,0.1);
    border: 1px solid rgba(0,200,150,0.25);
    padding: 4px 10px;
    border-radius: 3px;
    margin-bottom: 20px;
  }

  .deploy-badge span {
    width: 6px; height: 6px; border-radius: 50%; background: var(--green);
    animation: pulse-ring 2.5s ease infinite;
  }

  .deploy-steps {
    display: flex; flex-direction: column; gap: 16px;
  }

  .deploy-step {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 16px 20px;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--rule);
    border-radius: 6px;
    transition: border-color 0.2s;
  }
  .deploy-step:hover { border-color: rgba(0,200,150,0.3); }

  .deploy-step-num {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--green);
    background: rgba(0,200,150,0.1);
    border: 1px solid rgba(0,200,150,0.2);
    width: 22px; height: 22px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .deploy-step p { font-family: var(--sans); font-size: 0.875rem; color: var(--dim); line-height: 1.5; }
  .deploy-step strong { color: var(--text); font-weight: 500; }

  /* ── RESOURCES ── */
  .resources-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-top: 48px;
  }

  .res-card {
    background: var(--off);
    border: 1px solid var(--rule);
    border-radius: 6px;
    padding: 24px;
    transition: border-color 0.2s, transform 0.2s;
    cursor: default;
  }
  .res-card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-2px); }

  .res-icon {
    width: 36px; height: 36px;
    border-radius: 6px;
    background: rgba(255,255,255,0.04);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono);
    font-size: 0.72rem;
    letter-spacing: 0.05em;
    color: var(--dim);
    margin-bottom: 16px;
    border: 1px solid var(--rule);
  }

  .res-card h4 {
    font-family: var(--syne);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--text);
    margin-bottom: 8px;
  }
  .res-card p { font-family: var(--sans); font-size: 0.82rem; color: var(--dim); line-height: 1.6; }

  /* ── HOW IT WORKS ── */
  .steps-row {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--rule2);
    border: 1px solid var(--rule2);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 56px;
  }

  .step-cell {
    background: var(--black);
    padding: 40px 32px;
    position: relative;
  }
  .step-cell:hover { background: var(--off); }

  .step-cell-n {
    font-family: var(--mono);
    font-size: 3rem;
    font-weight: 400;
    color: var(--rule);
    letter-spacing: -0.04em;
    line-height: 1;
    margin-bottom: 24px;
  }

  .step-cell h3 {
    font-family: var(--syne);
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 10px;
    letter-spacing: -0.01em;
  }

  .step-cell p {
    font-family: var(--sans);
    font-size: 0.85rem;
    color: var(--dim);
    line-height: 1.65;
  }

  /* ── CODE WINDOW ── */
  .code-window {
    background: #0D0D0D;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    overflow: hidden;
    margin-top: 56px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.7);
  }
  .code-titlebar {
    background: #141414;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    padding: 12px 20px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .code-dots { display: flex; gap: 6px; }
  .code-dot { width: 10px; height: 10px; border-radius: 50%; }
  .code-filename {
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--dim);
    display: flex; align-items: center; gap: 6px;
  }
  .code-status {
    font-family: var(--mono);
    font-size: 0.65rem;
    color: var(--fire);
    display: flex; align-items: center; gap: 4px;
  }
  .code-body {
    padding: 28px 28px;
    font-family: var(--mono);
    font-size: 0.875rem;
    line-height: 1.85;
    overflow-x: auto;
  }
  .code-footer {
    background: #111;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 12px 20px;
    display: flex; gap: 12px; align-items: center;
    font-family: var(--mono);
    font-size: 0.72rem;
    color: var(--dimmer);
  }
  .code-chip {
    display: flex; align-items: center; gap: 4px;
    padding: 3px 10px;
    border-radius: 4px;
    font-size: 0.68rem;
  }

  .syn-tag  { color: #E8500A; }
  .syn-attr { color: #B39DDB; }
  .syn-val  { color: #80CBC4; }
  .syn-num  { color: #CE9178; }
  .syn-txt  { color: #D4D4D4; }
  .syn-cmt  { color: #3E3E3E; }

  /* ── CTA ── */
  .cta-strip {
    margin: 0 64px 80px;
    background: var(--off);
    border: 1px solid var(--rule);
    border-radius: 8px;
    padding: 56px 64px;
    display: flex; align-items: center; justify-content: space-between;
    gap: 40px;
    position: relative; overflow: hidden;
  }
  .cta-strip::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--fire), transparent);
  }
  .cta-strip h2 {
    font-family: var(--syne);
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
    line-height: 1.1;
    max-width: 500px;
  }
  .cta-strip h2 em { font-style: normal; color: var(--fire); }

  /* ── FOOTER ── */
  .footer {
    border-top: 1px solid var(--rule2);
    padding: 32px 64px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
  }
  .footer-brand {
    font-family: var(--syne);
    font-size: 1rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    color: var(--text);
    display: flex; align-items: center; gap: 8px;
    cursor: pointer;
  }
  .footer-copy {
    font-family: var(--mono);
    font-size: 0.68rem;
    color: var(--dimmer);
    letter-spacing: 0.05em;
  }

  /* ── RESPONSIVE ── */
  @media (max-width: 900px) {
    .hero { padding: 80px 24px 48px; }
    .section { padding: 72px 24px; }
    .feat-grid { grid-template-columns: 1fr; }
    .steps-row { grid-template-columns: 1fr; }
    .resources-grid { grid-template-columns: 1fr 1fr; }
    .deploy-banner { grid-template-columns: 1fr; gap: 32px; padding: 32px; }
    .cta-strip { margin: 0 24px 60px; padding: 36px 28px; flex-direction: column; align-items: flex-start; }
    .footer { padding: 28px 24px; }
    .hide-sm { display: none !important; }
  }

  @media (max-width: 540px) {
    .resources-grid { grid-template-columns: 1fr; }
  }
`;

/* ─────────────────────────────────────────────
   TYPEWRITER
───────────────────────────────────────────── */
const useTypewriter = (text: string, speed = 55, delay = 0) => {
  const [out, setOut] = useState('');
  const [go, setGo] = useState(false);
  useEffect(() => { const t = setTimeout(() => setGo(true), delay); return () => clearTimeout(t); }, [delay]);
  useEffect(() => {
    if (!go) return;
    let i = 0;
    const iv = setInterval(() => { i < text.length ? setOut(text.slice(0, ++i)) : clearInterval(iv); }, speed);
    return () => clearInterval(iv);
  }, [go, text, speed]);
  return out;
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const TICKS = [
  'ReactFlowProvider', 'supabase.auth.getSession()', 'buildAST(nodes, edges)',
  'generator.toTerraform()', 'PostgreSQL RLS Policies', 'useNodesState()',
  'aws.deploy --stack cloudast', 'Monaco Editor v0.47', 'HCL Compiler v2.1',
  'Vite HMR Enabled',
];

const FEATURES = [
  {
    n: '01', tag: 'react-flow',
    title: 'Visual Node Canvas',
    body: 'Built on React Flow. Drag AWS components — VPCs, EC2, RDS — onto an infinite canvas. Custom node types with auto-snap and intelligent edge routing.',
  },
  {
    n: '02', tag: 'ast-compiler',
    title: 'Live AST Translation',
    body: 'A browser-native Abstract Syntax Tree parser traverses your graph and emits valid HCL in real-time, with zero round-trips to a server.',
  },
  {
    n: '03', tag: 'supabase-pg',
    title: 'Cloud Persistence',
    body: 'Blueprints serialized as JSON, stored in Supabase PostgreSQL with Row Level Security. Your infra state lives in your account, not in memory.',
  },
  {
    n: '04', tag: 'monaco-editor',
    title: 'Bidirectional IDE',
    body: 'Move a node on canvas — the Monaco editor updates instantly. Edit HCL directly — the canvas re-renders. Fully synchronised, no refresh required.',
  },
];

const RESOURCES = [
  { abbr: 'VPC',  name: 'VPC',      desc: 'Virtual Private Cloud with subnets, route tables, NAT gateways.' },
  { abbr: 'RDS',  name: 'RDS',      desc: 'PostgreSQL/MySQL/MariaDB, Multi-AZ, automated backups.' },
  { abbr: 'ECS',  name: 'Fargate',  desc: 'Serverless containers with ECS orchestration and auto-scaling.' },
  { abbr: 'λ',    name: 'Lambda',   desc: 'Event-driven functions across Node, Python, Go runtimes.' },
  { abbr: 'S3',   name: 'S3',       desc: 'Object storage with versioning, encryption and lifecycle rules.' },
  { abbr: 'DDB',  name: 'DynamoDB', desc: 'NoSQL at any scale — on-demand capacity, global tables.' },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const typedCmd  = useTypewriter('CloudAST compile --target terraform --deploy aws', 42, 1200);
  const isCmdDone = typedCmd.length >= 'CloudAST compile --target terraform --deploy aws'.length;

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLE;
    document.head.appendChild(el);
    return () => { document.head.removeChild(el); };
  }, []);

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={() => navigate('/')}>
          <div className="nav-logo-dot" />
          CLOUDAST
        </div>

        <div className="nav-links hide-sm">
          {['Architecture', 'Docs', 'GitHub'].map(l => (
            <button key={l} className="nav-link">{l}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {!user && (
            <button className="nav-link hide-sm" onClick={() => navigate('/login')}>Sign in</button>
          )}
          <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.78rem' }}
            onClick={() => navigate(user ? '/dashboard' : '/login')}>
            {user ? 'Dashboard' : 'Open Studio'} <ArrowRight size={13} />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="grid-bg" />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 1100, width: '100%' }}>
          <div className="hero-overline rise" style={{ animationDelay: '0ms' }}>
            <div className="hero-overline-line" />
            BETA / OPEN SOURCE
          </div>

          <h1 className="hero-h1 rise" style={{ animationDelay: '80ms' }}>
            Infrastructure<br />
            as <em>Components.</em>
          </h1>

          <p className="hero-sub rise" style={{ animationDelay: '160ms' }}>
            Architect <strong>AWS</strong> topologies with React JSX or a visual canvas.
            Compile to <strong>Terraform, Pulumi,</strong> or <strong>CloudFormation</strong> —
            then deploy directly to AWS from the browser.
          </p>

          <div className="hero-actions rise" style={{ animationDelay: '220ms' }}>
            <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '12px 22px' }}
              onClick={() => navigate('/dashboard')}>
              Launch App <ArrowRight size={15} />
            </button>
            <button className="btn-outline" style={{ fontSize: '0.9rem', padding: '11px 20px' }}
              onClick={() => window.open('https://github.com/Kritagya123611/CloudAST', '_blank')}>
              <Terminal size={14} /> GitHub
            </button>
          </div>

          {/* terminal */}
          <div className="terminal rise" style={{ animationDelay: '300ms' }}>
            <div className="terminal-bar">
              <div className="t-dot" style={{ background: '#FF5F56' }} />
              <div className="t-dot" style={{ background: '#FEBC2E' }} />
              <div className="t-dot" style={{ background: '#27C840' }} />
              <span style={{ fontFamily: 'var(--mono)', fontSize: '0.68rem', color: 'var(--dim)', marginLeft: 12 }}>
                ~/cloudast — bash
              </span>
            </div>
            <div className="terminal-body">
              <div>
                <span style={{ color: 'var(--fire)' }}>❯ </span>
                <span style={{ color: 'var(--text)' }}>{typedCmd}</span>
                {!isCmdDone && <span className="blink" style={{ display: 'inline-block', width: 7, height: 14, background: 'var(--fire)', verticalAlign: 'middle', marginLeft: 3 }} />}
              </div>
              {isCmdDone && (
                <>
                  <div style={{ animationName: 'rise', animationDuration: '.35s', animationFillMode: 'both', animationDelay: '.1s', color: '#4ADE80', marginTop: 6 }}>
                    ✓ Supabase session verified
                  </div>
                  <div style={{ animationName: 'rise', animationDuration: '.35s', animationFillMode: 'both', animationDelay: '.3s', color: '#4ADE80' }}>
                    ✓ React Flow graph parsed → 6 nodes, 5 edges
                  </div>
                  <div style={{ animationName: 'rise', animationDuration: '.35s', animationFillMode: 'both', animationDelay: '.55s', color: 'var(--dim)' }}>
                    ▸ AST → HCL compilation complete
                  </div>
                  <div style={{ animationName: 'rise', animationDuration: '.35s', animationFillMode: 'both', animationDelay: '.8s', color: 'var(--green)' }}>
                    ▸ Pushing stack to AWS CloudFormation...
                  </div>
                  <div style={{ animationName: 'rise', animationDuration: '.35s', animationFillMode: 'both', animationDelay: '1.1s', color: 'var(--green)', fontWeight: 500 }}>
                    ✓ Stack deployed → us-east-1 &nbsp;
                    <span style={{ color: 'var(--dimmer)' }}>[ 12.4s ]</span>
                  </div>
                  <div style={{ animationName: 'rise', animationDuration: '.35s', animationFillMode: 'both', animationDelay: '1.3s', marginTop: 6 }}>
                    <span className="blink" style={{ display: 'inline-block', width: 7, height: 14, background: 'var(--fire)', verticalAlign: 'middle' }} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKS, ...TICKS].map((t, i) => (
            <span key={i} className="ticker-item">
              <span className="ticker-sep">▸ </span>{t}
            </span>
          ))}
        </div>
      </div>

      {/* ── NEW: DIRECT DEPLOY ── */}
      <section className="section" style={{ background: 'var(--off)' }}>
        <div className="section-inner">
          <div style={{ marginBottom: 48 }}>
            <div className="section-label">NEW FEATURE</div>
            <h2 className="section-title">
              Design it. Compile it.<br />Deploy it — without leaving the tab.
            </h2>
            <p className="section-desc" style={{ marginTop: 12 }}>
              CloudAST now connects directly to your AWS account.
              No CLI installs, no copy-pasting configs. One click from canvas to live infrastructure.
            </p>
          </div>

          <div className="deploy-banner">
            {/* left */}
            <div>
              <div className="deploy-badge">
                <span /> LIVE · AWS DIRECT DEPLOY
              </div>
              <h3 style={{
                fontFamily: 'var(--syne)',
                fontSize: '1.6rem',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text)',
                lineHeight: 1.15,
                marginBottom: 16,
              }}>
                Your visual blueprint,<br />
                <span style={{ color: 'var(--green)' }}>live on AWS</span> in seconds.
              </h3>
              <p style={{ fontFamily: 'var(--sans)', fontSize: '0.9rem', color: 'var(--dim)', lineHeight: 1.7, maxWidth: 360 }}>
                Authenticate once with your AWS credentials. CloudAST handles the CloudFormation stack creation, 
                rollback management, and live deployment status — all from the studio interface.
              </p>
              <div style={{ marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['CloudFormation', 'Terraform Cloud', 'Pulumi ESC'].map(p => (
                  <span key={p} style={{
                    fontFamily: 'var(--mono)', fontSize: '0.65rem', letterSpacing: '0.08em',
                    color: 'var(--dim)', background: 'rgba(255,255,255,0.04)',
                    border: '1px solid var(--rule)', borderRadius: 3, padding: '4px 10px',
                  }}>{p}</span>
                ))}
              </div>
            </div>

            {/* right: steps */}
            <div className="deploy-steps">
              {[
                { n: '1', title: 'Connect AWS', body: 'Enter your AWS credentials or assume a role via IAM. Stored encrypted, never logged.' },
                { n: '2', title: 'Design & Compile', body: 'Build on the canvas. CloudAST auto-generates your chosen IaC format in real time.' },
                { n: '3', title: 'Review Diff', body: 'See a full changeset — resources to create, modify, or destroy — before touching prod.' },
                { n: '4', title: 'Deploy', body: 'Hit deploy. Watch the stack build live. Automatic rollback on any failure.' },
              ].map(s => (
                <div key={s.n} className="deploy-step">
                  <div className="deploy-step-num">{s.n}</div>
                  <div>
                    <p><strong>{s.title}</strong> — {s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">THE ENGINE</div>
          <h2 className="section-title">What's actually under the hood.</h2>
          <p className="section-desc">No marketing blur. Four components that make CloudAST work.</p>

          <div className="feat-grid">
            {FEATURES.map((f) => (
              <div key={f.n} className="feat-cell">
                <div className="feat-cell-num">{f.n}</div>
                <div className="feat-tag">{f.tag}</div>
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section" style={{ background: 'var(--off)' }}>
        <div className="section-inner">
          <div className="section-label">WORKFLOW</div>
          <h2 className="section-title">From JSX to deployed stack.</h2>

          <div className="steps-row">
            {[
              { n: '01', title: 'Write JSX or draw', body: 'Describe infrastructure using React component syntax, or drag nodes on the visual canvas. Your choice.' },
              { n: '02', title: 'Configure properties', body: 'Set CIDR blocks, instance types, engine versions — using familiar className-style prefix syntax.' },
              { n: '03', title: 'Deploy to AWS', body: 'CloudAST compiles to Terraform/CloudFormation and pushes the stack directly to your AWS account.' },
            ].map(s => (
              <div key={s.n} className="step-cell">
                <div className="step-cell-n">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CODE SYNTAX ── */}
      <section className="section">
        <div className="section-inner">
          <div className="section-label">SYNTAX</div>
          <h2 className="section-title">Reads like React. Compiles to Terraform.</h2>
          <p className="section-desc">Use className props with a Tailwind-inspired prefix system.</p>

          <div className="code-window">
            <div className="code-titlebar">
              <div className="code-dots">
                <div className="code-dot" style={{ background: '#EF4444' }} />
                <div className="code-dot" style={{ background: '#F59E0B' }} />
                <div className="code-dot" style={{ background: '#10B981' }} />
              </div>
              <div className="code-filename">
                <Code2 size={12} color="#F59E0B" />
                infrastructure.jsx
              </div>
              <div className="code-status">
                <Zap size={11} /> Generating...
              </div>
            </div>

            <div className="code-body">
              <div><span className="syn-cmt">// Deploy a complete VPC stack to AWS</span></div>
              <div style={{ marginTop: 8 }}>
                <span className="syn-txt">{'<'}</span><span className="syn-tag">Infrastructure</span>
                <span className="syn-attr"> provider</span><span className="syn-txt">{'='}</span>
                <span className="syn-val">"aws"</span><span className="syn-attr"> region</span>
                <span className="syn-txt">{'='}</span><span className="syn-val">"us-east-1"</span>
                <span className="syn-txt">{'>'}</span>
              </div>
              <div>
                <span className="syn-txt" style={{ marginLeft: 24 }}>{'<'}</span>
                <span className="syn-tag">VPC</span>
                <span className="syn-attr"> className</span>
                <span className="syn-txt">{'='}</span>
                <span className="syn-val">"cidr-10.0.0.0/16 az-2 nat-enabled"</span>
                <span className="syn-txt">{'>'}</span>
              </div>
              <div>
                <span className="syn-txt" style={{ marginLeft: 48 }}>{'<'}</span>
                <span className="syn-tag">RDS</span>
                <span className="syn-attr"> className</span>
                <span className="syn-txt">{'='}</span>
                <span className="syn-val">"engine-postgres14 multi-az backup-7d"</span>
                <span className="syn-txt">{' />'}</span>
              </div>
              <div>
                <span className="syn-txt" style={{ marginLeft: 48 }}>{'<'}</span>
                <span className="syn-tag">Fargate</span>
                <span className="syn-attr"> className</span>
                <span className="syn-txt">{'='}</span>
                <span className="syn-val">"cpu-1 mem-2gb port-8080 scale-3-10"</span>
                <span className="syn-txt">{' />'}</span>
              </div>
              <div>
                <span className="syn-txt" style={{ marginLeft: 48 }}>{'<'}</span>
                <span className="syn-tag">Lambda</span>
                <span className="syn-attr"> className</span>
                <span className="syn-txt">{'='}</span>
                <span className="syn-val">"runtime-nodejs22 timeout-30 memory-512"</span>
                <span className="syn-txt">{' />'}</span>
              </div>
              <div>
                <span className="syn-txt" style={{ marginLeft: 24 }}>{'</'}</span>
                <span className="syn-tag">VPC</span>
                <span className="syn-txt">{'>'}</span>
              </div>
              <div>
                <span className="syn-txt">{'</'}</span><span className="syn-tag">Infrastructure</span>
                <span className="syn-txt">{'>'}</span>
                <span className="blink" style={{ color: 'var(--fire)', marginLeft: 4 }}>_</span>
              </div>
            </div>

            <div className="code-footer">
              <span style={{ color: 'var(--text)', marginRight: 8 }}>Output</span>
              <span className="code-chip" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981', border: '1px solid rgba(16,185,129,0.2)' }}>
                <CheckCircle2 size={11} /> main.tf
              </span>
              <span className="code-chip" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--dim)', border: '1px solid var(--rule)' }}>
                variables.tf
              </span>
              <span className="code-chip" style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--dim)', border: '1px solid var(--rule)' }}>
                outputs.tf
              </span>
              <span style={{ marginLeft: 'auto', color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.65rem' }}>
                <Cloud size={12} /> AWS-ready
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── RESOURCES ── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-inner">
          <div className="section-label">SUPPORTED RESOURCES</div>
          <h2 className="section-title">All the building blocks.</h2>
          <p className="section-desc">Everything you need for modern production-grade AWS architecture.</p>

          <div className="resources-grid">
            {RESOURCES.map(r => (
              <div key={r.name} className="res-card">
                <div className="res-icon">{r.abbr}</div>
                <h4>{r.name}</h4>
                <p>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta-strip">
        <h2>
          Your infra, your code,<br />
          <em>deployed in one click.</em>
        </h2>
        <div style={{ display: 'flex', gap: 12, flexShrink: 0 }}>
          <button className="btn-primary" style={{ fontSize: '0.9rem', padding: '13px 24px' }}
            onClick={() => navigate(user ? '/dashboard' : '/login')}>
            {user ? 'Open Studio' : 'Start Free'} <ArrowRight size={15} />
          </button>
          <button className="btn-outline" style={{ fontSize: '0.9rem', padding: '12px 20px' }}
            onClick={() => window.open('https://github.com/Kritagya123611/CloudAST', '_blank')}>
            <ArrowUpRight size={14} /> View Source
          </button>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-brand" onClick={() => navigate('/')}>
          <GitBranch size={14} color="var(--fire)" />
          CLOUDAST
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--dimmer)' }}>
            MIT License
          </span>
          <span className="footer-copy">© 2026 CloudAST Engine</span>
        </div>
      </footer>
    </>
  );
}