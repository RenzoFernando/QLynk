import { useEffect, useRef, useState } from 'react';
import type { HistoryItem } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import GenerateTab from './components/GenerateTab';
import ScanTab from './components/ScanTab';
import HistoryTab from './components/HistoryTab';
import SettingsTab from './components/SettingsTab';

type ThemeOption = "light" | "dark" | "light-contrast" | "dark-contrast";

const themeOptions: ThemeOption[] = ["light", "dark", "light-contrast", "dark-contrast"];

function normalizeTheme(value: string | null): ThemeOption {
    if (value === "contrast") return "dark-contrast";
    return themeOptions.includes(value as ThemeOption) ? value as ThemeOption : "light";
}

function getInitialHistory() {
    const saved = localStorage.getItem("qr_history");
    if (!saved) return [];

    try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed as HistoryItem[] : [];
    } catch {
        return [];
    }
}

function getInitialTheme() {
    return normalizeTheme(localStorage.getItem("qr_theme"));
}

function getInitialPrivateMode() {
    return localStorage.getItem("qr_private_mode") === "1";
}

export default function App() {
    const [tab, setTab] = useState("generate");
    const [theme, setTheme] = useState<ThemeOption>(getInitialTheme);
    const [privateMode, setPrivateMode] = useState(getInitialPrivateMode);
    const [history, setHistory] = useState<HistoryItem[]>(getInitialHistory);
    const [toast, setToast] = useState("");
    const toastTimerRef = useRef<number | null>(null);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem("qr_theme", theme);
    }, [theme]);

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                window.clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    function saveHistory(newHistory: HistoryItem[]) {
        setHistory(newHistory);
        localStorage.setItem("qr_history", JSON.stringify(newHistory));
    }

    function addToHistory(item: HistoryItem) {
        if (privateMode) {
            showToast("Modo privado activo: no se guardó en la biblioteca.");
            return;
        }

        setHistory((prev) => {
            const newHistory = [item, ...prev];
            localStorage.setItem("qr_history", JSON.stringify(newHistory));
            return newHistory;
        });

        showToast("Guardado en la biblioteca.");
    }

    function showToast(msg: string) {
        setToast(msg);
        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }
        toastTimerRef.current = window.setTimeout(() => setToast(""), 3500);
    }

    return (
        <div className="app-wrapper">
            {toast && <div className="toast">{toast}</div>}

            <div className="app-shell">
                <Header tab={tab} setTab={setTab} />

                <main className="main-content">
                    {tab === "generate" && <GenerateTab addToHistory={addToHistory} />}
                    {tab === "scan" && <ScanTab addToHistory={addToHistory} />}

                    {tab === "history" && (
                        <HistoryTab
                            history={history}
                            saveHistory={saveHistory}
                            notify={showToast}
                            privateMode={privateMode}
                        />
                    )}

                    {tab === "settings" && (
                        <SettingsTab
                            theme={theme}
                            setTheme={(t) => {
                                setTheme(normalizeTheme(t));
                            }}
                            privateMode={privateMode}
                            setPrivateMode={(v) => {
                                setPrivateMode(v);
                                localStorage.setItem("qr_private_mode", v ? "1" : "0");
                                showToast(v ? "Modo privado activado." : "Modo privado desactivado.");
                            }}
                        />
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
}
