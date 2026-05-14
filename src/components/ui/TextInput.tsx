import type { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
    tone?: "default" | "mono";
}

export default function TextInput({ className = "", tone = "default", ...props }: TextInputProps) {
    const classes = ["input-control", tone === "mono" ? "input-mono" : "", className].filter(Boolean).join(" ");

    return <input className={classes} {...props} />;
}
