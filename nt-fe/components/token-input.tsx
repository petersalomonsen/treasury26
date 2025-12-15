"use client";

import { Dispatch, SetStateAction, useMemo } from "react";
import { Button } from "./ui/button";
import { useTokenBalance, useTokenPrice } from "@/hooks/use-treasury-queries";
import { useTreasury } from "@/stores/treasury-store";
import { cn, formatBalance } from "@/lib/utils";
import TokenSelect from "./token-select";
import { LargeInput } from "./large-input";
import { InputBlock } from "./input-block";
import { FormField, FormMessage } from "./ui/form";
import { Control, FieldValues, Path, PathValue, useFormContext, useWatch } from "react-hook-form";

interface TokenInputProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    amountName: Path<TFieldValues>;
    tokenSymbolName: Path<TFieldValues>;
    tokenAddressName: Path<TFieldValues>;
    tokenNetworkName: Path<TFieldValues>;
    tokenIconName: Path<TFieldValues>;
    tokenDecimalsName: Path<TFieldValues>;
}

export function TokenInput<TFieldValues extends FieldValues = FieldValues>({ control, amountName, tokenSymbolName, tokenAddressName, tokenNetworkName, tokenIconName, tokenDecimalsName }: TokenInputProps<TFieldValues>) {
    const { selectedTreasury } = useTreasury();
    const { setValue } = useFormContext<TFieldValues>();
    const amount = useWatch({ control, name: amountName });

    const tokenSymbol = useWatch({ control, name: tokenSymbolName });
    const tokenAddress = useWatch({ control, name: tokenAddressName });
    const tokenNetwork = useWatch({ control, name: tokenNetworkName });

    const { data: tokenBalanceData, isLoading: isBalanceLoading } = useTokenBalance(selectedTreasury, tokenAddress, tokenNetwork);
    const { data: tokenPriceData, isLoading: isPriceLoading } = useTokenPrice(tokenAddress, tokenNetwork);

    const estimatedUSDValue = useMemo(() => {
        if (!tokenPriceData?.price || !amount || isNaN(amount) || amount <= 0) {
            return null;
        }
        return amount * tokenPriceData.price;
    }, [amount, tokenPriceData?.price]);

    return (
        <FormField
            control={control}
            name={amountName}
            render={({ field, fieldState }) => (
                <InputBlock title="Send" invalid={!!fieldState.error} topRightContent={
                    <div className="flex items-center gap-2">
                        {tokenBalanceData?.balance && !isBalanceLoading && (
                            <>
                                <p className="text-xs text-muted-foreground">
                                    Balance: {formatBalance(tokenBalanceData.balance, tokenBalanceData.decimals)} {tokenSymbol.toUpperCase()}
                                </p>
                                <Button type="button" variant="secondary" size="sm" onClick={() => {
                                    setValue(amountName, formatBalance(tokenBalanceData.balance, tokenBalanceData.decimals) as PathValue<TFieldValues, Path<TFieldValues>>);
                                }}>MAX</Button>
                            </>
                        )}
                    </div>
                } >

                    <>
                        <div className="flex justify-between items-center">
                            <div className="flex-1">
                                <LargeInput type="number" borderless {...field} placeholder="0" className="text-3xl!" />
                            </div>
                            <FormField
                                control={control}
                                name={tokenSymbolName}
                                render={({ field }) => (
                                    <TokenSelect selectedToken={field.value} setSelectedToken={(token) => {
                                        field.onChange(token.symbol);
                                        setValue(tokenAddressName, token.id as PathValue<TFieldValues, Path<TFieldValues>>);
                                        setValue(tokenNetworkName, token.network as PathValue<TFieldValues, Path<TFieldValues>>);
                                        setValue(tokenIconName, token.icon as PathValue<TFieldValues, Path<TFieldValues>>);
                                        setValue(tokenDecimalsName, token.decimals as PathValue<TFieldValues, Path<TFieldValues>>);
                                    }} />
                                )}
                            />
                        </div>
                        <p className={cn("text-muted-foreground text-xs invisible", estimatedUSDValue !== null && estimatedUSDValue > 0 && "visible")}>
                            {!isPriceLoading && estimatedUSDValue !== null && estimatedUSDValue > 0
                                ? `≈ $${estimatedUSDValue.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                })}`
                                : isPriceLoading
                                    ? 'Loading price...'
                                    : 'Invisible'}
                        </p>
                        {fieldState.error ? <FormMessage /> : <p className="text-muted-foreground text-xs invisible">Invisible</p>}
                    </>
                </InputBlock>
            )}
        />
    );
}

