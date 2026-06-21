"use client";

import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
  status?: "online" | "offline" | "busy" | "away";
  name?: string;
}

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-sm",
  md: "w-10 h-10 text-base",
  lg: "w-12 h-12 text-lg",
  xl: "w-16 h-16 text-xl",
};

const shapeClasses = {
  circle: "rounded-full",
  square: "rounded-xl",
};

const statusSizes = {
  xs: "w-1.5 h-1.5",
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-4 h-4",
};

const statusColors = {
  online: "bg-emerald-500",
  offline: "bg-gray-400",
  busy: "bg-red-500",
  away: "bg-amber-500",
};

export function Avatar({
  src,
  alt,
  fallback,
  size = "md",
  shape = "circle",
  status,
  name,
  className,
  ...props
}: AvatarProps) {
  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-xl";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className={cn("relative inline-flex shrink-0", className)} {...props}>
      <div
        className={cn(
          "relative overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center",
          sizeClasses[size],
          shapeClasses[shape]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-medium text-gray-600 dark:text-gray-400">
            {fallback || (name ? getInitials(name) : "?")}
          </span>
        )}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 border-2 border-white dark:border-gray-900 rounded-full",
              statusSizes[size],
              statusColors[status]
            )}
            aria-label={`${status} status`}
          />
        )}
      </div>
    </div>
  );
}

export function AvatarGroup({
  avatars,
  max = 5,
  size = "md",
  className,
}: {
  avatars: Array<{ src?: string; name: string; alt?: string }>;
  max?: number;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className={cn("flex -space-x-2", className)}>
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          alt={avatar.alt}
          size={size}
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "flex items-center justify-center bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 font-medium text-gray-600 dark:text-gray-400",
            sizeClasses[size]
          )}
          style={{ borderRadius: "50%" }}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
