import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  indicator?: 'red' | 'amber' | 'yellow' | 'green' | 'blue' | string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, indicator, ...props }, ref) => {
  // Map color names to Tailwind classes
  const getIndicatorClass = (color?: string) => {
    if (!color) return 'bg-primary';
    
    switch (color) {
      case 'red': return 'bg-red-500';
      case 'amber': return 'bg-amber-500';
      case 'yellow': return 'bg-yellow-500'; 
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-500';
      default: 
        // Check if it's already a bg class
        return color.startsWith('bg-') ? color : `bg-${color}-500`;
    }
  };

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn("h-full w-full flex-1 transition-all", getIndicatorClass(indicator))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  );
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
