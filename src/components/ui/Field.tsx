import type { ReactNode } from 'react';

interface FieldProps {
    label: string;
    hint?: string;
    error?: string;
    children: ReactNode;
}

export default function Field({ label, hint, error, children }: FieldProps) {
    return (
        <div className="field">
            <label className="field-label">{label}</label>
            {children}
            {hint && <div className="field-hint">{hint}</div>}
            {error && <div className="field-error">{error}</div>}
        </div>
    );
}
