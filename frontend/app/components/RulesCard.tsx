"use client";

import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";
import { GlassCard } from "./GlassCard";
import {
  Wallet,
  Zap,
  AlertTriangle,
  Trophy,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Wallet,
  Zap,
  AlertTriangle,
  Trophy,
};

const accentMap = {
  gold: "from-gold-500/20 to-gold-600/10 border-gold-500/20 text-gold-400",
  red: "from-red-500/20 to-red-600/10 border-red-500/20 text-red-400",
  green: "from-green-500/20 to-green-600/10 border-green-500/20 text-green-400",
};

interface RulesCardProps {
  icon: string;
  title: string;
  description: string;
  feeData?: Array<{ piece: string; cost: string }>;
  index: number;
  accent?: "gold" | "red" | "green";
}

export function RulesCard({
  icon,
  title,
  description,
  feeData,
  index,
  accent = "gold",
}: RulesCardProps) {
  const Icon = iconMap[icon] || Wallet;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{
        y: -4,
        boxShadow: "0 0 20px rgba(245, 166, 35, 0.25)",
        transition: { duration: 0.2 },
      }}
    >
      <GlassCard className="h-full" padding="lg">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center border",
              accentMap[accent]
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {description}
            </p>
            {feeData && feeData.length > 0 && (
              <ul className="mt-3 space-y-1.5 text-sm font-mono text-zinc-300">
                {feeData.map((fee, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{fee.piece}</span>
                    <span>{fee.cost}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
