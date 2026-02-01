import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Animal, Lot } from '../types';
import AnimalDetailModal from './AnimalDetailModal';
import { buildApiUrl } from '../api';

const PlusIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
);
const DownloadIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-9 0V3m0 13.5 4.5-4.5m-4.5 4.5L7.5 12" />
    </svg>
);
const UploadIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-9-13.5V16.5m0-13.5 4.5 4.5m-4.5-4.5L7.5 7.5" />
    </svg>
);
const LayersIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l9 5-9 5-9-5 9-5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10l-9 5-9-5" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 14l-9 5-9-5" />
    </svg>
);
const DotsVerticalIcon: React.FC = () => <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>;

const calculateAge = (birthDateString: string): string => {
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
        years--;
        months = (months + 12) % 12;
    }
    if (years > 0) {
        return `${years}a ${months}m`;
    }
    return `${months}m`;
};


interface HerdProps {
    farmId?: string | null;
    title?: string;
    subtitle?: string;
}

const Herd: React.FC<HerdProps> = ({ farmId, title = 'Rebanho', subtitle = 'Gerencie seu rebanho comercial de corte.' }) => {
    const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [lots, setLots] = useState<Lot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [animalModalOpen, setAnimalModalOpen] = useState(false);
    const [lotModalOpen, setLotModalOpen] = useState(false);
    const [animalFormError, setAnimalFormError] = useState<string | null>(null);
    const [lotFormError, setLotFormError] = useState<string | null>(null);
    const [animalForm, setAnimalForm] = useState({
        brinco: '',
        raca: '',
        sexo: 'Macho',
        dataNascimento: '',
        pesoAtual: '',
        lotId: '',
    });
    const [lotForm, setLotForm] = useState({ name: '', notes: '' });
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleRowClick = (animal: Animal) => {
        setSelectedAnimal(animal);
    };

    const handleCloseModal = () => {
        setSelectedAnimal(null);
    };

    const loadAnimals = useCallback(async () => {
        if (!farmId) {
            setAnimals([]);
            return;
        }
        try {
            const response = await fetch(buildApiUrl(`/animals?farmId=${farmId}`), {
                credentials: 'include',
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                setLoadError(payload?.message || 'Erro ao listar animais.');
                setAnimals([]);
                return;
            }
            setAnimals(payload.animals || []);
        } catch (error) {
            console.error(error);
            setLoadError('Não foi possível listar animais.');
            setAnimals([]);
        }
    }, [farmId]);

    const loadLots = useCallback(async () => {
        if (!farmId) {
            setLots([]);
            return;
        }
        try {
            const response = await fetch(buildApiUrl(`/lots?farmId=${farmId}`), {
                credentials: 'include',
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                setLoadError(payload?.message || 'Erro ao listar lotes.');
                setLots([]);
                return;
            }
            setLots(payload.lots || []);
        } catch (error) {
            console.error(error);
            setLoadError('Não foi possível listar lotes.');
            setLots([]);
        }
    }, [farmId]);

    useEffect(() => {
        if (!farmId) {
            setAnimals([]);
            setLots([]);
            return;
        }
        setIsLoading(true);
        setLoadError(null);
        Promise.all([loadAnimals(), loadLots()])
            .finally(() => setIsLoading(false));
    }, [farmId, loadAnimals, loadLots]);

    useEffect(() => {
        setSelectedAnimal(null);
    }, [farmId]);

    const handleDownloadTemplate = () => {
        const headers = [
            'Brinco',
            'Raça',
            'Sexo (Macho|Fêmea)',
            'Data Nascimento (DD/MM/AAAA)',
            'Peso Atual (kg)',
            'Data Pesagem 1 (DD/MM/AAAA)',
            'Peso Pesagem 1 (kg)',
            'Data Pesagem 2 (DD/MM/AAAA)',
            'Peso Pesagem 2 (kg)',
        ];
        const sampleRow = ['BR001', 'Nelore', 'Macho', '01/01/2023', '450', '15/02/2024', '455', '', ''];
        const aoa = [headers, sampleRow];
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Rebanho Comercial');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'modelo_rebanho_comercial.xlsx';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUploadMessage(null);
        setUploadError(null);
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.name.toLowerCase().endsWith('.xlsx') && !file.name.toLowerCase().endsWith('.csv')) {
            setUploadError('Envie um arquivo .xlsx ou .csv.');
            return;
        }

        setUploadMessage(`Arquivo "${file.name}" recebido. Processamento ainda não implementado.`);
        event.target.value = '';
    };

    const openAnimalModal = () => {
        setAnimalFormError(null);
        setAnimalModalOpen(true);
    };

    const closeAnimalModal = () => {
        setAnimalFormError(null);
        setAnimalModalOpen(false);
        resetAnimalForm();
    };

    const openLotModal = () => {
        setLotFormError(null);
        setLotModalOpen(true);
    };

    const closeLotModal = () => {
        setLotFormError(null);
        setLotModalOpen(false);
        resetLotForm();
    };

    const resetAnimalForm = () => {
        setAnimalForm({
            brinco: '',
            raca: '',
            sexo: 'Macho',
            dataNascimento: '',
            pesoAtual: '',
            lotId: '',
        });
    };

    const resetLotForm = () => {
        setLotForm({ name: '', notes: '' });
    };

    const updateAnimalForm = (field: keyof typeof animalForm, value: string) => {
        setAnimalForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateLotForm = (field: keyof typeof lotForm, value: string) => {
        setLotForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleCreateLot = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!farmId) {
            setLotFormError('Selecione uma fazenda para criar lote.');
            return;
        }
        if (!lotForm.name.trim()) {
            setLotFormError('Informe o nome do lote.');
            return;
        }
        setLotFormError(null);
        try {
            const response = await fetch(buildApiUrl('/lots'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    farmId,
                    name: lotForm.name.trim(),
                    notes: lotForm.notes.trim(),
                }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                setLotFormError(payload?.message || 'Não foi possível salvar o lote.');
                return;
            }
            resetLotForm();
            setLotModalOpen(false);
            loadLots();
        } catch (error) {
            console.error(error);
            setLotFormError('Não foi possível salvar o lote.');
        }
    };

    const handleCreateAnimal = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!farmId) {
            setAnimalFormError('Selecione uma fazenda para criar animal.');
            return;
        }
        if (!animalForm.brinco.trim() || !animalForm.raca.trim() || !animalForm.dataNascimento) {
            setAnimalFormError('Preencha brinco, raça e data de nascimento.');
            return;
        }
        const parsedPeso = Number(animalForm.pesoAtual);
        if (!parsedPeso || parsedPeso <= 0) {
            setAnimalFormError('Informe um peso atual válido.');
            return;
        }

        setAnimalFormError(null);
        try {
            const response = await fetch(buildApiUrl('/animals'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    farmId,
                    lotId: animalForm.lotId || undefined,
                    brinco: animalForm.brinco.trim(),
                    raca: animalForm.raca.trim(),
                    sexo: animalForm.sexo,
                    dataNascimento: animalForm.dataNascimento,
                    pesoAtual: parsedPeso,
                }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                setAnimalFormError(payload?.message || 'Não foi possível salvar o animal.');
                return;
            }
            resetAnimalForm();
            setAnimalModalOpen(false);
            loadAnimals();
        } catch (error) {
            console.error(error);
            setAnimalFormError('Não foi possível salvar o animal.');
        }
    };

    return (
        <div>
            <div className="mb-4 rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="m-0 text-[20px] font-bold leading-[24px] text-gray-900 dark:text-white">{title}</h2>
                        <p className="mt-1 text-[13px] leading-[18px] text-gray-500 opacity-75 dark:text-gray-400">
                            {subtitle}
                        </p>
                    </div>
                    <div className="flex items-center gap-[10px]">
                        <button
                            type="button"
                            onClick={openAnimalModal}
                            className="flex h-10 items-center rounded-[10px] bg-primary px-[14px] font-bold text-white shadow-md transition-colors duration-200 hover:bg-primary-dark"
                        >
                            <PlusIcon className="h-[18px] w-[18px]" />
                            <span className="ml-2 hidden sm:block">Adicionar animal</span>
                        </button>
                        <button
                            className="flex h-10 items-center rounded-[10px] bg-amber-500 px-[14px] font-bold text-white shadow-md transition-colors duration-200 hover:bg-amber-600"
                            type="button"
                            onClick={handleDownloadTemplate}
                        >
                            <DownloadIcon className="h-[18px] w-[18px]" />
                            <span className="ml-2 hidden sm:block">Baixar modelo</span>
                        </button>
                        <button
                            className="flex h-10 items-center rounded-[10px] bg-blue-600 px-[14px] font-bold text-white shadow-md transition-colors duration-200 hover:bg-blue-700"
                            type="button"
                            onClick={handleUploadClick}
                        >
                            <UploadIcon className="h-[18px] w-[18px]" />
                            <span className="ml-2 hidden sm:block">Importar planilha</span>
                        </button>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls,.csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <button
                            type="button"
                            onClick={openLotModal}
                            className="flex h-10 items-center rounded-[10px] bg-gray-500 px-[14px] font-bold text-white shadow-md transition-colors duration-200 hover:bg-gray-600"
                        >
                            <LayersIcon className="h-[18px] w-[18px]" />
                            <span className="ml-2 hidden sm:block">Criar lote</span>
                        </button>
                    </div>
                </div>
            </div>

            {(uploadMessage || uploadError) && (
                <div className="mb-4">
                    {uploadMessage && (
                        <p className="text-sm text-green-600 dark:text-green-400">{uploadMessage}</p>
                    )}
                    {uploadError && (
                        <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                    )}
                </div>
            )}
            {loadError && (
                <div className="mb-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
                </div>
            )}

            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="p-4">
                                    <div className="flex items-center">
                                        <input id="checkbox-all" type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                        <label htmlFor="checkbox-all" className="sr-only">checkbox</label>
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3">Brinco</th>
                                <th scope="col" className="px-6 py-3">Raça</th>
                                <th scope="col" className="px-6 py-3">Sexo</th>
                                <th scope="col" className="px-6 py-3">Idade</th>
                                <th scope="col" className="px-6 py-3">Peso Atual</th>
                                <th scope="col" className="px-6 py-3">GMD</th>
                                <th scope="col" className="px-6 py-3 text-center">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                        Carregando animais...
                                    </td>
                                </tr>
                            ) : animals.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="space-y-1">
                                                <p className="text-base font-semibold text-gray-900 dark:text-white">
                                                    Comece cadastrando seu rebanho
                                                </p>
                                                <p>Você pode adicionar manualmente ou importar uma planilha.</p>
                                            </div>
                                            <div className="flex flex-wrap items-center justify-center gap-3">
                                                <button
                                                    type="button"
                                                    onClick={openAnimalModal}
                                                    className="flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                                                >
                                                    <PlusIcon />
                                                    <span className="ml-2">Adicionar animal</span>
                                                </button>
                                                <button
                                                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                                                    type="button"
                                                    onClick={handleUploadClick}
                                                >
                                                    <UploadIcon />
                                                    <span className="ml-2">Importar planilha</span>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                animals.map((animal) => (
                                    <tr 
                                        key={animal.id} 
                                        className="bg-white border-b dark:bg-dark-card dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
                                        onClick={() => handleRowClick(animal)}
                                    >
                                        <td className="w-4 p-4" onClick={e => e.stopPropagation()}>
                                            <div className="flex items-center">
                                                <input id={`checkbox-table-${animal.id}`} type="checkbox" className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                                <label htmlFor={`checkbox-table-${animal.id}`} className="sr-only">checkbox</label>
                                            </div>
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap dark:text-white">
                                            {animal.brinco}
                                        </th>
                                        <td className="px-6 py-4">{animal.raca}</td>
                                        <td className="px-6 py-4">{animal.sexo}</td>
                                        <td className="px-6 py-4">{calculateAge(animal.dataNascimento)}</td>
                                        <td className="px-6 py-4">{animal.pesoAtual} kg</td>
                                        <td className="px-6 py-4 font-medium text-green-500">{animal.gmd.toFixed(2)} kg</td>
                                        <td className="px-6 py-4 text-center" onClick={e => e.stopPropagation()}>
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

            {animalModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={closeAnimalModal}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl bg-light dark:bg-dark-card shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Adicionar animal</h3>
                            <button
                                type="button"
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                                onClick={closeAnimalModal}
                                aria-label="Fechar modal"
                            >
                                ✕
                            </button>
                        </header>
                        <form onSubmit={handleCreateAnimal} className="space-y-4 p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brinco</label>
                                <input
                                    type="text"
                                    value={animalForm.brinco}
                                    onChange={(event) => updateAnimalForm('brinco', event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Raça</label>
                                <input
                                    type="text"
                                    value={animalForm.raca}
                                    onChange={(event) => updateAnimalForm('raca', event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sexo</label>
                                    <select
                                        value={animalForm.sexo}
                                        onChange={(event) => updateAnimalForm('sexo', event.target.value)}
                                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    >
                                        <option value="Macho">Macho</option>
                                        <option value="Fêmea">Fêmea</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nascimento</label>
                                    <input
                                        type="date"
                                        value={animalForm.dataNascimento}
                                        onChange={(event) => updateAnimalForm('dataNascimento', event.target.value)}
                                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Peso atual (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={animalForm.pesoAtual}
                                        onChange={(event) => updateAnimalForm('pesoAtual', event.target.value)}
                                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lote</label>
                                    <select
                                        value={animalForm.lotId}
                                        onChange={(event) => updateAnimalForm('lotId', event.target.value)}
                                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    >
                                        <option value="">Sem lote</option>
                                        {lots.map((lot) => (
                                            <option key={lot.id} value={lot.id}>
                                                {lot.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {animalFormError && (
                                <p className="text-sm text-red-600 dark:text-red-400">{animalFormError}</p>
                            )}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    onClick={closeAnimalModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                                >
                                    Salvar animal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {lotModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={closeLotModal}
                >
                    <div
                        className="w-full max-w-md rounded-2xl bg-light dark:bg-dark-card shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Criar lote</h3>
                            <button
                                type="button"
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                                onClick={closeLotModal}
                                aria-label="Fechar modal"
                            >
                                ✕
                            </button>
                        </header>
                        <form onSubmit={handleCreateLot} className="space-y-4 p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome do lote</label>
                                <input
                                    type="text"
                                    value={lotForm.name}
                                    onChange={(event) => updateLotForm('name', event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
                                <textarea
                                    value={lotForm.notes}
                                    onChange={(event) => updateLotForm('notes', event.target.value)}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    rows={3}
                                />
                            </div>
                            {lotFormError && (
                                <p className="text-sm text-red-600 dark:text-red-400">{lotFormError}</p>
                            )}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                                    onClick={closeLotModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                                >
                                    Salvar lote
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AnimalDetailModal
                animal={selectedAnimal}
                onClose={handleCloseModal}
                onAnimalUpdated={loadAnimals}
            />
        </div>
    );
};

export default Herd;
