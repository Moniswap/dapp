/* eslint-disable @next/next/no-img-element */
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { type AccountPosition } from "../../../.graphclient";
import BorderlessArtboard from "../artboards/BorderlessArtboard";
import { useMemo } from "react";
import { formatUnits } from "viem";
import { div } from "@/helpers/math";
import { RootState } from "@/configs/store";
import { useSelector } from "react-redux";
import { useChainId } from "wagmi";
import { BsExclamationCircle, BsQuestionCircle } from "react-icons/bs";
import { LuDot } from "react-icons/lu";
import { usePoolPositions } from "@/hooks/offchain/core";
import Link from "next/link";
import { FiPlusCircle } from "react-icons/fi";
import Image from "next/image";

interface DepositProps {
  data: AccountPosition;
}

const Deposit: React.FC<DepositProps> = ({ data }) => {
  const chainId = useChainId();
  const tokensStateData = useSelector((state: RootState) => state.tokens);
  const { tokenlist } = useMemo(() => tokensStateData[chainId], [chainId, tokensStateData]);
  const token0 = useMemo(
    () => tokenlist.find(t => t.address.toLowerCase() === data.pair.token0.id.toLowerCase()),
    [data.pair.token0.id, tokenlist]
  );
  const token1 = useMemo(
    () => tokenlist.find(t => t.address.toLowerCase() === data.pair.token1.id.toLowerCase()),
    [data.pair.token1.id, tokenlist]
  );
  const { usePoolTotalSupply, usePoolSymbol } = usePoolMetadata(data.pair.id as any);
  const { usePoolFee } = useProtocolCore();
  const { data: tS } = usePoolTotalSupply();
  const { data: symbol } = usePoolSymbol();
  const { data: fee } = usePoolFee(data.pair.id as any, data.pair.stable);
  const formattedTS = useMemo(() => Number(formatUnits(tS ?? BigInt(1), 18)), [tS]);
  const positionRatio = useMemo(() => div(Number(data.position), formattedTS), [data.position, formattedTS]);
  const token0Deposited = useMemo(
    () => positionRatio * Number(data.pair.reserve0),
    [data.pair.reserve0, positionRatio]
  );
  const token1Deposited = useMemo(
    () => positionRatio * Number(data.pair.reserve1),
    [data.pair.reserve1, positionRatio]
  );
  return (
    <BorderlessArtboard width="100%">
      <div className="w-full flex flex-col md:flex-row justify-start md:justify-between items-center md:items-start gap-4 py-4 md:py-8">
        <div className="flex flex-col justify-start md:justify-center items-start md:items-center gap-3 w-full md:w-auto">
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
                  {data.pair.stable ? "stable pool" : "volatile pool"}
                </span>{" "}
                <LuDot color="#cfcfcf" />{" "}
                <span className="text-[#cfcfcf] font-[400] text-sm">{Number(fee) / 100}%</span>{" "}
                <LuDot color="#cfcfcf" /> <BsExclamationCircle color="#cfcfcf" />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-start items-start gap-3">
            <h3 className="text-[#7d7d7d] text-sm md:text-lg capitalize font-[400]">pool total</h3>
            <div>
              <span className="text-[#cfcfcf] font-[400] text-sm">
                {parseFloat(data.pair.reserve0).toLocaleString("en-US", {
                  useGrouping: true,
                  maximumFractionDigits: 3
                })}
              </span>{" "}
              <span className="text-[#7d7d7d] font-[400] text-sm">{data.pair.token0.symbol}</span>
            </div>
            <div>
              <span className="text-[#cfcfcf] font-[400] text-sm">
                {parseFloat(data.pair.reserve1).toLocaleString("en-US", {
                  useGrouping: true,
                  maximumFractionDigits: 3
                })}
              </span>{" "}
              <span className="text-[#7d7d7d] font-[400] text-sm">{data.pair.token1.symbol}</span>
            </div>
          </div>
        </div>

        <div className="border border-[#33332d] bg-[#161515] w-full md:w-1/4 self-stretch flex flex-col justify-start items-start md:items-end gap-3 pb-8 pt-4 rounded-[12.8px] px-2 md:px-3">
          <h3 className="text-[#7d7d7d] text-sm md:text-lg capitalize font-[400]">in wallet</h3>
          <div className="h-[1px] w-full bg-[#33332d]" />
          <div className="flex flex-col gap-2 justify-start items-start md:items-end">
            <div>
              <span className="text-[#cfcfcf] font-[400] text-sm">
                {token0Deposited.toLocaleString("en-US", {
                  useGrouping: true,
                  maximumFractionDigits: 3
                })}
              </span>{" "}
              <span className="text-[#7d7d7d] font-[400] text-sm">{data.pair.token0.symbol}</span>
            </div>
            <div>
              <span className="text-[#cfcfcf] font-[400] text-sm">
                {token1Deposited.toLocaleString("en-US", {
                  useGrouping: true,
                  maximumFractionDigits: 3
                })}
              </span>{" "}
              <span className="text-[#7d7d7d] font-[400] text-sm">{data.pair.token1.symbol}</span>
            </div>
          </div>
        </div>

        <div className="border border-[#33332d] bg-[#161515] w-full md:w-1/4 self-stretch flex flex-col justify-start items-start md:items-end gap-3 pb-3 pt-4 rounded-[12.8px] px-2 md:px-3">
          <h3 className="text-[#7d7d7d] text-sm md:text-lg capitalize font-[400]">unstaked</h3>
          <div className="h-[1px] w-full bg-[#33332d]" />
          <div className="flex flex-col gap-2 justify-start items-start md:items-end">
            <div>
              <span className="text-[#cfcfcf] font-[400] text-sm">0.00</span>{" "}
              <span className="text-[#7d7d7d] font-[400] text-sm">{data.pair.token0.symbol}</span>
            </div>
            <div>
              <span className="text-[#cfcfcf] font-[400] text-sm">0.00</span>{" "}
              <span className="text-[#7d7d7d] font-[400] text-sm">{data.pair.token1.symbol}</span>
            </div>
          </div>
          <div className="w-full mt-5 flex justify-between items-center gap-3">
            <a className="text-sm font-[400] text-[#7d7d7d] underline capitalize">withdraw</a>
            <a className="flex justify-center items-center gap-2">
              <Image src="/images/bear_vector.svg" width={16} height={16} alt="vector" />
              <span className="capitalize underline text-[#fc8415] text-sm font-[400]">stake</span>
            </a>
          </div>
        </div>

        <div className="border border-[#33332d] bg-[#161515] w-full md:w-1/4 self-stretch flex flex-col justify-start items-start md:items-end gap-3 pb-8 pt-4 rounded-[12.8px] px-2 md:px-3">
          <h3 className="text-[#7d7d7d] text-sm md:text-lg capitalize font-[400]">staked</h3>
          <div className="h-[1px] w-full bg-[#33332d]" />
          <div className="flex flex-col gap-2 justify-start items-start md:items-end">
            <div>
              <span className="text-[#cfcfcf] font-[400] text-sm">0.00</span>{" "}
              <span className="text-[#7d7d7d] font-[400] text-sm">{data.pair.token0.symbol}</span>
            </div>
            <div>
              <span className="text-[#cfcfcf] font-[400] text-sm">0.00</span>{" "}
              <span className="text-[#7d7d7d] font-[400] text-sm">{data.pair.token1.symbol}</span>
            </div>
          </div>
        </div>
      </div>
    </BorderlessArtboard>
  );
};

function Deposits() {
  const positions = usePoolPositions();

  return (
    <div className="w-full flex flex-col justify-start items-start gap-7">
      <div className="flex w-full justify -between items-center">
        <div className="w-full flex justify-start items-center gap-2">
          <h2 className="text-[#fff] text-lg md:text-xl font-[500] capitalize">deposited & staked liquidity</h2>
          <BsQuestionCircle color="#cfcfcf" size={20} />
        </div>
        <Link
          href="/liquidity/deposit"
          className="rounded-[12.8px] bg-[#000004] border border-[#1e1e1a] flex justify-start items-center text-center px-2 py-3 gap-2"
        >
          <FiPlusCircle color="#fff" size={16} />
          <span className="text-[#fff] text-xs md:text-sm capitalize whitespace-nowrap">new deposit</span>
        </Link>
      </div>
      {positions.length > 0 ? (
        <div className="w-full flex flex-col justify-start items-center gap-4 md:gap-6">
          {positions.map(position => (
            <div key={position.id} className="w-full">
              <Deposit data={position} />
            </div>
          ))}
        </div>
      ) : (
        <BorderlessArtboard width="100%">
          <div className="w-full flex justify-start items-center px-2 py-3">
            <div>
              <span className="text-[#cfcfcf] text-sm">To receive emissions</span>{" "}
              <Link href="/liquidity/deposit">
                <span className="text-[#fc8415] text-sm underline">deposit, and stake</span>
              </Link>{" "}
              <span className="text-[#cfcfcf] text-sm">your liquidity</span>
            </div>
          </div>
        </BorderlessArtboard>
      )}
    </div>
  );
}

export default Deposits;
