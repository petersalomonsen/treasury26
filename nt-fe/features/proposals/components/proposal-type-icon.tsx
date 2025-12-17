import { ArrowLeftRight, FileText, Shield, Send, Coins, Download, Upload, Clock, CreditCard, TerminalSquare } from "lucide-react";
import { Proposal } from "@/lib/proposals-api";
import { getProposalType } from "../utils/proposal-utils";

interface ProposalTypeIconProps {
  proposal: Proposal;
  className?: string;
}

export function ProposalTypeIcon({ proposal }: ProposalTypeIconProps) {
  const type = getProposalType(proposal);

  switch (type) {
    case "Payment Request":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg dark:bg-blue-500/10 bg-blue-500/30">
          <CreditCard className="size-5 dark:text-blue-300 text-blue-600" />
        </div>
      );
    case "Function Call":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg dark:bg-blue-500/10 bg-blue-500/30">
          <TerminalSquare className="size-5 dark:text-blue-400 text-blue-600" />
        </div>
      );
    case "Change Policy":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg dark:bg-amber-500/10 bg-amber-500/30">
          <Shield className="size-5 dark:text-amber-300 text-amber-600" />
        </div>
      );
    case "Vesting":
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg dark:bg-indigo-500/10 bg-indigo-500/30">
          <Clock className="size-5 dark:text-indigo-300 text-indigo-600" />
        </div>
      );
    default:
      return (
        <div className="flex h-8 w-8 items-center justify-center rounded-lg dark:bg-gray-500/10 bg-gray-500/30">
          <FileText className="size-5 dark:text-gray-400 text-gray-600" />
        </div>
      );
  }
}
