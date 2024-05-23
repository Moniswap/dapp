"use client";

import { RootState } from "@/configs/store";
import { setFirstSelectedToken, setSecondSelectedToken } from "@/configs/store/slices/tokensSlice";
import { useAdapter, useAggregatorRouter } from "@/hooks/onchain/swap";
import { useERC20Balance } from "@/hooks/onchain/wallet";
import { Step, StepGroup } from "@/ui/Step";
import BorderlessArtboard from "@/ui/artboards/BorderlessArtboard";
import TokenlistModal from "@/ui/modals/TokenlistModal";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { CgArrowsExchangeV } from "react-icons/cg";
import { FiChevronDown, FiPlusSquare } from "react-icons/fi";
import { MdKeyboardDoubleArrowRight, MdOutlineCalculate } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useChainId, useWatchBlocks } from "wagmi";
import clsx from "clsx";
import { IoIosSwap } from "react-icons/io";
import { div } from "@/helpers/math";

const LiquidityRouteAdapterName: React.FC<{ address: string }> = ({ address }) => {
  const { useName } = useAdapter(address as any);
  const { data } = useName();
  return <span className="text-[#cfcfcf] font-[400] text-xs capitalize">{data ?? "unknown"}</span>;
};

const LiquidityRouteTokenImage: React.FC<{ address: string }> = ({ address }) => {
  const chainId = useChainId();
  const tkn = useSelector((state: RootState) => state.tokens);
  const tknStateData = useMemo(() => tkn[chainId], [chainId, tkn]);

  const token = useMemo(
    () => tknStateData.tokenlist.find(t => t.address.toLowerCase() === address.toLowerCase()),
    [address, tknStateData.tokenlist]
  );

  return <Image src={token?.logoURI ?? "/images/bear.png"} height={30} width={30} alt="img" className="rounded-full" />;
};

const LiquidityRoute: React.FC<{ adapters: readonly `0x${string}`[]; tokens: readonly `0x${string}`[] }> = ({
  adapters,
  tokens
}) => {
  return (
    <div className="w-full flex flex-col items-start justify-start gap-5">
      <h3 className="capitalize font-[400] text-sm md:text-lg text-[#cfcfcf]">liquidity routing</h3>
      <div className="h-[1px] w-full bg-[#2b2b2b]" />
      <div className="w-full relative flex justify-center items-center -mt-3">
        <div className="border-b border-dashed h-[1px] w-full bg-[#9a9888] absolute top-[50%]" />
        <ul className="flex justify-between items-center w-full z-[100]">
          {tokens.map((token, index) => (
            <li key={index} style={{ width: index < tokens.length - 1 ? `${(1 / tokens.length) * 100}%` : undefined }}>
              <div className="flex justify-between items-center w-full relative">
                <LiquidityRouteTokenImage address={token} />
                {index < tokens.length - 1 && (
                  <div className="flex flex-col justify-center items-center z-30 relative mt-16">
                    <div className="rounded-full p-1 bg-[#9a9888] z-10 flex justify-center items-center">
                      <MdKeyboardDoubleArrowRight size={10} color="#fff" />
                    </div>
                    <div className="flex flex-col justify-center items-center -z-40">
                      <div className="w-[1px] h-8 bg-[#111] -mt-1" />
                      <div className="bg-[#111] rounded-[8px] px-3 py-3 -mt-2">
                        <LiquidityRouteAdapterName address={adapters[Math.min(index, index + 1)]} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

function Swap() {
  const dispatch = useDispatch();
  const tokenlistModal0 = useRef<HTMLInputElement>(null);
  const tokenlistModal1 = useRef<HTMLInputElement>(null);

  const chainId = useChainId();
  const tkn = useSelector((state: RootState) => state.tokens);
  const tknStateData = useMemo(() => tkn[chainId], [chainId, tkn]);

  const token0 = useMemo(
    () => tknStateData.tokenlist.find(t => t.address === tknStateData.firstSelectedToken),
    [tknStateData.firstSelectedToken, tknStateData.tokenlist]
  );
  const token1 = useMemo(
    () => tknStateData.tokenlist.find(t => t.address === tknStateData.secondSelectedToken),
    [tknStateData.secondSelectedToken, tknStateData.tokenlist]
  );
  const [amount, setAmount] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  // Balances
  const { balance: token0Balance } = useERC20Balance(tknStateData.firstSelectedToken as any);
  const { balance: token1Balance } = useERC20Balance(tknStateData.secondSelectedToken as any);

  // Aggregator-related functions
  const { useBestQuery, useFindBestPath, useSwap } = useAggregatorRouter();
  const {
    data: bestQueryData,
    isFetching: bestQueryFetching,
    isError: bestQueryError,
    refetch: refetchBestQuery
  } = useBestQuery(
    tknStateData.firstSelectedToken as any,
    tknStateData.secondSelectedToken as any,
    amount * Math.pow(10, token0?.decimals ?? 18)
  );
  const {
    data: bestPathData,
    isFetching: bestPathFetching,
    isError: bestPathError,
    refetch: refetchBestPath
  } = useFindBestPath(
    amount * Math.pow(10, token0?.decimals ?? 18),
    tknStateData.firstSelectedToken as any,
    tknStateData.secondSelectedToken as any
  );
  const {
    executeSwap,
    isError: swapError,
    isPending: swapPending,
    isSuccess: swapSuccess
  } = useSwap({
    amountIn: BigInt(amount * Math.pow(10, token0?.decimals ?? 18)),
    amountOut: BigInt(0),
    path: bestPathData?.path ?? [],
    adapters: bestPathData?.adapters ?? []
  });

  useWatchBlocks({
    onBlock: async () => {
      if (amount > 0) {
        await refetchBestQuery();
        await refetchBestPath();
      }
    }
  });

  useEffect(() => {
    if (amount > 0) {
      setActiveStep(3);
    } else {
      setActiveStep(-1);
    }
  }, [amount, token0Balance]);

  return (
    <>
      <div className="w-full flex flex-col md:flex-row justify-start md:justify-center items-center gap-5 px-3 my-6 md:my-40">
        <div className="w-full md:w-1/3 self-stretch">
          <BorderlessArtboard width="100%" height="100%">
            <div className="flex flex-col justify-start items-center w-full gap-6 pt-4 pb-16 relative">
              <div className="flex flex-col gap-6 justify-start items-center w-full">
                <div className="flex justify-between items-center gap-3 w-full">
                  <h4 className="text-[#fff] font-[500] capitalize text-sm md:text-lg">swap</h4>
                  <span className=" text-[#cfcfcf] font-[500] capitalize text-xs md:text-sm">
                    available {token0Balance.toPrecision(4)} {token0?.symbol}
                  </span>
                </div>
                <div className="w-full join rounded-[12.8px] border border-[#2b2b2b]">
                  <button
                    onClick={() => {
                      if (tokenlistModal0.current) tokenlistModal0.current.checked = true;
                    }}
                    className="btn btn-ghost join-item h-full flex justify-start items-center gap-3 md:w-1/3"
                  >
                    <Image src={token0?.logoURI ?? ""} height={30} width={30} alt="img" className="rounded-full" />
                    <span className=" text-[#cfcfcf] font-[500] uppercase text-xs md:text-lg">{token0?.symbol}</span>
                    <FiChevronDown size={20} color="#cfcfcf" />
                  </button>
                  <input
                    onChange={ev => setAmount(Number(ev.target.value))}
                    type="number"
                    className={clsx({
                      "justify-center join-item items-start px-2.5  rounded-xl border-l border-[#2b2b2b] bg-transparent text-[#fff] font-[500] text-sm md:text-lg w-full outline-none":
                        true,
                      "border-t border-r border-b border-y-[#ffb443] border-r-[#ffb443]": amount > token0Balance
                    })}
                  />
                </div>
              </div>
              {/* TO DO: Switch */}
              <div className="w-full flex flex-col justify-center items-center relative py-8">
                <div className="bg-[#2b2b2b] w-full h-[1px]" />
                <button className="btn btn-ghost btn-sm md:btn-md btn-square rounded-[10px] relative -top-3 md:-top-6 bg-[#47473f] flex justify-center items-center">
                  <CgArrowsExchangeV color="#fff" size={28} />
                </button>
              </div>
              <div className="flex flex-col gap-6 justify-start items-center w-full">
                <div className="flex justify-between items-center gap-3 w-full">
                  <h4 className=" text-[#fff] font-[500] capitalize text-sm md:text-lg">for</h4>
                  <span className=" text-[#cfcfcf] font-[500] capitalize text-xs md:text-sm">
                    available {token1Balance.toPrecision(4)} {token1?.symbol}
                  </span>
                </div>
                <div className="w-full join rounded-[12.8px] border border-[#2b2b2b]">
                  <button
                    onClick={() => {
                      if (tokenlistModal1.current) tokenlistModal1.current.checked = true;
                    }}
                    className="btn btn-ghost join-item h-full flex justify-start items-center gap-3 md:w-1/3"
                  >
                    <Image src={token1?.logoURI ?? ""} height={30} width={30} alt="img" className="rounded-full" />
                    <span className=" text-[#cfcfcf] font-[500] uppercase text-xs md:text-lg">{token1?.symbol}</span>
                    <FiChevronDown size={20} color="#cfcfcf" />
                  </button>
                  <input
                    disabled
                    value={Number(bestQueryData?.amountOut ?? 0) / Math.pow(10, token1?.decimals ?? 18)}
                    type="number"
                    className="justify-center join-item items-start px-2.5  rounded-xl border-l border-[#2b2b2b] bg-transparent text-[#fff] font-[500] text-sm md:text-lg w-full outline-none"
                  />
                </div>
              </div>
              {bestPathFetching ? (
                <span className="loading loading-bars loading-lg text-[#f5f5f5]"></span>
              ) : (
                <>
                  {bestPathData && bestPathData!.path.length > 0 && bestPathData!.adapters.length > 0 && (
                    <LiquidityRoute adapters={bestPathData!.adapters} tokens={bestPathData!.path} />
                  )}
                </>
              )}
            </div>
          </BorderlessArtboard>
        </div>
        <div className="w-full md:w-1/4 self-stretch">
          <BorderlessArtboard width="100%" height="100%">
            <div className="flex flex-col justify-start items-center w-full gap-10 z-50">
              <div className="flex justify-between items-center gap-3 w-full">
                <h4 className=" text-[#fff] font-[500] capitalize text-lg md:text-xl">swap</h4>
                <Image src="/images/hive.svg" width={60} height={60} alt="hive" />
              </div>
              <StepGroup activeStep={activeStep}>
                <Step
                  customIcon={activeStep >= 0 ? <MdOutlineCalculate /> : undefined}
                  content={
                    <>
                      {amount <= 0 ? (
                        <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                          Start by selecting the token to swap from and the amount you want to exchange
                        </span>
                      ) : (
                        <>
                          {bestQueryFetching ? (
                            <div className="flex justify-center gap-1 items-center w-full">
                              <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                                Searching for ideal rate...
                              </span>
                              <span className="loading loading-sm loading-spinner text-[#f5f5f5]"></span>
                            </div>
                          ) : (
                            <>
                              {bestQueryData && bestQueryData.adapter && bestQueryData.amountOut > 0 ? (
                                <div className="flex flex-col justify-start items-start gap-2">
                                  <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                                    Best exchange rate found
                                  </span>
                                  <div className="flex justify-center items-center w-full gap-2">
                                    <span className="text-[#cfcfcf] text-sm md:text-lg text-justify uppercase font-medium">
                                      1 {token0?.symbol}
                                    </span>
                                    <IoIosSwap color="#cfcfcf" size={20} />
                                    <span className="text-[#cfcfcf] text-sm md:text-lg text-justify uppercase font-medium">
                                      {(
                                        div(Number(bestQueryData.amountOut), Math.pow(10, token0?.decimals ?? 18)) /
                                        amount
                                      ).toPrecision(4)}{" "}
                                      {token1?.symbol}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                                  No rate was found
                                </span>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  }
                />
                <Step
                  customIcon={activeStep >= 0 ? <FiPlusSquare /> : undefined}
                  content={
                    <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                      Pick the token you want to exchange for
                    </span>
                  }
                />
                <Step
                  content={
                    <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                      The quotes will be ready in a moment
                    </span>
                  }
                />
              </StepGroup>
              {/* <ul className="steps steps-vertical">
              <li className="step step-warning">
                <span className="text-[#cfcfcf] text-xs md:text-sm text-justify">
                  Start by selecting the token to swap from and the amount you want to exchange
                </span>
              </li>
              <li className="step step-warning">
                <span className="text-[#cfcfcf] text-xs md:text-sm text-justify">
                  Pick the token you want to exchange for
                </span>
              </li>
              <li className="step step-warning">
                <span className="text-[#cfcfcf] text-xs md:text-sm text-justify">
                  The quotes will be ready in a moment
                </span>
              </li>
            </ul> */}
            </div>
          </BorderlessArtboard>
        </div>
      </div>
      <TokenlistModal
        ref={tokenlistModal0}
        onSingleItemClick={address => dispatch(setFirstSelectedToken({ chainId, address }))}
        close={() => {
          if (tokenlistModal0.current) tokenlistModal0.current.checked = false;
        }}
      />

      <TokenlistModal
        ref={tokenlistModal1}
        onSingleItemClick={address => dispatch(setSecondSelectedToken({ chainId, address }))}
        close={() => {
          if (tokenlistModal1.current) tokenlistModal1.current.checked = false;
        }}
      />
    </>
  );
}

export default Swap;
