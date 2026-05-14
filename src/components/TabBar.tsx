import { Library, QrCode, ScanLine, Settings } from 'lucide-react';

interface TabBarProps {
    tab: string;
    setTab: (tab: string) => void;
}

const tabs = [
    {
        id: "generate",
        label: "Crear",
        icon: QrCode
    },
    {
        id: "scan",
        label: "Escanear",
        icon: ScanLine
    },
    {
        id: "history",
        label: "Biblioteca",
        icon: Library
    },
    {
        id: "settings",
        label: "Configuración",
        icon: Settings
    }
] as const;

export default function TabBar({ tab, setTab }: TabBarProps) {
    return (
        <nav className="tabs" role="tablist" aria-label="Navegación">
            {tabs.map((t) => {
                const Icon = t.icon;

                return (
                    <button
                        key={t.id}
                        type="button"
                        role="tab"
                        aria-selected={tab === t.id}
                        className={`tab ${tab === t.id ? "active" : ""}`}
                        onClick={() => setTab(t.id)}
                    >
                        <span className="tab-icon"><Icon size={18} aria-hidden="true" /></span>
                        <span className="tab-label">{t.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
