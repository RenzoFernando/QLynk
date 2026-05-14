import { Moon, Shield, SlidersHorizontal, Sun, TriangleAlert } from 'lucide-react';
import Card from './ui/Card';
import SwitchField from './ui/SwitchField';
import Badge from './ui/Badge';

interface SettingsTabProps {
    theme: string;
    setTheme: (t: string) => void;
    privateMode: boolean;
    setPrivateMode: (v: boolean) => void;
}

const themes = [
    {
        value: "light",
        label: "Claro",
        description: "Blanco frío con acento azul",
        className: "light-preview",
        icon: <Sun size={18} aria-hidden="true" />
    },
    {
        value: "dark",
        label: "Oscuro",
        description: "Negro sobrio con acento naranja",
        className: "dark-preview",
        icon: <Moon size={18} aria-hidden="true" />
    },
    {
        value: "light-contrast",
        label: "Contraste claro",
        description: "Blanco alto contraste",
        className: "light-contrast-preview",
        icon: <TriangleAlert size={18} aria-hidden="true" />
    },
    {
        value: "dark-contrast",
        label: "Contraste oscuro",
        description: "Negro alto contraste",
        className: "dark-contrast-preview",
        icon: <TriangleAlert size={18} aria-hidden="true" />
    }
];

export default function SettingsTab({ theme, setTheme, privateMode, setPrivateMode }: SettingsTabProps) {
    return (
        <div className="settings-grid">
            <Card
                eyebrow="Configuración"
                title="Preferencias visuales"
                description="Elige el tema principal de QLynk desde una sola zona de control."
                icon={<SlidersHorizontal size={18} aria-hidden="true" />}
            >
                <div className="settings-panel">
                    <div className="theme-preview-grid">
                        {themes.map((item) => (
                            <button
                                key={item.value}
                                type="button"
                                className={`theme-preview ${item.className} ${theme === item.value ? "active" : ""}`}
                                onClick={() => setTheme(item.value)}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                                <small>{item.description}</small>
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            <Card
                eyebrow="Privacidad"
                title="Control local"
                description="QLynk conserva el historial en el navegador hasta que decidas exportarlo o limpiarlo."
                icon={<Shield size={18} aria-hidden="true" />}
            >
                <div className="settings-panel">
                    <SwitchField
                        label="Modo privado"
                        description="Evita guardar nuevos códigos generados o escaneados en la biblioteca local."
                        checked={privateMode}
                        onChange={setPrivateMode}
                    />

                    <div className="privacy-note">
                        <Badge tone={privateMode ? "warning" : "success"}>{privateMode ? "No guarda historial" : "Biblioteca activa"}</Badge>
                        <p>Firebase no está conectado en esta fase. La sincronización y los links vivos quedan para una etapa posterior.</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}