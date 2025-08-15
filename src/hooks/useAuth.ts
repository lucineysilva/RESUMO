import { useState, useEffect } from 'react';
import { supabase, User } from '../services/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário logado no localStorage
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({ email, password });
    
    if (result.error) {
      return { error: result.error };
    }

    if (result.data?.user) {
      const user = result.data.user;
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return result;
  };

  const signUp = async (email: string, password: string, name?: string) => {
    const result = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (result.error) {
      return { error: result.error };
    }

    if (result.data?.user) {
      const user = result.data.user;
      setUser(user);
      localStorage.setItem('user', JSON.stringify(user));
    }

    return result;
  };

  const signOut = async () => {
    const result = await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
    return result;
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
};
