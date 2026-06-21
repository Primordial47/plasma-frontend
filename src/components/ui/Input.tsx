"use client";

import React, { useState } from "react";
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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        <input
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
            ` ${customClassName || ""} `,
            leftIcon ? "pl-10" : "px-4",
            rightIcon ? "pr-10" : "px-4",
            "py-3 rounded-xl"
          )}
          {...{
            ...props,
            onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
              setIsFocused(true);
              if (props.onFocus) props.onFocus(e);
            },
            onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
              setIsFocused(false);
              if (props.onBlur) props.onBlur(e);
            },
          }}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
            {rightIcon}
          </div>
        )}
        {error && (
          <div
            className="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center gap-1"
            id={`${props.id}-error`}
          >
            <span className="w-3 h-3" />
            {error}
          </div>
        )}
        {helperText && !error && (
          <div className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            {helperText}
          </div>
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
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
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
            className
          )}
          {...{
            ...props,
            onFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => {
              setIsFocused(true);
              if (props.onFocus) props.onFocus(e);
            },
            onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => {
              setIsFocused(false);
              if (props.onBlur) props.onBlur(e);
            },
          }}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${props.id}-error` : helperText ? `${props.id}-helper` : undefined}
        />
        {error && (
          <div
            className="absolute -bottom-6 left-0 text-xs text-red-500 flex items-center gap-1"
          >
            <span className="w-3 h-3" />
            {error}
          </div>
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