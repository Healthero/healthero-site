import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
const alertVariants = cva("w-full rounded-md border px-4 py-3 text-[15px]", {
  variants: { variant: { default: "border-border", warning: "border-destructive" } },
  defaultVariants: { variant: "default" },
});
const Alert = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>>(({ className, variant, ...props }, ref) => (
  <div ref={ref} role="status" className={cn(alertVariants({ variant }), className)} {...props} />
));
Alert.displayName = "Alert";
export { Alert };
