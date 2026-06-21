"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  className,
  variant = "text",
  width,
  height,
  lines = 3,
  ...props
}: SkeletonProps) {
  const baseStyles = "animate-pulse rounded bg-gray-200 dark:bg-gray-700";

  const variants = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-lg",
    card: "rounded-xl",
  };

  if (variant === "text") {
    return (
      <div className="space-y-3" {...props}>
        {Array.from({ length: lines }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "h-4 rounded",
              i === lines - 1 ? "w-3/4" : "w-full",
              "bg-gray-200 dark:bg-gray-700 animate-pulse"
            )}
            style={{ height: "1rem" }}
          />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(baseStyles, variants[variant], className)}
      style={{ width, height }}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton variant="rectangular" className="h-48 w-full" />
      <div className="space-y-3">
        <Skeleton variant="text" lines={1} width="1/3" />
        <Skeleton variant="text" lines={2} width="2/3" />
      </div>
      <div className="flex gap-4">
        <Skeleton variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" lines={1} width="1/2" />
          <Skeleton variant="text" lines={1} width="3/4" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="space-y-3">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} variant="text" width="80%" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" width="90%" />
          ))}
        </div>
      ))}
    </div>
  );
}