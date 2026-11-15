import * as React from "react";
import { cn } from "@/lib/utils";
const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={cn("flex min-h-[76px] w-full rounded-md border border-input bg-field px-3 py-2 text-base text-field-foreground placeholder:text-field-foreground/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />
));
Textarea.displayName = "Textarea";
export { Textarea };
