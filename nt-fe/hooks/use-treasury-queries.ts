import { useQuery } from "@tanstack/react-query";
import { getUserTreasuries, getTreasuryAssets, getTokenBalanceHistory } from "@/lib/api";

/**
 * Query hook to get user's treasuries with config data
 * Requires Near instance for blockchain queries
 */
export function useUserTreasuries(
  accountId: string | null | undefined,
) {
  return useQuery({
    queryKey: ["userTreasuries", accountId],
    queryFn: () => getUserTreasuries(accountId!),
    enabled: !!accountId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Query hook to get whitelisted tokens with balances and prices
 * Fetches from backend which aggregates data from Ref Finance and FastNear
 */
export function useWhitelistTokens(
  treasuryId: string | null | undefined,
) {
  return useQuery({
    queryKey: ["treasuryAssets", treasuryId],
    queryFn: () => getTreasuryAssets(treasuryId!),
    enabled: !!treasuryId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Query hook to get token balance history across multiple time periods
 * Fetches historical balance data from the backend
 */
export function useTokenBalanceHistory(
  accountId: string | null | undefined,
  tokenId: string | null | undefined,
) {
  return useQuery({
    queryKey: ["tokenBalanceHistory", accountId, tokenId],
    queryFn: () => getTokenBalanceHistory(accountId!, tokenId!),
    enabled: !!accountId && !!tokenId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
