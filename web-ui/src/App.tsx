import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Studio from './pages/Studio';

// Temporary Mock Pages (We will build these out properly next!)
const Landing = () => (
  <div style={{ padding: '50px', textAlign: 'center', color: 'white' }}>
    <h1>Design AWS Infrastructure in Seconds.</h1>
    <Link to="/login" style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Get Started</Link>
  </div>
);

const Auth = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'white' }}>
    <div style={{ background: '#252526', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
      <h2>Sign In</h2>
      <Link to="/dashboard" style={{ display: 'block', padding: '10px', background: '#333', color: 'white', textDecoration: 'none', marginBottom: '10px' }}>Continue with GitHub</Link>
      <Link to="/dashboard" style={{ display: 'block', padding: '10px', background: '#white', color: 'black', textDecoration: 'none' }}>Continue with Google</Link>
    </div>
  </div>
);

const Dashboard = () => (
  <div style={{ padding: '50px', color: 'white' }}>
    <h2>Welcome back, Engineer.</h2>
    <p>Your Projects:</p>
    <div style={{ display: 'flex', gap: '20px' }}>
      <Link to="/studio" style={{ padding: '20px', background: '#252526', color: 'white', textDecoration: 'none', border: '1px solid #4f46e5', borderRadius: '8px' }}>
        <h3>🚀 Production VPC</h3>
        <p>Updated 2 mins ago</p>
      </Link>
      <div style={{ padding: '20px', background: '#252526', border: '1px dashed #666', borderRadius: '8px', cursor: 'pointer' }}>
        <h3>+ New Architecture</h3>
      </div>
    </div>
  </div>
);

export default function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#1e1e1e', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/studio" element={<Studio />} />
        </Routes>
      </div>
    </Router>
  );
}