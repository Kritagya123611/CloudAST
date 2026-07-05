import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Studio from './pages/Studio';
import Dashboard from './pages/Dashboard'; 

export default function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#1e1e1e', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/studio" element={<Studio />} />
        </Routes>
      </div>
    </Router>
  );
}
