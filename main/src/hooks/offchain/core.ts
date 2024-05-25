import { __GRAPH_CHAIN_NAMES__, __POOL_FACTORIES__ } from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { useChainId } from "wagmi";
import { IndexPoolFactoryInfoDocument, type PoolFactory, execute } from "../../../.graphclient";

export function useFactoryInfo() {
  const chainId = useChainId();
  const graphChainName = useMemo(() => __GRAPH_CHAIN_NAMES__[chainId], [chainId]);
  const id = useMemo(() => __POOL_FACTORIES__[chainId], [chainId]);
  const [poolFactoryInfo, setPoolFactoryInfo] = useState<PoolFactory>();

  useEffect(() => {
    if (!!id) {
      execute(IndexPoolFactoryInfoDocument, { id }, { chain: graphChainName })
        .then(({ data }) => setPoolFactoryInfo(data.poolFactory))
        .catch(console.debug);
    }
  }, [graphChainName, id]);

  return poolFactoryInfo;
}
