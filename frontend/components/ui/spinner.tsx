"use client";

import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
};

export function Spinner({ size = "md", className, text }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-3",
    lg: "h-12 w-12 border-4",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-primary border-r-transparent",
          sizeClasses[size],
          className
        )}
      />
      {text && <p className="mt-2 text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

export function SpinnerOverlay({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "flex min-h-[200px] items-center justify-center",
        className
      )}
    >
      <Spinner {...props} />
    </div>
  );
}

export function SpinnerPage({
  className,
  text = "Cargando...",
  ...props
}: SpinnerProps) {
  return (
    <div
      className={cn(
        "flex h-[calc(100vh-200px)] items-center justify-center",
        className
      )}
    >
      <Spinner size="lg" text={text} {...props} />
    </div>
  );
}
