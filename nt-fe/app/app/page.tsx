"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNear } from "@/stores/near-store";
import { useUserTreasuries } from "@/hooks/use-treasury-queries";

export default function AppRedirect() {
  const router = useRouter();
  const { accountId } = useNear();
  const { data: treasuries = [], isLoading } = useUserTreasuries(accountId);

  useEffect(() => {
    if (!isLoading && treasuries.length > 0) {
      router.push(`/${treasuries[0].daoId}`);
    }
  }, [treasuries, isLoading, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading treasury...</p>
      </div>
    </div>
  );
}
