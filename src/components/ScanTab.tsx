import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Copy, ExternalLink, ImageUp, ScanLine, StopCircle } from 'lucide-react';
import { Html5Qrcode } from 'html5-qrcode';
import type { HistoryItem } from '../types';
import { classifyResult, nowISO, copy, openExternalUrl } from '../utils';
import FileDropZone from './FileDropZone';
import Button from './ui/Button';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';

interface ScanTabProps {
    addToHistory: (item: HistoryItem) => void;
}

export default function ScanTab({ addToHistory }: ScanTabProps) {
    const [scanStatus, setScanStatus] = useState("stopped");
    const [scanError, setScanError] = useState("");
    const [scanResult, setScanResult] = useState("");
    const scannerRef = useRef<Html5Qrcode | null>(null);
    const scanRegionId = "reader";
    const fileScanRegionId = "file-reader";

    const stopScan = useCallback(async () => {
        try {
            const inst = scannerRef.current;
            if (!inst) {
                setScanStatus("stopped");
                return;
            }
            if (inst.isScanning) {
                await inst.stop().catch(() => undefined);
            }
            inst.clear();
        } catch {
            scannerRef.current = null;
        } finally {
            scannerRef.current = null;
            setScanStatus("stopped");
        }
    }, []);

    async function startScan() {
        setScanError("");
        setScanResult("");

        try {
            const inst = new Html5Qrcode(scanRegionId);
            scannerRef.current = inst;
            setScanStatus("running");

            await inst.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: { width: 250, height: 250 } },
                async (decodedText) => {
                    setScanResult(decodedText);
                    addToHistory({
                        id: window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(),
                        kind: "scanned",
                        createdAt: nowISO(),
                        meta: { from: "camera" },
                        value: decodedText,
                    });
                    await stopScan();
                },
                () => undefined
            );
        } catch {
            setScanStatus("error");
            setScanError("Error de cámara. Revisa permisos o usa HTTPS.");
            await stopScan();
        }
    }

    useEffect(() => {
        return () => {
            void stopScan();
        };
    }, [stopScan]);

    async function scanFromImage(file: File) {
        setScanError("");
        setScanResult("");
        const inst = new Html5Qrcode(fileScanRegionId);

        try {
            const decodedText = await inst.scanFile(file, true);
            setScanResult(decodedText);
            addToHistory({
                id: window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(),
                kind: "scanned",
                createdAt: nowISO(),
                meta: { from: "image" },
                value: decodedText,
            });
        } catch {
            setScanError("No se pudo leer el QR en la imagen. Intenta con una foto más nítida.");
        } finally {
            inst.clear();
        }
    }

    const scanInfo = useMemo(() => classifyResult(scanResult), [scanResult]);

    return (
        <div className="dashboard-grid scan-grid">
            <div className="content-stack">
                <Card
                    eyebrow="Escanear"
                    title="Lectura con cámara"
                    description="Usa la cámara del dispositivo para detectar un QR y guardar el resultado en la biblioteca."
                    icon={<Camera size={18} aria-hidden="true" />}
                >
                    <div id={scanRegionId} className={`scanner-view ${scanStatus === "running" ? "running" : ""}`} />
                    <div id={fileScanRegionId} style={{ display: 'none' }} />

                    <div className="btns scan-actions">
                        <Button variant="primary" icon={<ScanLine size={17} aria-hidden="true" />} onClick={() => void startScan()} disabled={scanStatus === "running"}>Iniciar cámara</Button>
                        <Button variant="secondary" icon={<StopCircle size={17} aria-hidden="true" />} onClick={() => void stopScan()} disabled={scanStatus !== "running"}>Detener</Button>
                    </div>

                    {scanError && <div className="field-error floating-error">{scanError}</div>}
                </Card>

                <Card
                    eyebrow="Imagen"
                    title="Leer desde archivo"
                    description="Arrastra una imagen o selecciónala desde tu equipo para intentar leer el código."
                    icon={<ImageUp size={18} aria-hidden="true" />}
                >
                    <FileDropZone
                        accept="image/*"
                        label="Arrastra y suelta una imagen aquí"
                        helperText="Formatos: JPG, PNG, WEBP. Tip: buena luz, sin blur."
                        buttonText="Seleccionar imagen"
                        onFile={(file) => void scanFromImage(file)}
                    />
                </Card>
            </div>

            <aside className="preview-column">
                <Card
                    eyebrow="Resultado"
                    title="Lectura actual"
                    description="El resultado se clasifica automáticamente para sugerir la acción correcta."
                    icon={<ScanLine size={18} aria-hidden="true" />}
                    sticky
                >
                    <div className="result-panel">
                        {scanResult ? (
                            <>
                                <div className="result-top">
                                    <Badge tone="accent">{scanInfo.type}</Badge>
                                    <span className="mono text-small">{new Date().toLocaleString()}</span>
                                </div>

                                <div className="result-value mono">
                                    {scanResult}
                                </div>

                                <div className="action-grid">
                                    {scanInfo.action === "open" ? (
                                        <Button variant="primary" icon={<ExternalLink size={17} aria-hidden="true" />} onClick={() => openExternalUrl(scanResult)}>Abrir acción</Button>
                                    ) : (
                                        <Button variant="primary" icon={<Copy size={17} aria-hidden="true" />} onClick={() => copy(scanResult)}>Copiar texto</Button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <EmptyState
                                icon={<ScanLine size={40} aria-hidden="true" />}
                                title="Esperando lectura"
                                description="Inicia la cámara o carga una imagen para ver aquí el contenido detectado."
                            />
                        )}
                    </div>
                </Card>
            </aside>
        </div>
    );
}
