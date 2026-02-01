import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
    activeItem: string;
    setActiveItem: (item: string) => void;
    allowedModules?: string[];
}

interface NavSubItem {
    label: string;
    path: string;
}

interface NavItem {
    label: string;
    icon: React.ReactNode;
    badge?: string;
    subItems?: NavSubItem[];
}

interface NavSection {
    title: string;
    items: NavItem[];
}

const HomeIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 3h7v7H3V3zm11 0h7v7h-7V3zM3 14h7v7H3v-7zm11 0h7v7h-7v-7z"
        />
    </svg>
);

const FarmIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 21c4-4 7-7.5 7-11a7 7 0 10-14 0c0 3.5 3 7 7 11z"
        />
        <circle cx="12" cy="10" r="2.5" />
    </svg>
);

const HerdCommercialIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 7a2 2 0 012-2h5.586a2 2 0 011.414.586l5.414 5.414a2 2 0 010 2.828l-4.172 4.172a2 2 0 01-2.828 0L7 11.414A2 2 0 016.414 10L7 7z"
        />
        <circle cx="11" cy="9" r="1.5" />
    </svg>
);

const HerdGeneticIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3h6" />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 3v4.5l-3.5 9A3.5 3.5 0 009.8 21h4.4a3.5 3.5 0 003.3-4.5l-3.5-9V3"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 14h7" />
    </svg>
);

const HerdPoIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
        <circle cx="8" cy="7" r="1.5" />
        <circle cx="12" cy="12" r="1.5" />
        <circle cx="16" cy="17" r="1.5" />
    </svg>
);

const SuppliersIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h11v8H3V7z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.5l2.5 3v2H14v-5z" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
    </svg>
);

const MedicineIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 7l8 8a4 4 0 01-5.657 5.657l-8-8A4 4 0 019 7z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 11l-4 4" />
    </svg>
);

const GrainIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3h10l-1 3H8L7 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6h12l2 14H4L6 6z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 11h6" />
    </svg>
);

const SupplementIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3l8 4v10l-8 4-8-4V7l8-4z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v18" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7l8 4 8-4" />
    </svg>
);

const MoneyDownIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v8" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 11.5l3.5 3.5 3.5-3.5" />
    </svg>
);

const MoneyUpIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 17V9" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 12.5l3.5-3.5 3.5 3.5" />
    </svg>
);

const ChartIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h10" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 3l4 4-4 4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17H7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 21l-4-4 4-4" />
    </svg>
);

const ReportIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4h7l4 4v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 4v4h4" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 9h2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17h6" />
    </svg>
);

const OperationsIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
);

const SettingsIcon: React.FC = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
        <circle cx="8" cy="6" r="2" />
        <circle cx="16" cy="12" r="2" />
        <circle cx="10" cy="18" r="2" />
    </svg>
);

const geneticsSubItems: NavSubItem[] = [
    { label: 'Reprodução', path: '/genetics/reproducao' },
    { label: 'Seleção', path: '/genetics/selecao' },
    { label: 'Relatórios', path: '/genetics/relatorios' },
];

const navSections: NavSection[] = [
    {
        title: 'Principal',
        items: [
            { label: 'Visão Geral', icon: <HomeIcon /> },
            { label: 'Fazendas', icon: <FarmIcon /> },
            { label: 'Rebanho Comercial', icon: <HerdCommercialIcon /> },
            { label: 'Rebanho P.O.', icon: <HerdPoIcon /> },
            { label: 'Rebanho Genética', icon: <HerdGeneticIcon />, subItems: geneticsSubItems },
        ],
    },
    {
        title: 'Cadastros',
        items: [
            { label: 'Fornecedores', icon: <SuppliersIcon /> },
            { label: 'Remédios', icon: <MedicineIcon /> },
            { label: 'Rações', icon: <GrainIcon /> },
            { label: 'Suplementos', icon: <SupplementIcon /> },
        ],
    },
    {
        title: 'Financeiro',
        items: [
            { label: 'Contas a Pagar', icon: <MoneyDownIcon /> },
            { label: 'Contas a Receber', icon: <MoneyUpIcon /> },
            { label: 'Fluxo de Caixa', icon: <ChartIcon /> },
            { label: 'DRE', icon: <ReportIcon /> },
        ],
    },
    {
        title: 'Operação',
        items: [
            { label: 'Operações', icon: <OperationsIcon /> },
            { label: 'Configurações', icon: <SettingsIcon /> },
        ],
    },
];

const LogoIcon: React.FC = () => (
    <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
        E
    </div>
);

const CollapseIcon: React.FC<{ collapsed: boolean }> = ({ collapsed }) => (
    <svg
        className={`w-5 h-5 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronIndicator: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
    <span className="text-xs text-current">{isOpen ? '▾' : '▸'}</span>
);

interface SidebarButtonProps {
    label: string;
    icon?: React.ReactNode;
    isActive: boolean;
    isCollapsed: boolean;
    onClick: () => void;
    badge?: string;
    suffix?: React.ReactNode;
    isSubItem?: boolean;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
    label,
    icon,
    isActive,
    isCollapsed,
    onClick,
    badge,
    suffix,
    isSubItem,
}) => {
    const baseClasses = `w-full flex items-center ${
        isCollapsed ? 'justify-center' : 'justify-start'
    } ${isSubItem ? 'py-1.5' : 'py-2'} ${isSubItem ? (isCollapsed ? 'px-3' : 'pl-11 pr-3') : 'px-3'} ${
        isSubItem ? 'text-[13px]' : 'text-sm'
    } font-medium transition-colors rounded-xl ${
        isActive
            ? 'bg-primary/10 text-primary dark:text-primary border border-primary/30'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
    }`;

    return (
        <button
            type="button"
            onClick={onClick}
            className={baseClasses}
        >
            {!isCollapsed && icon ? (
                <span className="flex items-center justify-center mr-3 text-current">{icon}</span>
            ) : null}
            {!isCollapsed && !icon && isSubItem ? (
                <span className="mr-3 h-1.5 w-1.5 rounded-full bg-current" />
            ) : null}
            {!isCollapsed && (
                <>
                    <span className="flex-1 text-left">{label}</span>
                    {badge && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {badge}
                        </span>
                    )}
                    {suffix && <span className="ml-2">{suffix}</span>}
                </>
            )}
            {isCollapsed && icon ? (
                <span className="flex items-center justify-center text-current">{icon}</span>
            ) : null}
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activeItem, setActiveItem, allowedModules }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [isAssistantVisible, setIsAssistantVisible] = React.useState(true);
    const [isAssistantMinimized, setIsAssistantMinimized] = React.useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isGeneticsRoute = location.pathname.startsWith('/genetics');
    const [isGeneticsOpen, setIsGeneticsOpen] = React.useState(false);

    const handleSelect = (label: string) => {
        setActiveItem(label);
        if (isGeneticsRoute) {
            navigate('/');
        }
    };

    const isModuleAllowed = (label: string) => {
        if (!allowedModules || allowedModules.length === 0) {
            return true;
        }
        return allowedModules.includes(label);
    };

    React.useEffect(() => {
        if (isGeneticsRoute) {
            setIsGeneticsOpen(true);
        }
    }, [isGeneticsRoute]);

    const isGeneticsExpanded = isGeneticsRoute || isGeneticsOpen;

    const handleToggleGenetics = () => {
        if (isGeneticsRoute) {
            return;
        }
        setIsGeneticsOpen((prev) => !prev);
    };

    return (
        <aside
            className={`hidden lg:flex flex-col bg-white dark:bg-dark-card border-r border-gray-100 dark:border-gray-800 transition-all duration-200 ${
                isCollapsed ? 'w-20' : 'w-72'
            }`}
        >
            <div className="flex items-center justify-between px-5 py-6">
                <div className="flex items-center space-x-3">
                    <LogoIcon />
                    {!isCollapsed && (
                        <div>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">Eixo</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                Gestão Pecuária
                            </p>
                        </div>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => setIsCollapsed((prev) => !prev)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
                >
                    <CollapseIcon collapsed={isCollapsed} />
                </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 pb-6 space-y-6">
                {navSections.map((section) => (
                    <div key={section.title}>
                        {!isCollapsed && (
                            <p className="px-2 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500 mb-2">
                                {section.title}
                            </p>
                        )}
                        <ul className="space-y-1">
                            {section.items.map((item) => {
                                if (!isModuleAllowed(item.label)) {
                                    return null;
                                }
                                const isDropdown = Boolean(item.subItems?.length);
                                if (!isDropdown) {
                                    const isActive = !isGeneticsRoute && activeItem === item.label;
                                    return (
                                        <li key={item.label}>
                                            <SidebarButton
                                                label={item.label}
                                                icon={item.icon}
                                                isActive={isActive}
                                                isCollapsed={isCollapsed}
                                                onClick={() => handleSelect(item.label)}
                                                badge={item.badge}
                                            />
                                        </li>
                                    );
                                }

                                const isParentActive = isGeneticsRoute;
                                return (
                                    <li key={item.label}>
                                        <SidebarButton
                                            label={item.label}
                                            icon={item.icon}
                                            isActive={isParentActive}
                                            isCollapsed={isCollapsed}
                                            onClick={handleToggleGenetics}
                                            suffix={<ChevronIndicator isOpen={isGeneticsExpanded} />}
                                        />
                                        {!isCollapsed && isGeneticsExpanded && (
                                            <ul className="mt-1 space-y-1">
                                                {item.subItems?.map((subItem) => {
                                                    const isSubActive =
                                                        location.pathname === subItem.path ||
                                                        location.pathname.startsWith(`${subItem.path}/`);
                                                    return (
                                                        <li key={subItem.label}>
                                                            <SidebarButton
                                                                label={subItem.label}
                                                                isActive={isSubActive}
                                                                isCollapsed={isCollapsed}
                                                                isSubItem
                                                                onClick={() => {
                                                                    navigate(subItem.path);
                                                                    setIsGeneticsOpen(true);
                                                                }}
                                                            />
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ))}
            </nav>

            {!isCollapsed && isAssistantVisible && (
                <div className="px-5 pb-6">
                    <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-semibold">Assistente Virtual</p>
                                {!isAssistantMinimized && (
                                    <p className="text-xs text-white/80 mt-1">
                                        Tire dúvidas sobre o rebanho, finanças ou cadastros com o Eixo Copiloto.
                                    </p>
                                )}
                            </div>
                            <div className="flex space-x-1">
                                <button
                                    type="button"
                                    className="h-6 w-6 flex items-center justify-center rounded-md bg-white/20 text-xs font-bold hover:bg-white/30 transition-colors"
                                    onClick={() => setIsAssistantMinimized((prev) => !prev)}
                                    aria-label={isAssistantMinimized ? 'Expandir assistente' : 'Minimizar assistente'}
                                >
                                    _
                                </button>
                                <button
                                    type="button"
                                    className="h-6 w-6 flex items-center justify-center rounded-md bg-white/20 text-xs font-bold hover:bg-white/30 transition-colors"
                                    onClick={() => setIsAssistantVisible(false)}
                                    aria-label="Fechar assistente"
                                >
                                    x
                                </button>
                            </div>
                        </div>
                        {!isAssistantMinimized && (
                            <button className="mt-4 w-full py-2 rounded-xl bg-white/15 text-sm font-semibold hover:bg-white/25 transition-colors">
                                Abrir chat
                            </button>
                        )}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default Sidebar;
