"use client";

import { PageCard } from "@/components/card";
import { PageComponentLayout } from "@/components/page-component-layout";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/underline-tabs";
import { useProposals } from "@/hooks/use-proposals";
import { useTreasury } from "@/stores/treasury-store";
import { ProposalStatus } from "@/lib/proposals-api";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { ProposalsTable } from "@/features/proposals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download } from "lucide-react";
import { useTreasuryPolicy } from "@/hooks/use-treasury-queries";

function ProposalsList({ status }: { status?: ProposalStatus[] }) {
  const { selectedTreasury } = useTreasury();
  const { data: policy } = useTreasuryPolicy(selectedTreasury);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = parseInt(searchParams.get("page") || "0", 10);

  const updatePage = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  const { data, isLoading, error } = useProposals(selectedTreasury, {
    statuses: status,
    page,
    page_size: 20,
    sort_by: "CreationTime",
    sort_direction: "desc",
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">Loading proposals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-destructive">Error loading proposals. Please try again.</p>
      </div>
    );
  }

  if (!data || data.proposals.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No proposals found.</p>
      </div>
    );
  }

  // Calculate total pages based on response
  const totalPages = Math.ceil(data.proposals.length / data.page_size);

  return (
    <div className="flex flex-col gap-4">
      {policy && (
        <ProposalsTable proposals={data.proposals} policy={policy} />
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button
            onClick={() => updatePage(Math.max(0, page - 1))}
            disabled={page === 0}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page + 1} of {totalPages}
          </span>
          <Button
            onClick={() => updatePage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            variant="outline"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentTab = searchParams.get("tab") || "all";

  const handleTabChange = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", value);
    params.delete("page"); // Reset page when changing tabs
    router.push(`${pathname}?${params.toString()}`);
  }, [searchParams, router, pathname]);

  return (
    <PageComponentLayout title="Requests" description="View and manage all pending multisig requests">
      <PageCard>
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <div className="flex items-center justify-between mb-4">
            <TabsList className="w-fit border-none">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="executed">Executed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search requests..."
                  className="pl-9 h-9"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <TabsContents>
            <TabsContent value="all">
              <ProposalsList />
            </TabsContent>
            <TabsContent value="pending">
              <ProposalsList status={["InProgress"]} />
            </TabsContent>
            <TabsContent value="executed">
              <ProposalsList status={["Approved"]} />
            </TabsContent>
            <TabsContent value="rejected">
              <ProposalsList status={["Rejected", "Failed"]} />
            </TabsContent>
            <TabsContent value="expired">
              <ProposalsList status={["Expired"]} />
            </TabsContent>
          </TabsContents>
        </Tabs>
      </PageCard>
    </PageComponentLayout>
  );
}
