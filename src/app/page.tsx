"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { useAccount, useChainId, useDisconnect } from "wagmi";
import { base } from "wagmi/chains";
import { WalletButton } from "@/components/WalletButton";
import { HlpSentimentCard } from "@/components/dashboard/HlpSentimentCard";
import { SignalCard } from "@/components/dashboard/SignalCard";
import { KellyRecommendationCard } from "@/components/dashboard/KellyRecommendationCard";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge, StatusIndicator, PriceChange } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { Avatar, AvatarGroup } from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";
import { useToast, toast } from "@/components/ui/Toaster";
import { 
  Menu, Moon, Sun, ChevronDown, Bell, Settings, LogOut, 
  TrendingUp, TrendingDown, Target, Zap, Shield, 
  BarChart2, Calculator, Gauge, AlertTriangle, CheckCircle,
  RefreshCw, ExternalLink, Wallet, Key, ShieldCheck, 
  Clock, Layers, Zap as ZapIcon
} from "lucide-react";
import { cn, formatTime, formatDate, formatNumber, formatPercent, getSessionStatus } from "@/lib/utils";
import { useWalletStore, useSessionStore, useHlpStore, useSignalsStore } from "@/lib/stores";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6900";

interface DashboardData {
  cycleState: any;
  signals: any[];
  kelly: any;
  hlp: any;
}

export default function DashboardPage() {
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  
  const { token, isValid, setSession, clearSession } = useSessionStore();
  const { wallet: storedWallet, connect: storeWallet } = useWalletStore();
  const { fetchSentiment, zScore, signal: hlpSignal } = useHlpStore();
  const { signals, addSignal, fetchSignals } = useSignalsStore();

  const [isLoading, setIsLoading] = useState(true);
  const [cycleState, setCycleState] = useState<any>(null);
  const [kellyData, setKellyData] = useState<any>(null);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const isWrongChain = chainId !== base.id;
  const sessionStatus = getSessionStatus();
  const isSessionValid = isValid();

  const fetchDashboardData = useCallback(async () => {
    if (!isSessionValid) return;
    
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const [cycleRes, signalsRes, kellyRes] = await Promise.allSettled([
        fetch(`${API_URL}/api/v1/cycle-state/query`, { headers }),
        fetch(`${API_URL}/api/v1/signals/historical?limit=20`, { headers }),
        fetch(`${API_URL}/api/v1/kelly/recommendation`, { headers }),
      ]);

      if (cycleRes.status === "fulfilled" && cycleRes.value.ok) {
        const data = await cycleRes.value.json();
        setCycleState(data);
      }
      if (signalsRes.status === "fulfilled" && signalsRes.value.ok) {
        const data = await signalsRes.value.json();
      }
      if (kellyRes.status === "fulfilled" && kellyRes.value.ok) {
        const data = await kellyRes.value.json();
        setKellyData(data);
      }

      fetchSentiment();
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [token, isSessionValid, fetchSentiment]);

  useEffect(() => {
    if (address && !storedWallet) {
      storeWallet(address, chainId);
    }
    if (address && token && !isSessionValid) {
      clearSession();
      toast({ title: "Session Expired", description: "Your 24-hour session has expired. Please renew.", variant: "warning" });
    }
  }, [address, chainId, token, isSessionValid, storedWallet, clearSession, toast, storeWallet]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchDashboardData]);

  const handlePaymentComplete = async (txHash: string) => {
    if (!address) return;
    try {
      const res = await fetch(`${API_URL}/api/v1/payment/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_tx: txHash, wallet: address }),
      });
      if (res.ok) {
        const data = await res.json();
        setSession(data.access_token, data.tier, data.expires_at, data.wallet);
        setSessionExpiry(data.expires_at);
        setPaymentModalOpen(false);
        toast({ title: "Access Granted", description: "24-hour dashboard access activated", variant: "success" });
        fetchDashboardData();
      } else {
        throw new Error("Verification failed");
      }
    } catch (error) {
      toast({ title: "Payment Failed", description: "Could not verify payment. Please try again.", variant: "error" });
    }
  };

  if (!isConnected || isWrongChain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md px-6"
        >
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
              <ZapIcon className="w-12 h-12 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Plasma Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Institutional-grade trading signals with Kelly sizing and HLP sentiment
            </p>
          </div>

          <div className="space-y-4">
            <WalletButton />
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm text-gray-500 dark:text-gray-400"
            >
              Connect your wallet on Base network to access the dashboard
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4 text-sm"
            >
              <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
                <ZapIcon className="w-6 h-6 mx-auto mb-2 text-indigo-500" strokeWidth={2} />
                <p className="font-medium text-gray-900 dark:text-white">Real-time Signals</p>
                <p className="text-gray-500 dark:text-gray-400">London Open SELL setups</p>
              </div>
              <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
                <Calculator className="w-6 h-6 mx-auto mb-2 text-emerald-500" strokeWidth={2} />
                <p className="font-medium text-gray-900 dark:text-white">Kelly Sizing</p>
                <p className="text-gray-500 dark:text-gray-400">Optimal position sizing</p>
              </div>
              <div className="p-4 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700">
                <Gauge className="w-6 h-6 mx-auto mb-2 text-amber-500" strokeWidth={2} />
                <p className="font-medium text-gray-900 dark:text-white">HLP Sentiment</p>
                <p className="text-gray-500 dark:text-gray-400">Institutional positioning</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isSessionValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          <Card className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Key className="w-10 h-10 text-white" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Session Required</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your 24-hour access has expired. Renew for $0.66 (≈$20/month) to continue.
            </p>
            <Button 
              onClick={() => setPaymentModalOpen(true)}
              size="lg"
              className="w-full"
              leftIcon={<Wallet className="w-5 h-5" />}
            >
              Renew Access - $0.66
            </Button>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Payment via x402 on Base mainnet
            </p>
          </Card>

          <AnimatePresence>
            {paymentModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setPaymentModalOpen(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Renew Dashboard Access</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                        <ZapIcon className="w-10 h-10 text-white" strokeWidth={2} />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        24-hour access to Plasma Dashboard with institutional signals, 
                        Kelly sizing, and HLP sentiment.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Amount</span>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">$0.66 USDC</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Network</span>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">Base Mainnet</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Duration</span>
                        <span className="font-medium">24 hours</span>
                      </div>
                    </div>
                    <Button 
                      onClick={async () => {
                        try {
                          const res = await fetch(`${API_URL}/api/v1/payment/session`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ wallet: address, tier: "plasma_monthly" }),
                          });
                          if (res.ok) {
                            const data = await res.json();
                            window.open(data.payment_url, "_blank");
                          }
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                      className="w-full"
                      size="lg"
                    >
                      Pay with Wallet
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => setPaymentModalOpen(false)}
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="sticky top-0 z-40 glass border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <ZapIcon className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Plasma</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AHU Holdings</p>
                </div>
              </motion.div>

              <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ZapIcon className="w-4 h-4" strokeWidth={2} />
                  <span>Signals</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <BarChart2 className="w-4 h-4" strokeWidth={2} />
                  <span>Performance</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Calculator className="w-4 h-4" strokeWidth={2} />
                  <span>Kelly</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-2">
                  <Gauge className="w-4 h-4" strokeWidth={2} />
                  <span>HLP</span>
                </Button>
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    sessionStatus === "london_open" && "bg-emerald-500 animate-pulse",
                    sessionStatus === "ny_open" && "bg-blue-500 animate-pulse",
                    sessionStatus === "asia" && "bg-amber-500 animate-pulse",
                    sessionStatus === "closed" && "bg-gray-400"
                  )} aria-hidden="true" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                    {sessionStatus.replace("_", " ")}
                  </span>
                </div>

                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-2 rounded-xl"
                    aria-expanded={userMenuOpen}
                    aria-haspopup="true"
                  >
                    <Avatar
                      src={null}
                      name={address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Wallet"}
                      size="sm"
                      status="online"
                    />
                    <ChevronDown className={cn("w-4 h-4 transition-transform", userMenuOpen && "rotate-180")} />
                  </Button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden z-50"
                        role="menu"
                      >
                        <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connected"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Base Mainnet</p>
                        </div>
                        <button
                          onClick={() => { setUserMenuOpen(false); setPaymentModalOpen(true); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left text-gray-700 dark:text-gray-300 transition-colors"
                          role="menuitem"
                        >
                          <Key className="w-5 h-5 text-indigo-500" />
                          <span>Renew Access ($0.66)</span>
                        </button>
                        <button
                          onClick={() => { setUserMenuOpen(false); disconnect(); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-left text-red-600 dark:text-red-400 transition-colors"
                          role="menuitem"
                        >
                          <LogOut className="w-5 h-5" />
                          <span>Disconnect</span>
                        </button>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <Button
                    onClick={() => fetchDashboardData()}
                    disabled={isLoading}
                    variant="ghost"
                    size="sm"
                    className="p-2 rounded-xl"
                    aria-label="Refresh data"
                  >
                    <RefreshCw className={cn("w-5 h-5", isLoading && "animate-spin")} />
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={lastUpdated.getTime()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  Updated {lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })} UTC
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setAutoRefresh(!autoRefresh)} className={cn("gap-2", autoRefresh && "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800")}>
                  <Zap className="w-4 h-4" />
                  <span>{autoRefresh ? "Auto" : "Manual"}</span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <HlpSentimentCard zScore={zScore} signal={hlpSignal} lastUpdated={Date.now()} />
              
              <div className="lg:col-span-2 space-y-6">
                <Card className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cycle State</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Quarterly cycle phase and session bias</p>
                      </div>
                      <Badge variant="info" size="sm" dot={true} pulse>
                        LIVE
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading && <div className="grid grid-cols-2 md:grid-cols-4 gap-4"><Skeleton variant="text" lines={2} /><Skeleton variant="text" lines={2} /><Skeleton variant="text" lines={2} /><Skeleton variant="text" lines={2} /></div>}
                    {!isLoading && cycleState && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard
                          icon={<Layers className="w-5 h-5 text-indigo-500" />}
                          label="QT Level"
                          value={cycleState.qt_level || "—"}
                          color="indigo"
                        />
                        <MetricCard
                          icon={<Target className="w-5 h-5 text-emerald-500" />}
                          label="Price Position"
                          value={cycleState.price_position || "—"}
                          color="emerald"
                        />
                        <MetricCard
                          icon={<TrendingUp className="w-5 h-5 text-blue-500" />}
                          label="TM SO"
                          value={cycleState.tmso?.toFixed(2) || "—"}
                          color="blue"
                        />
                        <MetricCard
                          icon={<Clock className="w-5 h-5 text-amber-500" />}
                          label="Session"
                          value={cycleState.session_phase || sessionStatus}
                          color="amber"
                        />
                      </div>
                    )}
                    {!isLoading && !cycleState && (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">No cycle data available</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Kelly Sizing</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Optimal position sizing recommendations</p>
                      </div>
                      <Badge variant="info" size="sm" dot>KELLY</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton variant="rectangular" className="h-32 w-full" />
                    ) : (
                      <KellyRecommendationCard data={kellyData} />
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Signals</h3>
                <Badge variant="neutral" size="sm">
                  {signals.length} signals
                </Badge>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {signals.length === 0 ? (
                  <Card className="col-span-full p-8 text-center">
                    <TrendingDown className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" strokeWidth={1.5} />
                    <p className="text-gray-500 dark:text-gray-400">No signals yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Signals appear during London Open (08:00-10:00 UTC)</p>
                  </Card>
                ) : (
                  signals.map((signal, index) => (
                    <SignalCard key={signal.id} signal={signal} index={index} />
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors = {
    indigo: { bg: "bg-indigo-50 dark:bg-indigo-900/20", border: "border-indigo-200 dark:border-indigo-800", text: "text-indigo-700 dark:text-indigo-400", iconBg: "bg-indigo-100 dark:bg-indigo-900/30" },
    emerald: { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-400", iconBg: "bg-emerald-100 dark:bg-emerald-900/30" },
    blue: { bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", text: "text-blue-700 dark:text-blue-400", iconBg: "bg-blue-100 dark:bg-blue-900/30" },
    amber: { bg: "bg-amber-50 dark:bg-amber-900/20", border: "border-amber-200 dark:border-amber-800", text: "text-amber-700 dark:text-amber-400", iconBg: "bg-amber-100 dark:bg-amber-900/30" },
  };
  const c = colors[color as keyof typeof colors] || colors.indigo;

  return (
    <div className={cn("p-4 rounded-xl", c.bg, "border", c.border)}>
      <div className="flex items-center gap-3 mb-2">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", c.iconBg)}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</p>
          <p className={cn("font-mono text-sm font-medium", c.text)}>{value}</p>
        </div>
      </div>
    </div>
  );
}