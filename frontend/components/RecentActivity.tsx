
import React from 'react';
import { AtividadeRecente } from '../types';
import ChartCard from './ChartCard';

const ActivityIcon: React.FC<{ type: AtividadeRecente['tipo'] }> = ({ type }) => {
    const iconStyles = "w-10 h-10 rounded-lg flex items-center justify-center text-white";
    switch (type) {
        case 'Venda': return <div className={`${iconStyles} bg-blue-500`}>$</div>;
        case 'Pesagem': return <div className={`${iconStyles} bg-green-500`}>⚖️</div>;
        case 'Vacinação': return <div className={`${iconStyles} bg-yellow-500`}>💉</div>;
        case 'Manejo': return <div className={`${iconStyles} bg-purple-500`}>🐄</div>;
        default: return null;
    }
};

const RecentActivity: React.FC = () => {
    const activities: AtividadeRecente[] = [];

    return (
        <ChartCard title="Atividades Recentes">
            {activities.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">Nenhuma atividade registrada.</p>
            ) : (
                <div className="space-y-4">
                    {activities.map(activity => (
                        <div key={activity.id} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50">
                            <ActivityIcon type={activity.tipo} />
                            <div className="flex-1">
                                <p className="font-semibold text-gray-800 dark:text-gray-100">{activity.tipo}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{activity.descricao}</p>
                            </div>
                            <p className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">{activity.data}</p>
                        </div>
                    ))}
                </div>
            )}
        </ChartCard>
    );
};

export default RecentActivity;
