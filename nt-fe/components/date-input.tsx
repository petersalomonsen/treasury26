import { InputBlock } from "./input-block";
import { FormField, FormMessage } from "./ui/form";
import { Control, FieldValues, Path } from "react-hook-form";
import { DateTimePicker } from "./ui/datepicker";

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
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <InputBlock title={title} invalid={!!fieldState.error}>
                    <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        hideTime
                        showCalendarIcon={false}
                        placeholder="mm/dd/yyyy"

                        classNames={{
                            trigger: "border-none p-0",
                        }}
                    />
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
