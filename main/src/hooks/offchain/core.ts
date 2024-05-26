import { __GRAPH_CHAIN_NAMES__, __POOL_FACTORIES__ } from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import {
  IndexPoolFactoryInfoDocument,
  type PoolFactory,
  execute,
  type Pair,
  IndexSinglePairDocument,
  IndexManyPoolsUsingIDsDocument,
  IndexAllPoolsDocument
} from "../../../.graphclient";

export function useFactoryInfo() {
  const chainId = useChainId();
  const id = useMemo(() => __POOL_FACTORIES__[chainId], [chainId]);
  const [poolFactoryInfo, setPoolFactoryInfo] = useState<PoolFactory>();

  useEffect(() => {
    if (!!id) {
      execute(IndexPoolFactoryInfoDocument, { id })
        .then(({ data }) => setPoolFactoryInfo(data.poolFactory))
        .catch(console.debug);
    }
  }, [id]);

  return poolFactoryInfo;
}

export function useSinglePoolInfo(poolId?: string) {
  const [poolInfo, setPoolInfo] = useState<Pair>();

  useEffect(() => {
    if (!!poolId) {
      execute(IndexSinglePairDocument, { id: poolId })
        .then(({ data }) => setPoolInfo(data.pair))
        .catch(console.debug);
    }
  }, [poolId]);

  return poolInfo;
}

export function useManyPoolsByIDs(poolIds: string[]) {
  const [pools, setPools] = useState<Pair[]>([]);

  useEffect(() => {
    if (poolIds.length > 0) {
      execute(IndexManyPoolsUsingIDsDocument, { ids: poolIds })
        .then(({ data }) => setPools(data.pairs))
        .catch(console.debug);
    }
  }, [poolIds]);

  return pools;
}

export function useAllPools(first: number = 6000) {
  const [pools, setPools] = useState<Pair[]>([]);

  useEffect(() => {
    execute(IndexAllPoolsDocument, { first })
      .then(({ data }) => setPools(data.pairs))
      .catch(console.debug);
  }, [first]);

  return pools;
}
