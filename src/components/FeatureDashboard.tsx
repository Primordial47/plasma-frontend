"use client";

import React from "react";
import { motion } from "framer-motion";
import { SignalCard, type Signal } from "@/components/SignalCard";

const MOCK_SIGNALS: Signal[] = [
  {
    id: "1",
    ticker: "MNQM6",
    action: "SELL",
    price: 20450.5,
    strategy: "London Open ICT",
    confidence: 84,
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    ticker: "MSIL",
    action: "BUY",
    price: 875.25,
    strategy: "Q1 Expansion",
    confidence: 76,
    timestamp: new Date().toISOString(),
  },
  {
    id: "3",
    ticker: "MGC",
    action: "SELL",
    price: 2150.75,
    strategy: "London Open ICT",
    confidence: 89,
    timestamp: new Date().toISOString(),
  },
];

export default function FeatureDashboard() {
  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-white">Plasma</h1>
        <p className="text-slate-400">AHU Holdings — signal dashboard</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_SIGNALS.map((signal) => (
          <SignalCard key={signal.id} signal={signal} />
        ))}
      </div>
    </div>
  );
}
