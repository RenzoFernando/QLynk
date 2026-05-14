import type { CSSProperties } from 'react';

interface SliderFieldProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    valueLabel?: string;
    minLabel?: string;
    maxLabel?: string;
    showNumber?: boolean;
    onChange: (value: number) => void;
}

export default function SliderField({
                                        label,
                                        value,
                                        min,
                                        max,
                                        step = 1,
                                        unit = "",
                                        valueLabel,
                                        minLabel,
                                        maxLabel,
                                        showNumber = true,
                                        onChange
                                    }: SliderFieldProps) {
    const range = max - min;
    const progress = range > 0 ? ((value - min) / range) * 100 : 0;

    function updateValue(nextValue: number) {
        const normalized = Math.min(max, Math.max(min, nextValue));
        onChange(normalized);
    }

    return (
        <div className="slider-field">
            <div className="slider-header">
                <span>{label}</span>
                <strong>{valueLabel || `${value}${unit}`}</strong>
            </div>
            <div className={`slider-row ${showNumber ? "" : "slider-row-full"}`}>
                <input
                    className="range-control"
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    style={{ "--range-progress": `${progress}%` } as CSSProperties}
                    onChange={(e) => updateValue(Number(e.target.value))}
                />
                {showNumber && (
                    <input
                        className="input-control number-control"
                        type="number"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => updateValue(Number(e.target.value || min))}
                    />
                )}
            </div>
            {(minLabel || maxLabel) && (
                <div className="slider-scale">
                    <span>{minLabel || min}</span>
                    <span>{maxLabel || max}</span>
                </div>
            )}
        </div>
    );
}
