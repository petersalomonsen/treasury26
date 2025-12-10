import { AssetsTable } from "@/components/assets-table";
import { Tabs, TabsContent, TabsContents, TabsList, TabsTrigger } from "@/components/underline-tabs";
import { WhitelistToken } from "@/lib/api";

interface Props {
    tokens: WhitelistToken[];
}

export default function Assets({ tokens }: Props) {

    return (
        <div className="rounded-lg border bg-card overflow-hidden p-3">
            <Tabs>
                <TabsList>
                    <TabsTrigger value="assets">Assets</TabsTrigger>

                </TabsList>
                <TabsContents>
                    <TabsContent value="assets">
                        <AssetsTable tokens={tokens} />
                    </TabsContent>
                </TabsContents>
            </Tabs>
        </div>
    )
}
