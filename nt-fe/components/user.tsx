import { useProfile } from "@/hooks/use-treasury-queries";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface UserProps {
    accountId: string;
    iconOnly?: boolean;
    size?: "sm" | "md" | "lg";
    withLink?: boolean;
}

const sizeClasses = {
    sm: "size-6",
    md: "size-8",
    lg: "size-10",
}

export function User({ accountId, iconOnly = false, size = "sm", withLink = true }: UserProps) {
    const { data: profile } = useProfile(accountId);
    const name = profile?.name || accountId.split('.')[0];
    const image = `https://i.near.social/magic/large/https://near.social/magic/img/account/${accountId}`;

    const content = (
        <>
            <img src={image} alt="User Logo" className={cn("rounded-full", sizeClasses[size])} />
            {!iconOnly && (
                <div className="flex flex-col">
                    <span className="font-medium">{name}</span>
                    <span className="text-xs text-muted-foreground">{accountId}</span>
                </div>
            )}
        </>
    );

    return (
        withLink ? (
            <Link href={`https://nearblocks.io/address/${accountId}`} target="_blank" className="flex items-center gap-2">
                {content}
            </Link>
        ) : (
            <div className="flex items-center gap-2">
                {content}
            </div>
        )
    )
}
