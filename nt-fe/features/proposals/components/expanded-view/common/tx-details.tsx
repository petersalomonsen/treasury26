import { PageCard } from "@/components/card";
import { InfoDisplay } from "@/components/info-display";
import { Proposal } from "@/lib/proposals-api";
import { formatDate } from "@/lib/utils";
import { Policy } from "@/types/policy";

interface TxDetailsProps {
    proposal: Proposal;
    policy: Policy;
}

export function TxDetails({ proposal, policy }: TxDetailsProps) {
    const submissionTimestamp = parseInt(proposal.submission_time) / 1000000;

    const creatorInfo = [
        {
            label: "Created By",
            value: (
                <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                        {proposal.proposer.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{proposal.proposer.split('.')[0]}</span>
                        <span className="text-xs text-muted-foreground">{proposal.proposer}</span>
                    </div>
                </div>
            )
        },
        {
            label: "Created Date",
            value: formatDate(new Date(submissionTimestamp))
        },
        {
            label: "Expires At",
            value: formatDate(new Date(submissionTimestamp + parseInt(policy.proposal_period) / 1000000))
        }
    ];

    return (
        <PageCard className="w-full">
            <InfoDisplay items={creatorInfo} />
        </PageCard>
    );
}
