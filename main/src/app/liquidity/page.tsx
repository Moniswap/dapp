"use client";

import { RootState } from "@/configs/store";
import { useAllPools, useFactoryInfo, usePoolPositions } from "@/hooks/offchain/core";
import { ButtonGroup, ButtonGroupItem } from "@/ui/ButtonGroup";
import BorderlessArtboard from "@/ui/artboards/BorderlessArtboard";
import Pools from "@/ui/list/Pools";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { BsPiggyBank } from "react-icons/bs";
import { FaQuestionCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useChainId } from "wagmi";
import { type Pair } from "../../../.graphclient";

type POOL_TYPES = "active" | "stable" | "volatile" | "low-tvl" | "incentivized" | "participating" | "all";

const Liquidity: React.FC = () => {
  const chainId = useChainId();
  const tokensState = useSelector((state: RootState) => state.tokens);
  const tokens = useMemo(() => tokensState[chainId], [chainId, tokensState]);

  const [activeList, setActiveList] = useState(0);

  const currentPath = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const _activeList = useMemo<POOL_TYPES | null>(() => searchParams.get("list") as POOL_TYPES, [searchParams]);
  const activeListNumberMap = useMemo<{ [K in POOL_TYPES]: number }>(
    () => ({
      active: 0,
      stable: 1,
      volatile: 2,
      incentivized: 3,
      "low-tvl": 4,
      participating: 5,
      all: 6
    }),
    []
  );

  const [searchValue, setSearchValue] = useState("");

  const factoryInfo = useFactoryInfo();
  const accountPositions = usePoolPositions();
  const pools = useAllPools(factoryInfo?.pairCount);
  const filteredPools = useMemo(() => {
    let poolsForFilter: Pair[] = [];

    switch (activeList) {
      case 0:
        poolsForFilter = pools.filter(p => Number(p.reserve0) > 0 && Number(p.reserve1) > 0);
        break;
      case 1:
        poolsForFilter = pools.filter(p => p.stable);
        break;
      case 2:
        poolsForFilter = pools.filter(p => !p.stable);
        break;
      case 3:
        poolsForFilter = pools.filter(p => Number(p.totalAmount0Claimable) > 0 || Number(p.totalAmount1Claimable) > 0);
        break;
      case 4:
        poolsForFilter = pools.filter(p => Number(p.reserveUSD) < 9999);
        break;
      case 5: {
        const positionsPairs = accountPositions.map(pos => pos.pair.id);
        poolsForFilter = pools.filter(p => positionsPairs.includes(p.id));
        break;
      }
      case 6:
        poolsForFilter = pools;
        break;
      default:
        poolsForFilter = pools;
        break;
    }

    return poolsForFilter.filter(
      pool =>
        pool.id.toLowerCase().startsWith(searchValue.toLowerCase()) ||
        pool.token0.symbol.toLowerCase().startsWith(searchValue.toLowerCase()) ||
        pool.token1.symbol.toLowerCase().startsWith(searchValue.toLowerCase())
    );
  }, [accountPositions, activeList, pools, searchValue]);

  useEffect(() => {
    if (_activeList) {
      setActiveList(activeListNumberMap[_activeList]);
    }
  }, [_activeList, activeListNumberMap]);

  return (
    <div className="container mx-auto flex flex-col gap-10 px-3 my-12 animate-fade-down animate-once">
      <div className="flex w-full flex-col md:flex-row justify-start md:justify-around items-center gap-10">
        <div className="w-full md:w-[60%] self-stretch">
          <BorderlessArtboard width="100%" height="100%">
            <div className="flex flex-col w-full justify-center items-center gap-8 px-2 py-3">
              <div className="w-full flex justify-between items-start gap-3">
                <p className="text-[#fff] font-medium text-sm md:text-lg md:w-1/2">
                  Liquidity providers (LPs) make low-slippage swaps possible. Deposit and stake liquidity to earn MONI.
                </p>
                <Image src="/images/hive.svg" width={60} height={60} alt="hive" />
              </div>
              <div className="w-full flex flex-col md:flex-row justify-start items-center gap-4">
                <div className="bg-[#282828] rounded-[12.8px] flex justify-center items-center px-3 py-3 w-full md:w-auto">
                  <span className="text-xs md:text-sm font-[400] text-[#cfcfcf] uppercase">
                    tvl ~$
                    {parseFloat(factoryInfo?.totalLiquidityUSD ?? "0").toLocaleString("en-US", {
                      useGrouping: true,
                      maximumFractionDigits: 3
                    })}
                  </span>
                </div>
                <div className="bg-[#282828] rounded-[12.8px] flex justify-center items-center px-3 py-3 w-full md:w-auto">
                  <span className="text-xs md:text-sm font-[400] text-[#cfcfcf] capitalize">
                    fees ~$
                    {parseFloat(factoryInfo?.feesUSD ?? "0").toLocaleString("en-US", {
                      useGrouping: true,
                      maximumFractionDigits: 3
                    })}
                  </span>
                </div>
                <div className="bg-[#282828] rounded-[12.8px] flex justify-center items-center px-3 py-3 w-full md:w-auto">
                  <span className="text-xs md:text-sm font-[400] text-[#cfcfcf] capitalize">
                    volume ~$
                    {parseFloat(factoryInfo?.totalVolumeUSD ?? "0").toLocaleString("en-US", {
                      useGrouping: true,
                      maximumFractionDigits: 3
                    })}
                  </span>
                </div>
              </div>
              <div className="h-[1px] w-full bg-[#47473f]" />
              <div className="w-full flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-3">
                <div className="w-full md:w-[80%]">
                  <span className="text-xs md:text-sm font-[400] text-[#cfcfcf]">
                    There are currently {tokens.tokenlist.length} tokens listed.
                  </span>{" "}
                  <a className="text-xs md:text-sm font-[400] text-[#cfcfcf] underline capitalize">view tokens</a>{" "}
                  <span className="text-xs md:text-sm font-[400] text-[#cfcfcf]">or</span>{" "}
                  <a className="text-xs md:text-sm font-[400] text-[#cfcfcf] underline capitalize"> list new token</a>
                </div>
                <Link
                  href={currentPath.concat("/deposit")}
                  className="rounded-[12.8px] bg-[#ffb443] flex justify-center items-center px-6 py-2 gap-4"
                >
                  <BsPiggyBank color="#fff" size={20} />
                  <span className="text-[#fff] text-sm md:text-lg capitalize">deposit</span>
                </Link>
              </div>
            </div>
          </BorderlessArtboard>
        </div>
        <div className="hidden md:block md:w-[40%] self-stretch">
          <BorderlessArtboard width="100%" height="100%">
            <div className="flex flex-col w-full justify-start items-start gap-8 px-2 py-3">
              <h3 className="text-[#fff] font-medium text-lg">How it works</h3>
              <p className="text-[#cfcfcf] font-[400] text-sm w-[90%]">
                The deeper the liquidity (TVL), the lower the slippage a pool will offer. LPs get MONI emissions, while
                veMONI lockers get the pool trading fees as an incentive to vote on the most productive pools.
              </p>
              <div className="my-10 flex justify-center items-center gap-1">
                <a className="text-xs md:text-sm font-[400] text-[#cfcfcf] underline capitalize">read more</a>
                <FaQuestionCircle color="#cfcfcf" />
              </div>
            </div>
          </BorderlessArtboard>
        </div>
      </div>
      <div className="flex flex-col justify-start items-start gap-7 w-full">
        <div className="flex flex-col justify-start items-start gap-7 w-full">
          <h3 className="text-[#fff] font-medium text-lg md:text-xl  capitalize">liquidity pools</h3>
          <div className="w-full flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-4 overflow-auto">
            <ButtonGroup
              activeButtonIndex={activeList}
              onSingleItemClick={index => {
                const newActiveList = Object.keys(activeListNumberMap).find(
                  key => activeListNumberMap[key as POOL_TYPES] === index
                );
                router.push(`${currentPath}?list=${newActiveList}`);
              }}
            >
              <ButtonGroupItem>
                <span className="capitalize font-medium text-xs md:text-sm">active</span>
              </ButtonGroupItem>
              <ButtonGroupItem>
                <span className="capitalize font-medium text-xs md:text-sm">stable</span>
              </ButtonGroupItem>
              <ButtonGroupItem>
                <span className="capitalize font-medium text-xs md:text-sm">volatile</span>
              </ButtonGroupItem>
              <ButtonGroupItem>
                <span className="capitalize font-medium text-xs md:text-sm">incentivized</span>
              </ButtonGroupItem>
              <ButtonGroupItem>
                <span className="capitalize font-medium text-xs md:text-sm">low TVL</span>
              </ButtonGroupItem>
              <ButtonGroupItem>
                <span className="capitalize font-medium text-xs md:text-sm">participating</span>
              </ButtonGroupItem>
              <ButtonGroupItem>
                <span className="capitalize font-medium text-xs md:text-sm">all pools</span>
              </ButtonGroupItem>
            </ButtonGroup>

            <div className="flex justify-start items-center gap-1 bg-[#0c0c0b] rounded-[12.8px] border border-[#33332d] px-2 py-2 md:py-3 w-full md:w-1/5">
              <FiSearch color="#fff" size={16} />
              <input
                onChange={ev => setSearchValue(ev.target.value)}
                className="bg-transparent border-none outline-none text-[#fff] font-[400] w-full"
                placeholder="Symbol or address"
              />
            </div>
          </div>
        </div>
      </div>
      <Pools data={filteredPools} />
    </div>
  );
};

export default Liquidity;
