import type { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    tone?: "default" | "accent" | "success" | "warning" | "danger";
}

export default function Badge({ children, tone = "default" }: BadgeProps) {
    return <span className={`badge badge-${tone}`}>{children}</span>;
}
