import { isValidUrl } from "@/helpers/utils";
import { createClient } from "viem";
import { http, createConfig } from "wagmi";
import { bscTestnet, mainnet, berachainTestnet } from "wagmi/chains";
import { walletConnect, injected, coinbaseWallet, safe } from "wagmi/connectors";

export const config = (rpc: any) =>
  createConfig({
    chains: process.env.NETWORK === "mainnet" ? [mainnet] : [berachainTestnet, bscTestnet],
    multiInjectedProviderDiscovery: false,
    connectors: [
      injected({ target: "metaMask" }),
      coinbaseWallet({ appName: "Moniswap" }),
      safe(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
        relayUrl: "wss://relay.walletconnect.com"
      }),
      injected({
        target() {
          return {
            id: "trust",
            name: "Trust Wallet",
            provider: typeof window !== "undefined" ? (window as any).trustwallet : undefined
          };
        }
      })
    ],
    client({ chain }) {
      return createClient({
        chain,
        transport: !!rpc && !!rpc[chain.id] && isValidUrl(rpc[chain.id].url) ? http(rpc[chain.id].url) : http()
      });
    }
  });
