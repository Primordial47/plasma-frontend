"use client";

import { motion } from "framer-motion";
import { Badge, StatusIndicator } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, XCircle } from "lucide-react";

interface HlpSentimentProps {
  zScore: number | null;
  signal: "retail_short_extreme" | "retail_long_extreme" | "neutral";
  lastUpdated: number | null;
  className?: string;
}

interface SignalConfig {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  color: "success" | "danger" | "neutral";
  bg: string;
  border: string;
  text: string;
}

const signalConfig: Record<string, SignalConfig> = {
  retail_short_extreme: {
    label: "Retail Short Extreme",
    description: "HLP heavily long → Retail heavily short → Bullish for shorts",
    icon: TrendingDown,
    color: "success",
    bg: "bg-emerald-500/10 dark:bg-emerald-900/20",
    border: "border-emerald-500/30",
    text: "text-emerald-700 dark:text-emerald-400",
  },
  retail_long_extreme: {
    label: "Retail Long Extreme",
    description: "HLP heavily short → Retail heavily long → Bearish for longs",
    icon: TrendingUp,
    color: "danger",
    bg: "bg-red-500/10 dark:bg-red-900/20",
    border: "border-red-500/30",
    text: "text-red-700 dark:text-red-400",
  },
  neutral: {
    label: "Neutral",
    description: "HLP positioning within normal range",
    icon: CheckCircle,
    color: "neutral",
    bg: "bg-gray-100 dark:bg-gray-800",
    border: "border-gray-300 dark:border-gray-600",
    text: "text-gray-700 dark:text-gray-300",
  },
};

export function HlpSentimentCard({
  zScore,
  signal,
  lastUpdated,
  className,
}: HlpSentimentProps) {
  const config = signalConfig[signal] as SignalConfig;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={cn(
        "relative overflow-hidden",
        config.bg,
        config.border,
        "rounded-2xl p-6 transition-all duration-300",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              HLP Sentiment
            </h3>
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-3xl font-bold tabular-nums font-mono",
                config.text
              )}>
                {zScore !== null ? zScore.toFixed(2) : "—"}
              </span>
              <StatusIndicator status={zScore !== null ? (zScore > 2.5 || zScore < -2.5 ? "connected" : "pending") : "disconnected"} />
            </div>
          </div>
          <Badge variant={config.color} size="md" dot={true} pulse={signal !== "neutral"}>
            {config.label}
          </Badge>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{config.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className={cn("p-4 rounded-xl", config.bg, "border", config.border)}>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Z-Score</p>
            <p className="text-2xl font-bold tabular-nums font-mono" style={{ color: config.text.replace("text-", "") }}>
              {zScore !== null ? zScore.toFixed(2) : "—"}
            </p>
          </div>
          <div className={cn("p-4 rounded-xl", config.bg, "border", config.border)}>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Signal</p>
            <p className="text-sm font-medium capitalize" style={{ color: config.text.replace("text-", "") }}>
              {config.label}
            </p>
          </div>
        </div>

        {lastUpdated && (
          <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            Last updated: {new Date(lastUpdated).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC
          </p>
        )}
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
    </motion.div>
  );
}