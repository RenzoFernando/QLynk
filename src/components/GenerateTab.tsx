import { useEffect, useMemo, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeftRight, Clipboard, Download, FileCode, Image as ImageIcon, Link2, Maximize2, Paintbrush, RotateCcw, Save, Shapes, X } from 'lucide-react';
import type { HistoryItem } from '../types';
import { nowISO, copy } from '../utils';
import Button from './ui/Button';
import Card from './ui/Card';
import Field from './ui/Field';
import SelectField from './ui/SelectField';
import TextInput from './ui/TextInput';
import TextArea from './ui/TextArea';
import SliderField from './ui/SliderField';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import SectionHeader from './ui/SectionHeader';

interface GenerateTabProps {
    addToHistory: (item: HistoryItem) => void;
}

const modeOptions = [
    { value: "url", label: "Enlace" },
    { value: "text", label: "Texto libre" },
    { value: "wifi", label: "Wi-Fi" },
    { value: "vcard", label: "Contacto vCard" },
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS / WhatsApp" },
    { value: "location", label: "Ubicación" }
];

const encryptionOptions = [
    { value: "WPA", label: "WPA / WPA2" },
    { value: "WEP", label: "WEP" },
    { value: "nopass", label: "Sin clave" }
];

const channelOptions = [
    { value: "sms", label: "SMS" },
    { value: "whatsapp", label: "WhatsApp" }
];

const eccLevels = ["L", "M", "Q", "H"] as const;

const colorPresets = [
    { name: "Clásico", fg: "#000000", bg: "#ffffff" },
    { name: "Grafito", fg: "#111827", bg: "#f8fafc" },
    { name: "Marino", fg: "#0f172a", bg: "#f1f5f9" },
    { name: "Azul", fg: "#1d4ed8", bg: "#eff6ff" },
    { name: "Verde", fg: "#14532d", bg: "#ecfdf5" },
    { name: "Vino", fg: "#7f1d1d", bg: "#fff1f2" },
    { name: "Morado", fg: "#581c87", bg: "#faf5ff" },
    { name: "Naranja", fg: "#111827", bg: "#ffedd5" },
    { name: "Café", fg: "#3f2a18", bg: "#f7efe4" }
];

const defaultDesign = {
    size: 320,
    margin: 2,
    errorStrength: 35,
    fg: "#000000",
    bg: "#ffffff"
};

function getErrorLabel(value: number) {
    if (value >= 90) return "Extrema";
    if (value >= 70) return "Máxima";
    if (value >= 45) return "Alta";
    if (value >= 20) return "Media";
    return "Baja";
}

function getErrorLevel(value: number): typeof eccLevels[number] {
    if (value >= 70) return "H";
    if (value >= 45) return "Q";
    if (value >= 20) return "M";
    return "L";
}

function getQrVersion(value: number) {
    if (value >= 95) return 24;
    if (value >= 85) return 18;
    if (value >= 70) return 12;
    if (value >= 45) return 8;
    if (value >= 20) return 4;
    return 1;
}

export default function GenerateTab({ addToHistory }: GenerateTabProps) {
    const [mode, setMode] = useState("url");
    const [fields, setFields] = useState({
        text: "", url: "", ssid: "", encryption: "WPA", password: "", hidden: false,
        fullName: "", org: "", tel: "", email: "", website: "",
        mailTo: "", mailSub: "", mailBody: "",
        smsType: "sms", smsNum: "", smsMsg: "", lat: "", lng: ""
    });

    const [size, setSize] = useState(defaultDesign.size);
    const [margin, setMargin] = useState(defaultDesign.margin);
    const [errorStrength, setErrorStrength] = useState(defaultDesign.errorStrength);
    const [fg, setFg] = useState(defaultDesign.fg);
    const [bg, setBg] = useState(defaultDesign.bg);
    const [bgImage, setBgImage] = useState<string | null>(null);
    const [payload, setPayload] = useState("");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        let newPayload = "";

        if (mode === "text") newPayload = fields.text;
        else if (mode === "url") newPayload = fields.url;
        else if (mode === "wifi") newPayload = `WIFI:S:${fields.ssid};T:${fields.encryption};P:${fields.password};H:${fields.hidden};;`;
        else if (mode === "vcard") newPayload = `BEGIN:VCARD\nVERSION:3.0\nN:${fields.fullName}\nORG:${fields.org}\nTEL:${fields.tel}\nEMAIL:${fields.email}\nURL:${fields.website}\nEND:VCARD`;
        else if (mode === "email") newPayload = `mailto:${fields.mailTo}?subject=${encodeURIComponent(fields.mailSub)}&body=${encodeURIComponent(fields.mailBody)}`;
        else if (mode === "sms") {
            if (fields.smsType === "whatsapp") {
                const num = (fields.smsNum || "").replace(/[^\d]/g, "");
                const text = encodeURIComponent(fields.smsMsg || "");
                newPayload = num ? `https://wa.me/${num}?text=${text}` : "";
            } else {
                newPayload = `smsto:${fields.smsNum}:${fields.smsMsg}`;
            }
        }
        else if (mode === "location") newPayload = `geo:${fields.lat},${fields.lng}`;

        setPayload(newPayload);
    }, [mode, fields]);

    const activeModeLabel = useMemo(() => {
        return modeOptions.find((option) => option.value === mode)?.label || "Contenido";
    }, [mode]);

    const ecc = useMemo(() => getErrorLevel(errorStrength), [errorStrength]);
    const errorLabel = useMemo(() => getErrorLabel(errorStrength), [errorStrength]);
    const qrVersion = useMemo(() => getQrVersion(errorStrength), [errorStrength]);
    const previewSize = Math.min(size, 340);

    function onSaveGenerated() {
        if (!payload) return;

        addToHistory({
            id: window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString(),
            kind: "generated",
            createdAt: nowISO(),
            meta: { mode },
            value: payload,
        });
    }

    function downloadPNG() {
        if (!payload) return;
        const svg = document.getElementById("qr-svg-export");
        if (!svg) return;

        const marginPx = margin * 4;
        const totalSize = size + (marginPx * 2);

        const canvas = document.createElement("canvas");
        canvas.width = totalSize;
        canvas.height = totalSize;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const drawSVG = () => {
            const xml = new XMLSerializer().serializeToString(svg);
            const svg64 = btoa(unescape(encodeURIComponent(xml)));
            const image64 = 'data:image/svg+xml;base64,' + svg64;
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, marginPx, marginPx, size, size);
                const a = document.createElement("a");
                a.href = canvas.toDataURL("image/png");
                a.download = `qr-${Date.now()}.png`;
                a.click();
            };
            img.src = image64;
        };

        if (bgImage) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => {
                ctx.drawImage(img, 0, 0, totalSize, totalSize);
                drawSVG();
            };
            img.src = bgImage;
        } else {
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, totalSize, totalSize);
            drawSVG();
        }
    }

    function downloadSVG() {
        if (!payload) return;
        const svgEl = document.getElementById("qr-svg-export");
        if (!svgEl) return;
        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svgEl);

        if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
            source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
            source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
        const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-${Date.now()}.svg`;
        link.click();
    }

    function resetDesign() {
        setSize(defaultDesign.size);
        setMargin(defaultDesign.margin);
        setErrorStrength(defaultDesign.errorStrength);
        setFg(defaultDesign.fg);
        setBg(defaultDesign.bg);
        setBgImage(null);
        setIsPreviewOpen(false);
    }

    function swapColors() {
        setFg(bg);
        setBg(fg);
    }

    return (
        <div className="dashboard-grid create-grid">
            <div className="content-stack">
                <Card
                    eyebrow="Crear"
                    title="Contenido del QR"
                    description="Define qué información llevará el código. La vista previa se actualiza al instante."
                    icon={<Link2 size={18} aria-hidden="true" />}
                >
                    <div className="module-grid">
                        <Field label="Tipo de contenido" hint="Más adelante esta sección también incluirá links cortos y QR vivos.">
                            <SelectField value={mode} options={modeOptions} onChange={setMode} ariaLabel="Tipo de contenido" />
                        </Field>
                    </div>

                    {mode === "text" && (
                        <Field label="Texto">
                            <TextArea value={fields.text} onChange={(e) => setFields((s) => ({ ...s, text: e.target.value }))} placeholder="Escribe algo..." />
                        </Field>
                    )}

                    {mode === "url" && (
                        <Field label="URL">
                            <TextInput value={fields.url} onChange={(e) => setFields((s) => ({ ...s, url: e.target.value }))} placeholder="https://..." tone="mono" />
                        </Field>
                    )}

                    {mode === "wifi" && (
                        <>
                            <div className="module-grid two-columns">
                                <Field label="SSID">
                                    <TextInput value={fields.ssid} onChange={(e) => setFields((s) => ({ ...s, ssid: e.target.value }))} placeholder="MiWiFi" />
                                </Field>
                                <Field label="Seguridad">
                                    <SelectField value={fields.encryption} options={encryptionOptions} onChange={(value) => setFields((s) => ({ ...s, encryption: value }))} ariaLabel="Seguridad" />
                                </Field>
                            </div>

                            <Field label="Contraseña">
                                <TextInput value={fields.password} onChange={(e) => setFields((s) => ({ ...s, password: e.target.value }))} placeholder="********" />
                            </Field>

                            <label className="check-card">
                                <input type="checkbox" checked={fields.hidden} onChange={(e) => setFields((s) => ({ ...s, hidden: e.target.checked }))} />
                                <span>Red oculta</span>
                            </label>
                        </>
                    )}

                    {mode === "vcard" && (
                        <>
                            <div className="module-grid two-columns">
                                <Field label="Nombre">
                                    <TextInput value={fields.fullName} onChange={(e) => setFields((s) => ({ ...s, fullName: e.target.value }))} />
                                </Field>
                                <Field label="Empresa">
                                    <TextInput value={fields.org} onChange={(e) => setFields((s) => ({ ...s, org: e.target.value }))} />
                                </Field>
                            </div>

                            <div className="module-grid two-columns">
                                <Field label="Teléfono">
                                    <TextInput value={fields.tel} onChange={(e) => setFields((s) => ({ ...s, tel: e.target.value }))} />
                                </Field>
                                <Field label="Email">
                                    <TextInput value={fields.email} onChange={(e) => setFields((s) => ({ ...s, email: e.target.value }))} />
                                </Field>
                            </div>

                            <Field label="Sitio web">
                                <TextInput value={fields.website} onChange={(e) => setFields((s) => ({ ...s, website: e.target.value }))} placeholder="https://..." />
                            </Field>
                        </>
                    )}

                    {mode === "email" && (
                        <>
                            <Field label="Destinatario">
                                <TextInput value={fields.mailTo} onChange={(e) => setFields((s) => ({ ...s, mailTo: e.target.value }))} placeholder="correo@ejemplo.com" />
                            </Field>
                            <Field label="Asunto">
                                <TextInput value={fields.mailSub} onChange={(e) => setFields((s) => ({ ...s, mailSub: e.target.value }))} />
                            </Field>
                            <Field label="Mensaje">
                                <TextArea value={fields.mailBody} onChange={(e) => setFields((s) => ({ ...s, mailBody: e.target.value }))} />
                            </Field>
                        </>
                    )}

                    {mode === "sms" && (
                        <>
                            <div className="module-grid two-columns">
                                <Field label="Canal">
                                    <SelectField value={fields.smsType} options={channelOptions} onChange={(value) => setFields((s) => ({ ...s, smsType: value }))} ariaLabel="Canal" />
                                </Field>
                                <Field label="Número">
                                    <TextInput value={fields.smsNum} onChange={(e) => setFields((s) => ({ ...s, smsNum: e.target.value }))} placeholder="+123456789" />
                                </Field>
                            </div>

                            <Field label="Mensaje">
                                <TextArea value={fields.smsMsg} onChange={(e) => setFields((s) => ({ ...s, smsMsg: e.target.value }))} />
                            </Field>
                        </>
                    )}

                    {mode === "location" && (
                        <div className="module-grid two-columns">
                            <Field label="Latitud">
                                <TextInput value={fields.lat} onChange={(e) => setFields((s) => ({ ...s, lat: e.target.value }))} placeholder="4.60971" />
                            </Field>
                            <Field label="Longitud">
                                <TextInput value={fields.lng} onChange={(e) => setFields((s) => ({ ...s, lng: e.target.value }))} placeholder="-74.08175" />
                            </Field>
                        </div>
                    )}
                </Card>

                <Card
                    eyebrow="Diseño"
                    title="Personalización visual"
                    description="Controla la presencia del QR sin romper el layout ni perder claridad."
                    icon={<Paintbrush size={18} aria-hidden="true" />}
                    actions={
                        <Button variant="ghost" size="small" icon={<RotateCcw size={15} aria-hidden="true" />} onClick={resetDesign}>
                            Reiniciar diseño
                        </Button>
                    }
                >
                    <div className="settings-panel">
                        <SliderField label="Tamaño" min={160} max={1200} value={size} unit="px" minLabel="160px" maxLabel="1200px" onChange={setSize} />
                        <SliderField label="Margen" min={0} max={10} value={margin} minLabel="Sin margen" maxLabel="Amplio" onChange={setMargin} />
                        <SliderField
                            label="Nivel de error"
                            min={0}
                            max={100}
                            value={errorStrength}
                            valueLabel={errorLabel}
                            minLabel="Bajo"
                            maxLabel="Extremo"
                            showNumber={false}
                            onChange={setErrorStrength}
                        />

                        <div className="palette-panel">
                            <div className="palette-top">
                                <SectionHeader title="Colores del QR" description="Usa combinaciones rápidas o abre el selector visual del navegador." icon={<Paintbrush size={18} aria-hidden="true" />} />
                                <Button type="button" variant="secondary" size="small" icon={<ArrowLeftRight size={15} aria-hidden="true" />} onClick={swapColors}>
                                    Intercambiar
                                </Button>
                            </div>
                            <div className="color-presets">
                                {colorPresets.map((preset) => (
                                    <button
                                        key={preset.name}
                                        type="button"
                                        className={`color-preset ${fg === preset.fg && bg === preset.bg ? "active" : ""}`}
                                        onClick={() => {
                                            setFg(preset.fg);
                                            setBg(preset.bg);
                                        }}
                                    >
                                        <span className="preset-swatch" style={{ background: preset.bg }}>
                                            <span style={{ background: preset.fg }} />
                                        </span>
                                        <strong>{preset.name}</strong>
                                    </button>
                                ))}
                            </div>
                            <div className="color-picker-grid">
                                <Field label="Color principal">
                                    <label className="color-picker-card">
                                        <input type="color" value={fg} onChange={(e) => setFg(e.target.value)} aria-label="Color principal del QR" />
                                        <span>
                                            <strong>Color del código</strong>
                                            <small>{fg}</small>
                                        </span>
                                    </label>
                                </Field>
                                <Field label="Color de fondo">
                                    <label className="color-picker-card">
                                        <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} aria-label="Color de fondo del QR" />
                                        <span>
                                            <strong>Fondo del código</strong>
                                            <small>{bg}</small>
                                        </span>
                                    </label>
                                </Field>
                            </div>
                        </div>

                        <div className="upload-panel">
                            <div>
                                <SectionHeader title="Imagen de fondo" description="Se conserva por compatibilidad; en QR Pro se reemplazará por logo central." icon={<ImageIcon size={18} aria-hidden="true" />} />
                            </div>
                            <div className="btns">
                                <label htmlFor="bg-image-upload" className="btn btn-secondary btn-medium cursor-pointer">
                                    <span>Subir imagen</span>
                                </label>
                                <input
                                    id="bg-image-upload"
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (event) => setBgImage(event.target?.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                        e.target.value = '';
                                    }}
                                />
                                {bgImage && <Button type="button" variant="danger" onClick={() => setBgImage(null)}>Quitar</Button>}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <aside className="preview-column">
                <Card
                    eyebrow="Vista previa"
                    title="QR actual"
                    description="El panel se mantiene estable mientras modificas el contenido."
                    icon={<Shapes size={18} aria-hidden="true" />}
                    sticky
                >
                    <div className="preview-stage">
                        {payload ? (
                            <>
                                <div className="qr-preview-frame" style={{
                                    backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: bgImage ? 'transparent' : bg,
                                    padding: `${margin * 4}px`
                                }}>
                                    <QRCodeSVG
                                        value={payload}
                                        size={previewSize}
                                        level={ecc}
                                        minVersion={qrVersion}
                                        bgColor={bgImage ? "transparent" : bg}
                                        fgColor={fg}
                                        style={{ display: 'block' }}
                                    />
                                </div>
                                {size > previewSize && (
                                    <button type="button" className="preview-expand-button" onClick={() => setIsPreviewOpen(true)} aria-label="Ampliar vista previa">
                                        <Maximize2 size={18} aria-hidden="true" />
                                    </button>
                                )}
                            </>
                        ) : (
                            <EmptyState
                                icon={<QrPlaceholder />}
                                title="Esperando contenido"
                                description="El QR aparecerá aquí cuando completes la información principal."
                            />
                        )}
                    </div>

                    {payload && (
                        <div className="preview-meta">
                            <Badge tone="accent">{activeModeLabel}</Badge>
                            <Badge>{size}px</Badge>
                            <Badge>Error {errorLabel}</Badge>
                        </div>
                    )}

                    <div className="export-source" aria-hidden="true">
                        {payload && (
                            <QRCodeSVG
                                id="qr-svg-export"
                                value={payload}
                                size={size}
                                level={ecc}
                                minVersion={qrVersion}
                                bgColor={bgImage ? "transparent" : bg}
                                fgColor={fg}
                                style={{ display: 'block' }}
                            />
                        )}
                    </div>

                    <div className="payload-box">
                        <span>Contenido</span>
                        <code>{payload ? payload.slice(0, 220) + (payload.length > 220 ? "…" : "") : "Sin contenido todavía"}</code>
                    </div>

                    <div className="action-grid">
                        <Button variant="primary" icon={<Save size={17} aria-hidden="true" />} onClick={onSaveGenerated} disabled={!payload}>Guardar</Button>
                        <Button variant="secondary" icon={<Download size={17} aria-hidden="true" />} onClick={downloadPNG} disabled={!payload}>PNG</Button>
                        <Button variant="secondary" icon={<FileCode size={17} aria-hidden="true" />} onClick={downloadSVG} disabled={!payload}>SVG</Button>
                        <Button variant="ghost" icon={<Clipboard size={17} aria-hidden="true" />} onClick={() => copy(payload)} disabled={!payload}>Copiar</Button>
                    </div>

                    {isPreviewOpen && payload && (
                        <div className="preview-modal" role="dialog" aria-modal="true" aria-label="Vista previa ampliada" onClick={() => setIsPreviewOpen(false)}>
                            <div className="preview-modal-panel" onClick={(e) => e.stopPropagation()}>
                                <div className="preview-modal-top">
                                    <div>
                                        <strong>Vista previa ampliada</strong>
                                        <span>{size}px · Error {errorLabel}</span>
                                    </div>
                                    <button type="button" className="preview-close-button" onClick={() => setIsPreviewOpen(false)} aria-label="Cerrar vista previa">
                                        <X size={20} aria-hidden="true" />
                                    </button>
                                </div>
                                <div className="preview-modal-stage">
                                    <div className="preview-modal-content">
                                        <div className="qr-preview-frame qr-preview-frame-modal" style={{
                                            backgroundImage: bgImage ? `url(${bgImage})` : 'none',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundColor: bgImage ? 'transparent' : bg,
                                            padding: `${margin * 4}px`
                                        }}>
                                            <QRCodeSVG
                                                value={payload}
                                                size={size}
                                                level={ecc}
                                                minVersion={qrVersion}
                                                bgColor={bgImage ? "transparent" : bg}
                                                fgColor={fg}
                                                style={{ display: 'block' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </Card>
            </aside>
        </div>
    );
}

function QrPlaceholder() {
    return (
        <svg viewBox="0 0 80 80" width="54" height="54" fill="none" aria-hidden="true">
            <rect x="10" y="10" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="4" />
            <rect x="50" y="10" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="4" />
            <rect x="10" y="50" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="4" />
            <path d="M50 52h8v8h-8zM62 42h8v8h-8zM42 42h10v10H42zM42 62h28" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
    );
}