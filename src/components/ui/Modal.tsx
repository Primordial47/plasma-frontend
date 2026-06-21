"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showClose?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "md",
  showClose = true,
}: ModalProps) {
  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={`
              fixed inset-0 z-50 flex items-center justify-center p-4
              ${size === "full" ? "m-4" : ""}
            `}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
          >
            <div className={`relative w-full ${[
              "sm:max-w-sm",
              "md:max-w-md",
              "lg:max-w-lg",
              "xl:max-w-xl",
              "full:max-w-4xl",
            ].join(" ")} bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden`}>
              {(title || showClose) && (
                <div className="flex items-start justify-between p-6 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    {title && <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>}
                    {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
                  </div>
                  {showClose && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </motion.button>
                  )}
                </div>
              )}
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}