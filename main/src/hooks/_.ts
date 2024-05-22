import { RootState } from "@/configs/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { createClient, http } from "viem";
import { createConfig, useChainId, useConfig } from "wagmi";
import { injected, coinbaseWallet, safe, walletConnect } from "wagmi/connectors";

const isValidUrl = (urlString: string) => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export function useMutatedConfig() {
  const chainId = useChainId();
  const config = useConfig();
  const rpc = useSelector((state: RootState) => state.wallet.rpcNode);
  return useMemo(
    () =>
      !!rpc[chainId] && isValidUrl(rpc[chainId].url)
        ? createConfig({
            chains: config.chains,
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
              return createClient({ chain, transport: http(rpc[chain.id].url) });
            }
          })
        : config,
    [chainId, config, rpc]
  );
}
