import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthProps {
  onLogin: (email: string, password: string) => Promise<any>;
  onRegister: (email: string, password: string, name: string) => Promise<any>;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        const { error } = await onLogin(email, password);
        if (error) setError(error.message);
      } else {
        const { error } = await onRegister(email, password, name);
        if (error) setError(error.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "url('/img/1.jpg') no-repeat center center fixed",
        backgroundSize: 'cover'
      }}
    >
      <div className="bg-black bg-opacity-80 backdrop-blur-sm rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Resumos Prof F.silva
          </h1>
          <p className="text-light">
            {isLogin ? 'Entre em sua conta' : 'Crie sua conta'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                required={!isLogin}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-12 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:text-accent transition-colors"
          >
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
          </button>
        </div>

        <div className="text-center mt-4 text-xs text-gray-500">
          Para demonstração, você pode usar qualquer email e senha
        </div>
      </div>
    </div>
  );
};
