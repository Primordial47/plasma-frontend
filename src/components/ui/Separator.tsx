"use client";

import { cn } from "@/lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
}

export function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  ...props
}: SeparatorProps) {
  return (
    <hr
      aria-orientation={orientation}
      aria-hidden={decorative}
      className={cn(
        "shrink-0 bg-gray-200 dark:bg-gray-700 border-0",
        orientation === "horizontal" ? "w-full h-px" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

export function SectionDivider({
  className,
  children,
}: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn("flex items-center gap-4", className)}>
      <hr className="flex-1 h-px bg-gray-200 dark:bg-gray-700 border-0" />
      {children && (
        <span className="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {children}
        </span>
      )}
      <hr className="flex-1 h-px bg-gray-200 dark:bg-gray-700 border-0" />
    </div>
  );
}