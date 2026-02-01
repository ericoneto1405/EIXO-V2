import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animal, AtividadeRecente, Paddock, PaddockMove, WeighingHistory } from '../types';
import { HerdAnimal, HerdType, createPaddockMove, createWeighing, listPaddockMoves, listWeighings } from '../adapters/herdApi';
import { getCurrentNutrition } from '../adapters/nutritionApi';
import { buildApiUrl } from '../api';

interface AnimalDetailModalProps {
    animal: (Animal | HerdAnimal) | null;
    mode?: HerdType;
    herdType?: HerdType;
    onClose: () => void;
    onAnimalUpdated?: () => void;
}


const recentActivities: AtividadeRecente[] = [];

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

const CloseIcon: React.FC = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>;
const CattleIcon: React.FC = () => <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M18.8 6.2c.5-.5.8-1.2.8-2s-.3-1.5-.8-2c-.5-.5-1.2-.8-2-.8s-1.5.3-2 .8L12 5 9.2 2.2c-.5-.5-1.2-.8-2-.8s-1.5.3-2 .8c-.5-.5-.8 1.2-.8 2s.3 1.5.8 2L8 9v5H7c-1.1 0-2 .9-2 2v1c0 .6.4 1 1 1h10c.6 0 1-.4 1-1v-1c0-1.1-.9-2-2-2h-1V9l2.8-2.8z"></path></svg>;


const AnimalDetailModal: React.FC<AnimalDetailModalProps> = ({
    animal,
    mode,
    herdType,
    onClose,
    onAnimalUpdated,
}) => {
    const resolvedMode: HerdType = mode ?? herdType ?? 'COMMERCIAL';
    const [activeTab, setActiveTab] = useState<'weighing' | 'activity' | 'paddock'>('weighing');
    const [weighingHistory, setWeighingHistory] = useState<WeighingHistory[]>([]);
    const [weighingError, setWeighingError] = useState<string | null>(null);
    const [isLoadingWeighings, setIsLoadingWeighings] = useState(false);
    const [weighingDate, setWeighingDate] = useState('');
    const [weighingPeso, setWeighingPeso] = useState('');
    const [isSavingWeighing, setIsSavingWeighing] = useState(false);
    const [nutritionPlanName, setNutritionPlanName] = useState<string | null>(null);
    const [nutritionPlanMeta, setNutritionPlanMeta] = useState<number | null>(null);
    const [nutritionPlanPhase, setNutritionPlanPhase] = useState<string | null>(null);
    const [isLoadingNutrition, setIsLoadingNutrition] = useState(false);
    const [nutritionError, setNutritionError] = useState<string | null>(null);
    const [paddockMoves, setPaddockMoves] = useState<PaddockMove[]>([]);
    const [isLoadingPaddockMoves, setIsLoadingPaddockMoves] = useState(false);
    const [paddockMoveError, setPaddockMoveError] = useState<string | null>(null);
    const [paddockOptions, setPaddockOptions] = useState<Paddock[]>([]);
    const [movePaddockId, setMovePaddockId] = useState('');
    const [moveStartAt, setMoveStartAt] = useState(new Date().toISOString().slice(0, 10));
    const [moveNotes, setMoveNotes] = useState('');
    const [isSavingPaddockMove, setIsSavingPaddockMove] = useState(false);

    const animalId = animal?.id;

    const loadWeighings = useCallback(async () => {
        if (!animalId) {
            setWeighingHistory([]);
            return;
        }
        setIsLoadingWeighings(true);
        setWeighingError(null);
        try {
            const history = await listWeighings(animalId, resolvedMode);
            setWeighingHistory(history || []);
        } catch (error: any) {
            console.error(error);
            setWeighingError(error?.message || 'Não foi possível listar pesagens.');
            setWeighingHistory([]);
        } finally {
            setIsLoadingWeighings(false);
        }
    }, [animalId, resolvedMode]);

    const loadPaddockMoves = useCallback(async () => {
        if (!animalId) {
            setPaddockMoves([]);
            return;
        }
        setIsLoadingPaddockMoves(true);
        setPaddockMoveError(null);
        try {
            const moves = await listPaddockMoves(animalId, resolvedMode);
            setPaddockMoves(moves || []);
        } catch (error: any) {
            console.error(error);
            setPaddockMoveError(error?.message || 'Não foi possível listar movimentações de pasto.');
            setPaddockMoves([]);
        } finally {
            setIsLoadingPaddockMoves(false);
        }
    }, [animalId, resolvedMode]);

    const loadPaddockOptions = useCallback(async () => {
        const farmId = (animal as any)?.farmId;
        if (!farmId) {
            setPaddockOptions([]);
            return;
        }
        try {
            const response = await fetch(buildApiUrl(`/pastos?farmId=${farmId}`), { credentials: 'include' });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(payload?.message || 'Erro ao carregar pastos.');
            }
            setPaddockOptions(payload.items || []);
        } catch (error) {
            console.error(error);
            setPaddockOptions([]);
        }
    }, [animal]);

    useEffect(() => {
        if (animalId) {
            loadWeighings();
            loadPaddockMoves();
            loadPaddockOptions();
            setMovePaddockId('');
            setMoveStartAt(new Date().toISOString().slice(0, 10));
            setMoveNotes('');
        } else {
            setWeighingHistory([]);
            setWeighingError(null);
            setPaddockMoves([]);
            setPaddockMoveError(null);
            setPaddockOptions([]);
        }
    }, [animalId, loadWeighings, loadPaddockMoves, loadPaddockOptions]);

    useEffect(() => {
        const farmId = (animal as HerdAnimal)?.farmId;
        if (!animalId || !farmId) {
            setNutritionPlanName(null);
            setNutritionPlanMeta(null);
            setNutritionPlanPhase(null);
            setNutritionError(null);
            return;
        }
        const loadNutrition = async () => {
            setIsLoadingNutrition(true);
            setNutritionError(null);
            try {
            const payload = await getCurrentNutrition({
                farmId,
                animalId: resolvedMode === 'COMMERCIAL' ? animalId : undefined,
                poAnimalId: resolvedMode === 'PO' ? animalId : undefined,
            });
                setNutritionPlanName(payload.plan?.nome || null);
                setNutritionPlanMeta(payload.plan?.metaGmd ?? null);
                setNutritionPlanPhase(payload.plan?.fase || null);
            } catch (error: any) {
                console.error(error);
                setNutritionError(error?.message || 'Erro ao carregar nutrição.');
                setNutritionPlanName(null);
                setNutritionPlanMeta(null);
                setNutritionPlanPhase(null);
            } finally {
                setIsLoadingNutrition(false);
            }
        };
        loadNutrition();
    }, [animalId, resolvedMode, animal]);

    const handleAddWeighing = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!animalId) {
            return;
        }
        if (!weighingDate || !weighingPeso) {
            setWeighingError('Informe data e peso da pesagem.');
            return;
        }
        const parsedPeso = Number(weighingPeso);
        if (!parsedPeso || parsedPeso <= 0) {
            setWeighingError('Peso inválido.');
            return;
        }
        setIsSavingWeighing(true);
        setWeighingError(null);
        try {
            await createWeighing(animalId, resolvedMode, {
                data: weighingDate,
                peso: parsedPeso,
            });
            setWeighingDate('');
            setWeighingPeso('');
            await loadWeighings();
            onAnimalUpdated?.();
        } catch (error) {
            console.error(error);
            setWeighingError('Não foi possível salvar a pesagem.');
        } finally {
            setIsSavingWeighing(false);
        }
    };

    const handleAddPaddockMove = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!animalId) {
            return;
        }
        if (!movePaddockId) {
            setPaddockMoveError('Selecione o pasto.');
            return;
        }
        setIsSavingPaddockMove(true);
        setPaddockMoveError(null);
        try {
            await createPaddockMove(animalId, resolvedMode, {
                paddockId: movePaddockId,
                startAt: moveStartAt || undefined,
                notes: moveNotes || undefined,
            });
            setMovePaddockId('');
            setMoveStartAt(new Date().toISOString().slice(0, 10));
            setMoveNotes('');
            await loadPaddockMoves();
            onAnimalUpdated?.();
        } catch (error: any) {
            console.error(error);
            setPaddockMoveError(error?.message || 'Não foi possível movimentar o animal.');
        } finally {
            setIsSavingPaddockMove(false);
        }
    };

    if (!animal) return null;

    const detailItems = useMemo(() => {
        if (!animal) {
            return [];
        }
        const baseItems = [
            { label: 'Raça', value: animal.raca },
            { label: 'Sexo', value: animal.sexo },
            { label: 'Idade', value: calculateAge(animal.dataNascimento) },
            {
                label: 'Peso Atual',
                value: animal.pesoAtual !== undefined && animal.pesoAtual !== null ? `${animal.pesoAtual} kg` : '—',
            },
            {
                label: 'GMD atual',
                value: animal.gmd !== undefined && animal.gmd !== null ? `${animal.gmd.toFixed(2)} kg` : '—',
            },
            {
                label: 'Nascimento',
                value: animal.dataNascimento
                    ? new Date(animal.dataNascimento).toLocaleDateString('pt-BR')
                    : '—',
            },
        ];

        if (resolvedMode !== 'PO') {
            return baseItems;
        }

        const poAnimal = animal as HerdAnimal;
        const extraItems = [
            { label: 'Nome', value: poAnimal.nome || '—' },
            { label: 'Registro', value: poAnimal.registro || '—' },
            { label: 'Categoria', value: poAnimal.categoria || '—' },
        ];

        return [...extraItems, ...baseItems];
    }, [animal, resolvedMode]);

    const currentPaddockMove = useMemo(() => {
        if (!paddockMoves.length) {
            return null;
        }
        return paddockMoves.find((move) => !move.endAt) || paddockMoves[0];
    }, [paddockMoves]);

    const gmdAtual = typeof (animal as any)?.gmd === 'number' ? (animal as any).gmd : null;
    const gmdDelta = gmdAtual !== null && nutritionPlanMeta !== null ? gmdAtual - nutritionPlanMeta : null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-light dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <header className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                        <CattleIcon />
                        <h2 id="animal-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                            Detalhes do Animal:{' '}
                            <span className="text-primary">
                                {(animal as HerdAnimal).identificacao || animal.brinco || 'Sem identificação'}
                            </span>
                        </h2>
                    </div>
                    <button onClick={onClose} aria-label="Fechar modal" className="p-2 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400">
                        <CloseIcon />
                    </button>
                </header>

                {/* Content */}
                <div className="p-6 overflow-y-auto" aria-labelledby="animal-modal-title">
                    {/* Details Grid */}
                    <section>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Informações Gerais</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg">
                            {detailItems.map(item => (
                                <div key={item.label}>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{item.label}</p>
                                    <p className="font-semibold text-gray-800 dark:text-gray-100">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                    <section className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Nutrição atual</h3>
                        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-dark-card dark:text-gray-300">
                            {isLoadingNutrition ? (
                                <span>Carregando plano...</span>
                            ) : nutritionError ? (
                                <span className="text-red-600 dark:text-red-400">{nutritionError}</span>
                            ) : nutritionPlanName ? (
                                <div className="space-y-1">
                                    <div className="font-semibold text-gray-900 dark:text-white">{nutritionPlanName}</div>
                                    {nutritionPlanPhase && (
                                        <div className="text-xs text-gray-500">Fase: {nutritionPlanPhase}</div>
                                    )}
                                    {nutritionPlanMeta !== null && (
                                        <div className="text-xs text-gray-500">Meta GMD: {nutritionPlanMeta.toFixed(2)} kg</div>
                                    )}
                                    {gmdAtual !== null && (
                                        <div className="text-xs text-gray-500">GMD atual: {gmdAtual.toFixed(2)} kg</div>
                                    )}
                                    {gmdDelta !== null && (
                                        <div className={`text-xs ${gmdDelta >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                            Delta: {gmdDelta >= 0 ? '+' : ''}{gmdDelta.toFixed(2)} kg
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span>Sem plano ativo.</span>
                            )}
                        </div>
                    </section>

                    {/* History Tabs */}
                    <section className="mt-8">
                         <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Histórico</h3>
                        <div className="border-b border-gray-200 dark:border-gray-700">
                            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                                <button
                                    onClick={() => setActiveTab('weighing')}
                                    className={`${activeTab === 'weighing' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    aria-current={activeTab === 'weighing' ? 'page' : undefined}
                                >
                                    Histórico de Pesagens
                                </button>
                                <button
                                    onClick={() => setActiveTab('paddock')}
                                    className={`${activeTab === 'paddock' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                                    aria-current={activeTab === 'paddock' ? 'page' : undefined}
                                >
                                    Histórico de Pasto
                                </button>
                                <button
                                     onClick={() => setActiveTab('activity')}
                                     className={`${activeTab === 'activity' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:text-gray-300 dark:hover:border-gray-600'} whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors`}
                                     aria-current={activeTab === 'activity' ? 'page' : undefined}
                                >
                                    Atividades Recentes
                                </button>
                            </nav>
                        </div>

                        <div className="mt-6">
                            {activeTab === 'weighing' && (
                                <>
                                    <form onSubmit={handleAddWeighing} className="mb-4 flex flex-wrap items-end gap-3">
                                        <div className="flex flex-col">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Data</label>
                                            <input
                                                type="date"
                                                value={weighingDate}
                                                onChange={(event) => setWeighingDate(event.target.value)}
                                                className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Peso (kg)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={weighingPeso}
                                                onChange={(event) => setWeighingPeso(event.target.value)}
                                                className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
                                            disabled={isSavingWeighing}
                                        >
                                            {isSavingWeighing ? 'Salvando...' : 'Salvar pesagem'}
                                        </button>
                                    </form>
                                    {weighingError && (
                                        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{weighingError}</p>
                                    )}
                                    {isLoadingWeighings ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Carregando pesagens...</p>
                                    ) : weighingHistory.length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma pesagem registrada para este animal.</p>
                                    ) : (
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3">Data</th>
                                                    <th scope="col" className="px-4 py-3">Peso</th>
                                                    <th scope="col" className="px-4 py-3">GMD</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {weighingHistory.map(item => (
                                                    <tr key={item.id} className="border-b dark:border-gray-700">
                                                        <td className="px-4 py-3">{new Date(item.data).toLocaleDateString('pt-BR')}</td>
                                                        <td className="px-4 py-3">{item.peso} kg</td>
                                                        <td className="px-4 py-3 font-medium text-green-500">{item.gmd.toFixed(2)} kg</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </>
                            )}
                            {activeTab === 'paddock' && (
                                <>
                                    <div className="mb-4 rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-dark-card dark:text-gray-300">
                                        <div className="text-xs uppercase text-gray-400">Pasto atual</div>
                                        <div className="font-semibold text-gray-900 dark:text-white">
                                            {currentPaddockMove?.paddockName || '—'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Entrada: {currentPaddockMove?.startAt ? new Date(currentPaddockMove.startAt).toLocaleDateString('pt-BR') : '—'}
                                        </div>
                                    </div>
                                    <form onSubmit={handleAddPaddockMove} className="mb-4 flex flex-wrap items-end gap-3">
                                        <div className="flex flex-col">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Pasto</label>
                                            <select
                                                value={movePaddockId}
                                                onChange={(event) => setMovePaddockId(event.target.value)}
                                                className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                                required
                                            >
                                                <option value="">Selecione</option>
                                                {paddockOptions.length === 0 && (
                                                    <option value="" disabled>Cadastre pastos na fazenda</option>
                                                )}
                                                {paddockOptions.map((paddock) => (
                                                    <option key={paddock.id} value={paddock.id}>{paddock.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Entrada</label>
                                            <input
                                                type="date"
                                                value={moveStartAt}
                                                onChange={(event) => setMoveStartAt(event.target.value)}
                                                className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                            />
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-[160px]">
                                            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Observações</label>
                                            <input
                                                type="text"
                                                value={moveNotes}
                                                onChange={(event) => setMoveNotes(event.target.value)}
                                                className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary dark:border-gray-600 dark:bg-dark-card"
                                                placeholder="Opcional"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-70"
                                            disabled={isSavingPaddockMove}
                                        >
                                            {isSavingPaddockMove ? 'Salvando...' : 'Mover'}
                                        </button>
                                    </form>
                                    {paddockMoveError && (
                                        <p className="mb-4 text-sm text-red-600 dark:text-red-400">{paddockMoveError}</p>
                                    )}
                                    {isLoadingPaddockMoves ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Carregando movimentações...</p>
                                    ) : paddockMoves.length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma movimentação de pasto registrada.</p>
                                    ) : (
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
                                                <tr>
                                                    <th scope="col" className="px-4 py-3">Pasto</th>
                                                    <th scope="col" className="px-4 py-3">Entrada</th>
                                                    <th scope="col" className="px-4 py-3">Saída</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paddockMoves.map((move) => (
                                                    <tr key={move.id} className="border-b dark:border-gray-700">
                                                        <td className="px-4 py-3">{move.paddockName || '—'}</td>
                                                        <td className="px-4 py-3">{new Date(move.startAt).toLocaleDateString('pt-BR')}</td>
                                                        <td className="px-4 py-3">{move.endAt ? new Date(move.endAt).toLocaleDateString('pt-BR') : '—'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </>
                            )}
                             {activeTab === 'activity' && (
                                <>
                                    {recentActivities.length === 0 ? (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma atividade recente para este animal.</p>
                                    ) : (
                                        <ul className="space-y-3">
                                           {recentActivities.map(item => (
                                                <li key={item.id} className="p-3 rounded-lg bg-gray-100 dark:bg-gray-900/50 flex justify-between items-center">
                                                    <div>
                                                        <p className="font-semibold text-gray-800 dark:text-gray-200">{item.tipo}</p>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">{item.descricao}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(item.data).toLocaleDateString('pt-BR')}</p>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </div>
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default AnimalDetailModal;
