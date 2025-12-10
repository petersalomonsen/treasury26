import { Button as ShadButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";



export function Button({ children, className, ...props }: React.ComponentProps<typeof ShadButton>) {
    return <ShadButton {...props} className={cn("font-semibold rounded-[6px]", className)}>
        {children}
    </ShadButton>;
}
