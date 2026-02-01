import React from 'react';

const AnimalSuppliers: React.FC = () => {
    return (
        <div>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Gerencie seus fornecedores de gado.</p>
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-12 text-center flex flex-col items-center justify-center h-96">
                 <svg className="w-16 h-16 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16l-4-4 4-4"></path><path d="M8 12h8"></path><path d="M18.8 6.2c.5-.5.8-1.2.8-2s-.3-1.5-.8-2c-.5-.5-1.2-.8-2-.8s-1.5.3-2 .8L12 5 9.2 2.2c-.5-.5-1.2-.8-2-.8s-1.5.3-2 .8c-.5.5-.8 1.2-.8 2s.3 1.5.8 2L8 9v5H7c-1.1 0-2 .9-2 2v1c0 .6.4 1 1 1h10c.6 0 1-.4 1-1v-1c0-1.1-.9-2-2-2h-1V9l2.8-2.8z"></path></svg>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Módulo em Desenvolvimento</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">A seção de cadastro de fornecedores de animais está em construção e estará disponível em breve.</p>
            </div>
        </div>
    );
};

export default AnimalSuppliers;