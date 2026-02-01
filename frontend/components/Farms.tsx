import React, { useEffect, useRef, useState } from 'react';
import FarmRegistrationForm from './FarmRegistrationForm';
import { Farm } from '../types';

// Icons
const PlusIcon: React.FC = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const DotsVerticalIcon: React.FC = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>;


interface FarmsProps {
    farms: Farm[];
    onFarmCreated?: (farm: Farm) => void;
    openForm?: boolean;
    onFormOpened?: () => void;
    onFormClosed?: () => void;
}

const Farms: React.FC<FarmsProps> = ({ farms, onFarmCreated, openForm, onFormOpened, onFormClosed }) => {
    const [showForm, setShowForm] = useState(false);
    const [focusOnForm, setFocusOnForm] = useState(false);
    const formRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (openForm) {
            setShowForm(true);
            setFocusOnForm(true);
            onFormOpened?.();
        }
    }, [openForm, onFormOpened]);

    const handleToggleForm = () => {
        setShowForm((prev) => {
            const next = !prev;
            if (next) {
                setFocusOnForm(true);
                onFormOpened?.();
            } else {
                onFormClosed?.();
            }
            return next;
        });
    };

    const handleFarmCreated = (farm: Farm) => {
        setFocusOnForm(false);
        onFarmCreated?.(farm);
        setShowForm(false);
        onFormClosed?.();
    };

    useEffect(() => {
        if (showForm) {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [showForm]);

    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <div>
                     <p className="text-gray-500 dark:text-gray-400">Gerencie suas propriedades cadastradas.</p>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    <button
                        type="button"
                        onClick={handleToggleForm}
                        className="flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                    >
                        <PlusIcon />
                        <span className="ml-2 hidden sm:block">
                            {showForm ? 'Fechar cadastro' : 'Adicionar Fazenda'}
                        </span>
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="mb-6" ref={formRef}>
                    <FarmRegistrationForm onFarmCreated={handleFarmCreated} autoFocusName={focusOnForm} />
                </div>
            )}

            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nome da Fazenda</th>
                                <th scope="col" className="px-6 py-3">Cidade/UF</th>
                                <th scope="col" className="px-6 py-3">Tamanho (ha)</th>
                                <th scope="col" className="px-6 py-3">Nº de Pastos</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {farms.length === 0 && !showForm ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                        <p className="text-base font-semibold text-gray-900 dark:text-white">
                                            Comece cadastrando uma fazenda
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                farms.map((farm) => (
                                    <tr key={farm.id} className="bg-white border-b dark:bg-dark-card dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                                        <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap dark:text-white">
                                            {farm.name}
                                        </th>
                                        <td className="px-6 py-4">{farm.city}</td>
                                        <td className="px-6 py-4">{farm.size}</td>
                                        <td className="px-6 py-4">{farm.paddocks?.length ?? 0}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                                               <DotsVerticalIcon />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Farms;
