import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  chainId: number | null;
  connect: (address: string, chainId: number) => void;
  disconnect: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      address: null,
      isConnected: false,
      chainId: null,
      connect: (address: string, chainId: number) =>
        set({ address, isConnected: true, chainId }),
      disconnect: () => set({ address: null, isConnected: false, chainId: null }),
    }),
    { name: "plasma-wallet" }
  )
);

export interface SessionState {
  token: string | null;
  tier: string | null;
  expiresAt: number | null;
  wallet: string | null;
  setSession: (token: string, tier: string, expiresAt: number, wallet: string) => void;
  clearSession: () => void;
  isValid: () => boolean;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      token: null,
      tier: null,
      expiresAt: null,
      wallet: null,
      setSession: (token: string, tier: string, expiresAt: number, wallet: string) =>
        set({ token, tier, expiresAt, wallet }),
      clearSession: () => set({ token: null, tier: null, expiresAt: null, wallet: null }),
      isValid: () => {
        const { token, expiresAt } = get();
        return !!token && !!expiresAt && Date.now() < expiresAt;
      },
    }),
    { name: "plasma-session" }
  )
);

const SUBSCRIPTION_TIERS = {
  plasma_monthly: {
    id: "plasma_monthly",
    name: "Plasma Monthly",
    price: 20,
    period: "month",
    features: [
      "Daily pre-London Open brief",
      "Quarterly cycle context",
      "HLP sentiment indicator",
      "Kelly sizing recommendations",
      "Historical signal archive",
      "Real-time x402 API access",
    ],
  },
} as const;

export type TierId = keyof typeof SUBSCRIPTION_TIERS;

export interface SubscriptionState {
  tier: TierId | null;
  status: "active" | "expired" | "cancelled" | null;
  currentPeriodEnd: number | null;
  fetchStatus: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  tier: null,
  status: null,
  currentPeriodEnd: null,
  fetchStatus: async () => {
    // Implementation will call /api/v1/subscription/status
    // For now, mock
    set({ tier: "plasma_monthly", status: "active", currentPeriodEnd: Date.now() + 86400000 });
  },
});

export interface HlpSentiment {
  zScore: number | null;
  signal: "retail_short_extreme" | "retail_long_extreme" | "neutral";
  lastUpdated: number | null;
  fetchSentiment: () => Promise<void>;
}

export const useHlpStore = create<HlpSentiment>((set) => ({
  zScore: null,
  signal: "neutral",
  lastUpdated: null,
  fetchSentiment: async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/hlp/sentiment`);
      const data = await res.json();
      set({ zScore: data.zScore, signal: data.signal, lastUpdated: Date.now() });
    } catch {
      // Ignore errors for now
    }
  },
});

export interface Signal {
  id: string;
  ticker: string;
  action: "buy" | "sell";
  price: number;
  strategy: string;
  session: string;
  timestamp: string;
  outcome?: "win" | "loss" | "pending";
  pnlR?: number;
  hlpZScore?: number;
  hlpSignal?: string;
}

export interface SignalsState {
  signals: Signal[];
  liveSignals: Signal[];
  fetchSignals: () => Promise<void>;
  addSignal: (signal: Signal) => void;
}

export const useSignalsStore = create<SignalsState>()(
  persist(
    (set) => ({
      signals: [],
      liveSignals: [],
      fetchSignals: async () => {
        // Fetch from API
      },
      addSignal: (signal) =>
        set((state) => ({
          liveSignals: [signal, ...state.liveSignals].slice(0, 50),
        })),
    }),
    { name: "plasma-signals" }
  )
);