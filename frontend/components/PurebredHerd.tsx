import React from 'react';

const PurebredHerd: React.FC = () => {
    return (
        <div>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Gerencie seus animais de elite, pedigree e dados de genealogia.</p>
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-12 text-center flex flex-col items-center justify-center h-96">
                <svg className="w-16 h-16 text-primary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M4 17v4M2 19h4M17 3v4M15 5h4M17 17v4M15 19h4M12 9a3 3 0 100-6 3 3 0 000 6zm-7 3a3 3 0 100-6 3 3 0 000 6zm14 0a3 3 0 100-6 3 3 0 000 6zM12 21a3 3 0 100-6 3 3 0 000 6zm-7 0a3 3 0 100-6 3 3 0 000 6zm14 0a3 3 0 100-6 3 3 0 000 6z"></path></svg>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Módulo em Desenvolvimento</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">A seção para gerenciamento de rebanho genética está em construção e estará disponível em breve.</p>
            </div>
        </div>
    );
};

export default PurebredHerd;
