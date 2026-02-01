export enum AnimalSexo {
    MACHO = 'Macho',
    FEMEA = 'Fêmea',
}

export interface Animal {
    id: string;
    brinco: string;
    raca: string;
    sexo: AnimalSexo;
    dataNascimento: string;
    pesoAtual: number;
    gmd: number; // Ganho Médio Diário
    farmId?: string;
    lotId?: string | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface AtividadeRecente {
    id: string;
    tipo: 'Pesagem' | 'Vacinação' | 'Manejo' | 'Venda';
    descricao: string;
    data: string;
}

export interface Tarefa {
    id: string;
    titulo: string;
    responsavel: string;
    prazo: string;
    concluida: boolean;
}

export interface FluxoCaixaData {
    mes: string;
    receita: number;
    despesa: number;
}

export interface ComposicaoRebanhoData {
    name: string;
    value: number;
}

export interface Alert {
    id: string;
    message: string;
    type: 'info' | 'warning' | 'critical';
}

export interface WeighingHistory {
    id: string;
    data: string;
    peso: number;
    gmd: number;
}

export interface LotUI {
    id: string;
    name: string;
    notes?: string | null;
    farmId: string;
}

export interface AnimalUI {
    id: string;
    farmId: string;
    brinco?: string | null;
    nome?: string | null;
    identificacao: string;
    raca: string;
    sexo: string;
    dataNascimento?: string | null;
    pesoAtual: number | null;
    gmd: number | null;
    lotId?: string | null;
    registro?: string | null;
    categoria?: string | null;
}

export interface WeighingUI {
    id: string;
    data: string;
    peso: number;
    gmd: number;
}

export interface Lot {
    id: string;
    name: string;
    notes?: string | null;
    farmId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Paddock {
    id: string;
    name: string;
    size: number;
}

export interface Farm {
    id: string;
    name: string;
    city: string;
    lat?: number | null;
    lng?: number | null;
    size: number;
    notes?: string;
    paddocks: Paddock[];
    createdAt: string;
    userId?: string;
}
