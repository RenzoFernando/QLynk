import type { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
    soft: "btn-soft",
    danger: "btn-danger"
};

const sizeClasses: Record<ButtonSize, string> = {
    small: "btn-small",
    medium: "btn-medium",
    large: "btn-large"
};

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
        variantClasses[variant],
        sizeClasses[size],
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
