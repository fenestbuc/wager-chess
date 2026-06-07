"use client";

import { cn } from "@/app/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverGlow?: boolean;
  border?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8 sm:p-12",
};

export function GlassCard({
  children,
  className,
  hoverGlow = false,
  border = true,
  padding = "md",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-surface/60 backdrop-blur-xl backdrop-saturate-150",
        border && "border border-white/[0.06]",
        hoverGlow &&
          "hover:shadow-[0_0_30px_rgba(245,166,35,0.15)] hover:border-gold-500/30 transition-all duration-300",
        paddingMap[padding],
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
