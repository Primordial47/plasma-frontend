"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md" | "lg";
  dot?: boolean;
  pulse?: boolean;
}

export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  pulse = false,
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    neutral: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-sm gap-1.5",
    lg: "px-3 py-1.5 text-base gap-2",
  };

  return (
    <div
      className={`inline-flex items-center gap-1 font-medium rounded-full ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
          {dot && (
            <motion.span
              className={cn("w-1.5 h-1.5 rounded-full bg-current", pulse && "animate-pulse")}
              aria-hidden="true"
            />
          )}
          <span>{children}</span>
        </div>
      );
    }
export function StatusIndicator({
  status,
  label,
  size = "md",
}: {
  status: "connected" | "disconnected" | "pending" | "error";
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const statusConfig = {
    connected: { variant: "success" as const, dot: true, pulse: true, text: "Connected" },
    disconnected: { variant: "neutral" as const, dot: true, pulse: false, text: "Disconnected" },
    pending: { variant: "warning" as const, dot: true, pulse: true, text: "Connecting..." },
    error: { variant: "danger" as const, dot: true, pulse: false, text: "Error" },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} size={size} dot={config.dot} pulse={config.pulse ?? false}>
      {label || config.text}
    </Badge>
  );
}

export function PriceChange({ change, prefix = "" }: { change: number; prefix?: string }) {
  const isPositive = change >= 0;
  return (
    <Badge
      variant={isPositive ? "success" : "danger"}
      size="sm"
      className="font-mono"
    >
      {isPositive ? "+" : ""}{prefix}{change.toFixed(2)}%
    </Badge>
  );
}