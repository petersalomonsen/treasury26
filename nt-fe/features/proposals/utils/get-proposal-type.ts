import { Proposal, ProposalKind } from "@/lib/proposals-api";
import { ProposalType } from "../types";

/**
 * Determines the type of a proposal based on its kind
 */
export function getProposalType(proposal: Proposal): ProposalType {
  const kind = proposal.kind;

  if ('Transfer' in kind) {
    return 'Transfer';
  }

  if ('FunctionCall' in kind) {
    return 'FunctionCall';
  }

  if ('ChangePolicy' in kind) {
    return 'ChangePolicy';
  }

  return 'Unknown';
}
