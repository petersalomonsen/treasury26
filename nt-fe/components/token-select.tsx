"use client";

import { useTreasury } from "@/stores/treasury-store";
import { useTreasuryAssets } from "@/hooks/use-treasury-queries";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./modal";
import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { LargeInput } from "./large-input";
import { formatBalance } from "@/lib/utils";
import { TreasuryAsset } from "@/lib/api";

interface TokenSelectProps {
    selectedToken: string | null;
    setSelectedToken: (token: TreasuryAsset) => void;
}

export default function TokenSelect({ selectedToken, setSelectedToken }: TokenSelectProps) {
    const { selectedTreasury } = useTreasury();
    const { data: { tokens = [] } = {} } = useTreasuryAssets(selectedTreasury, { onlyPositiveBalance: true });
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (tokens.length > 0 && !selectedToken) {
            setSelectedToken(tokens[0]);
        }
    }, [tokens, selectedToken]);

    const filteredTokens = tokens.filter(token =>
        token.symbol.toLowerCase().includes(search.toLowerCase()) ||
        token.name?.toLowerCase().includes(search.toLowerCase())
    );

    const selectedTokenData = tokens.find(t => t.symbol === selectedToken);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-card hover:bg-card hover:border-muted-foreground rounded-full">
                    {selectedTokenData ? (
                        <>
                            <img src={selectedTokenData.icon} alt={selectedTokenData.symbol} className="size-6 rounded-full shrink-0" />
                            <span className="font-medium">{selectedTokenData.symbol}</span>
                        </>
                    ) : (
                        <span className="text-muted-foreground">Select token</span>
                    )}
                    <ChevronDown className="size-4 text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md p-0">
                <DialogHeader>
                    <DialogTitle>Select a token</DialogTitle>
                </DialogHeader>
                <div>
                    <div className="px-6 pb-4 border-b">
                        <LargeInput search placeholder="Search name or symbol..." value={search} onChange={(e) => setSearch(e.target.value)} />
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                        {filteredTokens.map(token => (
                            <Button
                                variant="ghost"
                                key={token.symbol}
                                onClick={() => {
                                    setSelectedToken(token);
                                    setOpen(false);
                                    setSearch("");
                                }}
                                className="w-full h-20 rounded-none border-b last:border-b-0 last:rounded-b-md py-0 flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <img src={token.icon} alt={token.symbol} className="size-10 rounded-full shrink-0" />
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{token.name || token.symbol}</span>
                                        <span className="text-sm text-muted-foreground">{token.symbol}</span>
                                    </div>
                                </div>
                                <span className="text-sm text-muted-foreground">{formatBalance(token.balance, token.decimals)}</span>
                            </Button>
                        ))}
                        {filteredTokens.length === 0 && (
                            <div className="px-6 py-8 text-center text-muted-foreground">
                                No tokens found
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
