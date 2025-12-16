import { Proposal } from "@/lib/proposals-api";
import { Check, X } from "lucide-react";

interface VotingIndicatorProps {
  proposal: Proposal;
}

export function VotingIndicator({ proposal }: VotingIndicatorProps) {
  const voteCounts = proposal.vote_counts;

  // Calculate totals
  let totalApprove = 0;
  let totalReject = 0;
  let totalRequired = 0;

  Object.values(voteCounts).forEach(([approve, reject, remove]) => {
    totalApprove += approve;
    totalReject += reject;
    // Assuming threshold of 2 for demo - should come from policy
    totalRequired = 2;
  });

  const total = totalApprove + totalReject;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground">
        {totalApprove} out of {totalRequired}
      </span>
      <div className="flex items-center gap-1">
        {Array.from({ length: totalRequired }).map((_, index) => {
          if (index < totalApprove) {
            return (
              <div
                key={index}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500"
              >
                <Check className="h-3 w-3 text-white" />
              </div>
            );
          } else if (index < totalApprove + totalReject) {
            return (
              <div
                key={index}
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500"
              >
                <X className="h-3 w-3 text-white" />
              </div>
            );
          } else {
            return (
              <div
                key={index}
                className="h-5 w-5 rounded-full border-2 border-muted-foreground/30"
              />
            );
          }
        })}
      </div>
    </div>
  );
}
