import { adapterAbi, aggregatorRouterAbi } from "@/assets/abis";
import { __AGGREGATOR_ROUTERS__ } from "@/constants";
import { useMemo } from "react";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";

const SWAP_FEE = 99;

export function useAdapter(address: `0x${string}`) {
  const useName = () =>
    useReadContract({
      abi: adapterAbi,
      address,
      functionName: "name"
    });

  return { useName };
}

export function useAggregatorRouter() {
  const chainId = useChainId();
  const { address } = useAccount();
  const routerAddress = useMemo(() => __AGGREGATOR_ROUTERS__[chainId], [chainId]);

  const useFindBestPath = (amountIn: number, tokenIn: `0x${string}`, tokenOut: `0x${string}`, maxSteps: number = 4) =>
    useReadContract({
      abi: aggregatorRouterAbi,
      address: routerAddress as `0x${string}`,
      functionName: "findBestPath",
      args: [BigInt(amountIn), tokenIn, tokenOut, BigInt(maxSteps)]
    });

  const useBestQuery = (tokenIn: `0x${string}`, tokenOut: `0x${string}`, amountIn: number) =>
    useReadContract({
      abi: aggregatorRouterAbi,
      address: routerAddress as `0x${string}`,
      functionName: "query",
      args: [tokenIn, tokenOut, BigInt(amountIn)]
    });

  const useSwap = (
    trade: {
      amountIn: bigint;
      amountOut: bigint;
      path: readonly `0x${string}`[];
      adapters: readonly `0x${string}`[];
    },
    onSuccess?: () => any
  ) => {
    const { writeContract, isError, isSuccess, isPending, data: hash, reset, error } = useWriteContract();

    const executeSwap = () =>
      writeContract(
        {
          abi: aggregatorRouterAbi,
          address: routerAddress as `0x${string}`,
          functionName: "swap",
          args: [trade, address as `0x${string}`, BigInt(SWAP_FEE)],
          account: address
        },
        { onSuccess, onError: err => console.error(err.stack) }
      );

    return { executeSwap, isError, isSuccess, isPending, hash, reset, error };
  };

  return { useFindBestPath, useSwap, useBestQuery };
}
