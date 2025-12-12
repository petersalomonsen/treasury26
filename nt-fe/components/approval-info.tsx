import { useTreasuryPolicy } from "@/hooks/use-treasury-queries";
import { useTreasury } from "@/stores/treasury-store";
import { getApprovalRequirement } from "@/lib/config-utils";
import { Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function ApprovalInfo() {
    const { selectedTreasury } = useTreasury();
    const { data: policy } = useTreasuryPolicy(selectedTreasury);

    const { threshold } = getApprovalRequirement(policy);

    return (
        <Alert>
            <Info />
            <AlertDescription className="inline-block">
                This payment will require approval from{" "}
                <span className="font-semibold">
                    {threshold}
                </span>{" "}
                treasury members before execution.
            </AlertDescription>
        </Alert>
    );
}
