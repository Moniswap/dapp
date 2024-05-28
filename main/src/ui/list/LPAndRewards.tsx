/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Image from "next/image";
import BorderlessArtboard from "../artboards/BorderlessArtboard";
import { BsExclamationCircle, BsQuestionCircle } from "react-icons/bs";
import { type Fee } from "../../../.graphclient";
import { RootState } from "@/configs/store";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useChainId } from "wagmi";
import { LuDot } from "react-icons/lu";
import { usePoolRewards } from "@/hooks/offchain/core";

interface SingleRewardProps {
  data: Fee;
}

const SingleReward: React.FC<SingleRewardProps> = ({ data }) => {
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
  const { usePoolSymbol } = usePoolMetadata(data.pair.id as any);
  const { usePoolFee } = useProtocolCore();
  const { data: symbol } = usePoolSymbol();
  const { data: fee } = usePoolFee(data.pair.id as any, data.pair.stable);
  return (
    <BorderlessArtboard width="100%">
      <div className="w-full flex flex-col md:flex-row justify-start md:justify-between items-center md:items-start gap-4 py-4 md:py-8">
        <div className="flex justify-center items-center gap-5 w-full md:w-auto border-b border-[#33332d] md:border-none md:border-0">
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
              <LuDot color="#cfcfcf" /> <span className="text-[#cfcfcf] font-[400] text-sm">{Number(fee) / 100}%</span>{" "}
              <LuDot color="#cfcfcf" /> <BsExclamationCircle color="#cfcfcf" />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-5 justify-start items-start md:items-end md:w-auto border-b border-[#33332d] md:border-none md:border-0 self-stretch">
          <h3 className="text-[#7d7d7d] text-sm md:text-lg capitalize font-[400]">emissions aPR</h3>
          <span className="text-[#fff] text-xs md:text-sm font-[400]">0.00%</span>
        </div>

        <div className="w-full flex flex-col justify-start gap-5 items-start md:items-end md:w-auto border-b border-[#33332d] md:border-none md:border-0 self-stretch">
          <h3 className="text-[#7d7d7d] text-sm md:text-lg capitalize font-[400]">emissions</h3>
          <div>
            <span className="text-[#fff] text-xs md:text-sm font-[400]">0.00</span>{" "}
            <span className="text-[#cfcfcf] text-xs md:text-sm font-[400] uppercase">moni</span>
          </div>
        </div>

        <div className="w-full flex flex-col justify-start gap-5 items-start md:items-end md:w-auto self-stretch">
          <h3 className="text-[#7d7d7d] text-sm md:text-lg capitalize font-[400]">trading fees</h3>
          <div>
            <span className="text-[#fff] text-xs md:text-sm font-[400]">
              {Number(data.amount0Claimable).toFixed(3)}
            </span>{" "}
            <span className="text-[#cfcfcf] text-xs md:text-sm font-[400] uppercase">{data.pair.token0.symbol}</span>
          </div>
          <div>
            <span className="text-[#fff] text-xs md:text-sm font-[400]">
              {Number(data.amount1Claimable).toFixed(3)}
            </span>{" "}
            <span className="text-[#cfcfcf] text-xs md:text-sm font-[400] uppercase">{data.pair.token1.symbol}</span>
          </div>
          <a className="flex justify-center items-center gap-2">
            <Image src="/images/bear_vector.svg" width={16} height={16} alt="vector" />
            <span className="capitalize underline text-[#fc8415] text-sm font-[400]">claim</span>
          </a>
        </div>
      </div>
    </BorderlessArtboard>
  );
};

function LPAndRewards() {
  const accountFees = usePoolRewards();
  return (
    <div className="w-full flex flex-col justify-start items-start gap-7">
      <div className="w-full flex justify-start items-center gap-2">
        <h2 className="text-[#fff] text-lg md:text-xl font-[500] capitalize">liquidity rewards</h2>
        <BsQuestionCircle color="#cfcfcf" size={20} />
      </div>
      {accountFees.length > 0 ? (
        <div className="w-full flex flex-col justify-start items-center gap-4 md:gap-6">
          {accountFees.map(fee => (
            <div key={fee.id} className="w-full">
              <SingleReward data={fee} />
            </div>
          ))}
        </div>
      ) : (
        <BorderlessArtboard width="100%">
          <div className="w-full flex justify-start items-center px-2 py-3">
            <div>
              <span className="text-[#cfcfcf] text-sm">Start by</span>{" "}
              <Link href="/liquidity/deposity">
                <span className="text-[#fc8415] text-sm underline">depositing, and staking</span>
              </Link>{" "}
              <span className="text-[#cfcfcf] text-sm">liquidity</span>
            </div>
          </div>
        </BorderlessArtboard>
      )}
    </div>
  );
}

export default LPAndRewards;
