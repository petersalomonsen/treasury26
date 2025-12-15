"use client";

import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { InputBlock } from "./input-block";
import { FormField, FormMessage } from "./ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Control, FieldValues, Path } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

interface DateInputProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
    title: string;
}

export function DateInput<TFieldValues extends FieldValues = FieldValues>({
    control,
    name,
    title
}: DateInputProps<TFieldValues>) {
    const [dropdown, setDropdown] =
        useState<React.ComponentProps<typeof Calendar>["captionLayout"]>("dropdown")

    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <InputBlock title={title} invalid={!!fieldState.error}>
                    <Popover>
                        <PopoverTrigger className="w-full flex items-center justify-start text-left font-normal border-none hover:bg-transparent px-0">
                            {field.value ? (
                                format(field.value, "MM/dd/yyyy")
                            ) : (
                                <span className="text-muted-foreground">mm/dd/yyyy</span>
                            )}
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout={dropdown}
                                startMonth={new Date(1900, 0)}
                                endMonth={new Date(2100, 11)}
                            />
                        </PopoverContent>
                    </Popover>
                    {fieldState.error ? (
                        <FormMessage />
                    ) : (
                        <p className="text-muted-foreground text-xs invisible">Invisible</p>
                    )}
                </InputBlock>
            )}
        />
    );
}
