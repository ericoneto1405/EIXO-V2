import React from 'react';
import FarmRegistrationForm from './FarmRegistrationForm';

interface RegistrationsProps {
    onFarmCreated?: () => void;
}

const Registrations: React.FC<RegistrationsProps> = ({ onFarmCreated }) => {
    return (
        <div>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Adicione e gerencie os dados de suas fazendas.</p>
            <FarmRegistrationForm onFarmCreated={onFarmCreated} />
        </div>
    );
};

export default Registrations;
