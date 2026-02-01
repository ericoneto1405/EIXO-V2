import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Farm, Paddock } from '../types';
import { buildApiUrl } from '../api';

// A simple unique ID generator for paddocks
let paddockIdCounter = 0;

interface PaddockInput {
    id: string;
    name: string;
    size: string; // Use string to handle empty inputs
}

interface FarmRegistrationFormProps {
    onFarmCreated?: (farm: Farm) => void;
    autoFocusName?: boolean;
}

const FarmRegistrationForm: React.FC<FarmRegistrationFormProps> = ({ onFarmCreated, autoFocusName }) => {
    const [farmName, setFarmName] = useState('');
    const [farmCity, setFarmCity] = useState('');
    const [farmLat, setFarmLat] = useState('');
    const [farmLng, setFarmLng] = useState('');
    const [farmSize, setFarmSize] = useState(''); // Total size in hectares
    const [farmNotes, setFarmNotes] = useState('');
    const [paddocks, setPaddocks] = useState<PaddockInput[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const nameInputRef = useRef<HTMLInputElement | null>(null);

    const totalPaddockSize = useMemo(() => {
        return paddocks.reduce((sum, paddock) => sum + (parseFloat(paddock.size) || 0), 0);
    }, [paddocks]);

    const farmSizeFloat = parseFloat(farmSize) || 0;
    const remainingSize = farmSizeFloat - totalPaddockSize;
    const isBalancedArea = Math.abs(remainingSize) < 0.0001;

    const isSaveDisabled = isSubmitting;

    useEffect(() => {
        if (autoFocusName) {
            nameInputRef.current?.focus();
        }
    }, [autoFocusName]);

    const handleAddPaddock = () => {
        const paddockNumber = paddocks.length + 1;
        setPaddocks([...paddocks, { id: `paddock-${paddockIdCounter++}`, name: `Pasto ${paddockNumber}`, size: '' }]);
    };

    const handleRemovePaddock = (id: string) => {
        setPaddocks(paddocks.filter(p => p.id !== id));
    };

    const handlePaddockSizeChange = (id: string, value: string) => {
        setPaddocks(paddocks.map(p => p.id === id ? { ...p, size: value } : p));
    };

    const handlePaddockNameChange = (id: string, value: string) => {
        setPaddocks(paddocks.map(p => p.id === id ? { ...p, name: value } : p));
    };

    const resetForm = () => {
        setFarmName('');
        setFarmCity('');
        setFarmLat('');
        setFarmLng('');
        setFarmSize('');
        setFarmNotes('');
        setPaddocks([]);
        paddockIdCounter = 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);
        setSubmitSuccess(null);

        const payloadPaddocks: Paddock[] = paddocks.map((p) => ({
            id: p.id,
            name: p.name.trim(),
            size: parseFloat(p.size) || 0,
        }));

        const hasInvalidPaddock = payloadPaddocks.some(
            (p) => !p.name || Number.isNaN(p.size) || p.size <= 0,
        );
        if (!farmName.trim() || !farmCity.trim()) {
            setSubmitError('Informe nome e cidade da fazenda.');
            return;
        }
        if (!payloadPaddocks.length || hasInvalidPaddock) {
            setSubmitError('Pastos precisam de nome e tamanho válidos.');
            return;
        }
        if (farmSizeFloat <= 0) {
            setSubmitError('Informe o tamanho total da fazenda.');
            return;
        }
        if (!isBalancedArea) {
            setSubmitError('Distribua a área total da fazenda entre os pastos para salvar.');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(buildApiUrl('/farms'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: farmName.trim(),
                    city: farmCity.trim(),
                    lat: farmLat.trim(),
                    lng: farmLng.trim(),
                    size: farmSizeFloat,
                    notes: farmNotes.trim(),
                    paddocks: payloadPaddocks,
                }),
            });

            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                setSubmitError(payload?.message || 'Não foi possível salvar a fazenda.');
                return;
            }

            setSubmitSuccess('Fazenda salva com sucesso!');
            resetForm();
            if (payload?.farm) {
                onFarmCreated?.(payload.farm);
            }
        } catch (error) {
            console.error(error);
            setSubmitError('Não foi possível salvar a fazenda. Verifique sua conexão.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Cadastro de Fazenda</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Farm Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome da Fazenda</label>
                        <input
                            ref={nameInputRef}
                            type="text"
                            id="farmName"
                            value={farmName}
                            onChange={e => setFarmName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="farmCity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Cidade/UF</label>
                        <input type="text" id="farmCity" value={farmCity} onChange={e => setFarmCity(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
                    </div>
                    <div>
                        <label htmlFor="farmLat" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Latitude</label>
                        <input type="text" id="farmLat" placeholder="-23.550520" value={farmLat} onChange={e => setFarmLat(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="farmLng" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Longitude</label>
                        <input type="text" id="farmLng" placeholder="-46.633308" value={farmLng} onChange={e => setFarmLng(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="farmSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tamanho Total (ha)</label>
                        <input type="number" id="farmSize" value={farmSize} onChange={e => setFarmSize(e.target.value)} min="0" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="farmNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
                        <textarea id="farmNotes" value={farmNotes} onChange={e => setFarmNotes(e.target.value)} rows={3} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"></textarea>
                    </div>
                </div>

                {/* Paddocks Section */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pastos</h3>
                    <div className="mt-4 space-y-4">
                        {paddocks.map((paddock, index) => (
                            <div key={paddock.id} className="flex flex-col gap-3 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pasto {index + 1}</span>
                                    <button type="button" onClick={() => handleRemovePaddock(paddock.id)} className="ml-auto text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors" aria-label="Remover pasto">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <div>
                                        <label htmlFor={`paddock-name-${paddock.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Pasto</label>
                                        <input
                                            type="text"
                                            id={`paddock-name-${paddock.id}`}
                                            value={paddock.name}
                                            onChange={(e) => handlePaddockNameChange(paddock.id, e.target.value)}
                                            placeholder="Ex.: Pasto 01, Rotacionado, Maternidade..."
                                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`paddock-size-${paddock.id}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tamanho (ha)</label>
                                        <input
                                            type="number"
                                            id={`paddock-size-${paddock.id}`}
                                            value={paddock.size}
                                            onChange={(e) => handlePaddockSizeChange(paddock.id, e.target.value)}
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-dark-card border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={handleAddPaddock} className="mt-4 flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                         <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Adicionar Pasto
                    </button>
                </div>

                {submitError && (
                    <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
                )}
                {submitSuccess && (
                    <p className="text-sm text-green-600 dark:text-green-400">{submitSuccess}</p>
                )}

                {/* Summary and Validation */}
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border dark:border-gray-700 space-y-2 mt-4">
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Área Total da Fazenda:</span>
                        <span className="font-bold text-gray-800 dark:text-white">{farmSizeFloat.toFixed(2)} ha</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="font-medium text-gray-600 dark:text-gray-400">Área Total dos Pastos:</span>
                        <span className="font-bold text-gray-800 dark:text-white">{totalPaddockSize.toFixed(2)} ha</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold">
                        <span className={isBalancedArea && farmSizeFloat > 0 ? 'text-green-600' : 'text-red-600'}>Área Restante a Alocar:</span>
                        <span className={isBalancedArea && farmSizeFloat > 0 ? 'text-green-600' : 'text-red-600'}>{remainingSize.toFixed(2)} ha</span>
                    </div>
                     {!isBalancedArea && farmSizeFloat > 0 && (
                        <p className="text-xs text-center text-yellow-600 dark:text-yellow-400 pt-2">A soma das áreas dos pastos deve ser igual à área total da fazenda (tolerância de 0.0001 ha).</p>
                     )}
                </div>

                {/* Actions */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaveDisabled}
                        className="flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed dark:disabled:bg-gray-600"
                    >
                        {isSubmitting ? 'Salvando...' : 'Salvar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FarmRegistrationForm;
