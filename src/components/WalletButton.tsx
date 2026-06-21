"use client";

import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from "wagmi";
import { injected, metaMask, walletConnect } from "wagmi/connectors";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Separator } from "@/components/ui/Separator";
import { Tooltip } from "@/components/ui/Tooltip";
import { ChevronDown, ExternalLink, ScanQrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useWalletStore, useSessionStore } from "@/lib/stores";

const SUPPORTED_CHAINS = [
  { id: 8453, name: "Base", nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 }, rpcUrls: { default: { http: ["https://mainnet.base.org"] } } },
];

export function WalletButton() {
  const { address, isConnected, chainId, connect, disconnect } = useWalletStore();
  const { connect: connectWagmi, connectors } = useConnect();
  const { disconnect: disconnectWagmi } = useDisconnect();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { token, setSession, clearSession } = useSessionStore();

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLButtonElement>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (connector: any) => {
    setIsConnecting(true);
    try {
      await connectWagmi({ connector });
    } catch (error) {
      console.error("Connection failed:", error);
    } finally {
      setIsConnecting(false);
      setShowMenu(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWagmi();
    disconnect();
    clearSession();
    setShowMenu(false);
  };

  const handleSwitchChain = async (chainId: number) => {
    try {
      await switchChain({ chainId });
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  const isWrongChain = currentChainId !== 8453;

  const shortAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const connectors_list = [
    { id: "injected", name: "MetaMask", icon: "🦊", connector: injected() },
    { id: "walletConnect", name: "WalletConnect", icon: "🔗", connector: walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "" }) },
  ].filter((c) => c.id !== "walletConnect" || process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID);

  return (
    <>
      <motion.button
        ref={menuRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowMenu(!showMenu)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200",
          isConnected
            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
            : "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800",
            "flex items-center gap-2 px-4 py-2 rounded-xl"
          )}
        disabled={isConnecting}
        aria-expanded={showMenu}
        aria-haspopup="true"
      >
        {isConnected ? (
          <>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="font-medium text-sm">{shortAddress}</span>
            </span>
            <ChevronDown className="w-4 h-4" />
          </>
        ) : (
          <>
            <span className="flex items-center gap-1.5">
              <WalletIcon className="w-4 h-4" />
              <span className="font-medium text-sm">Connect Wallet</span>
            </span>
          </>
        )}
      </motion.button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-4 top-full mt-2 z-50 w-64"
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl overflow-hidden">
              {!isConnected ? (
                <>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Connect Wallet</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect to access Plasma Dashboard</p>
                  </div>
                  <div className="p-2">
                    {connectors_list.map((connector) => (
                      <motion.button
                        key={connector.id}
                        onClick={() => handleConnect(connector.connector)}
                        disabled={isConnecting}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                          "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700",
                          "hover:bg-gray-50 dark:hover:bg-gray-800",
                          "text-left"
                        )}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="text-2xl">{connector.icon}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{connector.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {shortAddress.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{shortAddress}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {isWrongChain ? "Wrong network (Base required)" : "Connected to Base"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    {isWrongChain && (
                      <motion.button
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleSwitchChain(8453)}
                        className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span>⚠️</span>
                          <span>Switch to Base Network</span>
                        </span>
                      </motion.button>
                    )}
                    <Separator />
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={handleDisconnect}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span>🚪</span>
                        <span>Disconnect</span>
                      </span>
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </>
  );
}
function WalletIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5V7a2 2 0 0 1 0-4h14a2 2 0 0 1 0 4H5v5" />
      <path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5" />
    </svg>
  );
}