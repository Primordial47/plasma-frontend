"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface Signal {
  id: string;
  ticker: string;
  action: "BUY" | "SELL";
  price: number;
  strategy: string;
  confidence: number;
  timestamp: string;
}

interface SignalCardProps {
  signal: Signal;
}

export function SignalCard({ signal }: SignalCardProps) {
  const isBuy = signal.action === "BUY";
  const actionColor = isBuy ? "text-emerald-400" : "text-rose-400";
  const actionBg = isBuy ? "bg-emerald-500/10 border-emerald-500/30" : "bg-rose-500/10 border-rose-500/30";
  const confidenceColor =
    signal.confidence >= 80 ? "text-emerald-400" : signal.confidence >= 60 ? "text-amber-400" : "text-rose-400";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn("rounded-xl border p-4 transition-colors", actionBg)}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{signal.ticker}</span>
          <div className="mt-1 text-xl font-bold text-white">{signal.strategy}</div>
        </div>
        <span className={cn("rounded-md border px-2 py-1 text-xs font-bold", actionColor)}>{signal.action}</span>
      </div>

      <div className="mt-4 space-y-1 text-sm text-slate-300">
        <div className="flex justify-between">
          <span className="text-slate-400">Price</span>
          <span className="font-mono">${signal.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Confidence</span>
          <span className={cn("font-mono font-semibold", confidenceColor)}>{signal.confidence}%</span>
        </div>
      </div>

      <div className="mt-4 text-xs text-slate-500">
        {new Date(signal.timestamp).toLocaleString()}
      </div>
    </motion.div>
  );
}
