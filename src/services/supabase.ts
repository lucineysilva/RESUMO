// Serviço para conectar com API MySQL local
export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message: string;
}

class MySQLAuthService {
  private baseUrl = '/api';

  async signInWithPassword(credentials: { email: string; password: string }): Promise<{ data?: { user: User }, error?: Error }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth.php?action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.user) {
        // Salvar usuário no localStorage para persistir sessão
        localStorage.setItem('user', JSON.stringify(result.user));
        return { data: { user: result.user } };
      } else {
        return { error: new Error(result.message) };
      }
    } catch (error) {
      return { error: error as Error };
    }
  }

  async signUp(credentials: { email: string; password: string; options?: { data?: { name?: string } } }): Promise<{ data?: { user: User }, error?: Error }> {
    try {
      const response = await fetch(`${this.baseUrl}/auth.php?action=register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: credentials.options?.data?.name,
        }),
      });

      const result: AuthResponse = await response.json();

      if (result.success && result.user) {
        // Salvar usuário no localStorage
        localStorage.setItem('user', JSON.stringify(result.user));
        return { data: { user: result.user } };
      } else {
        return { error: new Error(result.message) };
      }
    } catch (error) {
      return { error: error as Error };
    }
  }

  async getSession(): Promise<{ data: { session: { user: User } | null } }> {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return { data: { session: { user } } };
    }
    return { data: { session: null } };
  }

  async signOut(): Promise<{ error?: Error }> {
    localStorage.removeItem('user');
    return {};
  }

  onAuthStateChange(callback: (event: string, session: { user: User } | null) => void) {
    // Simular mudança de estado de autenticação
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      callback('SIGNED_IN', { user });
    } else {
      callback('SIGNED_OUT', null);
    }

    // Retornar subscription mock
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  }
}

// Instância do serviço de autenticação
export const supabase = {
  auth: new MySQLAuthService(),
  // Mock para outras funcionalidades se necessário
  from: () => ({
    insert: () => ({ select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }) }),
    select: () => ({ eq: () => Promise.resolve({ data: [], error: null }) }),
    update: () => ({ eq: () => Promise.resolve({ error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ error: null }) })
  })
};

// Database schema SQL para criação das tabelas:
/*
-- Tabela de highlights
CREATE TABLE highlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de notas
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  text TEXT NOT NULL,
  note_content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own highlights" ON highlights FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own highlights" ON highlights FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own highlights" ON highlights FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own notes" ON notes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON notes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON notes FOR DELETE USING (auth.uid() = user_id);
*/
