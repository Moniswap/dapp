import { poolAbi, poolFactoryAbi, protocolRouterAbi } from "@/assets/abis";
import { RootState } from "@/configs/store";
import { __IDEAL_GAS__, __POOL_FACTORIES__, __PROTOCOL_ROUTERS__, __WRAPPED_ETHER__ } from "@/constants";
import { add, mul } from "@/helpers/math";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useAccount, useChainId, useEstimateGas, useGasPrice, useReadContract, useWriteContract } from "wagmi";

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

  const useAllPools = () =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "allPools"
    });

  const useGetPool = (token0: `0x${string}`, token1: `0x${string}`, stable: boolean) =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "getPool",
      args: [token0, token1, stable]
    });

  const usePoolFee = (pool: `0x${string}`, stable: boolean) =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "getFee",
      args: [pool, stable]
    });

  const useVolatileFee = () =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "volatileFee"
    });

  const useStableFee = () =>
    useReadContract({
      abi: poolFactoryAbi,
      address: factoryAddress as `0x${string}`,
      functionName: "stableFee"
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

    const executeAddLiquidityETH = () =>
      writeContract({
        abi: protocolRouterAbi,
        address: routerAddress as `0x${string}`,
        functionName: "addLiquidityETH",
        args: [
          nonETHToken as `0x${string}`,
          stable,
          nonETHToken === token0 ? BigInt(amount0Desired) : BigInt(amount1Desired),
          BigInt(0),
          BigInt(0),
          address as `0x${string}`,
          BigInt(Math.floor(Date.now() / 1000) + mul(deadline, 60))
        ],
        value: nonETHToken === token0 ? BigInt(amount1Desired) : BigInt(amount0Desired)
      });

    const executeAddLiquidity = () =>
      writeContract({
        abi: protocolRouterAbi,
        address: routerAddress as `0x${string}`,
        functionName: "addLiquidity",
        args: [
          token0,
          token1,
          stable,
          BigInt(amount0Desired),
          BigInt(amount1Desired),
          BigInt(0),
          BigInt(0),
          address as `0x${string}`,
          BigInt(Math.floor(Date.now() / 1000) + mul(deadline, 60))
        ]
      });

    return {
      executeAddLiquidity,
      executeAddLiquidityETH,
      isError,
      isPending,
      isSuccess,
      hash,
      error,
      reset
    };
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

    return { executeRemoveLiquidity, isError, isSuccess, hash, reset, error, isPending };
  };

  return {
    useAddLiquidity,
    useGetPool,
    useQuoteAddLiquidity,
    useQuoteRemoveLiquidity,
    useRemoveLiquidity,
    useAllPools,
    usePoolFee,
    useStableFee,
    useVolatileFee
  };
}

export function usePoolMetadata(poolAddress: `0x${string}`) {
  const usePoolName = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "name"
    });

  const usePoolSymbol = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "symbol"
    });

  const usePoolDecimals = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "decimals"
    });

  const usePoolTotalSupply = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "totalSupply"
    });

  const usePoolStability = () =>
    useReadContract({
      address: poolAddress,
      abi: poolAbi,
      functionName: "stable"
    });

  return { usePoolName, usePoolSymbol, usePoolDecimals, usePoolTotalSupply, usePoolStability };
}
