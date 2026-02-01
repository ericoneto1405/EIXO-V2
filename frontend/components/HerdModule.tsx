import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import HerdAnimalModal from './AnimalDetailModal';
import LotDetailModal from './LotDetailModal';
import {
    HerdAnimal,
    HerdLot,
    HerdType,
    createAnimal,
    createLot,
    listAnimals,
    listLots,
} from '../adapters/herdApi';

type TabKey = 'overview' | 'lots' | 'animals' | 'weighings' | 'reports' | 'settings';

interface HerdModuleProps {
    farmId?: string | null;
    mode?: HerdType;
    herdType?: HerdType;
}

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
const DotsVerticalIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
);

const calculateAge = (birthDateString?: string | null): string => {
    if (!birthDateString) {
        return '—';
    }
    const birthDate = new Date(birthDateString);
    if (Number.isNaN(birthDate.getTime())) {
        return '—';
    }
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

const formatNumber = (value?: number | null) => {
    if (value === null || value === undefined) {
        return '—';
    }
    return value.toFixed(2);
};

const HerdModule: React.FC<HerdModuleProps> = ({ farmId, mode, herdType }) => {
    const resolvedMode = mode ?? herdType ?? 'COMMERCIAL';
    const [activeTab, setActiveTab] = useState<TabKey>('overview');
    const [animals, setAnimals] = useState<HerdAnimal[]>([]);
    const [lots, setLots] = useState<HerdLot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [lotFilter, setLotFilter] = useState('');
    const [selectedAnimal, setSelectedAnimal] = useState<HerdAnimal | null>(null);
    const [selectedLot, setSelectedLot] = useState<HerdLot | null>(null);
    const [lotModalOpen, setLotModalOpen] = useState(false);
    const [animalFormOpen, setAnimalFormOpen] = useState(false);
    const [animalFormError, setAnimalFormError] = useState<string | null>(null);
    const [lotFormError, setLotFormError] = useState<string | null>(null);
    const [uploadMessage, setUploadMessage] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [animalForm, setAnimalForm] = useState({
        brinco: '',
        nome: '',
        raca: '',
        sexo: 'Macho',
        dataNascimento: '',
        pesoAtual: '',
        registro: '',
        categoria: '',
        observacoes: '',
        lotId: '',
    });
    const [lotForm, setLotForm] = useState({ name: '', notes: '' });

    const isPo = resolvedMode === 'PO';

    const tabs = useMemo(() => {
        return [
            { key: 'overview', label: 'Visão do Rebanho' },
            { key: 'lots', label: 'Lotes/Grupos' },
            { key: 'animals', label: 'Animais' },
            { key: 'weighings', label: 'Pesagens' },
            { key: 'reports', label: 'Relatórios' },
            { key: 'settings', label: 'Configurações' },
        ];
    }, []);

    const title = isPo ? 'Rebanho P.O.' : 'Rebanho Comercial';
    const subtitle = isPo
        ? 'Gerencie seu plantel P.O. com o mesmo fluxo do rebanho comercial.'
        : 'Gerencie seu rebanho comercial de corte.';

    const loadData = useCallback(async () => {
        if (!farmId) {
            setAnimals([]);
            setLots([]);
            return;
        }
        setIsLoading(true);
        setLoadError(null);
        try {
            const [animalsResult, lotsResult] = await Promise.all([
                listAnimals(farmId, resolvedMode),
                listLots(farmId, resolvedMode),
            ]);
            setAnimals(animalsResult);
            setLots(lotsResult);
        } catch (error: any) {
            console.error(error);
            setLoadError(error?.message || 'Não foi possível carregar o rebanho.');
        } finally {
            setIsLoading(false);
        }
    }, [farmId, resolvedMode, isPo]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        setSelectedAnimal(null);
        setSelectedLot(null);
        setLotFilter('');
    }, [farmId, resolvedMode]);

    useEffect(() => {
        if (lotFilter && !lots.some((lot) => lot.id === lotFilter)) {
            setLotFilter('');
        }
    }, [lots, lotFilter]);

    const filteredAnimals = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        const matchesLot = (animal: HerdAnimal) => (lotFilter ? animal.lotId === lotFilter : true);
        return animals.filter((animal) => {
            if (isPo) {
                const haystack = [
                    animal.identificacao,
                    animal.nome,
                    animal.brinco,
                    animal.registro,
                    animal.raca,
                ]
                    .filter(Boolean)
                    .join(' ')
                    .toLowerCase();
                if (term && !haystack.includes(term)) {
                    return false;
                }
                return matchesLot(animal);
            }
            if (!term) {
                return matchesLot(animal);
            }
            const matchesSearch = [animal.identificacao, animal.raca, animal.sexo]
                .filter(Boolean)
                .join(' ')
                .toLowerCase()
                .includes(term);
            return matchesLot(animal) && matchesSearch;
        });
    }, [animals, isPo, lotFilter, searchTerm]);

    const overviewStats = useMemo(() => {
        const total = animals.length;
        const weights = animals.map((animal) => animal.pesoAtual).filter((peso) => typeof peso === 'number');
        const avgWeight = weights.length
            ? weights.reduce((sum, value) => sum + (value || 0), 0) / weights.length
            : null;
        return {
            total,
            avgWeight,
        };
    }, [animals]);

    const resetAnimalForm = () => {
        setAnimalForm({
            brinco: '',
            nome: '',
            raca: '',
            sexo: 'Macho',
            dataNascimento: '',
            pesoAtual: '',
            registro: '',
            categoria: '',
            observacoes: '',
            lotId: '',
        });
    };

    const resetLotForm = () => {
        setLotForm({ name: '', notes: '' });
    };

    const openAnimalForm = () => {
        setAnimalFormError(null);
        setAnimalFormOpen(true);
    };

    const closeAnimalForm = () => {
        setAnimalFormError(null);
        setAnimalFormOpen(false);
        resetAnimalForm();
    };

    const openLotForm = () => {
        setLotFormError(null);
        setLotModalOpen(true);
    };

    const closeLotForm = () => {
        setLotFormError(null);
        setLotModalOpen(false);
        resetLotForm();
    };

    const handleDownloadTemplate = () => {
        const headers = isPo
            ? ['Brinco', 'Nome', 'Raça', 'Sexo (Macho|Fêmea)', 'Data Nascimento (DD/MM/AAAA)', 'Peso Atual (kg)', 'Registro', 'Categoria']
            : [
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
        const sampleRow = isPo
            ? ['PO001', 'Matriz Top', 'Nelore', 'Fêmea', '01/01/2022', '450', 'ABCZ-123', 'Doadora']
            : ['BR001', 'Nelore', 'Macho', '01/01/2023', '450', '15/02/2024', '455', '', ''];
        const aoa = [headers, sampleRow];
        const ws = XLSX.utils.aoa_to_sheet(aoa);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, isPo ? 'Rebanho P.O.' : 'Rebanho Comercial');
        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = isPo ? 'modelo_rebanho_po.xlsx' : 'modelo_rebanho_comercial.xlsx';
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

    const handleCreateAnimal = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!farmId) {
            setAnimalFormError('Selecione uma fazenda para criar animal.');
            return;
        }
        if (isPo) {
            if (!animalForm.nome.trim() || !animalForm.raca.trim()) {
                setAnimalFormError('Preencha nome e raça.');
                return;
            }
        } else if (!animalForm.brinco.trim() || !animalForm.raca.trim() || !animalForm.dataNascimento) {
            setAnimalFormError('Preencha brinco, raça e data de nascimento.');
            return;
        }

        const parsedPeso = animalForm.pesoAtual ? Number(animalForm.pesoAtual) : null;
        if (animalForm.pesoAtual && (!parsedPeso || parsedPeso <= 0)) {
            setAnimalFormError('Informe um peso atual válido.');
            return;
        }

        try {
            setAnimalFormError(null);
            const payload = isPo
                ? {
                    brinco: animalForm.brinco.trim() || undefined,
                    nome: animalForm.nome.trim(),
                    raca: animalForm.raca.trim(),
                    sexo: animalForm.sexo,
                    dataNascimento: animalForm.dataNascimento || undefined,
                    pesoAtual: parsedPeso ?? undefined,
                    registro: animalForm.registro.trim() || undefined,
                    categoria: animalForm.categoria.trim() || undefined,
                    observacoes: animalForm.observacoes.trim() || undefined,
                    lotId: animalForm.lotId || undefined,
                }
                : {
                    brinco: animalForm.brinco.trim(),
                    raca: animalForm.raca.trim(),
                    sexo: animalForm.sexo,
                    dataNascimento: animalForm.dataNascimento,
                    pesoAtual: parsedPeso ?? undefined,
                    lotId: animalForm.lotId || undefined,
                };
            await createAnimal(farmId, resolvedMode, payload);
            closeAnimalForm();
            await loadData();
        } catch (error: any) {
            setAnimalFormError(error?.message || 'Não foi possível salvar o animal.');
        }
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
        try {
            setLotFormError(null);
            await createLot(farmId, resolvedMode, {
                name: lotForm.name.trim(),
                notes: lotForm.notes.trim() || undefined,
            });
            closeLotForm();
            await loadData();
        } catch (error: any) {
            setLotFormError(error?.message || 'Não foi possível salvar o lote.');
        }
    };

    const renderTable = (actionLabel?: string) => (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Identificação</th>
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
                                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                    Carregando animais...
                                </td>
                            </tr>
                        ) : filteredAnimals.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="space-y-1">
                                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                                                Nenhum animal encontrado
                                            </p>
                                            <p>Use os botões acima para adicionar animais.</p>
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center gap-3">
                                            <button
                                                type="button"
                                                onClick={openAnimalForm}
                                                className="flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                                            >
                                                <PlusIcon />
                                                <span className="ml-2">Adicionar animal</span>
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            filteredAnimals.map((animal) => (
                                <tr
                                    key={animal.id}
                                    className="bg-white border-b dark:bg-dark-card dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
                                    onClick={() => {
                                        setSelectedAnimal(animal);
                                    }}
                                >
                                    <th scope="row" className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap dark:text-white">
                                        <div>{animal.identificacao}</div>
                                        {animal.registro && (
                                            <div className="text-xs text-gray-400">Registro: {animal.registro}</div>
                                        )}
                                    </th>
                                    <td className="px-6 py-4">{animal.raca}</td>
                                    <td className="px-6 py-4">{animal.sexo}</td>
                                    <td className="px-6 py-4">{calculateAge(animal.dataNascimento)}</td>
                                    <td className="px-6 py-4">
                                        {animal.pesoAtual !== null && animal.pesoAtual !== undefined
                                            ? `${animal.pesoAtual} kg`
                                            : '—'}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-green-500">
                                        {formatNumber(animal.gmd)} kg
                                    </td>
                                    <td className="px-6 py-4 text-center" onClick={(event) => event.stopPropagation()}>
                                        <button
                                            type="button"
                                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                            onClick={() => setSelectedAnimal(animal)}
                                            aria-label={actionLabel || 'Abrir detalhes'}
                                        >
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
    );

    const renderOverview = () => (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-dark-card">
                <p className="text-sm text-gray-500">Total de animais</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{overviewStats.total}</p>
            </div>
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-dark-card">
                <p className="text-sm text-gray-500">Peso médio</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                    {overviewStats.avgWeight ? `${overviewStats.avgWeight.toFixed(1)} kg` : '—'}
                </p>
            </div>
        </div>
    );

    const renderLots = () => {
        return (
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Lote</th>
                                <th scope="col" className="px-6 py-3">Observações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                        Carregando lotes...
                                    </td>
                                </tr>
                            ) : lots.length === 0 ? (
                                <tr>
                                    <td colSpan={2} className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="space-y-1">
                                                <p className="text-base font-semibold text-gray-900 dark:text-white">
                                                    Nenhum lote cadastrado
                                                </p>
                                                <p>Organize seu rebanho criando um lote.</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={openLotForm}
                                                className="flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors duration-200"
                                            >
                                                <PlusIcon />
                                                <span className="ml-2">Adicionar lote</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                lots.map((lot) => (
                                    <tr
                                        key={lot.id}
                                        className="bg-white border-b dark:bg-dark-card dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
                                        onClick={() => setSelectedLot(lot)}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{lot.name}</td>
                                        <td className="px-6 py-4">{lot.notes || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div className="mb-4 rounded-[14px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2 className="m-0 text-[20px] font-bold leading-[24px] text-gray-900 dark:text-white">{title}</h2>
                        <p className="mt-1 text-[13px] leading-[18px] text-gray-500 opacity-75 dark:text-gray-400">
                            {subtitle}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-[10px]">
                        {activeTab === 'animals' && (
                            <>
                                <button
                                    type="button"
                                    onClick={openAnimalForm}
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
                            </>
                        )}
                        {activeTab === 'lots' && (
                            <button
                                type="button"
                                onClick={openLotForm}
                                className="flex h-10 items-center rounded-[10px] bg-gray-500 px-[14px] font-bold text-white shadow-md transition-colors duration-200 hover:bg-gray-600"
                            >
                                <LayersIcon className="h-[18px] w-[18px]" />
                                <span className="ml-2 hidden sm:block">Criar lote</span>
                            </button>
                        )}
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        placeholder="Buscar por identificação, raça ou registro..."
                        className="w-full max-w-sm rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                    />
                    {(
                        <select
                            value={lotFilter}
                            onChange={(event) => setLotFilter(event.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                        >
                            <option value="">Todos os lotes</option>
                            {lots.map((lot) => (
                                <option key={lot.id} value={lot.id}>{lot.name}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {uploadMessage && (
                <div className="mb-4">
                    <p className="text-sm text-green-600 dark:text-green-400">{uploadMessage}</p>
                </div>
            )}
            {uploadError && (
                <div className="mb-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{uploadError}</p>
                </div>
            )}
            {loadError && (
                <div className="mb-4">
                    <p className="text-sm text-red-600 dark:text-red-400">{loadError}</p>
                </div>
            )}

            <div className="mb-6 flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                            activeTab === tab.key
                                ? 'bg-primary text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 dark:bg-dark-card dark:text-gray-300 dark:hover:bg-gray-700'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'lots' && renderLots()}
            {activeTab === 'animals' && renderTable()}
            {activeTab === 'weighings' && renderTable('Registrar pesagem')}
            {activeTab === 'reports' && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-dark-card">
                    Relatórios do rebanho em breve.
                </div>
            )}
            {activeTab === 'settings' && (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-gray-700 dark:bg-dark-card">
                    Configurações específicas do rebanho em breve.
                </div>
            )}
            {animalFormOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    role="dialog"
                    aria-modal="true"
                    onClick={closeAnimalForm}
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
                                onClick={closeAnimalForm}
                                aria-label="Fechar modal"
                            >
                                ✕
                            </button>
                        </header>
                        <form onSubmit={handleCreateAnimal} className="space-y-4 p-6">
                            {isPo && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                                    <input
                                        type="text"
                                        value={animalForm.nome}
                                        onChange={(event) => setAnimalForm((prev) => ({ ...prev, nome: event.target.value }))}
                                        className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                        required
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brinco</label>
                                <input
                                    type="text"
                                    value={animalForm.brinco}
                                    onChange={(event) => setAnimalForm((prev) => ({ ...prev, brinco: event.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    required={!isPo}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Raça</label>
                                <input
                                    type="text"
                                    value={animalForm.raca}
                                    onChange={(event) => setAnimalForm((prev) => ({ ...prev, raca: event.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sexo</label>
                                <select
                                    value={animalForm.sexo}
                                    onChange={(event) => setAnimalForm((prev) => ({ ...prev, sexo: event.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                >
                                    <option value="Macho">Macho</option>
                                    <option value="Fêmea">Fêmea</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de nascimento</label>
                                <input
                                    type="date"
                                    value={animalForm.dataNascimento}
                                    onChange={(event) => setAnimalForm((prev) => ({ ...prev, dataNascimento: event.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    required={!isPo}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Peso atual (kg)</label>
                                <input
                                    type="number"
                                    value={animalForm.pesoAtual}
                                    onChange={(event) => setAnimalForm((prev) => ({ ...prev, pesoAtual: event.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lote</label>
                                <select
                                    value={animalForm.lotId}
                                    onChange={(event) => setAnimalForm((prev) => ({ ...prev, lotId: event.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                >
                                    <option value="">Sem lote</option>
                                    {lots.map((lot) => (
                                        <option key={lot.id} value={lot.id}>{lot.name}</option>
                                    ))}
                                </select>
                            </div>
                            {isPo && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Registro</label>
                                        <input
                                            type="text"
                                            value={animalForm.registro}
                                            onChange={(event) => setAnimalForm((prev) => ({ ...prev, registro: event.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Categoria</label>
                                        <input
                                            type="text"
                                            value={animalForm.categoria}
                                            onChange={(event) => setAnimalForm((prev) => ({ ...prev, categoria: event.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
                                        <textarea
                                            value={animalForm.observacoes}
                                            onChange={(event) => setAnimalForm((prev) => ({ ...prev, observacoes: event.target.value }))}
                                            className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                            rows={3}
                                        />
                                    </div>
                                </>
                            )}
                            {animalFormError && (
                                <p className="text-sm text-red-600 dark:text-red-400">{animalFormError}</p>
                            )}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                                    onClick={closeAnimalForm}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                                >
                                    Salvar
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
                    onClick={closeLotForm}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl bg-light dark:bg-dark-card shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Criar lote</h3>
                            <button
                                type="button"
                                className="rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                                onClick={closeLotForm}
                                aria-label="Fechar modal"
                            >
                                ✕
                            </button>
                        </header>
                        <form onSubmit={handleCreateLot} className="space-y-4 p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome</label>
                                <input
                                    type="text"
                                    value={lotForm.name}
                                    onChange={(event) => setLotForm((prev) => ({ ...prev, name: event.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
                                <textarea
                                    value={lotForm.notes}
                                    onChange={(event) => setLotForm((prev) => ({ ...prev, notes: event.target.value }))}
                                    className="mt-1 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                    rows={3}
                                />
                            </div>
                            {lotFormError && (
                                <p className="text-sm text-red-600 dark:text-red-400">{lotFormError}</p>
                            )}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                                    onClick={closeLotForm}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedAnimal && (
                <HerdAnimalModal
                    animal={selectedAnimal}
                    mode={resolvedMode}
                    onClose={() => setSelectedAnimal(null)}
                    onAnimalUpdated={loadData}
                />
            )}
            {selectedLot && (
                <LotDetailModal
                    lot={selectedLot}
                    onClose={() => setSelectedLot(null)}
                    mode={resolvedMode}
                />
            )}
        </div>
    );
};

export default HerdModule;
