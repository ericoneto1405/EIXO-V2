import { buildApiUrl } from '../api';

interface NutritionPlan {
    id: string;
    nome: string;
    fase?: string | null;
    startAt: string;
    endAt?: string | null;
    metaGmd?: number | null;
    observacoes?: string | null;
}

interface NutritionAssignment {
    id: string;
    planId: string;
    lotId?: string | null;
    poLotId?: string | null;
    animalId?: string | null;
    poAnimalId?: string | null;
    startAt: string;
    endAt?: string | null;
}

export interface NutritionCurrentResponse {
    assignment: NutritionAssignment | null;
    plan: NutritionPlan | null;
}

export const getCurrentNutrition = async (params: {
    farmId: string;
    animalId?: string;
    poAnimalId?: string;
    lotId?: string;
    poLotId?: string;
}): Promise<NutritionCurrentResponse> => {
    const query = new URLSearchParams();
    query.set('farmId', params.farmId);
    if (params.animalId) query.set('animalId', params.animalId);
    if (params.poAnimalId) query.set('poAnimalId', params.poAnimalId);
    if (params.lotId) query.set('lotId', params.lotId);
    if (params.poLotId) query.set('poLotId', params.poLotId);

    const response = await fetch(buildApiUrl(`/nutrition/assignments/current?${query.toString()}`), {
        credentials: 'include',
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(payload?.message || 'Erro ao buscar plano atual.');
    }
    return {
        assignment: payload.assignment || null,
        plan: payload.plan || null,
    };
};
