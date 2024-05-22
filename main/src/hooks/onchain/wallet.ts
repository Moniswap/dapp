import { useAccount, useBalance, useReadContract, useWatchBlocks } from "wagmi";
import { erc20Abi } from "@/assets/abis";

export function useNativeBalance() {
  const { address } = useAccount();
  const {
    data: balance,
    refetch,
    isLoading,
    isError
  } = useBalance({
    address
  });

  useWatchBlocks({
    onBlock: () => {
      refetch()
        .then(() => console.info("Refetched native balance"))
        .catch(console.debug);
    }
  });

  return { balance: !!balance ? Number(balance.value) / Math.pow(10, 18) : 0, isLoading, isError };
}

export function useERC20Balance(tokenAddress: `0x${string}`) {
  const { address } = useAccount();
  const { data: decimals } = useReadContract({
    abi: erc20Abi,
    functionName: "decimals",
    address: tokenAddress
  });
  const {
    data: balance,
    refetch,
    isLoading,
    isError
  } = useReadContract({
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [!address ? "0x" : address],
    address: tokenAddress
  });

  useWatchBlocks({
    onBlock: () => {
      refetch()
        .then(() => console.info("Refetched account balance for %s", tokenAddress))
        .catch(console.debug);
    }
  });

  return { balance: !!balance && !!decimals ? Number(balance) / Math.pow(10, decimals) : 0, isLoading, isError };
}
