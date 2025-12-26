
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login, signUp } = useAuth();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
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
        // Por padrão, manteremos a sessão persistente (true) para melhor experiência do usuário
        const success = await login(username, password, true);
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden custom-scrollbar">
      {/* Background Decorativo - Brilhos Sutis */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[420px] z-10 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[40px] shadow-2xl shadow-blue-500/5 p-8 sm:p-10 transition-all">
          
          <header className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-500/30 mb-6 transform hover:rotate-3 transition-transform cursor-default">
              GC
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase text-center">
              {isRegistering ? 'Criar Acesso' : 'Gestão de Cursos'}
            </h1>
            <p className="text-slate-400 font-bold text-[9px] uppercase tracking-[0.2em] mt-2">
              Sessão Segura e Criptografada
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-3 rounded-2xl text-[10px] font-black uppercase text-center border border-rose-100 dark:border-rose-900/50 animate-fadeIn">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-3 rounded-2xl text-[10px] font-black uppercase text-center border border-emerald-100 dark:border-emerald-900/50 animate-fadeIn">
                {successMsg}
              </div>
            )}

            {isRegistering && (
              <div className="space-y-1 animate-fadeIn">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Nome Completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold dark:text-white"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Login</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold dark:text-white lowercase"
                placeholder="claudioasousa"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-3">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border border-transparent rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 text-[10px] uppercase tracking-widest flex justify-center items-center mt-6 disabled:opacity-50"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : (isRegistering ? 'Confirmar Cadastro' : 'Acessar Sistema')}
            </button>

            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full text-center text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors py-4"
            >
              {isRegistering ? 'Já possui acesso? Faça Login' : 'Ainda não tem conta? Clique aqui'}
            </button>
          </form>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.3em]">
                Projeto: gestao_de_cursos
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
