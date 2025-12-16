import { Proposal } from "@/lib/proposals-api";
import { InfoDisplay } from "@/components/info-display";
import { formatNearAmount, decodeArgs, formatDate } from "@/lib/utils";

interface VestingExpandedProps {
  proposal: Proposal;
}

export function VestingExpanded({ proposal }: VestingExpandedProps) {
  if (!('FunctionCall' in proposal.kind)) return null;

  const functionCall = proposal.kind.FunctionCall;
  const receiver = functionCall.receiver_id;

  // Check if this is a vesting transaction (create on lockup.near)
  const isVesting = receiver.includes('lockup.near') || receiver === 'lockup.near';
  if (!isVesting) return null;

  const firstAction = functionCall.actions[0];
  if (!firstAction || firstAction.method_name !== 'create') return null;

  const args = decodeArgs(firstAction.args);
  if (!args) return null;

  const vestingSchedule = args.vesting_schedule?.VestingSchedule;
  const recipient = args.owner_account_id;
  const amount = firstAction.deposit;
  const lockupDuration = args.lockup_duration;

  // Prepare info items
  const sourceWalletLabel = proposal.status === "Approved" ? "Cross-chain Wallet" : "Source Wallet";

  const infoItems = [
    { label: sourceWalletLabel, value: sourceWalletLabel },
    { label: "Recipient", value: recipient || "N/A" },
    {
      label: "Amount",
      value: (
        <div className="flex items-center gap-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500">
            <span className="text-[10px] text-white font-bold">N</span>
          </div>
          <span>{formatNearAmount(amount)} NEAR</span>
          <span className="text-muted-foreground">($2,130.00)</span>
        </div>
      )
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
    { label: "Allow Cancellation", value: lockupDuration === "0" ? "Yes" : "No" },
    { label: "Allow Staking", value: "No" }
  );

  return (
    <InfoDisplay items={infoItems} />
  );
}
