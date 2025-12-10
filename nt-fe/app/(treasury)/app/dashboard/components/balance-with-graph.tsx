import { WhitelistToken } from "@/lib/api";
import { useState } from "react";
import BalanceChart from "./chart";
import { Button } from "@/components/button";
import { ArrowLeftRight, ArrowUpRightIcon, Database, Download } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/select";

interface Props {
    totalBalanceUSD: number;
    tokens: WhitelistToken[];
}

const chartData = [
    { name: "Jan 1", value: 100 },
    { name: "Jan 2", value: 200 },
    { name: "Jan 3", value: 300 },
    { name: "Jan 4", value: 400 },
    { name: "Jan 5", value: 500 },
    { name: "Jan 6", value: 600 },
    { name: "Jan 7", value: 700 },
    { name: "Jan 8", value: 800 },
    { name: "Jan 9", value: 900 },
]

export default function BalanceWithGraph({ totalBalanceUSD, tokens }: Props) {
    const [selectedToken, setSelectedToken] = useState<string>("all");

    const selectedTokenData = selectedToken === "all" ? null : tokens.find(token => token.symbol === selectedToken);
    const balance = selectedTokenData ? selectedTokenData.balanceUSD : totalBalanceUSD;

    return (
        <div className="flex flex-col gap-2  rounded-lg border bg-card p-6">
            <div className="flex justify-around gap-4 mb-6">
                <div className="flex-1">
                    <h3 className="text-xs font-medium text-muted-foreground">Total Balance</h3>
                    <p className="text-3xl font-bold mt-2">{balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</p>
                </div>
                <div>
                    <Select value={selectedToken} onValueChange={setSelectedToken}>
                        <SelectTrigger size="sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tokens</SelectItem>
                            {tokens.map(token => (
                                <SelectItem key={token.symbol} value={token.symbol}>{token.symbol}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button><Download className="size-4" /> Deposit</Button>
                <Button><ArrowUpRightIcon className="size-4" /> Send</Button>
                <Button><ArrowLeftRight className="size-4" /> Exchange</Button>
                <Button><Database className="size-4" /> Earn</Button>
            </div>


            <BalanceChart data={chartData} />

        </div>
    )
}
