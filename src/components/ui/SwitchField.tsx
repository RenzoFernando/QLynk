interface SwitchFieldProps {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
}

export default function SwitchField({ label, description, checked, onChange }: SwitchFieldProps) {
    return (
        <button
            type="button"
            className={`switch-field ${checked ? "checked" : ""}`}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
        >
            <span className="switch-copy">
                <strong>{label}</strong>
                {description && <span>{description}</span>}
            </span>
            <span className="switch-track">
                <span className="switch-thumb" />
            </span>
        </button>
    );
}
