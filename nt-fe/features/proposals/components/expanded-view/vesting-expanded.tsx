import { Proposal } from "@/lib/proposals-api";
import { InfoDisplay, InfoItem } from "@/components/info-display";
import { decodeArgs, formatDate, decodeProposalDescription } from "@/lib/utils";
import { LOCKUP_NO_WHITELIST_ACCOUNT_ID } from "@/constants/config";
import { Amount } from "../amount";
import { User } from "@/components/user";

interface VestingExpandedProps {
  proposal: Proposal;
}

export function VestingExpanded({ proposal }: VestingExpandedProps) {
  if (!('FunctionCall' in proposal.kind)) return null;
  const functionCall = proposal.kind.FunctionCall;
  const receiver = functionCall.receiver_id;

  // Check if this is a vesting transaction (create on lockup.near)
  const isVesting = receiver.endsWith('lockup.near');
  if (!isVesting) return null;

  const firstAction = functionCall.actions[0];
  if (!firstAction || firstAction.method_name !== 'create') return null;

  const args = decodeArgs(firstAction.args);
  if (!args) return null;

  const vestingSchedule = args.vesting_schedule?.VestingSchedule;
  const whitelistAccountId = args.whitelist_account_id;
  const foundationAccountId = args.foundation_account_id;
  const recipient = args.owner_account_id;

  const infoItems: InfoItem[] = [
    { label: "Recipient", value: <User accountId={recipient || ""} /> },
    {
      label: "Amount",
      value: <Amount amount={firstAction.deposit} tokenId="near" />
    },
  ];

  if (vestingSchedule) {
    infoItems.push(
      { label: "Start Date", value: formatDate(parseInt(vestingSchedule.start_timestamp) / 1000000) },
      { label: "End Date", value: formatDate(parseInt(vestingSchedule.end_timestamp) / 1000000) },
      { label: "Cliff Date", value: formatDate(parseInt(vestingSchedule.cliff_timestamp) / 1000000) }
    );
  }

  infoItems.push(
    { label: "Allow Cancellation", value: foundationAccountId ? "Yes" : "No" },
    { label: "Allow Staking", value: whitelistAccountId === LOCKUP_NO_WHITELIST_ACCOUNT_ID ? "No" : "Yes" }
  );

  const notes = decodeProposalDescription("notes", proposal.description);
  if (notes && notes !== "") {
    infoItems.push({ label: "Notes", value: notes });
  }

  return (
    <InfoDisplay items={infoItems} />
  );
}
