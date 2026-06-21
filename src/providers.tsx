"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiConfig, createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "@/components/ui/Toaster";
import { ThemeProvider } from "next-themes";

const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "demo-project-id" }),
  ],
  transports: {
    [base.id]: http(),
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[base]}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiConfig>
  );
}