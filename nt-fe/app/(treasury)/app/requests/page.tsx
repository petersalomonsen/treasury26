import { PageCard } from "@/components/card";
import { PageComponentLayout } from "@/components/page-component-layout";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/underline-tabs";

export default function RequestsPage() {
  return (
    <PageComponentLayout title="Requests" description="View and manage all pending multisig requests">
      <PageCard>
        <Tabs>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="executed">Executed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>

          </TabsList>
          <TabsContents>
            <TabsContent value="all">
              All
            </TabsContent>
          </TabsContents>
        </Tabs>
      </PageCard>
    </PageComponentLayout>
  );
}
