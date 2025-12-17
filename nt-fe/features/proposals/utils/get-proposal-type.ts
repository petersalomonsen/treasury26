import { getKindFromProposal } from "@/lib/config-utils";
import { Proposal } from "@/lib/proposals-api";

// Helper to check if it's a vesting transaction
function isVestingProposal(proposal: Proposal): boolean {
    if (!('FunctionCall' in proposal.kind)) return false;
    const functionCall = proposal.kind.FunctionCall;
    const receiver = functionCall.receiver_id;
    const isLockup = receiver.includes('lockup.near') || receiver === 'lockup.near';
    const firstAction = functionCall.actions[0];
    return isLockup && firstAction?.method_name === 'create';
}

export function getProposalType(proposal: Proposal) {
    const proposalType = getKindFromProposal(proposal.kind);
    switch (proposalType) {
        case "transfer":
            return "Payment Request";
        case "call":
            if (isVestingProposal(proposal)) {
                return "Vesting";
            }
            return "Function Call";
        case "policy":
            return "Change Policy";
        default:
            return "Unknown";
    }
}
