
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { isConfigured } from '../lib/supabase';

const LoginPage = () => {
  const { login, signUp } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setError(null);
    setSuccessMsg(null);
  }, [isRegistering]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        const result = await signUp(name, username, password);
        if (result.success) {
          setSuccessMsg(result.message);
          setIsRegistering(false);
          setPassword('');
        } else {
          setError(result.message);
        }
      } else {
        const success = await login(username, password, rememberMe);
        if (!success) {
          setError('Usuário ou senha incorretos.');
        }
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique sua internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 dark:bg-blue-600/10 rounded-full blur-[120px] animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>

      <div className="w-full max-w-[440px] z-10 animate-fadeIn">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white dark:border-white/5 rounded-[48px] shadow-2xl shadow-blue-500/10 p-10 sm:p-12 transition-all">
          
          {!isConfigured && !isRegistering && (
             <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4">
                <span className="text-xl">⚠️</span>
                <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest leading-relaxed">
                    Sistema em modo Local. Use login <b className="text-amber-700">admin</b> para testes.
                </p>
             </div>
          )}

          <header className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-blue-500/40 mb-8 relative">
              G
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-slate-900"></div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase text-center leading-none">
              {isRegistering ? 'Nova Conta' : 'Portal v6.9'}
            </h1>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.3em] mt-3">Enterprise Suite</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-500 text-white p-4 rounded-2xl text-[10px] font-black uppercase text-center shadow-lg shadow-rose-500/20 animate-shake">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-500 text-white p-4 rounded-2xl text-[10px] font-black uppercase text-center shadow-lg shadow-emerald-500/20">
                {successMsg}
              </div>
            )}

            {isRegistering && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">Nome Real</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-blue-500/30 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold dark:text-white"
                  placeholder="Nome completo"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">Nome de Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-blue-500/30 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold dark:text-white"
                placeholder="Ex: joaosilva"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-4">Senha de Acesso</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-6 py-4 bg-slate-50 dark:bg-white/5 border border-transparent focus:border-blue-500/30 rounded-[1.5rem] focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {!isRegistering && (
              <div className="flex items-center justify-between px-2 pt-2">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500 transition-all"
                  />
                  <span className="ml-3 text-[10px] font-black text-slate-400 group-hover:text-blue-500 uppercase tracking-widest transition-colors">Manter Sessão</span>
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black rounded-[1.5rem] transition-all shadow-2xl shadow-blue-500/30 active:scale-[0.98] text-[11px] uppercase tracking-[0.2em] flex justify-center items-center mt-8 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Autenticando...</span>
                </div>
              ) : (isRegistering ? 'Ativar Conta v6.9' : 'Entrar no Sistema')}
            </button>

            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-center text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors py-6"
            >
              {isRegistering ? 'Voltar para o Login' : 'Não tem conta? Criar Agora'}
            </button>
          </form>
        </div>
        
        <p className="mt-10 text-center text-[9px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.4em]">
           Gestão de Cursos © 2025 • PRO Edition
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
