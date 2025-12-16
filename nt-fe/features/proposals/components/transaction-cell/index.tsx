import { Proposal } from "@/lib/proposals-api";
import { getProposalType } from "../../utils/get-proposal-type";
import { TransferCell } from "./transfer-cell";
import { FunctionCallCell } from "./function-call-cell";
import { ChangePolicyCell } from "./change-policy-cell";

interface TransactionCellProps {
  proposal: Proposal;
}

/**
 * Renders the transaction cell based on proposal type
 */
export function TransactionCell({ proposal }: TransactionCellProps) {
  const type = getProposalType(proposal);

  switch (type) {
    case "Transfer":
      return <TransferCell proposal={proposal} />;
    case "FunctionCall":
      return <FunctionCallCell proposal={proposal} />;
    case "ChangePolicy":
      return <ChangePolicyCell proposal={proposal} />;
    default:
      return (
        <div className="flex flex-col gap-1">
          <span className="font-medium">Unknown</span>
          <span className="text-xs text-muted-foreground">Unknown proposal type</span>
        </div>
      );
  }
}
