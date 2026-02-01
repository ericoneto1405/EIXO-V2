import React, { useState, useEffect } from 'react';

interface ModuleCategory {
    title: string;
    modules: string[];
}

interface UserRegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (name: string, email: string, password: string, modules: string[]) => void;
    moduleCategories: ModuleCategory[];
    error?: string | null;
    successMessage?: string | null;
}

const UserRegisterModal: React.FC<UserRegisterModalProps> = ({
    isOpen,
    onClose,
    onRegister,
    moduleCategories,
    error,
    successMessage,
}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedModules, setSelectedModules] = useState<string[]>([]);
    const [modulesError, setModulesError] = useState<string | null>(null);

    const allModules = React.useMemo(
        () => moduleCategories.flatMap((category) => category.modules),
        [moduleCategories],
    );

    useEffect(() => {
        if (!isOpen) {
            setName('');
            setEmail('');
            setPassword('');
            setSelectedModules(allModules);
            setModulesError(null);
            return;
        }
        setSelectedModules(allModules);
    }, [isOpen, allModules]);

    if (!isOpen) return null;

    const toggleModule = (module: string) => {
        setSelectedModules((prev) => {
            if (prev.includes(module)) {
                return prev.filter((item) => item !== module);
            }
            return [...prev, module];
        });
    };

    const toggleAll = () => {
        if (selectedModules.length === allModules.length) {
            setSelectedModules([]);
        } else {
            setSelectedModules(allModules);
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedModules.length === 0) {
            setModulesError('Selecione pelo menos um módulo para liberar.');
            return;
        }

        setModulesError(null);
        onRegister(name, email, password, selectedModules);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
            <div className="bg-white dark:bg-dark-card rounded-3xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-primary">Admin</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Cadastrar novo usuário</h3>
                    </div>
                    <button
                        type="button"
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={onClose}
                        aria-label="Fechar"
                    >
                        X
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="user-name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Nome completo
                        </label>
                        <input
                            id="user-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Maria Andrade"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="user-email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            E-mail corporativo
                        </label>
                        <input
                            id="user-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="nome@fazenda.com"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="user-password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                            Senha temporária
                        </label>
                        <input
                            id="user-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-dark px-4 py-3 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">Liberar módulos</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Escolha quais áreas o usuário poderá acessar.</p>
                            </div>
                            <button
                                type="button"
                                onClick={toggleAll}
                                className="text-xs font-semibold text-primary hover:underline"
                            >
                                {selectedModules.length === allModules.length ? 'Remover todos' : 'Selecionar todos'}
                            </button>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {moduleCategories.map((category) => (
                                <div key={category.title}>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-1">
                                        {category.title}
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {category.modules.map((module) => (
                                            <label
                                                key={module}
                                                className={`flex items-center space-x-2 rounded-xl border px-3 py-2 text-sm ${
                                                    selectedModules.includes(module)
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300'
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="rounded text-primary focus:ring-primary"
                                                    checked={selectedModules.includes(module)}
                                                    onChange={() => toggleModule(module)}
                                                />
                                                <span>{module}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {modulesError && (
                            <p className="mt-3 text-xs text-red-500">{modulesError}</p>
                        )}
                    </div>

                    {error && (
                        <div className="rounded-2xl bg-red-50 text-red-600 text-sm px-4 py-3 dark:bg-red-500/10 dark:text-red-300">
                            {error}
                        </div>
                    )}
                    {successMessage && !error && (
                        <div className="rounded-2xl bg-green-50 text-green-700 text-sm px-4 py-3 dark:bg-green-500/10 dark:text-green-300">
                            {successMessage}
                        </div>
                    )}

                    <div className="flex items-center justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Salvar usuário
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserRegisterModal;
