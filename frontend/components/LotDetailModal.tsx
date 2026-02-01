import React, { useEffect, useState } from 'react';
import { Lot } from '../types';
import { HerdType } from '../adapters/herdApi';
import { getCurrentNutrition } from '../adapters/nutritionApi';

interface LotDetailModalProps {
    lot: Lot | null;
    onClose: () => void;
    mode?: HerdType;
    herdType?: HerdType;
}

const LotDetailModal: React.FC<LotDetailModalProps> = ({ lot, onClose, mode, herdType }) => {
    const resolvedMode: HerdType = mode ?? herdType ?? 'COMMERCIAL';
    const [planName, setPlanName] = useState<string | null>(null);
    const [planPhase, setPlanPhase] = useState<string | null>(null);
    const [planMeta, setPlanMeta] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    useEffect(() => {
        if (!lot?.id || !lot.farmId) {
            return;
        }
        const loadPlan = async () => {
            setIsLoading(true);
            setLoadError(null);
            try {
                const payload = await getCurrentNutrition({
                    farmId: lot.farmId,
                    lotId: resolvedMode === 'COMMERCIAL' ? lot.id : undefined,
                    poLotId: resolvedMode === 'PO' ? lot.id : undefined,
                });
                setPlanName(payload.plan?.nome || null);
                setPlanPhase(payload.plan?.fase || null);
                setPlanMeta(payload.plan?.metaGmd ?? null);
            } catch (error: any) {
                console.error(error);
                setLoadError(error?.message || 'Erro ao carregar nutrição.');
                setPlanName(null);
                setPlanPhase(null);
                setPlanMeta(null);
            } finally {
                setIsLoading(false);
            }
        };
        loadPlan();
    }, [lot, resolvedMode]);

    if (!lot) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg rounded-2xl bg-light dark:bg-dark-card shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <header className="flex items-center justify-between border-b border-gray-200 p-5 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detalhe do lote</h3>
                    <button
                        type="button"
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-200 dark:text-gray-400 dark:hover:bg-gray-700"
                        onClick={onClose}
                        aria-label="Fechar modal"
                    >
                        ✕
                    </button>
                </header>
                <div className="space-y-4 p-6">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Lote</p>
                        <p className="text-base font-semibold text-gray-900 dark:text-white">{lot.name}</p>
                    </div>
                    {lot.notes && (
                        <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Observações</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{lot.notes}</p>
                        </div>
                    )}
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nutrição atual</p>
                        <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 dark:border-gray-700 dark:bg-dark-card dark:text-gray-300">
                            {isLoading ? (
                                <span>Carregando plano...</span>
                            ) : loadError ? (
                                <span className="text-red-600 dark:text-red-400">{loadError}</span>
                            ) : planName ? (
                                <div className="space-y-1">
                                    <div className="font-semibold text-gray-900 dark:text-white">{planName}</div>
                                    {planPhase && (
                                        <div className="text-xs text-gray-500">Fase: {planPhase}</div>
                                    )}
                                    {planMeta !== null && (
                                        <div className="text-xs text-gray-500">Meta GMD: {planMeta.toFixed(2)} kg</div>
                                    )}
                                </div>
                            ) : (
                                <span>Sem plano ativo.</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LotDetailModal;
