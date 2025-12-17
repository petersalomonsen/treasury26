interface UserProps {
    accountId: string;
    iconOnly?: boolean;
}

export function User({ accountId, iconOnly = false }: UserProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {accountId.charAt(0).toUpperCase()}
            </div>
            {!iconOnly && (
                <div className="flex flex-col">
                    <span className="font-medium">{accountId.split('.')[0]}</span>
                    <span className="text-xs text-muted-foreground">{accountId}</span>
                </div>
            )}
        </div>
    )
}
