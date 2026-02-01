
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    change?: string;
    changeType?: 'increase' | 'decrease';
    icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon }) => {
    const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';
    const changeIcon = changeType === 'increase' ? '↑' : '↓';

    return (
        <div className="bg-white dark:bg-dark-card rounded-xl shadow-lg p-6 flex items-center justify-between transition-transform transform hover:-translate-y-1">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                {change && (
                    <div className={`text-sm font-semibold mt-2 flex items-center ${changeColor}`}>
                        <span>{changeIcon} {change}</span>
                        <span className="ml-1 text-gray-500 dark:text-gray-400 font-normal">vs. mês passado</span>
                    </div>
                )}
            </div>
            <div className="bg-green-100 dark:bg-green-900/50 p-3 rounded-full">
                {icon}
            </div>
        </div>
    );
};

export default StatCard;
