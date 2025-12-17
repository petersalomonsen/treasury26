import { useToken } from "@/hooks/use-treasury-queries";
import { formatBalance } from "@/lib/utils";
import { Coins } from "lucide-react";

interface TokenCellProps {
  tokenId: string;
  amount: string;
  receiver: string;
}

export function TokenCell({ tokenId, amount, receiver }: TokenCellProps) {
  const token = tokenId.length > 0 ? tokenId : "near";
  const { data: tokenData } = useToken(token, "NEAR");
  const icon = tokenData?.icon ? <img src={tokenData?.icon} alt={tokenData?.name} width={20} height={20} /> : <Coins className="size-5 shrink-0 border border-border rounded-full p-1" />;


  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-medium">{formatBalance(amount, tokenData?.decimals || 24)} {tokenData?.symbol || "NEAR"}</span>
      </div>
      <span className="text-xs text-muted-foreground">To: {receiver}</span>
    </div>
  );
}
