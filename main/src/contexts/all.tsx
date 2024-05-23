"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config as web3Config } from "@/configs/web3.config";
import { PersistGate } from "redux-persist/integration/react";
import { RootState, persistor, store } from "@/configs/store";
import { Provider as ReduxProvider, useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { __CHAIN_IDS__ } from "@/constants";
import { loadTokenList } from "@/configs/store/slices/tokensSlice";

const queryClient = new QueryClient();

function Web3Context({ children }: { children: any }) {
  const rpc = useSelector((state: RootState) => state.wallet.rpcNode);
  const web3ConfigMOD = useMemo(() => web3Config(rpc), [rpc]);
  return (
    <WagmiProvider config={web3ConfigMOD}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

function InitTokenList({ children }: { children: any }) {
  const dispatch = useDispatch();
  useEffect(() => {
    Object.values(__CHAIN_IDS__).forEach(value => {
      dispatch(loadTokenList(value) as any);
    });
  }, [dispatch]);
  return <>{children}</>;
}

function AllContexts({ children }: { children: any }) {
  return (
    <ReduxProvider store={store}>
      <PersistGate persistor={persistor}>
        <Web3Context>
          <InitTokenList>{children}</InitTokenList>
        </Web3Context>
      </PersistGate>
    </ReduxProvider>
  );
}

export default AllContexts;
