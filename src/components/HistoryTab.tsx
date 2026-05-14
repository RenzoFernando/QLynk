import { Archive, Clock, Copy, ExternalLink, FileDown, Trash, Upload } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { HistoryItem } from '../types';
import { classifyResult, copy } from '../utils';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';

interface HistoryTabProps {
    history: HistoryItem[];
    saveHistory: (h: HistoryItem[]) => void;
    notify: (msg: string) => void;
    privateMode: boolean;
}

export default function HistoryTab({ history, saveHistory, notify, privateMode }: HistoryTabProps) {
    function clearHistory() {
        if (window.confirm("¿Seguro que deseas borrar todo el historial?")) {
            saveHistory([]);
            notify("Biblioteca limpiada.");
        }
    }

    function exportHistoryJSON() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history, null, 2));
        const link = document.createElement("a");
        link.href = dataStr;
        link.download = "qlynk-library.json";
        link.click();
        notify("Biblioteca exportada: qlynk-library.json");
    }

    function importHistoryJSON(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target?.result as string);
                if (Array.isArray(imported)) {
                    saveHistory(imported);
                    notify("Biblioteca importada con éxito.");
                } else {
                    notify("El JSON no tiene el formato esperado.");
                }
            } catch (err) {
                notify("Archivo JSON no válido.");
            }
        };

        reader.readAsText(file);
        e.target.value = '';
    }

    function deleteHistoryItem(id: string) {
        if (window.confirm("¿Eliminar este recurso de la biblioteca?")) {
            saveHistory(history.filter((item) => item.id !== id));
            notify("Recurso eliminado.");
        }
    }

    function openHistoryItem(value: string) {
        const raw = value.trim();
        const lower = raw.toLowerCase();

        if (lower.startsWith("http://") || lower.startsWith("https://")) {
            window.open(raw, "_blank", "noopener,noreferrer");
            notify("Recurso abierto en una pestaña nueva.");
            return;
        }

        if (lower.startsWith("geo:")) {
            const coords = raw.slice(4).split("?")[0];
            window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`, "_blank", "noopener,noreferrer");
            notify("Ubicación abierta en el mapa.");
            return;
        }

        if (lower.startsWith("mailto:") || lower.startsWith("tel:") || lower.startsWith("sms:") || lower.startsWith("smsto:")) {
            window.location.href = raw;
            notify("Recurso enviado al sistema.");
            return;
        }

        copy(raw);
        notify("Este recurso no se puede abrir directamente. Se copió el contenido.");
    }

    return (
        <Card
            eyebrow="Biblioteca"
            title="Recursos guardados"
            description="Consulta, exporta o reutiliza los códigos generados y escaneados localmente."
            icon={<Archive size={18} aria-hidden="true" />}
            actions={
                <div className="btns">
                    <Button variant="secondary" icon={<FileDown size={17} aria-hidden="true" />} onClick={exportHistoryJSON} disabled={history.length === 0}>Exportar</Button>

                    <label className="btn btn-secondary btn-medium cursor-pointer">
                        <Upload size={17} aria-hidden="true" />
                        <span>Importar</span>
                        <input type="file" accept=".json" style={{ display: 'none' }} onChange={importHistoryJSON} />
                    </label>

                    <Button variant="danger" icon={<Trash size={17} aria-hidden="true" />} onClick={clearHistory} disabled={history.length === 0}>Limpiar</Button>
                </div>
            }
        >
            {privateMode && (
                <div className="alert-banner info">
                    Modo privado activo: los nuevos QRs no se guardan en la biblioteca.
                </div>
            )}

            {history.length >= 15 && (
                <div className="alert-banner warning">
                    Tienes {history.length} códigos guardados. Exporta tu biblioteca para no perderla si limpias el navegador.
                </div>
            )}

            {history.length === 0 ? (
                <EmptyState
                    icon={<Archive size={42} aria-hidden="true" />}
                    title="Biblioteca vacía"
                    description="Cuando guardes o escanees códigos, aparecerán aquí con sus acciones rápidas."
                />
            ) : (
                <div className="library-grid">
                    {history.map((h) => {
                        const info = classifyResult(h.value);
                        return (
                            <article className="library-item" key={h.id}>
                                <div className="library-top">
                                    <div className="library-badges">
                                        <Badge tone={h.kind === "generated" ? "accent" : "success"}>{h.kind === "generated" ? "Generado" : "Escaneado"}</Badge>
                                        <Badge>{info.type}</Badge>
                                    </div>
                                    <span className="library-date">
                                        <Clock size={14} aria-hidden="true" />
                                        {new Date(h.createdAt).toLocaleString()}
                                    </span>
                                </div>

                                <div className="library-value mono">
                                    {h.value.slice(0, 180)}{h.value.length > 180 ? "…" : ""}
                                </div>

                                <div className="btns">
                                    <Button variant="ghost" size="small" icon={<Copy size={15} aria-hidden="true" />} onClick={() => {
                                        copy(h.value);
                                        notify("Contenido copiado.");
                                    }}>Copiar</Button>
                                    {info.action === "open" && (
                                        <Button variant="ghost" size="small" icon={<ExternalLink size={15} aria-hidden="true" />} onClick={() => openHistoryItem(h.value)}>Abrir</Button>
                                    )}
                                    <Button variant="danger" size="small" icon={<Trash size={15} aria-hidden="true" />} onClick={() => deleteHistoryItem(h.id)}>Eliminar</Button>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </Card>
    );
}