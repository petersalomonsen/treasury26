"use client";

import { Fragment, useMemo, useState } from "react";
import { Proposal, ProposalStatus } from "@/lib/proposals-api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
import { TransactionCell } from "./transaction-cell";
import { ExpandedView } from "./expanded-view";
import { ProposalTypeIcon } from "./proposal-type-icon";
import { VotingIndicator } from "./voting-indicator";
import { Policy } from "@/types/policy";
import { formatDate } from "@/lib/utils";
import { User } from "@/components/user";
import { Checkbox } from "@/components/ui/checkbox";
import { getProposalStatus, getProposalUIKind } from "../utils/proposal-utils";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Pagination } from "@/components/pagination";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getExpandedRowModel,
  createColumnHelper,
  ExpandedState,
  getPaginationRowModel,
} from "@tanstack/react-table"

const columnHelper = createColumnHelper<Proposal>();

interface ProposalsTableProps {
  proposals: Proposal[];
  policy: Policy;
  pageIndex?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
}

function getStatusColor(status: ProposalStatus): string {
  switch (status) {
    case "Approved":
      return "bg-green-500/10 text-green-600";
    case "Rejected":
    case "Failed":
      return "bg-red-500/10 text-red-600";
    case "InProgress":
      return "bg-orange-500/10 text-orange-600";
    case "Expired":
      return "bg-gray-500/10 text-gray-600";
    default:
      return "bg-muted text-muted-foreground";
  }
}

export function ProposalsTable({
  proposals,
  policy,
  pageIndex = 0,
  pageSize = 10,
  total = 0,
  onPageChange
}: ProposalsTableProps) {
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState<ExpandedState>({});

  const columns = useMemo<ColumnDef<Proposal, any>[]>(
    () => [
      columnHelper.display({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }),
      columnHelper.accessor("id", {
        header: () => <span className="text-xs font-medium uppercase text-muted-foreground">Request</span>,
        cell: (info) => {
          const proposal = info.row.original;
          const title = getProposalUIKind(proposal);
          const date = formatDate(
            new Date(parseInt(proposal.submission_time) / 1000000)
          );
          return (
            <div className="flex items-center gap-5 max-w-[400px] truncate">
              <span className="text-sm text-muted-foreground w-6 shrink-0">
                #{proposal.id}
              </span>
              <ProposalTypeIcon proposal={proposal} />
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{title}</span>
                </div>
                <span className="text-xs text-muted-foreground">{date}</span>
              </div>
            </div>
          );
        },
      }),
      columnHelper.display({
        id: "transaction",
        header: () => <span className="text-xs font-medium uppercase text-muted-foreground">Transaction</span>,
        cell: ({ row }) => (
          <div className="max-w-[300px] truncate">
            <TransactionCell proposal={row.original} />
          </div>
        ),
      }),
      columnHelper.accessor("proposer", {
        header: () => <span className="text-xs font-medium uppercase text-muted-foreground">Requester</span>,
        cell: (info) => <User accountId={info.getValue()} />,
      }),
      columnHelper.display({
        id: "voting",
        header: () => <span className="text-xs font-medium uppercase text-muted-foreground">Voting</span>,
        cell: ({ row }) => (
          <VotingIndicator proposal={row.original} policy={policy} />
        ),
      }),
      columnHelper.accessor("status", {
        header: () => <span className="text-xs font-medium uppercase text-muted-foreground">Status</span>,
        cell: (info) => (
          <span
            className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
              info.getValue()
            )}`}
          >
            {getProposalStatus(info.row.original, policy)}
          </span>
        ),
      }),
      columnHelper.display({
        id: "expand",
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => row.toggleExpanded()}
            className="h-8 w-8 p-0"
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        ),
      }),
    ],
    [policy]
  );

  const table = useReactTable({
    data: proposals,
    columns,
    state: {
      rowSelection,
      expanded,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowId: (row) => row.id.toString(),
    manualPagination: true,
  });

  if (proposals.length === 0 && pageIndex === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No proposals found.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex flex-col gap-4">
      <ScrollArea className="grid">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow>
                    <TableCell colSpan={row.getVisibleCells().length} className="p-4 bg-background">
                      <ExpandedView proposal={row.original} policy={policy} />
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {onPageChange && (
        <Pagination
          pageIndex={pageIndex}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
