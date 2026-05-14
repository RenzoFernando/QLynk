import type { ReactNode } from 'react';

interface CardProps {
    title?: string;
    description?: string;
    eyebrow?: string;
    icon?: ReactNode;
    actions?: ReactNode;
    className?: string;
    sticky?: boolean;
    children: ReactNode;
}

export default function Card({
                                 title,
                                 description,
                                 eyebrow,
                                 icon,
                                 actions,
                                 className = "",
                                 sticky = false,
                                 children
                             }: CardProps) {
    const classes = ["card", sticky ? "card-sticky" : "", className].filter(Boolean).join(" ");

    return (
        <section className={classes}>
            {(title || description || eyebrow || icon || actions) && (
                <div className="card-header">
                    <div className="card-heading">
                        {(eyebrow || icon) && (
                            <div className="eyebrow-row">
                                {icon && <span className="eyebrow-icon">{icon}</span>}
                                {eyebrow && <span className="eyebrow">{eyebrow}</span>}
                            </div>
                        )}
                        {title && <h2>{title}</h2>}
                        {description && <p>{description}</p>}
                    </div>
                    {actions && <div className="card-actions">{actions}</div>}
                </div>
            )}
            <div className="card-body">{children}</div>
        </section>
    );
}
