"use client";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config as web3Config } from "@/configs/web3.config";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "@/configs/store";
import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { __CHAIN_IDS__ } from "@/constants";
import { loadTokenList } from "@/configs/store/slices/tokensSlice";

const queryClient = new QueryClient();

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
        <WagmiProvider config={web3Config}>
          <QueryClientProvider client={queryClient}>
            <InitTokenList>{children}</InitTokenList>
          </QueryClientProvider>
        </WagmiProvider>
      </PersistGate>
    </ReduxProvider>
  );
}

export default AllContexts;
