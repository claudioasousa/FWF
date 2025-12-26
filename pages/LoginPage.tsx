
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useData } from '../hooks/useData';

const LoginPage = () => {
  const { login, signUp } = useAuth();
  const { users, loading: loadingUsers } = useData();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para limpar mensagens ao trocar de formulário
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
          setIsRegistering(false); // Volta para login após sucesso
          setPassword('');
        } else {
          setError(result.message);
        }
      } else {
        const success = await login(username, password, rememberMe);
        if (!success) {
          setError('Usuário ou senha incorretos. Verifique a tabela abaixo.');
        }
      }
    } catch (err) {
      setError('Erro de conexão com o servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden custom-scrollbar">
      {/* Background Dinâmico */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/5 dark:bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-[440px] z-10 animate-fadeIn">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[48px] shadow-2xl shadow-blue-500/5 p-8 sm:p-12 transition-all duration-500">
          
          <header className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-[28px] flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-blue-500/40 mb-8 transform hover:scale-110 transition-transform cursor-default">
              GC
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase text-center leading-none mb-3">
              {isRegistering ? 'Nova Conta' : 'Portal de Gestão'}
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] text-center">
              Projeto: gestao_de_cursos
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 p-4 rounded-3xl text-[10px] font-black uppercase text-center border border-rose-100 dark:border-rose-900/50 animate-fadeIn">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-3xl text-[10px] font-black uppercase text-center border border-emerald-100 dark:border-emerald-900/50 animate-fadeIn">
                {successMsg}
              </div>
            )}

            {isRegistering && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Seu Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-7 py-4 bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold dark:text-white"
                  placeholder="Nome completo"
                  required
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full px-7 py-4 bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold dark:text-white lowercase"
                placeholder="claudioasousa"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-4">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="w-full px-7 py-4 bg-slate-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 transition-all font-bold dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            {!isRegistering && (
              <div className="flex items-center gap-3 ml-4">
                <div className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                </div>
                <label htmlFor="remember" className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest cursor-pointer select-none">
                  Permanecer conectado
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[24px] transition-all shadow-xl shadow-blue-500/25 active:scale-95 text-[11px] uppercase tracking-[0.2em] disabled:opacity-70 flex justify-center items-center mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isRegistering ? 'Confirmar Cadastro' : 'Entrar no Sistema'
              )}
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
      </div>

      {/* Seção de Credenciais Cadastradas (Modo Desenvolvedor/Admin) */}
      <div className="w-full max-w-2xl mt-12 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
        <div className="bg-slate-50 dark:bg-slate-900/40 backdrop-blur-sm rounded-[32px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-lg">
          <div className="px-8 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/40 dark:bg-slate-900/40">
            <h2 className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Sincronização Supabase (Debug)</h2>
            {loadingUsers && <div className="w-3 h-3 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>}
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/30 dark:bg-slate-800/30">
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Usuário</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Senha</th>
                  <th className="px-8 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Permissão</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {users.length > 0 ? users.map((u) => (
                  <tr key={u.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/10 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{u.name}</span>
                        <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400">@{u.username}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-xs font-mono text-slate-500 dark:text-slate-600">{u.password}</td>
                    <td className="px-8 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase ${u.role === 'ADMIN' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={3} className="px-8 py-12 text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                      {loadingUsers ? 'Carregando dados...' : 'Nenhum acesso registrado'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-center text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
          Conectado via Supabase: vibmmexedzoasehemkkr
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
