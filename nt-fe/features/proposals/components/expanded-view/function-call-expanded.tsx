import { PageCard } from "@/components/card";
import { InfoDisplay, InfoItem } from "@/components/info-display";
import { User } from "@/components/user";
import { Proposal } from "@/lib/proposals-api";
import { decodeArgs, formatBalance, formatGas, formatNearAmount } from "@/lib/utils";

interface FunctionCallExpandedProps {
  proposal: Proposal;
}

export function FunctionCallExpanded({ proposal }: FunctionCallExpandedProps) {
  if (!('FunctionCall' in proposal.kind)) return null;

  const functionCall = proposal.kind.FunctionCall;
  const action = functionCall.actions[0];
  const args = decodeArgs(action.args);

  let items: InfoItem[] = [
    {
      label: "Recipient",
      value: <User accountId={functionCall.receiver_id} />
    },
    {
      label: "Method",
      value: action?.method_name
    },
    {
      label: "Gas",
      value: `${formatGas(action.gas)} TGas`
    }
  ];

  if (action?.deposit && action.deposit !== "0") {
    items.push({
      label: "Deposit",
      value: formatNearAmount(action.deposit)
    });
  }

  items.push({
    label: "Arguments",
    differentLine: true,
    value: <pre className="overflow-x-auto rounded-md bg-muted/50 p-3 text-xs">
      <code className="text-foreground/90">
        {JSON.stringify(args, null, 2)}
      </code>
    </pre>
  });


  return (
    <InfoDisplay items={items} />
  );
}
