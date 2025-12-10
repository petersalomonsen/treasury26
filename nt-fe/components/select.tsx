import { Select, SelectContent as SelectContentPrimitive, SelectTrigger as SelectTriggerPrimitive, SelectValue as SelectValuePrimitive, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";


function SelectTrigger({ size, ...props }: React.ComponentProps<typeof SelectTriggerPrimitive>) {
    return <SelectTriggerPrimitive {...props} size={size} className={cn(
        "border-none shadow-none bg-muted rounded-[6px] text-muted-foreground font-bold hover:bg",
        size === "sm" && "h-8",
    )} />
}

function SelectValue({ ...props }: React.ComponentProps<typeof SelectValuePrimitive>) {
    return <SelectValuePrimitive {...props} />
}

function SelectContent({ ...props }: React.ComponentProps<typeof SelectContentPrimitive>) {
    return <SelectContentPrimitive {...props} className="rounded-[6px]" />
}

export {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
}
