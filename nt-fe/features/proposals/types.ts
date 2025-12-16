import { Proposal, ProposalKind } from "@/lib/proposals-api";

export type ProposalType = "Transfer" | "FunctionCall" | "ChangePolicy" | "Unknown";

export interface ProposalTypeInfo {
  type: ProposalType;
  proposal: Proposal;
}
