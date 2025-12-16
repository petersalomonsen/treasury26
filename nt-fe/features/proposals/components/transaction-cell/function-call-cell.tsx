import { Proposal } from "@/lib/proposals-api";
import { formatNearAmount, decodeArgs } from "@/lib/utils";
import { Coins } from "lucide-react";

interface FunctionCallCellProps {
  proposal: Proposal;
}

export function FunctionCallCell({ proposal }: FunctionCallCellProps) {
  if (!('FunctionCall' in proposal.kind)) return null;

  const functionCall = proposal.kind.FunctionCall;
  const receiver = functionCall.receiver_id;
  const actionsCount = functionCall.actions.length;
  const firstAction = functionCall.actions[0];

  // Check if this is a vesting transaction
  const isVesting = (receiver.includes('lockup.near') || receiver === 'lockup.near') &&
                    firstAction?.method_name === 'create';

  if (isVesting && firstAction) {
    const args = decodeArgs(firstAction.args);
    const recipient = args?.owner_account_id;
    const amount = firstAction.deposit;

    return (
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500">
          <Coins className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{formatNearAmount(amount)} NEAR</span>
          <span className="text-xs text-muted-foreground">To: {recipient || 'contributor.near'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium">{firstAction?.method_name || "Function Call"}</span>
      <span className="text-xs text-muted-foreground">
        on {receiver}
        {actionsCount > 1 && ` (+${actionsCount - 1} more)`}
      </span>
    </div>
  );
}
