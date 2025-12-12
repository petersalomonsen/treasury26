export function PageCard({ children, ...props }: React.ComponentProps<"div">) {
    return <div className="flex flex-col gap-2 rounded-lg border bg-card p-6" {...props}>
        {children}
    </div>
}
