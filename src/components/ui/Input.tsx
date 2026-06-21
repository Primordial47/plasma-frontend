"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  className,
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className: customClassName,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {props.leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {props.leftIcon}
          </div>
        )}
        <motion.input
          ref={props.ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            `
              w-full text-gray-900 dark:text-white bg-white dark:bg-gray-900
              border rounded-xl transition-all duration-200
              placeholder:text-gray-400 dark:placeholder-gray-500
              disabled:opacity-50 disabled:cursor-not-allowed
            `,
            error ? "border-red-500 focus:ring-red-500" : 
              isFocused ? "border-indigo-500 ring-2 ring-indigo-500/20" : 
              "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
            ` ${props.className || ""} `,
            props.leftIcon ? "pl-10" : "px-4",
            props.rightIcon ? "pr-10" : "px-4",
            "py-3 rounded-xl"
          )}
          {...props}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
        />
        {props.rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {props.rightIcon}
          </div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center gap-1"
            id={`${props.id}-error`}
          >
            <span className="w-3 h-3" />
            {error}
          </motion.div>
        )}
        {helperText && !error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-0 text-xs text-gray-500 dark:text-gray-400"
            id={`${props.id}-helper`}
          >
            {helperText}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function Textarea({
  className,
  label,
  error,
  helperText,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  error?: string;
  helperText?: string;
}) {
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <motion.textarea
          ref={props.ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            `
              w-full text-gray-900 dark:text-white bg-white dark:bg-gray-900
              border rounded-xl transition-all duration-200 resize-y min-h-[100px]
              placeholder:text-gray-400 dark:placeholder-gray-500
              disabled:opacity-50 disabled:cursor-not-allowed
            `,
            error ? "border-red-500 focus:ring-2 focus:ring-red-500/20" :
              isFocused ? "border-indigo-500 ring-2 ring-indigo-500/20" :
              "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
            "px-4 py-3 rounded-xl",
            props.className
          )}
          {...props}
          onFocus={(e) => { setIsFocused(true); props.onFocus?.(e); }}
          onBlur={(e) => { setIsFocused(false); props.onBlur?.(e); }}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
        />
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center gap-1"
          >
            <span className="w-3 h-3" />
            {error}
          </motion.div>
        )}
        {helperText && !error && (
          <div className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{helperText}</div>
        )}
      </div>
    </div>
  );
}

export function Label({
  className,
  children,
  required = false,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label className={cn("block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5", className)} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
    </label>
  );
}