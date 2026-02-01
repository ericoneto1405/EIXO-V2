import React, { useState } from 'react';

interface LoginProps {
    onLogin: (email: string, password: string, rememberMe: boolean) => void;
    error?: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onLogin(email, password, rememberMe);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-primary/10 flex items-center justify-center px-4">
            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-dark-card shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800">
                <div className="hidden lg:flex flex-col justify-between p-10 bg-primary text-white">
                    <div>
                        <p className="uppercase tracking-[0.3em] text-sm opacity-80">Eixo Gestão</p>
                        <h1 className="text-4xl font-bold mt-4">Gerencie sua fazenda com dados e inteligência.</h1>
                        <p className="mt-4 text-white/80">
                            Painel completo de operações, rebanho e finanças para sua gestão pecuária.
                        </p>
                    </div>
                    <div className="mt-10 space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center text-lg font-semibold">
                                1
                            </div>
                            <p className="text-white/90">Monitore o rebanho em tempo real.</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center text-lg font-semibold">
                                2
                            </div>
                            <p className="text-white/90">Centralize cadastros de fornecedores e insumos.</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-2xl bg-white/20 flex items-center justify-center text-lg font-semibold">
                                3
                            </div>
                            <p className="text-white/90">Tome decisões financeiras com clareza.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <div className="max-w-md mx-auto w-full">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center text-xl font-bold">
                                E
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">Bem-vindo</p>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Acesse o painel</h2>
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                                    E-mail corporativo
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="nome@fazenda.com"
                                    required
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                                >
                                    Senha
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span>Lembrar de mim</span>
                                </label>
                            </div>

                            {error && (
                                <div className="rounded-2xl bg-red-50 text-red-600 text-sm px-4 py-3 dark:bg-red-500/10 dark:text-red-300">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-2xl transition-colors"
                            >
                                Entrar
                            </button>

                            <p className="text-xs text-gray-400 text-center">
                                Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
