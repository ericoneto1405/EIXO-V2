import React from 'react';

const Financial: React.FC = () => {
    return (
        <div className="container mx-auto px-6 py-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Financeiro</h1>
                <p className="text-gray-500 dark:text-gray-400">Controle de receitas, despesas e fluxo de caixa.</p>
            </header>
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-12 text-center flex flex-col items-center justify-center h-96">
                <svg className="w-16 h-16 text-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Módulo em Desenvolvimento</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">A seção financeira está sendo cuidadosamente elaborada e estará disponível em breve para otimizar a gestão de custos e lucros da sua fazenda.</p>
            </div>
        </div>
    );
};

export default Financial;