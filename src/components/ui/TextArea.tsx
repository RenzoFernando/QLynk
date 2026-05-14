import type { TextareaHTMLAttributes } from 'react';

export default function TextArea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    const classes = ["input-control", "textarea-control", className].filter(Boolean).join(" ");

    return <textarea className={classes} {...props} />;
}
