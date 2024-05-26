/* eslint-disable @next/next/no-img-element */
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { type Pair } from "../../../.graphclient";
import { useSelector } from "react-redux";
import { RootState } from "@/configs/store";
import { useChainId } from "wagmi";
import { useMemo } from "react";
import { LuDot } from "react-icons/lu";
import { BsExclamationCircle, BsPiggyBank } from "react-icons/bs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BorderlessArtboard from "../artboards/BorderlessArtboard";
import clsx from "clsx";

interface PoolsViewProps {
  data: Pair[];
}

const SinglePoolItem: React.FC<{ data: Pair }> = ({ data }) => {
  const chainId = useChainId();
  const tokensStateData = useSelector((state: RootState) => state.tokens);
  const { tokenlist } = useMemo(() => tokensStateData[chainId], [chainId, tokensStateData]);
  const token0 = useMemo(
    () => tokenlist.find(t => t.address.toLowerCase() === data.token0.id.toLowerCase()),
    [data.token0.id, tokenlist]
  );
  const token1 = useMemo(
    () => tokenlist.find(t => t.address.toLowerCase() === data.token1.id.toLowerCase()),
    [data.token1.id, tokenlist]
  );

  const { usePoolSymbol } = usePoolMetadata(data.id as `0x${string}`);
  const { usePoolFee } = useProtocolCore();
  const { data: symbol } = usePoolSymbol();
  const { data: fee } = usePoolFee(data.id as `0x${string}`, data.stable);

  const currentPath = usePathname();
  return (
    <>
      <div className="hidden md:flex justify-between w-full items-center px-4 py-4">
        <div className="flex justify-center items-center gap-5">
          <div className="avatar-group -space-x-6 rtl:space-x-reverse">
            <div className="avatar">
              <div className="w-8">
                <img src={token0?.logoURI} alt={token0?.symbol} />
              </div>
            </div>
            <div className="avatar">
              <div className="w-8">
                <img src={token1?.logoURI} alt={token1?.symbol} />
              </div>
            </div>
          </div>
          <div className="flex flex-col self-stretch justify-start items-start gap-3">
            <h3 className="font-[500] text-xl text-[#fff]">{symbol}</h3>
            <div className="flex justify-center items-center gap-1">
              <span className="text-[#cfcfcf] font-[400] text-sm capitalize">
                {data.stable ? "stable pool" : "volatile pool"}
              </span>{" "}
              <LuDot color="#cfcfcf" /> <span className="text-[#cfcfcf] font-[400] text-sm">{Number(fee) / 100}%</span>{" "}
              <LuDot color="#cfcfcf" /> <BsExclamationCircle color="#cfcfcf" />
            </div>
            <div>
              <span className="text-[#cfcfcf] font-[400] text-sm uppercase">tvl</span>
              <span className="text-[#fff] font-[400] text-sm">
                ~${parseFloat(data.reserveUSD).toLocaleString("en-US", { useGrouping: true, maximumFractionDigits: 3 })}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col self-stretch justify-start items-end gap-3">
          <h3 className="font-[500] text-lg text-[#cfcfcf]">0.0%</h3>
          <div className="h-5" />
          <a className="text-sm font-[400] text-[#7d7d7d] underline capitalize">add incentives</a>
        </div>
        <div className="flex flex-col self-stretch justify-start items-end gap-3">
          <h3 className="font-[500] text-lg text-[#cfcfcf]">
            ~${parseFloat(data.volumeUSD).toLocaleString("en-US", { useGrouping: true, maximumFractionDigits: 3 })}
          </h3>
          <div>
            <span className="text-[#cfcfcf] font-[400] text-sm">{data.volumeToken0}</span>{" "}
            <span className="text-[#7d7d7d] font-[400] text-sm">{data.token0.symbol}</span>
          </div>
          <div>
            <span className="text-[#cfcfcf] font-[400] text-sm">{data.volumeToken1}</span>{" "}
            <span className="text-[#7d7d7d] font-[400] text-sm">{data.token1.symbol}</span>
          </div>
        </div>

        <div className="flex flex-col self-stretch justify-start items-end gap-3">
          <h3 className="font-[500] text-lg text-[#cfcfcf]">
            ~${parseFloat(data.feesUSD).toLocaleString("en-US", { useGrouping: true, maximumFractionDigits: 3 })}
          </h3>
          <div>
            <span className="text-[#cfcfcf] font-[400] text-sm">{data.totalAmount0Claimable}</span>{" "}
            <span className="text-[#7d7d7d] font-[400] text-sm">{data.token0.symbol}</span>
          </div>
          <div>
            <span className="text-[#cfcfcf] font-[400] text-sm">{data.totalAmount1Claimable}</span>{" "}
            <span className="text-[#7d7d7d] font-[400] text-sm">{data.token1.symbol}</span>
          </div>
        </div>

        <div className="flex flex-col self-stretch justify-start items-end gap-3">
          <div>
            <span className="text-[#cfcfcf] font-[400] text-sm">{data.reserve0}</span>{" "}
            <span className="text-[#7d7d7d] font-[400] text-sm">{data.token0.symbol}</span>
          </div>
          <div>
            <span className="text-[#cfcfcf] font-[400] text-sm">{data.reserve1}</span>{" "}
            <span className="text-[#7d7d7d] font-[400] text-sm">{data.token1.symbol}</span>
          </div>
          <Link
            href={currentPath.concat(`/deposit?token0=${token0?.address}&token1=${token1?.address}`)}
            className="rounded-[12.8px] bg-[#1e1e1e] border border-[#33332d] flex justify-center items-center px-6 py-2 gap-4"
          >
            <BsPiggyBank color="#fff" size={20} />
            <span className="text-[#fff] text-sm md:text-lg capitalize">deposit</span>
          </Link>
        </div>
      </div>
    </>
  );
};

const Pools: React.FC<PoolsViewProps> = ({ data }) => (
  <div className="w-full flex flex-col justify-start items-center gap-8">
    <BorderlessArtboard width="100%">
      <div className="flex justify-between items-center w-full px-4 py-3 overflow-x-scroll md:overflow-hidden gap-3">
        <h3 className="font-[500] text-[#7d7d7d] text-sm md:text-lg uppercase">liquidity pool</h3>
        <h3 className="font-[500] text-[#7d7d7d] text-sm md:text-lg uppercase">apr</h3>
        <h3 className="font-[500] text-[#7d7d7d] text-sm md:text-lg uppercase">volume</h3>
        <h3 className="font-[500] text-[#7d7d7d] text-sm md:text-lg uppercase">fees</h3>
        <h3 className="font-[500] text-[#7d7d7d] text-sm md:text-lg uppercase">pool balance</h3>
      </div>
    </BorderlessArtboard>
    <BorderlessArtboard width="100%">
      <div className="flex flex-col justify-start items-center w-full gap-3">
        {data.map((pair, index) => (
          <div
            key={index}
            className={clsx("w-full", {
              "border-b border-[#000]": index < data.length - 1
            })}
          >
            <SinglePoolItem data={pair} />
          </div>
        ))}
      </div>
    </BorderlessArtboard>
  </div>
);

export default Pools;
