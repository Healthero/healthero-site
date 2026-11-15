import * as React from "react";
import { cn } from "@/lib/utils";
const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => (
  <input type={type} ref={ref} className={cn("flex min-h-11 w-full rounded-md border border-input bg-field px-3 py-2 text-base text-field-foreground placeholder:text-field-foreground/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
));
Input.displayName = "Input";
export { Input };
