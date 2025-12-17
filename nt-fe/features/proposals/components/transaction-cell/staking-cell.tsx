import { Proposal } from "@/lib/proposals-api";
import { decodeArgs } from "@/lib/utils";
import { TokenCell } from "./token-cell";
import { useLockupPool } from "@/hooks/use-treasury-queries";

interface StakingCellProps {
    proposal: Proposal;
}

export function StakingCell({ proposal }: StakingCellProps) {
    if (!('FunctionCall' in proposal.kind)) return null;
    const functionCall = proposal.kind.FunctionCall;

    const isLockup = functionCall.receiver_id.endsWith('lockup.near')
    const { data: lockupPool } = useLockupPool(isLockup ? functionCall.receiver_id : null);

    const actions = functionCall.actions;
    const stakingAction = actions.find(action => action.method_name === 'stake' || action.method_name === 'deposit_and_stake' || action.method_name === 'deposit');
    const withdrawAction = actions.find(action => action.method_name === 'withdraw' || action.method_name === 'unstake');
    if (!stakingAction && !withdrawAction) return null;

    const args = decodeArgs(stakingAction?.args || withdrawAction?.args || '');
    if (!args) return null;

    const amount = args.amount;
    return (
        <TokenCell tokenId="near" amount={amount} receiver={isLockup ? lockupPool : functionCall.receiver_id} />
    );
}
