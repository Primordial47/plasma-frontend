"use client";

import { motion } from "framer-motion";
import { Badge, PriceChange } from "@/components/ui/Badge";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target, Flag, Clock, Circle, X, Check } from "lucide-react";

export interface SignalData {
  id: string;
  ticker: string;
  action: "buy" | "sell";
  price: number;
  strategy: string;
  session: string;
  timestamp: string;
  outcome?: "win" | "loss" | "pending";
  pnlR?: number;
  hlpZScore?: number;
  hlpSignal?: string;
  targetPrice?: number;
  stopPrice?: number;
  riskR?: number;
}

interface SignalCardProps {
  signal: SignalData;
  index?: number;
  onClick?: () => void;
}

export function SignalCard({ signal, index = 0, onClick }: SignalCardProps) {
  const isWin = signal.outcome === "win";
  const isLoss = signal.outcome === "loss";
  const isPending = signal.outcome === "pending" || !signal.outcome;
  const isSell = signal.action === "sell";

  const actionConfig = {
    buy: { color: "success", icon: TrendingUp, label: "LONG", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    sell: { color: "danger", icon: TrendingDown, label: "SHORT", bg: "bg-red-100 dark:bg-red-900/30" },
  };

  const action = actionConfig[signal.action];
  const isResolved = signal.outcome === "win" || signal.outcome === "loss";
  const pnlClass = signal.pnlR !== undefined 
    ? (signal.pnlR! >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")
    : "text-gray-500 dark:text-gray-400";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index || 0) * 0.08 }}
      onClick={onClick}
      className={cn(
        "relative group cursor-pointer transition-all duration-300",
        "bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700",
        "p-5 hover:border-indigo-500/50 dark:hover:border-indigo-500/50",
        "hover:shadow-xl hover:shadow-indigo-500/10",
        "hover:-translate-y-1 transition-all duration-300"
      )}
      onClick={onClick}
      whileHover={{ y: -4, boxShadow: "0 20px 40px -12px rgba(99, 102, 241, 0.15)" }}
    >
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Badge variant="neutral" size="sm" className="text-xs">
          {signal.session.replace("_", " ").toUpperCase()}
        </Badge>
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white",
            action.bg
          )}>
            <action.icon className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900 dark:text-white font-mono tabular-nums">
                {signal.ticker}
              </span>
              <Badge variant={action.color} size="sm">
                {action.label}
              </Badge>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
              {signal.strategy}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {signal.hlpZScore !== undefined && (
            <Tooltip content={`HLP Z-Score: ${signal.hlpZScore.toFixed(2)}`}>
              <Badge
                variant={signal.hlpZScore! > 2.5 ? "success" : signal.hlpZScore! < -2.5 ? "danger" : "neutral"}
                size="sm"
                dot={true}
                pulse={Math.abs(signal.hlpZScore!) > 2}
                className="text-xs"
              >
                HLP: {signal.hlpZScore!.toFixed(1)}
              </Badge>
            </Tooltip>
          )}
          <div className={cn(
            "text-sm font-mono tabular-nums font-medium",
            isPending ? "text-gray-500 dark:text-gray-400" : pnlClass
          )}>
            {signal.pnlR !== undefined 
              ? `${signal.pnlR >= 0 ? "+" : ""}${signal.pnlR.toFixed(1)}R`
              : "—"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className={cn("p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center", "border", "border-gray-100 dark:border-gray-700")}>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Entry</p>
          <p className="font-mono text-sm font-medium tabular-nums">{signal.price.toLocaleString()}</p>
        </div>
        {signal.stopPrice && signal.targetPrice && (
          <>
            <div className={cn("p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-center")}>
              <p className="text-xs text-red-600 dark:text-red-400 uppercase tracking-wider mb-1">Stop</p>
              <p className="font-mono text-sm font-medium text-red-600 dark:text-red-400 tabular-nums">{signal.stopPrice.toLocaleString()}</p>
            </div>
            <div className={cn("p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-center")}>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Target</p>
              <p className="font-mono text-sm font-medium text-emerald-600 dark:text-emerald-400 tabular-nums">{signal.targetPrice.toLocaleString()}</p>
            </div>
          </>
        )}
        {(!signal.stopPrice || !signal.targetPrice) && (
          <div className="col-span-3">
            <div className={cn("p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center", "border", "border-gray-100 dark:border-gray-700")}>
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Risk/Position</p>
              <p className="font-mono text-sm font-medium tabular-nums">
                {signal.riskR ? `${signal.riskR}R risk` : "—"}
              </p>
            </div>
          </div>
        )}
      </div>

      {isResolved && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isWin ? (
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
              <span className="font-medium" style={{ color: isWin ? "inherit" : "inherit" }}>
                {isWin ? "WIN" : "LOSS"}
              </span>
            </div>
            <PriceChange change={signal.pnlR || 0} prefix="" />
          </div>
        </motion.div>
      )}

      <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/5 to-purple-500/10 rounded-full blur-2xl -translate-x-1/4 translate-y-1/4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.article>
  );
}