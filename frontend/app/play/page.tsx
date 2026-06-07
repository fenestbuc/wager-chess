"use client";
import Link from "next/link";
import { ConnectWallet } from "../components/ConnectWallet";
import { ChessGame } from "../components/ChessGame";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function Play() {
  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-accent/30">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex items-center gap-3 hover:opacity-80 transition-all">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-raised border border-border group-hover:border-accent/50 transition-colors">
              <ChevronLeft className="h-5 w-5 text-zinc-400 group-hover:text-accent transition-colors" />
            </div>
            <h1 className="text-xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Back to Hub</h1>
          </Link>
          <ConnectWallet />
        </div>
      </header>

      <main className="flex-1 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 via-background to-background"></div>
        
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-5xl"
          >
            <ChessGame />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
