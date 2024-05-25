"use client";

import { RootState } from "@/configs/store";
import { useFactoryInfo } from "@/hooks/offchain/core";
import { ButtonGroup, ButtonGroupItem } from "@/ui/ButtonGroup";
import BorderlessArtboard from "@/ui/artboards/BorderlessArtboard";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { BsPiggyBank } from "react-icons/bs";
import { FaQuestionCircle } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useSelector } from "react-redux";
import { useChainId } from "wagmi";

const Liquidity: React.FC = () => {
  const chainId = useChainId();
  const tokensState = useSelector((state: RootState) => state.tokens);
  const tokens = useMemo(() => tokensState[chainId], [chainId, tokensState]);

  const currentPath = usePathname();

  const factoryInfo = useFactoryInfo();
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
                    {parseFloat(factoryInfo?.totalLiquidityUSD).toLocaleString("en-US", {
                      useGrouping: true,
                      maximumFractionDigits: 3
                    })}
                  </span>
                </div>
                <div className="bg-[#282828] rounded-[12.8px] flex justify-center items-center px-3 py-3 w-full md:w-auto">
                  <span className="text-xs md:text-sm font-[400] text-[#cfcfcf] capitalize">
                    volume ~$
                    {parseFloat(factoryInfo?.totalVolumeUSD).toLocaleString("en-US", {
                      useGrouping: true,
                      maximumFractionDigits: 3
                    })}
                  </span>
                </div>
                <div className="bg-[#282828] rounded-[12.8px] flex justify-center items-center px-3 py-3 w-full md:w-auto">
                  <span className="text-xs md:text-sm font-[400] text-[#cfcfcf] capitalize">
                    pools ~{factoryInfo?.pairCount.toLocaleString("en-US", { useGrouping: true })}
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
            <ButtonGroup activeButtonIndex={0}>
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
                className="bg-transparent border-none outline-none text-[#fff] font-[400] w-full"
                placeholder="Symbol or address"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Liquidity;
