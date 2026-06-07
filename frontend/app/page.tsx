"use client";
import Link from "next/link";
import { ConnectWallet } from "./components/ConnectWallet";
import { motion } from "framer-motion";
import { Swords, Coins, ShieldAlert, Trophy, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent-hover shadow-[0_0_15px_rgba(245,166,35,0.3)]">
              <Swords className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">Wager Chess</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/play" className="text-sm font-medium text-zinc-300 hover:text-accent transition-colors hidden sm:block">Play Now</Link>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-4 py-24 sm:px-6 lg:px-8 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent/10 via-background to-background"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6">
              Pay Per <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-amber-300 drop-shadow-[0_0_15px_rgba(245,166,35,0.4)]">Move.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-zinc-400 mb-10">
              A hyper-financialized variant of chess deployed on the Monad testnet. Every move costs real tokens. Winner takes the entire pot.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/play" className="group flex items-center gap-2 rounded-lg bg-gradient-to-r from-accent to-accent-hover px-8 py-3.5 text-lg font-bold text-white transition-all shadow-[0_0_20px_rgba(245,166,35,0.2)] hover:shadow-[0_0_30px_rgba(245,166,35,0.4)] hover:scale-105">
                Start a Game <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#rules" className="rounded-lg bg-surface/50 backdrop-blur-md border border-border px-8 py-3.5 text-lg font-medium transition-all hover:bg-surface-raised hover:border-accent/50">
                Read the Rules
              </a>
            </div>
          </motion.div>
        </section>

        {/* Rules Section */}
        <section id="rules" className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 sm:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
            
            <h2 className="text-3xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">The Rules of Engagement</h2>
            
            <div className="grid gap-8 md:grid-cols-2">
              <div className="group rounded-2xl p-6 bg-surface/30 border border-white/5 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                    <Coins className="w-5 h-5" />
                  </div>
                  The Buy-In
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Every game requires a base wager (0.01 MON) to create or join. This forms the initial prize pot held securely in the escrow contract.
                </p>
              </div>

              <div className="group rounded-2xl p-6 bg-surface/30 border border-white/5 hover:border-accent/30 hover:bg-surface/50 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/20 text-accent group-hover:scale-110 transition-transform">
                    <Swords className="w-5 h-5" />
                  </div>
                  Dynamic Move Fees
                </h3>
                <p className="text-zinc-400 leading-relaxed mb-4">
                  Moving pieces isn't free. The more powerful the piece, the more you pay:
                </p>
                <ul className="space-y-3 text-sm">
                  <li className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="flex items-center gap-2"><span className="text-lg">♛</span> Queen</span> 
                    <span className="font-mono text-accent bg-accent/10 px-2 py-1 rounded">0.0009 MON</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="flex items-center gap-2"><span className="text-lg">♜</span> Rook</span> 
                    <span className="font-mono text-zinc-300">0.0005 MON</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-white/5 pb-2">
                    <span className="flex items-center gap-2"><span className="text-lg">♝/♞</span> Minor</span> 
                    <span className="font-mono text-zinc-300">0.0003 MON</span>
                  </li>
                  <li className="flex justify-between items-center pt-1">
                    <span className="flex items-center gap-2"><span className="text-lg">♟/♚</span> Pawn/King</span> 
                    <span className="font-mono text-zinc-500">0.0001 MON</span>
                  </li>
                </ul>
              </div>

              <div className="group rounded-2xl p-6 bg-surface/30 border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20 text-red-400 group-hover:scale-110 transition-transform">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  The Check Penalty
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  Aggression is taxed. Putting your opponent in check costs an additional <span className="text-red-400 font-mono bg-red-500/10 px-1 py-0.5 rounded">0.0005 MON</span> on top of the base piece movement fee.
                </p>
              </div>

              <div className="group rounded-2xl p-6 bg-surface/30 border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/20 text-green-400 group-hover:scale-110 transition-transform">
                    <Trophy className="w-5 h-5" />
                  </div>
                  Winner Takes All
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  The player who delivers Checkmate immediately claims the entire accumulated pot (base wagers + all move fees paid by both players). A stalemate splits the pot.
                </p>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border/50 py-8 mt-12 bg-background/80">
        <div className="mx-auto flex max-w-7xl flex-col md:flex-row items-center justify-between px-4 text-sm text-zinc-500 sm:px-6 lg:px-8">
          <p>Built on the Monad Testnet for high-throughput gaming.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <a href="https://github.com/Kubar-Labs/wager-chess" target="_blank" className="hover:text-accent transition-colors">GitHub</a>
            <a href="https://monad-foundation.notion.site/Resources-c716367594f283b1832681536dcf6d84" target="_blank" className="hover:text-accent transition-colors">Monad Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
