import { Proposal } from "@/lib/proposals-api";

interface ChangePolicyCellProps {
  proposal: Proposal;
}

export function ChangePolicyCell({ proposal }: ChangePolicyCellProps) {
  if (!('ChangePolicy' in proposal.kind)) return null;

  const policy = proposal.kind.ChangePolicy.policy;
  const rolesCount = policy.roles.length;

  return (
    <div className="flex flex-col gap-1">
      <span className="font-medium">Policy Update</span>
      <span className="text-xs text-muted-foreground">
        {rolesCount} role{rolesCount !== 1 ? 's' : ''} configured
      </span>
    </div>
  );
}
