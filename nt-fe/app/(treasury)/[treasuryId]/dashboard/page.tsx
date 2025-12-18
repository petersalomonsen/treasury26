"use client";

import { PageComponentLayout } from "@/components/page-component-layout";
import { useTreasury } from "@/stores/treasury-store";
import { useTreasuryAssets } from "@/hooks/use-treasury-queries";

import Assets from "./components/assets";
import BalanceWithGraph from "./components/balance-with-graph";

export default function AppPage() {
  const { selectedTreasury: accountId } = useTreasury();
  const { data } = useTreasuryAssets(accountId, { onlyPositiveBalance: true });
  const { tokens, totalBalanceUSD } = data || { tokens: [], totalBalanceUSD: 0 };

  return (
    <PageComponentLayout
      title="Dashboard"
      description="Overview of your treasury assets and activity"
    >
      <div className="flex flex-col gap-8">
        <BalanceWithGraph totalBalanceUSD={totalBalanceUSD} tokens={tokens} />

        <Assets tokens={tokens} />
      </div>
    </PageComponentLayout>
  );
}
