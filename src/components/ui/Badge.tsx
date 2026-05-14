import type { ReactNode } from 'react';

type BadgeTone = "default" | "accent" | "success" | "warning" | "danger";

interface BadgeProps {
    children: ReactNode;
    tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
    default: "",
    accent: "badge-accent",
    success: "badge-success",
    warning: "badge-warning",
    danger: "badge-danger"
};

export default function Badge({ children, tone = "default" }: BadgeProps) {
    const classes = ["badge", toneClasses[tone]].filter(Boolean).join(" ");
    return <span className={classes}>{children}</span>;
}
