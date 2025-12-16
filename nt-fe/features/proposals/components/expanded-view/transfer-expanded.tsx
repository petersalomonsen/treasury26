import { Proposal } from "@/lib/proposals-api";
import { formatNearAmount } from "@/lib/utils";

interface TransferExpandedProps {
  proposal: Proposal;
}

export function TransferExpanded({ proposal }: TransferExpandedProps) {
  if (!('Transfer' in proposal.kind)) return null;

  const transfer = proposal.kind.Transfer;
  const amount = transfer.amount;
  const receiver = transfer.receiver_id;
  const tokenId = transfer.token_id || "NEAR";
  const msg = transfer.msg;

  const formattedAmount = tokenId === "NEAR" || tokenId === ""
    ? formatNearAmount(amount)
    : amount;

  return (
    <div className="p-4 bg-muted/30 rounded-lg space-y-3">
      <h4 className="font-semibold text-sm">Transfer Details</h4>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-muted-foreground">Amount:</span>
          <p className="font-medium">{formattedAmount} {tokenId || "NEAR"}</p>
        </div>

        <div>
          <span className="text-muted-foreground">Receiver:</span>
          <p className="font-medium break-all">{receiver}</p>
        </div>

        {tokenId && tokenId !== "" && (
          <div>
            <span className="text-muted-foreground">Token ID:</span>
            <p className="font-medium break-all">{tokenId}</p>
          </div>
        )}

        {msg && (
          <div className="col-span-2">
            <span className="text-muted-foreground">Message:</span>
            <p className="font-medium">{msg}</p>
          </div>
        )}
      </div>
    </div>
  );
}
