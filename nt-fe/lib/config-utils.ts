import type { Policy, RoleKind } from "@/types/policy";

/**
 * Approval requirement result
 */
export interface ApprovalRequirement {
  /** Number of current approvals/members */
  current: number;
  /** Number of required approvals (quorum) */
  required: number;
  /** Threshold as a readable string (e.g., "1/2", "2/3") */
  threshold: string;
}

/**
 * Get the size of a role (number of members)
 * Returns 0 for Everyone and Member roles, actual count for Group roles
 */
function getRoleSize(roleKind: RoleKind): number {
  if ("Group" in roleKind) {
    return roleKind.Group.length;
  }
  return 0;
}

/**
 * Extract approval requirements from a policy
 * Calculates X out of Y approval requirement based on the policy configuration
 *
 * @param policy - The versioned policy from the treasury
 * @returns ApprovalRequirement with current members, required approvals, and threshold
 */
export function getApprovalRequirement(
  policy: Policy | null | undefined
): ApprovalRequirement {
  if (!policy) {
    return {
      current: 0,
      required: 0,
      threshold: "1/2",
    };
  }

  const votePolicy = policy.default_vote_policy;

  // Calculate total weight based on weight kind
  let totalWeight = 0;
  if (votePolicy.weight_kind === "RoleWeight") {
    // For RoleWeight, count total members across all roles
    totalWeight = policy.roles.reduce(
      (acc, role) => acc + getRoleSize(role.kind),
      0
    );
  } else {
    // For TokenWeight, we'd need actual token amounts (not available in policy alone)
    // Use quorum as total for display purposes
    totalWeight = parseInt(votePolicy.quorum);
  }

  // Calculate required approvals based on threshold
  let requiredApprovals = 0;
  const thresholdValue = votePolicy.threshold;

  if ("Ratio" in thresholdValue) {
    const [numerator, denominator] = thresholdValue.Ratio;
    requiredApprovals = Math.ceil((totalWeight * numerator) / denominator);
  } else if ("Weight" in thresholdValue) {
    requiredApprovals = parseInt(thresholdValue.Weight);
  }

  // Ensure quorum is met (minimum required)
  const quorum = parseInt(votePolicy.quorum);
  requiredApprovals = Math.max(requiredApprovals, quorum);

  // Get threshold as readable string
  const threshold = formatThreshold(votePolicy.threshold);

  return {
    current: totalWeight,
    required: requiredApprovals,
    threshold,
  };
}

/**
 * Format threshold from WeightOrRatio to readable string
 */
function formatThreshold(threshold: Policy["default_vote_policy"]["threshold"]): string {
  if ("Ratio" in threshold) {
    const [numerator, denominator] = threshold.Ratio;
    return `${numerator} of ${denominator}`;
  }

  if ("Weight" in threshold) {
    return threshold.Weight;
  }

  return "1 of 2";
}

/**
 * Check if a user has permission for a specific action in the policy
 *
 * @param policy - The versioned policy from the treasury
 * @param accountId - The user's account ID
 * @param permission - The permission string to check (e.g., "Transfer:*")
 * @returns true if the user has the permission
 */
export function hasPermission(
  policy: Policy | null | undefined,
  accountId: string,
  permission: string
): boolean {
  if (!policy) return false;

  // Check each role to see if user is in it and has the permission
  for (const role of policy.roles) {
    const isInRole = checkRoleMembership(role.kind, accountId);
    const hasPermission = role.permissions.includes(permission) ||
      role.permissions.includes("*:*");

    if (isInRole && hasPermission) {
      return true;
    }
  }

  return false;
}

/**
 * Check if an account is a member of a role
 */
function checkRoleMembership(roleKind: RoleKind, accountId: string): boolean {
  if ("Everyone" in roleKind) {
    return true;
  }

  if ("Group" in roleKind) {
    return roleKind.Group.includes(accountId);
  }

  // Member role requires token balance check - can't determine from policy alone
  return false;
}
