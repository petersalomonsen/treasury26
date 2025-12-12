import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

interface LargeInputProps extends React.ComponentProps<typeof Input> {
    search?: boolean;
    borderless?: boolean;
}

export function LargeInput({ className, search, borderless, ...props }: LargeInputProps) {
    return (
        <div className="relative">
            {search && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Search className="size-4 text-muted-foreground" />
                </div>
            )}
            <Input
                {...props}
                className={cn("text-xl! h-12 shrink-0 p-0", search && "pl-10", borderless && "border-none focus-visible:ring-0 focus-visible:ring-offset-0", className)}
            />
        </div>
    );
}
