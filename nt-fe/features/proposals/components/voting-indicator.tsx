import { getApproversAndThreshold } from "@/lib/config-utils";
import { Proposal } from "@/lib/proposals-api";
import { Policy } from "@/types/policy";
import { Check } from "lucide-react";
import { UserVote } from "./user-vote";

interface VotingIndicatorProps {
  proposal: Proposal;
  policy: Policy;
}

export function VotingIndicator({ proposal, policy }: VotingIndicatorProps) {
  const { requiredVotes } = getApproversAndThreshold(policy, "", proposal.kind, false);


  const total = Object.values(proposal.votes).length

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {total} out of {requiredVotes}
      </span>
      <div className="flex -space-x-3">
        {
          Object.entries(proposal.votes).map(([account, vote]) => {
            return (
              <UserVote
                key={account}
                accountId={account}
                vote={vote}
              />
            );
          })
        }
      </div>
    </div>
  );
}
