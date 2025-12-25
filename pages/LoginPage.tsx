
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(false);
    const success = login(username, password);
    if (!success) setError(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md animate-fadeIn relative z-10">
        <div className="bg-white dark:bg-gray-900 rounded-[48px] shadow-2xl shadow-blue-500/10 p-10 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-500/30 mb-6">G</div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Gestão de Cursos</h1>
            <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Área Restrita</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 p-4 rounded-2xl text-xs font-black uppercase text-center border border-rose-100 dark:border-rose-800 animate-bounce">
                Credenciais Inválidas
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white"
                placeholder="Seu nome de usuário"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold dark:text-white"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 text-sm uppercase tracking-widest"
            >
              Acessar Sistema
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800 text-center">
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Esqueceu sua senha? Contate o suporte.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
