"use client";

import { InputBlock } from "./input-block";

interface InfoItem {
    label: string;
    value: string | number | React.ReactNode;
}

interface InfoDisplayProps {
    title?: string;
    items: InfoItem[];
    className?: string;
}

export function InfoDisplay({ title, items, className }: InfoDisplayProps) {
    return (
        <div className={`flex flex-col gap-2 ${className || ""}`}>
            {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b border-border pb-4 last:border-b-0 last:pb-0">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
            ))}
        </div>
    );
}
