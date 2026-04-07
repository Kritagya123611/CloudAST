import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  user: any | null;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true); // Critical for preventing the bounce

  useEffect(() => {
    // 1. Grab the session immediately on load (this reads that URL token!)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) console.error("Session Error:", error);
      setUser(session?.user ?? null);
      setLoading(false); // Only stop loading once we know for sure
    });

    // 2. Listen for the auth state changing in the background
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth Event Fired:", _event); // This will help us debug if it fails!
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {/* 🚨 This is the magic lock. It prevents the router from bouncing you while the token is being read! */}
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};