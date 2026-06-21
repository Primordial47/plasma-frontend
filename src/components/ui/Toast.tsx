"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Loader2, X } from "lucide-react";

const ToastProvider = ToastPrimitives.Provider;
const ToastViewport = ToastPrimitives.Viewport;

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & { variant?: "default" | "success" | "error" | "loading" }
>(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
    success: "bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800",
    error: "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800",
    loading: "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800",
  };

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-xl border p-4 pr-8 shadow-lg transition-all",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[swipe=end]:animate-out data-[swipe=end]:fade-out-80",
        "data-[swipe=end]:slide-out-to-right-full",
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {variant === "loading" && (
          <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
        )}
        {variant === "success" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
        {variant === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
        {variant === "default" && <Loader2 className="h-5 w-5 text-indigo-500" />}
      </div>
      <div className="flex flex-1 flex-col gap-y-1.5">
        <ToastPrimitives.Title className="text-sm font-semibold text-gray-900 dark:text-white" />
        <ToastPrimitives.Description className="text-sm text-gray-500 dark:text-gray-400" />
      </div>
      <ToastPrimitives.Close className="absolute right-2 top-2 rounded-md p-1 text-gray-500 opacity-0 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100">
        <X className="h-4 w-4" />
      </ToastPrimitives.Close>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;
type ToastActionElement = React.ReactElement<typeof ToastAction>;

export { type ToastProps, type ToastActionElement, ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction };