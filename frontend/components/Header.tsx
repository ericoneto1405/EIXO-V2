import React, { useState, useEffect, useRef } from 'react';
import AlertTicker from './AlertTicker';

// Icons
const SearchIcon: React.FC = () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const NotificationIcon: React.FC = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a2 2 0 10-4 0v.083A6 6 0 004 11v3.159c0 .538-.214 1.055-.595 1.436L2 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>;
const ChevronDownIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => <svg className={`w-5 h-5 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>;
const FarmIcon: React.FC = () => <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>;

const SEARCH_PLACEHOLDERS = ['Buscar por brinco...', 'Buscar por ID...'];

interface Farm {
  id: string;
  name: string;
}

interface HeaderProps {
    farms: Farm[];
    selectedFarmId: string | null;
    onSelectFarm: (farmId: string | null) => void;
    currentUser?: { name: string; email: string } | null;
    onLogout?: () => void;
    canRegisterUsers?: boolean;
    onOpenUserRegister?: () => void;
}

const Header: React.FC<HeaderProps> = ({
    farms,
    selectedFarmId,
    onSelectFarm,
    currentUser,
    onLogout,
    canRegisterUsers,
    onOpenUserRegister,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hasFarms = farms.length > 0;
    const selectedFarm = farms.find((farm) => farm.id === selectedFarmId) || null;
    const currentFarmLabel = hasFarms
        ? selectedFarm?.name || 'Selecione uma fazenda'
        : 'Nenhuma fazenda cadastrada';

    const handleSelect = (farmId: string | null) => {
        onSelectFarm(farmId);
        setIsOpen(false);
    };

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (searchValue !== '') {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        }, 5000);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [searchValue]);

    return (
        <header className="bg-white dark:bg-dark-card shadow-sm dark:border-b dark:border-gray-700 p-4 flex justify-between items-center flex-shrink-0 space-x-4">
            {/* Left side: Farm Selector */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <FarmIcon />
                    <div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Fazenda Selecionada</span>
                        <div className="flex items-center">
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white">{currentFarmLabel}</h1>
                             <ChevronDownIcon isOpen={isOpen} />
                        </div>
                    </div>
                </button>
                {isOpen && (
                    <div className="absolute z-10 mt-2 w-72 bg-white dark:bg-dark-card rounded-lg shadow-xl border dark:border-gray-700">
                        <ul className="py-1">
                            {hasFarms ? (
                                <>
                                    <li>
                                        <a
                                            href="#"
                                            onClick={(e) => { e.preventDefault(); handleSelect(null); }}
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Todas as Fazendas
                                        </a>
                                    </li>
                                    {farms.map(farm => (
                                        <li key={farm.id}>
                                            <a
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handleSelect(farm.id); }}
                                                className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                                {farm.name}
                                            </a>
                                        </li>
                                    ))}
                                </>
                            ) : (
                                <li className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    Nenhuma fazenda cadastrada.
                                </li>
                            )}
                        </ul>
                    </div>
                )}
            </div>

            {/* Middle: Ticker */}
            <div className="flex-1 min-w-0">
                <AlertTicker />
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 relative">
                    <NotificationIcon />
                    <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                
                <div className="relative hidden md:block">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                       <SearchIcon />
                    </span>
                    <input
                        className="w-full pl-10 pr-4 py-2 rounded-lg border bg-light dark:bg-dark dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
                        value={searchValue}
                        onChange={(event) => setSearchValue(event.target.value)}
                    />
                </div>
                {currentUser && (
                    <div className="flex items-center space-x-3">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{currentUser.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser.email}</p>
                            {canRegisterUsers && (
                                <button
                                    type="button"
                                    onClick={onOpenUserRegister}
                                    className="mt-2 w-full rounded-lg border border-primary text-primary text-xs font-semibold py-1 hover:bg-primary/10 transition-colors"
                                >
                                    Cadastrar usuários
                                </button>
                            )}
                        </div>
                        <button
                            className="px-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
                            onClick={onLogout}
                            type="button"
                        >
                            Sair
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
