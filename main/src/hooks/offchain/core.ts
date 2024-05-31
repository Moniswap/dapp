import { __GRAPH_CHAIN_NAMES__, __GRAPH__URLs__, __POOL_FACTORIES__ } from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import {
  IndexPoolFactoryInfoDocument,
  type PoolFactory,
  execute,
  type Pair,
  IndexSinglePairDocument,
  IndexManyPoolsUsingIDsDocument,
  IndexAllPoolsDocument,
  IndexAccountPositionsDocument,
  type AccountPosition,
  type Fee,
  IndexFeesDocument
} from "../../../.graphclient";

export function useFactoryInfo() {
  const chainId = useChainId();
  const id = useMemo(() => __POOL_FACTORIES__[chainId], [chainId]);
  const [poolFactoryInfo, setPoolFactoryInfo] = useState<PoolFactory>();
  const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);

  useEffect(() => {
    if (!!id) {
      execute(IndexPoolFactoryInfoDocument, { id }, { url })
        .then(({ data }) => setPoolFactoryInfo(data.poolFactory))
        .catch(console.debug);
    }
  }, [id, url]);

  return poolFactoryInfo;
}

export function useSinglePoolInfo(poolId?: string) {
  const chainId = useChainId();
  const [poolInfo, setPoolInfo] = useState<Pair>();
  const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);

  useEffect(() => {
    if (!!poolId) {
      execute(IndexSinglePairDocument, { id: poolId }, { url })
        .then(({ data }) => setPoolInfo(data.pair))
        .catch(console.debug);
    }
  }, [poolId, url]);

  return poolInfo;
}

export function useManyPoolsByIDs(poolIds: string[]) {
  const [pools, setPools] = useState<Pair[]>([]);
  const chainId = useChainId();
  const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);

  useEffect(() => {
    if (poolIds.length > 0) {
      execute(IndexManyPoolsUsingIDsDocument, { ids: poolIds }, { url })
        .then(({ data }) => setPools(data.pairs))
        .catch(console.debug);
    }
  }, [poolIds, url]);

  return pools;
}

export function useAllPools(first: number = 1000) {
  const [pools, setPools] = useState<Pair[]>([]);
  const chainId = useChainId();
  const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);

  useEffect(() => {
    execute(IndexAllPoolsDocument, { first }, { url })
      .then(({ data }) => setPools(data.pairs))
      .catch(console.debug);
  }, [first, url]);

  return pools;
}

export function usePoolPositions() {
  const [positions, setPositions] = useState<AccountPosition[]>([]);
  const { address } = useAccount();
  const chainId = useChainId();
  const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);

  useEffect(() => {
    if (address) {
      execute(IndexAccountPositionsDocument, { account: address }, { url })
        .then(({ data }) => setPositions(data.accountPositions))
        .catch(console.debug);
    }
  }, [address, url]);

  return positions;
}

export function usePoolRewards() {
  const [rewards, setRewards] = useState<Fee[]>([]);
  const { address } = useAccount();
  const chainId = useChainId();
  const url = useMemo(() => __GRAPH__URLs__[chainId], [chainId]);

  useEffect(() => {
    if (address) {
      execute(IndexFeesDocument, {}, { url })
        .then(({ data }) => setRewards(data.fees))
        .catch(console.debug);
    }
  }, [address, url]);

  return rewards;
}
