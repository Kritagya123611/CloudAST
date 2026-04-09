import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'
import { GitBranch, ArrowRight } from 'lucide-react'

const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #060606;
    --card:    #0b0b0b;
    --border:  rgba(255,255,255,0.07);
    --orange:  #E8500A;
    --orange2: #FF7235;
    --text:    #F0F0F0;
    --muted:   #525252;
    --muted2:  #8A8A8A;
    --sans:    'DM Sans', sans-serif;
    --mono:    'DM Mono', monospace;
    --display: 'Bebas Neue', sans-serif;
    --red:     #ff4f4f;
  }

  html, body { height: 100%; overflow: hidden; } /* Prevent scroll at root */
  body { background: var(--bg); color: var(--text); font-family: var(--sans); -webkit-font-smoothing: antialiased; }

  /* noise */
  .noise {
    position:fixed; inset:0; pointer-events:none; z-index:9999; opacity:.022;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E");
    background-size:160px;
  }

  /* grid */
  .grid-bg {
    position:absolute; inset:0; z-index:0;
    background-image:
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size:52px 52px;
    mask-image: radial-gradient(ellipse 70% 80% at 50% 40%, black 20%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse 70% 80% at 50% 40%, black 20%, transparent 100%);
  }

  /* card - TIGHTENED PADDING */
  .auth-card {
    position: relative;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 32px 36px 28px; 
    width: 100%;
    max-width: 420px;
    z-index: 10;
  }
  .auth-card::before {
    content: '';
    position: absolute;
    top: 0; left: 20%; right: 20%; height: 1px;
    background: linear-gradient(90deg, transparent, var(--orange), transparent);
    opacity: .9;
  }

  /* input - TIGHTENED PADDING */
  .auth-input {
    width: 100%;
    padding: 10px 14px; 
    background: rgba(0,0,0,.6);
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text);
    font-family: var(--sans);
    font-size: .85rem;
    transition: border-color .18s, box-shadow .18s;
    outline: none;
    -webkit-appearance: none;
  }
  .auth-input::placeholder { color: var(--muted); }
  .auth-input:focus {
    border-color: rgba(232,80,10,.6);
    box-shadow: 0 0 0 3px rgba(232,80,10,.08);
  }

  /* social btn - TIGHTENED PADDING */
  .social-btn {
    width: 100%;
    padding: 9px 16px;
    background: rgba(255,255,255,.03);
    border: 1px solid var(--border);
    border-radius: 3px;
    color: var(--text);
    font-family: var(--sans);
    font-weight: 500;
    font-size: .84rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    transition: background .18s, border-color .18s;
  }
  .social-btn:hover {
    background: rgba(255,255,255,.055);
    border-color: rgba(255,255,255,.14);
  }

  /* submit - TIGHTENED PADDING */
  .submit-btn {
    width: 100%;
    padding: 11px;
    background: var(--orange);
    color: #fff;
    border: none;
    border-radius: 3px;
    font-family: var(--sans);
    font-weight: 600;
    font-size: .88rem;
    letter-spacing: .025em;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: background .18s, box-shadow .18s, transform .12s;
  }
  .submit-btn:hover:not(:disabled) {
    background: var(--orange2);
    box-shadow: 0 4px 22px rgba(232,80,10,.28);
    transform: translateY(-1px);
  }
  .submit-btn:active:not(:disabled) { transform: translateY(0); }
  .submit-btn:disabled { opacity: .55; cursor: not-allowed; }

  /* divider - TIGHTENED MARGIN */
  .divider {
    display: flex; align-items: center; gap: 12px;
    margin: 16px 0;
  }
  .divider-line { flex: 1; height: 1px; background: var(--border); }
  .divider-text {
    font-family: var(--mono); font-size: .62rem;
    color: var(--muted); letter-spacing: .12em;
  }

  /* error - TIGHTENED MARGIN */
  .error-box {
    font-family: var(--mono); font-size: .72rem; color: #ff7272;
    background: rgba(255,60,60,.06);
    border: 1px solid rgba(255,60,60,.18);
    border-left: 2px solid #ff4f4f;
    padding: 8px 12px; border-radius: 3px;
    margin-bottom: 16px; line-height: 1.5;
  }

  /* label */
  .field-label {
    display: block;
    font-family: var(--mono); font-size: .62rem;
    letter-spacing: .1em; color: var(--muted2);
    margin-bottom: 5px; text-transform: uppercase;
  }

  /* tab toggle - TIGHTENED MARGIN */
  .tab-wrap {
    display: flex;
    border: 1px solid var(--border);
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 20px;
  }
  .tab-btn {
    flex: 1;
    padding: 7px 0;
    background: transparent;
    border: none;
    font-family: var(--mono);
    font-size: .65rem;
    letter-spacing: .1em;
    color: var(--muted);
    cursor: pointer;
    transition: background .18s, color .18s;
    text-transform: uppercase;
  }
  .tab-btn.active {
    background: rgba(232,80,10,.12);
    color: var(--orange2);
  }
  .tab-btn:hover:not(.active) {
    background: rgba(255,255,255,.03);
    color: var(--text);
  }

  /* loader dots */
  @keyframes ldot { 0%,80%,100%{transform:scale(0)}40%{transform:scale(1)} }
  .ldot { display:inline-block; width:5px; height:5px; border-radius:50%; background:#fff; animation:ldot 1.2s ease infinite; }
  .ldot:nth-child(2) { animation-delay:.16s; }
  .ldot:nth-child(3) { animation-delay:.32s; }
`;

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const el = document.createElement('style');
    el.textContent = STYLE;
    document.head.appendChild(el);
    return () => {
      document.head.removeChild(el);
    };
  }, []);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/login` },
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', padding: '16px',
    }}>
      <div className="noise" aria-hidden />
      <div className="grid-bg" />
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -55%)',
        width: 480, height: 480, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(232,80,10,.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <Link to="/" style={{
        position: 'absolute', top: 20, left: 24,
        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 9, zIndex: 20,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 3, background: 'var(--orange)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <GitBranch size={13} color="#fff" strokeWidth={2.5} />
        </div>
        <span style={{ fontFamily: 'var(--display)', fontSize: '1.2rem', letterSpacing: '.08em', color: 'var(--text)' }}>
          CLOUDAST
        </span>
      </Link>
      <div className="auth-card">
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontFamily: 'var(--mono)', fontSize: '.62rem',
            letterSpacing: '.12em', color: 'var(--orange2)',
            marginBottom: 6, textTransform: 'uppercase',
            display: 'flex', alignItems: 'center', gap: 7,
          }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--orange)', display: 'inline-block' }} />
            Secure Access
          </div>
          <h2 style={{
            fontFamily: 'var(--display)',
            fontSize: '2.2rem', 
            letterSpacing: '.05em',
            lineHeight: .92,
            color: 'var(--text)',
          }}>
            {isLogin ? 'WELCOME\nBACK.' : 'CREATE\nACCOUNT.'}
          </h2>
        </div>
        <div className="tab-wrap">
          <button type="button" className={`tab-btn${isLogin ? ' active' : ''}`} onClick={() => setIsLogin(true)}>
            Sign In
          </button>
          <button type="button" className={`tab-btn${!isLogin ? ' active' : ''}`} onClick={() => setIsLogin(false)}>
            Register
          </button>
        </div>
        {errorMsg && (
          <div className="error-box">
            ✕ &nbsp;{errorMsg}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 0 }}>
          <button type="button" className="social-btn" onClick={() => handleSocialLogin('github')}>
            <svg height="15" width="15" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>
        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">or</span>
          <div className="divider-line" />
        </div>
        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: 14 }}>
            <label className="field-label">Email</label>
            <input
              type="email" required
              placeholder="you@company.com"
              className="auth-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
              <label className="field-label" style={{ margin: 0 }}>Password</label>
              {isLogin && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: '.6rem', color: 'var(--muted)', cursor: 'pointer', letterSpacing: '.06em', transition: 'color .15s' }}
                  onMouseOver={e => (e.currentTarget.style.color = 'var(--text)')}
                  onMouseOut={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  forgot?
                </span>
              )}
            </div>
            <input
              type="password" required
              placeholder="••••••••••"
              className="auth-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? (
              <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
                <span className="ldot" />
                <span className="ldot" />
                <span className="ldot" />
              </span>
            ) : (
              <>
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: 16, fontSize: '.8rem', color: 'var(--muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            style={{ color: 'var(--orange2)', cursor: 'pointer', fontWeight: 500, transition: 'color .15s' }}
            onClick={() => setIsLogin(!isLogin)}
            onMouseOver={e => (e.currentTarget.style.color = '#fff')}
            onMouseOut={e => (e.currentTarget.style.color = 'var(--orange2)')}
          >
            {isLogin ? 'Register' : 'Sign in'}
          </span>
        </p>

      </div>
    </div>
  );
}