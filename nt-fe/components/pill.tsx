import { cn } from "@/lib/utils";

interface PillProps {
    title: string;
    variant?: "default" | "secondary";
}

const variants = {
    default: "",
    secondary: "bg-card text-card-foreground",
}

export function Pill({ title, variant = "default" }: PillProps) {
    return (
        <div className={cn("flex border rounded-md py-[3px] px-2 w-fit text-xs font-medium text-center", variants[variant])}>
            {title}
        </div>
    )
}
