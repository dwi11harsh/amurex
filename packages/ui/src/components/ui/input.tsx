import * as React from "react";

import { cn } from "@repo/ui/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        `w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${className}`,
        className,
      )}
      {...props}
    />
  );
}

export { Input };
