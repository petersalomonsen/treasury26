"use client";

import { cn } from "@/lib/utils";

export interface InfoItem {
    label: string;
    value: string | number | React.ReactNode;
    differentLine?: boolean;
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
                <div key={index} className={cn("flex justify-between items-center border-b border-border pb-4 last:border-b-0 last:pb-0", item.differentLine && "flex-col items-start gap-2")}>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <div className="text-sm text-muted-foreground">{item.value}</div>
                </div>
            ))}
        </div>
    );
}
