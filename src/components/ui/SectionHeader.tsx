import type { ReactNode } from 'react';

interface SectionHeaderProps {
    title: string;
    description?: string;
    icon?: ReactNode;
}

export default function SectionHeader({ title, description, icon }: SectionHeaderProps) {
    return (
        <div className="section-header">
            {icon && <span className="section-icon">{icon}</span>}
            <div>
                <h3>{title}</h3>
                {description && <p>{description}</p>}
            </div>
        </div>
    );
}
