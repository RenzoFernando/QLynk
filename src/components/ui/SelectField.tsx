import { ChevronDown } from 'lucide-react';

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    ariaLabel?: string;
}

export default function SelectField({ value, options, onChange, ariaLabel }: SelectFieldProps) {
    return (
        <div className="select-shell">
            <select
                className="select-control"
                value={value}
                aria-label={ariaLabel}
                onChange={(e) => onChange(e.target.value)}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                ))}
            </select>
            <ChevronDown size={18} className="select-icon" aria-hidden="true" />
        </div>
    );
}
