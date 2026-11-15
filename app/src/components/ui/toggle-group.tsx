import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";
const ToggleGroup = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root ref={ref} className={cn("inline-flex items-center gap-1", className)} {...(props as any)} />
));
ToggleGroup.displayName = "ToggleGroup";
const ToggleGroupItem = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Item>, React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item ref={ref} className={cn("min-h-9 rounded-md border border-foreground/50 px-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:opacity-45 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground", className)} {...props} />
));
ToggleGroupItem.displayName = "ToggleGroupItem";
export { ToggleGroup, ToggleGroupItem };
