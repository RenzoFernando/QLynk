export interface HistoryItem {
    id: string;
    kind: "generated" | "scanned";
    createdAt: string;
    meta: Record<string, unknown>;
    value: string;
}
