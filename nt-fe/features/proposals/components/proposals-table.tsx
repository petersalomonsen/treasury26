"use client";

import { useState } from "react";
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

interface ProposalsTableProps {
  proposals: Proposal[];
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

function getStatusLabel(status: ProposalStatus): string {
  switch (status) {
    case "Approved":
      return "Executed";
    case "Rejected":
      return "Rejected";
    case "Failed":
      return "Rejected";
    case "InProgress":
      return "Pending";
    case "Expired":
      return "Expired";
    default:
      return status;
  }
}

// Extract title from description
function getProposalTitle(description: string): string {
  // Try to extract title from markdown description
  const titleMatch = description.match(/\*\s*Title:\s*([^<\n]+)/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  // Fallback to first line or truncated description
  const firstLine = description.split('\n')[0].replace(/^\*+\s*/, '').trim();
  return firstLine.length > 60 ? firstLine.substring(0, 60) + '...' : firstLine;
}

// Extract date from submission_time
function formatProposalDate(submission_time: string): string {
  const date = new Date(parseInt(submission_time) / 1000000);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  return `${month} ${day}, ${year} ${time}`;
}

export function ProposalsTable({ proposals }: ProposalsTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  const toggleRow = (id: number) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelect = (id: number) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === proposals.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(proposals.map((p) => p.id)));
    }
  };

  if (proposals.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-muted-foreground">No proposals found.</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[40px]">
            <input
              type="checkbox"
              checked={selectedRows.size === proposals.length}
              onChange={toggleSelectAll}
              className="h-4 w-4 rounded border-gray-300"
            />
          </TableHead>
          <TableHead className="w-[400px] text-xs font-medium uppercase text-muted-foreground">
            Request
          </TableHead>
          <TableHead className="text-xs font-medium uppercase text-muted-foreground">
            Transaction
          </TableHead>
          <TableHead className="text-xs font-medium uppercase text-muted-foreground">
            Requester
          </TableHead>
          <TableHead className="text-xs font-medium uppercase text-muted-foreground">
            Voting
          </TableHead>
          <TableHead className="w-[120px] text-xs font-medium uppercase text-muted-foreground">
            Status
          </TableHead>
          <TableHead className="w-[40px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {proposals.map((proposal) => {
          const isExpanded = expandedRows.has(proposal.id);
          const isSelected = selectedRows.has(proposal.id);
          const title = getProposalTitle(proposal.description);
          const date = formatProposalDate(proposal.submission_time);

          return (
            <>
              <TableRow
                key={proposal.id}
                className={`${isSelected ? 'bg-muted/30' : ''} cursor-pointer`}
              >
                <TableCell>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(proposal.id)}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-3">
                    <ProposalTypeIcon proposal={proposal} />
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">#{proposal.id}</span>
                        <span className="text-sm font-medium">{title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{date}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <TransactionCell proposal={proposal} />
                </TableCell>

                <TableCell>
                  <span className="text-sm">{proposal.proposer}</span>
                </TableCell>

                <TableCell>
                  <VotingIndicator proposal={proposal} />
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-flex px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(
                      proposal.status
                    )}`}
                  >
                    {getStatusLabel(proposal.status)}
                  </span>
                </TableCell>

                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleRow(proposal.id)}
                    className="h-8 w-8 p-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>

              {isExpanded && (
                <TableRow>
                  <TableCell colSpan={7} className="p-0 bg-muted/5">
                    <div className="px-14 py-4">
                      <ExpandedView proposal={proposal} />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}
