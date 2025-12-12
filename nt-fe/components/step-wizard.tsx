import { useState, } from "react";
import { Control, FieldValues, Path, } from "react-hook-form";
import { Button } from "./ui/button";
import { ArrowLeftIcon } from "lucide-react";
import { FormDescription, FormField, FormLabel } from "./ui/form";
import { Switch } from "./ui/switch";

interface Step {
    nextButton: React.ComponentType<{ handleNext: () => void }>;
    component: React.ComponentType<{ handleBack?: () => void }>;
}

interface StepWizardProps {
    steps: Step[];
}

export function StepWizard({
    steps,
}: StepWizardProps) {
    const [index, setIndex] = useState(0);

    const CurrentStep = steps[index];

    // Handle next step (validate current step)
    const handleNext = async () => {
        setIndex((i) => i + 1);
    };

    const handleBack = () => {
        setIndex((i) => i - 1);
    };

    return (
        <>
            <CurrentStep.component handleBack={index > 0 ? handleBack : undefined} />
            <CurrentStep.nextButton handleNext={handleNext} />
        </>
    );
}

interface HandleBackWithTitleProps {
    title: string;
    handleBack?: () => void;
}

export function StepperHeader({ title, handleBack }: HandleBackWithTitleProps) {
    return (
        <div className="flex items-center">
            {
                handleBack && <Button variant={'ghost'} size={'icon'} onClick={handleBack}>{<ArrowLeftIcon className="size-4" />}</Button>
            }
            <p className="text-lg font-semibold">{title}</p>
        </div>
    );
}

export const StepperNextButton = ({ text }: { text: string }) => {
    return (handleNext?: () => void) => {
        const { type, onClick } = handleNext ? { type: "button" as const, onClick: handleNext } : { type: "submit" as const, onClick: undefined };
        return <Button className="w-full h-13 font-semibold text-lg" type={type} onClick={onClick}>{text}</ Button>;
    }
};

interface ReviewStepProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    reviewingTitle: string;
    children: React.ReactNode;
    approveWithMyVoteName: Path<TFieldValues>;
    handleBack?: () => void;
}

export function ReviewStep<TFieldValues extends FieldValues = FieldValues>({ control, reviewingTitle, children, approveWithMyVoteName, handleBack }: ReviewStepProps<TFieldValues>) {
    return (
        <div className="flex flex-col gap-4">
            <StepperHeader title={reviewingTitle} handleBack={handleBack} />
            {children}

            <FormField control={control} name={approveWithMyVoteName} render={({ field }) => (
                <div className="flex items-start gap-2">
                    <Switch id="approveWithMyVote" checked={field.value} onCheckedChange={field.onChange} />
                    <div className="flex flex-col gap-1">
                        <FormLabel htmlFor="approveWithMyVote" className="font-semibold">Approve with my vote</FormLabel>
                        <FormDescription className="text-xs">This will count as the first approval for this payment request</FormDescription>
                    </div>
                </div>
            )} />
        </div>
    );
}
