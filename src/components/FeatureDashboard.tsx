"use client";

import { motion } from "framer-motion";

export default function FeatureDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-40 glass border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Plasma</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">AHU Holdings</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Signals</h2>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Kelly</h2>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Ready</p>
          </div>
          <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">HLP</h2>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">Active</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
