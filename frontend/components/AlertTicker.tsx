import React from 'react';
import Marquee from 'react-fast-marquee';
import { Alert } from '../types';

const AlertIcon: React.FC<{ type: Alert['type'] }> = ({ type }) => {
    switch (type) {
        case 'critical':
            return <span className="mr-2 text-red-500">🔴</span>;
        case 'warning':
            return <span className="mr-2 text-yellow-500">🟡</span>;
        case 'info':
        default:
            return <span className="mr-2 text-blue-500">🔵</span>;
    }
};

const AlertTicker: React.FC = () => {
    const alerts: Alert[] = [];

    if (alerts.length === 0) {
        return (
            <div className="hidden lg:flex items-center w-full bg-gray-100 dark:bg-dark rounded-lg p-2 overflow-hidden">
                <p className="text-sm text-gray-600 dark:text-gray-400 px-2">Nenhum alerta no momento.</p>
            </div>
        );
    }

    return (
        <div className="hidden lg:flex items-center w-full bg-gray-100 dark:bg-dark rounded-lg p-2 overflow-hidden">
            <Marquee
                gradient={true}
                gradientWidth={20}
                speed={40}
                pauseOnHover={true}
                className="text-sm text-gray-700 dark:text-gray-300"
            >
                {alerts.map(alert => (
                    <div key={alert.id} className="flex items-center mx-8 whitespace-nowrap">
                        <AlertIcon type={alert.type} />
                        <span className="uppercase">{alert.message}</span>
                    </div>
                ))}
            </Marquee>
        </div>
    );
};

export default AlertTicker;
