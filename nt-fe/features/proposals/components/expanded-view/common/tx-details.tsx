import { PageCard } from "@/components/card";
import { InfoDisplay } from "@/components/info-display";
import { User } from "@/components/user";
import { Proposal } from "@/lib/proposals-api";
import { decodeProposalDescription, formatDate } from "@/lib/utils";
import { Policy } from "@/types/policy";

interface TxDetailsProps {
    proposal: Proposal;
    policy: Policy;
    showNote?: boolean;
}

export function TxDetails({ proposal, policy, showNote = true }: TxDetailsProps) {
    const submissionTimestamp = parseInt(proposal.submission_time) / 1000000;
    const notes = decodeProposalDescription("notes", proposal.description);

    let creatorInfo: { label: string; value: React.ReactNode }[] = [
        {
            label: "Created By",
            value: <User accountId={proposal.proposer} />
        }];

    if (notes && showNote) {
        creatorInfo.push({
            label: "Notes",
            value: notes
        });
    }

    creatorInfo.push({
        label: "Created Date",
        value: formatDate(new Date(submissionTimestamp))
    });
    creatorInfo.push({
        label: "Expires At",
        value: formatDate(new Date(submissionTimestamp + parseInt(policy.proposal_period) / 1000000))
    });

    return (
        <PageCard className="w-full">
            <InfoDisplay items={creatorInfo} />
        </PageCard>
    );
}
