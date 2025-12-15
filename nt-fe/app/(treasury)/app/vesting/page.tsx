"use client";

import { ApprovalInfo } from "@/components/approval-info";
import { PageCard } from "@/components/card";
import { CheckboxInput } from "@/components/checkbox-input";
import { DateInput } from "@/components/date-input";
import { InfoDisplay } from "@/components/info-display";
import { InputBlock } from "@/components/input-block";
import { PageComponentLayout } from "@/components/page-component-layout";
import { RecipientInput } from "@/components/recipient-input";
import { ReviewStep, StepperHeader, StepperNextButton, StepProps, StepWizard } from "@/components/step-wizard";
import { TokenInput } from "@/components/token-input";
import { Form } from "@/components/ui/form";
import { useTokenPrice, useTreasuryPolicy } from "@/hooks/use-treasury-queries";
import { useNear } from "@/stores/near-store";
import { useTreasury } from "@/stores/treasury-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useForm, useFormContext } from "react-hook-form";
import z from "zod";

const vestingFormSchema = z.object({
  vesting: z.object({
    address: z.string().min(2, "Recipient should be at least 2 characters").max(64, "Recipient must be less than 64 characters"),
    amount: z
      .string()
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be greater than 0",
      }),
    memo: z.string().optional(),
    isRegistered: z.boolean().optional(),
    tokenSymbol: z.string().min(1, "Token symbol is required"),
    tokenAddress: z.string().min(1, "Token address is required"),
    tokenNetwork: z.string().min(1, "Token network is required"),
    tokenDecimals: z.number().min(1, "Token decimals is required"),
    tokenIcon: z.string().min(1, "Token icon is required"),
    startDate: z.date({ message: "Start date is required" }),
    endDate: z.date({ message: "End date is required" }),
    allowEarn: z.boolean().optional(),
    allowCancel: z.boolean().optional(),
  }),
  approveWithMyVote: z.boolean()
}).superRefine((data, ctx) => {
  if (data.vesting.address === data.vesting.tokenAddress) {
    ctx.addIssue({
      code: "custom",
      path: [`vesting.address`],
      message: "Recipient and token address cannot be the same",
    });
  }
  if (data.vesting.startDate >= data.vesting.endDate) {
    ctx.addIssue({
      code: "custom",
      path: [`vesting.endDate`],
      message: "Start date must be before end date",
    });
  }
});

type VestingFormValues = z.infer<typeof vestingFormSchema>;

function Step1() {
  const form = useFormContext<VestingFormValues>();
  return (
    <>
      <StepperHeader title="New Vesting Schedule" />
      <TokenInput title="Amount" control={form.control} amountName={`vesting.amount`} tokenSymbolName={`vesting.tokenSymbol`} tokenAddressName={`vesting.tokenAddress`} tokenNetworkName={`vesting.tokenNetwork`} tokenIconName={`vesting.tokenIcon`} tokenDecimalsName={`vesting.tokenDecimals`} />
      <RecipientInput control={form.control} name="vesting.address" />

      <div className="grid grid-cols-2 gap-4">
        <DateInput control={form.control} name="vesting.startDate" title="Start Date" />
        <DateInput control={form.control} name="vesting.endDate" title="End Date" />
      </div>

      <ApprovalInfo />
    </>)
}

function Step2({ handleBack }: StepProps) {
  const form = useFormContext<VestingFormValues>();
  return (
    <>
      <StepperHeader title="Advanced Settings" handleBack={handleBack} />
      <CheckboxInput
        control={form.control}
        name="vesting.allowCancel"
        title="Allow Cancellation"
        description="Allows the NEAR Foundation to cancel the lockup at any time. Non-cancellable lockups are not compatible with cliff dates."
      />
      <CheckboxInput
        control={form.control}
        name="vesting.allowEarn"
        title="Allow Earn"
        description="Allows the owner of the lockup to stake the full amount of tokens in the lockup (even before the cliff date)."
      />
      <ApprovalInfo />
    </>
  )
}

function Step3({ handleBack }: StepProps) {
  const form = useFormContext<VestingFormValues>();
  const { vesting } = form.watch()
  const { data: usdPrice } = useTokenPrice(vesting.tokenAddress, vesting.tokenNetwork);

  const estimatedUSDValue = useMemo(() => {
    if (!usdPrice?.price || !vesting.amount || isNaN(Number(vesting.amount))) {
      return 0;
    }
    return Number(vesting.amount) * usdPrice.price;
  }, [usdPrice?.price, vesting.amount]);

  return (
    <ReviewStep control={form.control} reviewingTitle="Review Your Vesting Schedule" approveWithMyVoteName="approveWithMyVote" handleBack={handleBack}>
      <div className="flex flex-col gap-6">
        <InputBlock title="" invalid={false}>
          <div className="flex flex-col gap-2 p-2 text-xs text-center justify-center items-center">
            <p>You are creating a vesting schedule for</p>
            <img src={vesting.tokenIcon} alt={vesting.tokenSymbol} className="size-10 shrink-0 rounded-full" />
            <p className="text-xl font-semibold">{vesting.amount} {vesting.tokenSymbol}</p>
            <p className="text-sm text-muted-foreground">≈ ${estimatedUSDValue.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}</p>
          </div>
        </InputBlock>
        <InfoDisplay items={[
          {
            label: "Recipient",
            value: vesting.address,
          },
          {
            label: "Start Date",
            value: format(vesting.startDate, "MM/dd/yyyy"),
          },
          {
            label: "End Date",
            value: format(vesting.endDate, "MM/dd/yyyy"),
          },
          {
            label: 'Cancelable',
            value: vesting.allowCancel ? "Yes" : "No",
          },
          {
            label: 'Allow Earn',
            value: vesting.allowEarn ? "Yes" : "No",
          }]}
        />
      </div>
    </ReviewStep>
  )
}

export default function VestingPage() {
  const { selectedTreasury } = useTreasury();
  const { signAndSendTransactions } = useNear();
  const { data: policy } = useTreasuryPolicy(selectedTreasury);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VestingFormValues>({
    resolver: zodResolver(vestingFormSchema),
    defaultValues: {
      vesting: {
        address: "",
        amount: "0",
        memo: "",
        startDate: undefined,
        endDate: undefined,
        allowCancel: false,
        allowEarn: false,
      },
      approveWithMyVote: false,
    },
  });

  const onSubmit = async (data: VestingFormValues) => {
    console.log("Vesting data", data);
  };

  return (
    <PageComponentLayout title="Vesting" description="Create vesting schedules quickly and effortlessly">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-[600px] mx-auto">
          <PageCard className="gap-3">
            <StepWizard
              steps={[
                {
                  nextButton: ({ handleNext }) => StepperNextButton({ text: "Continue" })(() => {
                    form.trigger().then((isValid) => {
                      if (isValid) {
                        return handleNext();
                      }
                    });
                  }),
                  component: Step1,
                },
                {
                  nextButton: ({ handleNext }) => StepperNextButton({ text: "Review Request" })(handleNext),
                  component: Step2,
                },
                {
                  nextButton: ({ }) => StepperNextButton({ text: "Confirm and Submit Request", loading: isSubmitting })(),
                  component: Step3,
                }
              ]}
            />
          </PageCard>
        </form>
      </Form>
    </PageComponentLayout>
  );
}
