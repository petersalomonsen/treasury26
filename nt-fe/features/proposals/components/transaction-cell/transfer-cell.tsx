import { Proposal } from "@/lib/proposals-api";
import { formatNearAmount } from "@/lib/utils";
import { Coins } from "lucide-react";

interface TransferCellProps {
  proposal: Proposal;
}

// Token icon component
function TokenIcon({ token }: { token: string }) {
  const isNear = token === "NEAR" || token === "";
  const isUsdc = token.toLowerCase().includes("usdc");
  const isDai = token.toLowerCase().includes("dai");
  const isEth = token.toLowerCase().includes("eth");

  const bgColor = isNear
    ? "bg-emerald-500"
    : isUsdc
    ? "bg-blue-500"
    : isDai
    ? "bg-amber-500"
    : isEth
    ? "bg-purple-500"
    : "bg-gray-500";

  return (
    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${bgColor}`}>
      <Coins className="h-4 w-4 text-white" />
    </div>
  );
}

export function TransferCell({ proposal }: TransferCellProps) {
  if (!('Transfer' in proposal.kind)) return null;

  const transfer = proposal.kind.Transfer;
  const amount = transfer.amount;
  const receiver = transfer.receiver_id;
  const tokenId = transfer.token_id || "NEAR";

  // Format amount based on token (assuming 24 decimals for NEAR)
  const formattedAmount = tokenId === "NEAR" || tokenId === ""
    ? formatNearAmount(amount)
    : amount;

  return (
    <div className="flex items-center gap-2">
      <TokenIcon token={tokenId} />
      <div className="flex flex-col">
        <span className="font-medium">{formattedAmount} {tokenId || "NEAR"}</span>
        <span className="text-xs text-muted-foreground">To: {receiver}</span>
      </div>
    </div>
  );
}
