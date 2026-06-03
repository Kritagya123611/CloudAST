import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasUser, setHasUser] = useState(false);

  useEffect(() => {
    // EMERGENCY PRESENTATION BYPASS
    if (localStorage.getItem('demo_bypass') === 'true') {
      setHasUser(true);
      setSessionChecked(true);
      return;
    }

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setHasUser(true);
      setSessionChecked(true);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setHasUser(true);
      else if (localStorage.getItem('demo_bypass') !== 'true') setHasUser(false);
      setSessionChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!sessionChecked) {
    return <div style={{ height: '100vh', backgroundColor: '#000' }} />;
  }

  if (!hasUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}