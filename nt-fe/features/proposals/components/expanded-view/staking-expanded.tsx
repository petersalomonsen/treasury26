import { useLockupPool, useToken } from "@/hooks/use-treasury-queries";
import { Proposal } from "@/lib/proposals-api";
import { decodeArgs, decodeProposalDescription, formatNearAmount } from "@/lib/utils";
import { Amount } from "../amount";
import { InfoDisplay } from "@/components/info-display";
import Link from "next/link";


interface StakingExpandedProps {
    proposal: Proposal;
}

export function StakingExpanded({ proposal }: StakingExpandedProps) {
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

    const notes = decodeProposalDescription("notes", proposal.description);
    const validator = isLockup ? lockupPool : functionCall.receiver_id;

    const infoItems = [
        {
            label: "Source Wallet",
            value: isLockup ? "Lockup" : "Wallet"
        },
        {
            label: "Amount",
            value: <Amount amount={args.amount} tokenId="near" />
        },
        {
            label: "Validator",
            value: <Link href={`https://nearblocks.io/node-explorer/${validator}`} target="_blank">{validator}</Link>
        }
    ];
    if (notes && notes !== "") {
        infoItems.push({ label: "Notes", value: notes });
    }
    return (
        <InfoDisplay items={infoItems} />
    );
}

export function extractStakingData(proposal: Proposal) {

}
