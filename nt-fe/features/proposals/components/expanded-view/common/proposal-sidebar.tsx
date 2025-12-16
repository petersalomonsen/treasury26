import { Proposal } from "@/lib/proposals-api";
import { Button } from "@/components/ui/button";
import { Check, X, Copy, ExternalLink, MoreHorizontal } from "lucide-react";
import { PageCard } from "@/components/card";

interface ProposalSidebarProps {
  proposal: Proposal;
  onApprove?: () => void;
  onReject?: () => void;
}

function TransactionStatus({ status }: { status: string }) {
  const isCompleted = status === "Approved";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full ${isCompleted ? 'bg-green-500' : 'bg-green-500'
          }`}>
          <Check className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold">Transaction created</p>
        </div>
      </div>
    </div>
  );
}

function VotingSection({ proposal }: { proposal: Proposal }) {
  const votes = proposal.votes;
  const voteCounts = proposal.vote_counts;

  // Calculate total approvals needed
  let totalApprove = 0;
  let totalRequired = 2; // Default threshold

  Object.values(voteCounts).forEach(([approve]) => {
    totalApprove += approve;
  });

  const votesArray = Object.entries(votes);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/30">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        </div>
        <div>
          <p className="text-sm font-semibold">Voting</p>
          <p className="text-xs text-muted-foreground">
            {totalApprove}/{totalRequired} approvals received
          </p>
        </div>
      </div>

      <div className="ml-3 space-y-2 border-l-2 border-muted-foreground/20 pl-6">
        {votesArray.map(([account, vote]) => {
          const initial = account.charAt(0).toUpperCase();
          const isApproved = vote === "Approve";
          const isRejected = vote === "Reject";

          return (
            <div key={account} className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {initial}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{account.split('.')[0]}</p>
                <p className="text-xs text-muted-foreground">{account}</p>
              </div>
              <span
                className={`text-xs font-medium ${isApproved
                  ? 'text-green-600'
                  : isRejected
                    ? 'text-red-600'
                    : 'text-muted-foreground'
                  }`}
              >
                {vote}d
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExecutedSection() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted-foreground/30">
          <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
        </div>
        <div>
          <p className="text-sm font-semibold">Executed</p>
        </div>
      </div>
    </div>
  );
}

export function ProposalSidebar({ proposal, onApprove, onReject }: ProposalSidebarProps) {
  const isPending = proposal.status === "InProgress";

  return (
    <PageCard className="w-full">

      {/* Status Timeline */}
      <div className="flex flex-col gap-4">
        <TransactionStatus status={proposal.status} />
        <VotingSection proposal={proposal} />
        <ExecutedSection />
      </div>

      {/* Action Buttons */}
      {isPending && (
        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onReject}
          >
            <X className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button
            className="flex-1 bg-black text-white hover:bg-black/90"
            onClick={onApprove}
          >
            <Check className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </div>
      )}
    </PageCard>
  );
}
