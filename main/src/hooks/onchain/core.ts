import { poolFactoryAbi, protocolRouterAbi } from "@/assets/abis";
import { RootState } from "@/configs/store";
import { __POOL_FACTORIES__, __PROTOCOL_ROUTERS__, __WRAPPED_ETHER__ } from "@/constants";
import { mul } from "@/helpers/math";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useAccount, useChainId, useReadContract, useWriteContract } from "wagmi";

export function useProtocolCore() {
  const chainId = useChainId();
  const { address } = useAccount();
  const routerAddress = useMemo(() => __PROTOCOL_ROUTERS__[chainId], [chainId]);
  const factoryAddress = useMemo(() => __POOL_FACTORIES__[chainId], [chainId]);
  const deadline = useSelector((state: RootState) => state.wallet.executionDeadlineInMinutes);

  const useQuoteAddLiquidity = (
    token0: `0x${string}`,
    token1: `0x${string}`,
    stable: boolean,
    amount0Desired: number,
    amount1Desired: number
  ) =>
    useReadContract({
      abi: protocolRouterAbi,
      address: routerAddress as `0x${string}`,
      functionName: "quoteAddLiquidity",
      args: [token0, token1, stable, factoryAddress as any, BigInt(amount0Desired), BigInt(amount1Desired)]
    });

  const useQuoteRemoveLiquidity = (token0: `0x${string}`, token1: `0x${string}`, stable: boolean, liquidity: number) =>
    useReadContract({
      abi: protocolRouterAbi,
      address: routerAddress as `0x${string}`,
      functionName: "quoteRemoveLiquidity",
      args: [token0, token1, stable, factoryAddress as any, BigInt(liquidity)]
    });

  const useGetPool = (token0: `0x${string}`, token1: `0x${string}`, stable: boolean) =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "getPool",
      args: [token0, token1, stable]
    });

  const useAddLiquidity = (
    token0: `0x${string}`,
    token1: `0x${string}`,
    stable: boolean,
    amount0Desired: number,
    amount1Desired: number
  ) => {
    const { writeContract, isError, isSuccess, isPending, data: hash, reset, error } = useWriteContract();
    const isETH = useMemo(
      () =>
        token0.toLowerCase() === __WRAPPED_ETHER__[chainId].toLowerCase() ||
        token1.toLowerCase() === __WRAPPED_ETHER__[chainId].toLowerCase(),
      [token0, token1]
    );
    const nonETHToken = useMemo(
      () => (isETH ? (token0.toLowerCase() !== __WRAPPED_ETHER__[chainId].toLowerCase() ? token0 : token1) : undefined),
      [isETH, token0, token1]
    );

    const executeAddLiquidity = () =>
      writeContract({
        abi: protocolRouterAbi,
        address: routerAddress as `0x${string}`,
        functionName: isETH ? "addLiquidityETH" : "addLiquidity",
        args: isETH
          ? [
              nonETHToken as `0x${string}`,
              stable,
              nonETHToken === token0 ? BigInt(amount0Desired) : BigInt(amount1Desired),
              BigInt(0),
              BigInt(0),
              address as `0x${string}`,
              BigInt(mul(deadline, 60000))
            ]
          : [
              token0,
              token1,
              stable,
              BigInt(amount0Desired),
              BigInt(amount1Desired),
              BigInt(0),
              BigInt(0),
              address as `0x${string}`,
              BigInt(mul(deadline, 60000))
            ],
        value: isETH ? (nonETHToken === token0 ? BigInt(amount1Desired) : BigInt(amount0Desired)) : undefined
      });

    return { executeAddLiquidity, isError, isPending, isSuccess, hash, error, reset };
  };

  const useRemoveLiquidity = (token0: `0x${string}`, token1: `0x${string}`, stable: boolean, liquidity: number) => {
    const { writeContract, isError, isSuccess, isPending, data: hash, reset, error } = useWriteContract();
    const isETH = useMemo(
      () =>
        token0.toLowerCase() === __WRAPPED_ETHER__[chainId].toLowerCase() ||
        token1.toLowerCase() === __WRAPPED_ETHER__[chainId].toLowerCase(),
      [token0, token1]
    );
    const nonETHToken = useMemo(
      () => (isETH ? (token0.toLowerCase() !== __WRAPPED_ETHER__[chainId].toLowerCase() ? token0 : token1) : undefined),
      [isETH, token0, token1]
    );

    const executeRemoveLiquidity = () =>
      writeContract({
        abi: protocolRouterAbi,
        address: routerAddress as `0x${string}`,
        functionName: isETH ? "removeLiquidityETHSupportingFeeOnTransferTokens" : "removeLiquidity",
        args: isETH
          ? [
              nonETHToken as `0x${string}`,
              stable,
              BigInt(liquidity),
              BigInt(0),
              BigInt(0),
              address as `0x${string}`,
              BigInt(mul(deadline, 60000))
            ]
          : [
              token0,
              token1,
              stable,
              BigInt(liquidity),
              BigInt(0),
              BigInt(0),
              address as `0x${string}`,
              BigInt(mul(deadline, 60000))
            ]
      });

    return { executeRemoveLiquidity, isError, isSuccess, hash, reset, error };
  };

  return { useAddLiquidity, useGetPool, useQuoteAddLiquidity, useQuoteRemoveLiquidity, useRemoveLiquidity };
}
