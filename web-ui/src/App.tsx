import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Studio from './pages/Studio';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';



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