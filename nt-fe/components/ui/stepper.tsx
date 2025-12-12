"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepperContextValue {
  currentStep: number
  totalSteps: number
  goToStep: (step: number) => void
  nextStep: () => void
  previousStep: () => void
  isFirstStep: boolean
  isLastStep: boolean
}

const StepperContext = React.createContext<StepperContextValue | undefined>(
  undefined
)

function useStepper() {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("useStepper must be used within a Stepper")
  }
  return context
}

interface StepperProps {
  children: React.ReactNode
  initialStep?: number
  onStepChange?: (step: number) => void
}

function Stepper({ children, initialStep = 0, onStepChange }: StepperProps) {
  const [currentStep, setCurrentStep] = React.useState(initialStep)

  const steps = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === StepperStep
  )
  const totalSteps = steps.length

  const goToStep = React.useCallback(
    (step: number) => {
      if (step >= 0 && step < totalSteps) {
        setCurrentStep(step)
        onStepChange?.(step)
      }
    },
    [totalSteps, onStepChange]
  )

  const nextStep = React.useCallback(() => {
    goToStep(currentStep + 1)
  }, [currentStep, goToStep])

  const previousStep = React.useCallback(() => {
    goToStep(currentStep - 1)
  }, [currentStep, goToStep])

  const value = React.useMemo(
    () => ({
      currentStep,
      totalSteps,
      goToStep,
      nextStep,
      previousStep,
      isFirstStep: currentStep === 0,
      isLastStep: currentStep === totalSteps - 1,
    }),
    [currentStep, totalSteps, goToStep, nextStep, previousStep]
  )

  return (
    <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
  )
}

interface StepperStepProps {
  children: React.ReactNode
}

function StepperStep({ children }: StepperStepProps) {
  const { currentStep } = useStepper()
  const stepIndex = React.useContext(StepIndexContext)

  if (stepIndex !== currentStep) {
    return null
  }

  return <>{children}</>
}

const StepIndexContext = React.createContext<number>(0)

interface StepperContentProps {
  children: React.ReactNode
}

function StepperContent({ children }: StepperContentProps) {
  const steps = React.Children.toArray(children)

  return (
    <>
      {steps.map((child, index) => (
        <StepIndexContext.Provider key={index} value={index}>
          {child}
        </StepIndexContext.Provider>
      ))}
    </>
  )
}

interface StepperHeaderProps {
  children?: React.ReactNode
  className?: string
}

function StepperHeader({ children, className }: StepperHeaderProps) {
  const { currentStep, totalSteps } = useStepper()

  if (children) {
    return <div className={cn("mb-8", className)}>{children}</div>
  }

  const steps = React.Children.toArray(children)

  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-between">
        {steps.map((_, index) => (
          <React.Fragment key={index}>
            <StepIndicator step={index} />
            {index < totalSteps - 1 && <StepConnector completed={index < currentStep} />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

interface StepIndicatorProps {
  step: number
  className?: string
}

function StepIndicator({ step, className }: StepIndicatorProps) {
  const { currentStep, goToStep } = useStepper()
  const isCompleted = step < currentStep
  const isCurrent = step === currentStep

  return (
    <button
      type="button"
      onClick={() => goToStep(step)}
      className={cn(
        "flex size-10 items-center justify-center rounded-full border-2 transition-all",
        {
          "border-primary bg-primary text-primary-foreground": isCurrent,
          "border-primary bg-primary text-primary-foreground": isCompleted,
          "border-input bg-background text-muted-foreground": !isCurrent && !isCompleted,
        },
        className
      )}
    >
      {isCompleted ? <Check className="size-5" /> : step + 1}
    </button>
  )
}

interface StepConnectorProps {
  completed?: boolean
  className?: string
}

function StepConnector({ completed, className }: StepConnectorProps) {
  return (
    <div
      className={cn(
        "h-0.5 flex-1 transition-colors",
        completed ? "bg-primary" : "bg-input",
        className
      )}
    />
  )
}

interface StepperNavigationProps {
  children?: React.ReactNode
  className?: string
  backLabel?: string
  nextLabel?: string
  finishLabel?: string
  onBack?: () => void
  onNext?: () => void
  onFinish?: () => void
}

function StepperNavigation({
  children,
  className,
  backLabel = "Back",
  nextLabel = "Next",
  finishLabel = "Finish",
  onBack,
  onNext,
  onFinish,
}: StepperNavigationProps) {
  const { previousStep, nextStep, isFirstStep, isLastStep } = useStepper()

  if (children) {
    return <div className={cn("mt-8 flex gap-4", className)}>{children}</div>
  }

  return (
    <div className={cn("mt-8 flex gap-4", className)}>
      {!isFirstStep && (
        <button
          type="button"
          onClick={() => {
            previousStep()
            onBack?.()
          }}
          className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-6 text-sm font-medium shadow-xs transition-all hover:bg-accent hover:text-accent-foreground"
        >
          {backLabel}
        </button>
      )}
      <button
        type="button"
        onClick={() => {
          if (isLastStep) {
            onFinish?.()
          } else {
            nextStep()
            onNext?.()
          }
        }}
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90"
      >
        {isLastStep ? finishLabel : nextLabel}
      </button>
    </div>
  )
}

export {
  Stepper,
  StepperStep,
  StepperContent,
  StepperHeader,
  StepIndicator,
  StepConnector,
  StepperNavigation,
  useStepper,
}
