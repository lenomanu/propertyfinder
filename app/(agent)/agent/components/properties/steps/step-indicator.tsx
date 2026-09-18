"use client";

import { Progress } from "@/components/ui/progress";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  {
    number: 1,
    title: "Basic Details",
  },
  {
    number: 2,
    title: "Property Details",
  },
  {
    number: 3,
    title: "GPS Location",
  },
];

export default function StepIndicator({
  currentStep,
}: StepIndicatorProps) {
  const progress = ((currentStep - 1) / 2) * 100;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {steps.map((step) => {
          const active = currentStep === step.number;
          const completed = currentStep > step.number;

          return (
            <div
              key={step.number}
              className="flex flex-col items-center gap-2"
            >
              <div
                className={[
                  "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium",
                  active &&
                    "bg-primary text-primary-foreground",
                  completed &&
                    "bg-primary/15 text-primary",
                  !active &&
                    !completed &&
                    "bg-muted text-muted-foreground",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {step.number}
              </div>

              <span
                className={[
                  "hidden text-center text-xs sm:block",
                  active && "font-medium",
                  !active && "text-muted-foreground",
                ].join(" ")}
              >
                {step.title}
              </span>
            </div>
          );
        })}
      </div>

      <Progress value={progress} />
    </div>
  );
}