import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    fullWidth?: boolean;
}

export default function Button({
                                   variant = "secondary",
                                   size = "medium",
                                   icon,
                                   fullWidth = false,
                                   className = "",
                                   children,
                                   ...props
                               }: ButtonProps) {
    const classes = [
        "btn",
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth ? "btn-full" : "",
        className
    ].filter(Boolean).join(" ");

    return (
        <button className={classes} {...props}>
            {icon && <span className="btn-icon">{icon}</span>}
            <span>{children}</span>
        </button>
    );
}
