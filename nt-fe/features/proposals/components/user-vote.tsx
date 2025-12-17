import { Tooltip } from "@/components/tooltip";
import { Button } from "@/components/ui/button";
import { User } from "@/components/user";
import { Vote } from "@/lib/proposals-api";
import { cn } from "@/lib/utils";
import { Check, Trash, X, } from "lucide-react";

const iconStyle = "size-3 text-white rounded-full p-0.5 stroke-3";

export function UserVote({ accountId, vote }: { accountId: string, vote: Vote }) {
    let icon;
    let action;
    switch (vote) {
        case "Approve":
            icon = <Check className={cn(iconStyle, "bg-green-500")} />;
            action = "Approved";
            break;
        case "Reject":
            icon = <X className={cn(iconStyle, "bg-red-500")} />;
            action = "Rejected";
            break;
        case "Remove":
            icon = <Trash className={cn(iconStyle, "bg-red-500")} />;
            action = "Removed";
            break;
    }

    return (
        <Tooltip content={`${accountId}: ${action}`}>
            <Button variant="ghost" size="icon-sm" className="relative">
                <User accountId={accountId} iconOnly />
                <div className="absolute bottom-0.5 right-0.5">
                    {icon}
                </div>
            </Button>
        </Tooltip>
    );
}
