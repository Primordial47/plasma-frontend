"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge, PriceChange } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target, AlertTriangle, CheckCircle, XCircle, Gauge, BarChart2, Calculator, Shield, TrendingUp as TrendingUpIcon } from "lucide-react";

export interface KellyData {
  ticker: string;
  setup: string;
  session: string;
  totalSignals: number;
  winRate: number;
  avgWinR: number;
  avgLossR: number;
  kellyFraction: number;
  expectedValue: number;
  recommendation: "full_size" | "standard_size" | "reduce_size" | "inverse_or_skip";
  action: string;
  note: string;
}

interface KellyCardProps {
  data: KellyData | null;
  loading?: boolean;
  className?: string;
}

const recommendationConfig = {
  full_size: {
    label: "FULL SIZE",
    description: "High confidence - Kelly ≥ 75%",
    icon: TrendingUpIcon,
    color: "success",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    border: "border-emerald-500/30",
    text: "text-emerald-700 dark:text-emerald-400",
    action: "Trade full position",
  },
  standard_size: {
    label: "STANDARD SIZE",
    description: "Good confidence - Kelly 35-74%",
    icon: TrendingUpIcon,
    color: "info",
    bg: "bg-blue-100 dark:bg-blue-900/30",
    border: "border-blue-500/30",
    text: "text-blue-700 dark:text-blue-400",
    action: "Trade standard position",
  },
  reduce_size: {
    label: "REDUCE SIZE",
    description: "Low confidence - Kelly 10-34%",
    icon: TrendingDown,
    color: "warning",
    bg: "bg-amber-100 dark:bg-amber-900/30",
    border: "border-amber-500/30",
    text: "text-amber-700 dark:text-amber-400",
    action: "Trade reduced size",
  },
  inverse_or_skip: {
    label: "SKIP / INVERSE",
    description: "Negative EV or win rate < 50%",
    icon: XCircle,
    color: "danger",
    bg: "bg-red-100 dark:bg-red-900/30",
    border: "border-red-500/30",
    text: "text-red-700 dark:text-red-400",
    action: "Skip or trade inverse",
  },
  insufficient_data: {
    label: "INSUFFICIENT DATA",
    description: "Need ≥10 resolved signals",
    icon: AlertTriangle,
    color: "neutral",
    bg: "bg-gray-100 dark:bg-gray-800",
    border: "border-gray-300 dark:border-gray-600",
    text: "text-gray-700 dark:text-gray-300",
    action: "Wait for more data",
  },
} as const;

export function KellyRecommendationCard({
  data,
  loading,
  className,
}: KellyCardProps) {
  if (loading) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kelly Sizing</h3>
          <Skeleton variant="text" width="1/3" />
        </div>
        <CardContent>
          <Skeleton variant="rectangular" className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className={className}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kelly Sizing</h3>
        </div>
        <CardContent>
          <p className="text-gray-500 dark:text-gray-400">No data available</p>
        </CardContent>
      </Card>
    );
  }

  const rec = recommendationConfig[data.recommendation] || recommendationConfig.insufficient_data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={cn(className)}
    >
      <Card className="relative overflow-hidden">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kelly Sizing</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {data.ticker} • {data.setup} • {data.session}
            </p>
          </div>
          <Badge variant={rec.color} size="md" dot={true}>
            {rec.label}
          </Badge>
        </div>
        
        <CardContent>
          <div className="mb-4 p-4 rounded-xl" style={{ 
            backgroundColor: rec.bg.includes("emerald") ? "rgb(16 185 129 / 0.1)" :
              rec.bg.includes("blue") ? "rgb(59 130 246 / 0.1)" :
              rec.bg.includes("amber") ? "rgb(245 158 11 / 0.1)" :
              rec.bg.includes("red") ? "rgb(239 68 68 / 0.1)" :
              "rgb(107 114 128 / 0.1)",
            borderColor: rec.border.includes("emerald") ? "rgb(16 185 129 / 0.3)" :
              rec.border.includes("blue") ? "rgb(59 130 246 / 0.3)" :
              rec.border.includes("amber") ? "rgb(245 158 11 / 0.3)" :
              rec.border.includes("red") ? "rgb(239 68 68 / 0.3)" :
              "rgb(156 163 175 / 0.3)",
            borderStyle: "solid",
            borderWidth: "1px",
          }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ 
                backgroundColor: rec.color === "success" ? "rgb(16 185 129)" :
                  rec.color === "info" ? "rgb(59 130 246)" :
                  rec.color === "warning" ? "rgb(245 158 11)" :
                  rec.color === "danger" ? "rgb(239 68 68)" :
                  "rgb(107 114 128)" 
              }}>
                <rec.icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{rec.label}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Recommended Action:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{rec.action}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <StatCard
              icon={<BarChart2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />}
              label="Total Signals"
              value={data.totalSignals.toString()}
            />
            <StatCard
              icon={<TrendingUpIcon className="w-5 h-5 text-emerald-500" />}
              label="Win Rate"
              value={`${(data.winRate * 100).toFixed(1)}%`}
            />
            <StatCard
              icon={<Calculator className="w-5 h-5 text-indigo-500" />}
              label="Kelly %"
              value={`${(data.kellyFraction * 100).toFixed(1)}%`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <MetricCard
              icon={<TrendingUpIcon className="w-5 h-5 text-emerald-500" />}
              label="Avg Win"
              value={`${data.avgWinR.toFixed(1)}R`}
              color="emerald"
            />
            <MetricCard
              icon={<TrendingDown className="w-5 h-5 text-red-500" />}
              label="Avg Loss"
              value={`${data.avgLossR.toFixed(1)}R`}
              color="red"
            />
          </div>

          <div className={cn(
            "p-4 rounded-xl",
            "bg-gradient-to-r from-indigo-500/10 to-purple-500/10",
            "border border-indigo-500/20 dark:border-indigo-500/20"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-indigo-500" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Expected Value</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold tabular-nums font-mono text-indigo-600 dark:text-indigo-400">
                  {data.expectedValue.toFixed(2)}R
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">per trade</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {data.note}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold tabular-nums font-mono text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: "emerald" | "red" }) {
  const colors = {
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-400" },
    red: { bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-400" },
  };
  const c = colors[color];

  return (
    <div className={cn("p-4 rounded-xl", c.bg, "border", c.border)}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      <p className={cn("font-mono text-sm font-medium tabular-nums", c.text)}>{value}</p>
    </div>
  );
}