import { useQuery } from "@tanstack/react-query";
import { getProposals, ProposalFilters, getProposal } from "@/lib/proposals-api";

/**
 * Query hook to get proposals for a specific DAO with optional filtering
 * Fetches from Sputnik DAO API with support for pagination, sorting, and various filters
 *
 * @param daoId - The DAO account ID to fetch proposals for
 * @param filters - Optional filters for proposals (status, search, types, pagination, etc.)
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { data, isLoading } = useProposals("example.sputnik-dao.near");
 *
 * // With filters
 * const { data } = useProposals("example.sputnik-dao.near", {
 *   statuses: ["InProgress", "Approved"],
 *   page: 0,
 *   page_size: 20,
 *   sort_by: "CreationTime",
 *   sort_direction: "desc"
 * });
 *
 * // With search and type filters
 * const { data } = useProposals("example.sputnik-dao.near", {
 *   search: "funding",
 *   proposal_types: ["Transfer", "FunctionCall"],
 *   proposers: ["alice.near"]
 * });
 * ```
 */
export function useProposals(
  daoId: string | null | undefined,
  filters?: ProposalFilters
) {
  return useQuery({
    queryKey: ["proposals", daoId, filters],
    queryFn: () => getProposals(daoId!, filters),
    enabled: !!daoId,
    staleTime: 1000 * 60 * 2, // 2 minutes (proposals can change frequently)
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
}

export function useProposal(daoId: string | null | undefined, proposalId: string | null | undefined) {
  return useQuery({
    queryKey: ["proposal", daoId, proposalId],
    queryFn: () => getProposal(daoId!, proposalId!),
    enabled: !!daoId && !!proposalId,
    staleTime: 1000 * 60 * 2, // 2 minutes (proposals can change frequently)
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });
}
