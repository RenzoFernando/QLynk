export function nowISO() {
    return new Date().toISOString();
}

export function getWebUrl(text: string) {
    try {
        const url = new URL(text.trim());
        if (url.protocol !== "http:" && url.protocol !== "https:") return null;
        if (url.protocol === "http:") url.protocol = "https:";
        return url.toString();
    } catch {
        return null;
    }
}

export function openExternalUrl(text: string) {
    const url = getWebUrl(text);
    if (!url) return false;
    window.open(url, "_blank", "noopener,noreferrer");
    return true;
}

export function classifyResult(text: string) {
    if (!text) return { type: "Desconocido", action: "none" };
    const lower = text.toLowerCase();
    if (getWebUrl(text)) return { type: "URL", action: "open" };
    if (lower.startsWith("wifi:")) return { type: "WiFi", action: "copy" };
    if (lower.startsWith("begin:vcard")) return { type: "vCard", action: "copy" };
    if (lower.startsWith("mailto:")) return { type: "Email", action: "open" };
    if (lower.startsWith("smsto:") || lower.startsWith("sms:")) return { type: "SMS", action: "open" };
    if (lower.startsWith("geo:")) return { type: "Ubicación", action: "open" };
    if (lower.startsWith("tel:")) return { type: "Teléfono", action: "open" };
    return { type: "Texto", action: "copy" };
}

export function copy(text: string) {
    if (!navigator.clipboard?.writeText) return;
    void navigator.clipboard.writeText(text || "").catch(() => undefined);
}
