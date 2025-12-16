import { Proposal } from "@/lib/proposals-api";
import { getProposalType } from "../../utils/get-proposal-type";
import { TransferExpanded } from "./transfer-expanded";
import { FunctionCallExpanded } from "./function-call-expanded";
import { ChangePolicyExpanded } from "./change-policy-expanded";
import { VestingExpanded } from "./vesting-expanded";
import { ProposalSidebar } from "./common/proposal-sidebar";
import { PageCard } from "@/components/card";
import { Button } from "@/components/button";
import { Copy, ExternalLink, MoreHorizontal } from "lucide-react";
import { TxDetails } from "./common/tx-details";
import { Policy } from "@/types/policy";

interface ExpandedViewProps {
  proposal: Proposal;
  policy: Policy;
}

// Helper to check if it's a vesting transaction
function isVestingProposal(proposal: Proposal): boolean {
  if (!('FunctionCall' in proposal.kind)) return false;
  const functionCall = proposal.kind.FunctionCall;
  const receiver = functionCall.receiver_id;
  const isLockup = receiver.includes('lockup.near') || receiver === 'lockup.near';
  const firstAction = functionCall.actions[0];
  return isLockup && firstAction?.method_name === 'create';
}

function ExpandedViewInternal({ proposal, policy }: ExpandedViewProps) {
  if (isVestingProposal(proposal)) {
    return <VestingExpanded proposal={proposal} />;
  }

  const type = getProposalType(proposal);
  switch (type) {
    case "Transfer":
      return <TransferExpanded proposal={proposal} />;
    case "FunctionCall":
      return <FunctionCallExpanded proposal={proposal} />;
    case "ChangePolicy":
      return <ChangePolicyExpanded proposal={proposal} />;
    default:
      return (
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground">Unknown proposal type</p>
        </div>
      );
  }
}

export function ExpandedView({ proposal, policy }: ExpandedViewProps) {
  const component = ExpandedViewInternal({ proposal, policy });

  return (
    <div className="flex w-full gap-4">
      <div className="flex w-full flex-col gap-4">
        <PageCard className="w-full">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Request Details</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {component}
        </PageCard>

        <TxDetails proposal={proposal} policy={policy} />
      </div>
      <div className="w-3/5">
        <ProposalSidebar proposal={proposal} />
      </div>

    </div>
  )
}
