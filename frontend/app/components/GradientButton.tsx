"use client";

import React from "react";
import { motion } from "framer-motion";
import { Loader2, type LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/app/lib/utils";

interface GradientButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: string; // lucide icon name
}

const sizeMap = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-3 text-sm",
  lg: "px-8 py-4 text-base",
};

export function GradientButton({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  className,
  icon,
}: GradientButtonProps) {
  const isDisabled = disabled || loading;

  let IconComponent: LucideIcon | null = null;
  if (icon && !loading) {
    IconComponent = (Icons as unknown as Record<string, LucideIcon>)[icon] ?? null;
  }

  const variants = {
    primary: cn(
      "bg-gradient-to-br from-gold-400 to-gold-600 text-black font-bold",
      "shadow-gold hover:shadow-gold-lg",
      "hover:scale-[1.02]",
      "rounded-xl"
    ),
    secondary: cn(
      "border border-gold-500/30 bg-transparent text-gold-400",
      "hover:bg-gold-500/10 hover:border-gold-500/50",
      "rounded-xl"
    ),
    ghost: cn(
      "bg-transparent text-zinc-300",
      "hover:bg-white/5 hover:text-white",
      "rounded-xl"
    ),
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200",
        sizeMap[size],
        variants[variant],
        isDisabled && "opacity-60 cursor-not-allowed hover:scale-100",
        className
      )}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {!loading && IconComponent && <IconComponent className="h-4 w-4" />}
      {children}
    </motion.button>
  );
}
