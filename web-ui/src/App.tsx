import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 1. MUST IMPORT THE AUTH PROVIDER
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Studio from './pages/Studio';
import Dashboard from './pages/Dashboard'; 

export default function App() {
  return (
    // 2. THIS IS THE FIX: AuthProvider MUST wrap everything!
    <AuthProvider>
      <Router>
        <div style={{ backgroundColor: '#1e1e1e', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth />} />

            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/studio" 
              element={
                <ProtectedRoute>
                  <Studio />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
