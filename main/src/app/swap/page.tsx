"use client";

import { RootState } from "@/configs/store";
import React from "react";
import { setFirstSelectedToken, setSecondSelectedToken } from "@/configs/store/slices/tokensSlice";
import { useAdapter, useAggregatorRouter } from "@/hooks/onchain/swap";
import { useERC20Allowance, useERC20Balance, useNativeBalance } from "@/hooks/onchain/wallet";
import { Step, StepGroup } from "@/ui/Step";
import BorderlessArtboard from "@/ui/artboards/BorderlessArtboard";
import TokenlistModal from "@/ui/modals/TokenlistModal";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CgArrowsExchangeV } from "react-icons/cg";
import { FiChevronDown, FiExternalLink, FiPlusSquare } from "react-icons/fi";
import { MdKeyboardDoubleArrowRight, MdOutlineCalculate, MdOutlineError } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useChainId, useWatchBlocks } from "wagmi";
import clsx from "clsx";
import { IoIosSwap } from "react-icons/io";
import { div, mul, sub } from "@/helpers/math";
import { __AGGREGATOR_ROUTERS__, __CHAIN_INFO__, __ETHER__, __WRAPPED_ETHER__ } from "@/constants";
import { FaLock, FaUnlockKeyhole } from "react-icons/fa6";
import { PiConfetti } from "react-icons/pi";

const LiquidityRouteAdapterName: React.FC<{ address: string }> = ({ address }) => {
  const { useName } = useAdapter(address as any);
  const { data } = useName();
  return <span className="text-[#cfcfcf] font-[400] text-[8px] md:text-xs capitalize">{data ?? "unknown"}</span>;
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
      <div className="w-full flex justify-start items-center -mt-3 overflow-x-auto">
        {/* <div className="border-b border-dashed h-[1px] w-full bg-[#9a9888] absolute top-[50%]" /> */}
        <ul className="timeline w-full">
          {tokens.map((token, index) => (
            <React.Fragment key={index}>
              <li className="flex-grow">
                {index > 0 && <hr className="bg-[#9a9888] h-[1px] border-b border-dashed" />}
                <div className="timeline-middle">
                  <LiquidityRouteTokenImage address={token} />
                </div>
                {index < tokens.length - 1 && <hr className="bg-[#9a9888] h-[1px] border-b border-dashed" />}
              </li>
              {index < tokens.length - 1 && (
                <li className="flex-grow">
                  <hr className="bg-[#9a9888] h-[1px] border-b border-dashed" />
                  <div className="timeline-middle">
                    <div className="rounded-full p-1 bg-[#9a9888] flex justify-center items-center">
                      <MdKeyboardDoubleArrowRight size={10} color="#fff" />
                    </div>
                  </div>
                  <div className="timeline-end">
                    <div className="flex flex-col justify-center items-center -z-40 w-full">
                      <div className="w-[1px] h-4 md:h-8 bg-[#111] -mt-1" />
                      <div className="bg-[#111] rounded-[8px] px-3 py-3 -mt-2 flex flex-nowrap overflow-clip justify-center items-center w-[80%] md:w-[90%]">
                        <LiquidityRouteAdapterName address={adapters[Math.min(index, index + 1)]} />
                      </div>
                    </div>
                  </div>
                  <hr className="bg-[#9a9888] h-[1px] border-b border-dashed" />
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Swap: React.FC = () => {
  const dispatch = useDispatch();
  const tokenlistModal0 = useRef<HTMLInputElement>(null);
  const tokenlistModal1 = useRef<HTMLInputElement>(null);

  const chainId = useChainId();
  const tkn = useSelector((state: RootState) => state.tokens);
  const tknStateData = useMemo(() => tkn[chainId], [chainId, tkn]);
  const { isConnected } = useAccount();

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

  // Wrapped ETHER
  const wrappedEther = useMemo(() => __WRAPPED_ETHER__[chainId], [chainId]);

  // Router
  const router = useMemo(() => __AGGREGATOR_ROUTERS__[chainId], [chainId]);

  // Token addresses
  const address0 = useMemo(
    () => (tknStateData.firstSelectedToken === __ETHER__ ? wrappedEther : tknStateData.firstSelectedToken),
    [tknStateData.firstSelectedToken, wrappedEther]
  );
  const address1 = useMemo(
    () => (tknStateData.secondSelectedToken === __ETHER__ ? wrappedEther : tknStateData.secondSelectedToken),
    [tknStateData.secondSelectedToken, wrappedEther]
  );

  const { balance: etherBalance } = useNativeBalance();
  const { balance: token0Balance } = useERC20Balance(address0 as any);
  const { balance: token1Balance } = useERC20Balance(address1 as any);
  const balance0 = useMemo(
    () => (tknStateData.firstSelectedToken === __ETHER__ ? etherBalance : token0Balance),
    [etherBalance, tknStateData.firstSelectedToken, token0Balance]
  );
  const balance1 = useMemo(
    () => (tknStateData.secondSelectedToken === __ETHER__ ? etherBalance : token1Balance),
    [etherBalance, tknStateData.secondSelectedToken, token1Balance]
  );

  // Wallet settings
  const slippage = useSelector((state: RootState) => state.wallet.slippageTolerance);

  // Aggregator-related functions
  const { useBestQuery, useFindBestPath, useSwap } = useAggregatorRouter();
  const {
    data: bestQueryData,
    isFetching: bestQueryFetching,
    isError: bestQueryError,
    refetch: refetchBestQuery
  } = useBestQuery(address0 as any, address1 as any, amount * Math.pow(10, token0?.decimals ?? 18));
  const amountOutFormatted = useMemo(
    () => div(Number(bestQueryData?.amountOut ?? 0), Math.pow(10, token1?.decimals ?? 18)),
    [bestQueryData?.amountOut, token1?.decimals]
  );

  const {
    data: bestPathData,
    isFetching: bestPathFetching,
    refetch: refetchBestPath
  } = useFindBestPath(amount * Math.pow(10, token0?.decimals ?? 18), address0 as any, address1 as any);
  const {
    executeSwap,
    isError: swapError,
    isPending: swapPending,
    isSuccess: swapSuccess,
    hash: swapHash,
    reset: resetSwap,
    error: txError
  } = useSwap({
    amountIn: BigInt(mul(Number(amount.toFixed(3)), Math.pow(10, token0?.decimals ?? 18))),
    amountOut: BigInt(
      mul(
        sub(parseFloat(amountOutFormatted.toFixed(3)), mul(slippage / 100, parseFloat(amountOutFormatted.toFixed(2)))),
        Math.pow(10, token1?.decimals ?? 18)
      )
    ),
    path: bestPathData?.path ?? [],
    adapters: bestPathData?.adapters ?? []
  });
  const txUrl = useMemo(() => __CHAIN_INFO__[chainId].explorer.concat(`/tx/${swapHash}`), [chainId, swapHash]);

  // Wallet-relevant on-chain functions
  const { useAllowance, useApproval } = useERC20Allowance(address0 as any);
  const {
    data: allowance,
    isFetching: allowanceFetching,
    isError: allowanceError,
    refetch: refetchAllowance
  } = useAllowance(router as any);
  const allowedToSpend = useMemo(
    () => div(Number(allowance ?? 0), Math.pow(10, token0?.decimals ?? 18)),
    [allowance, token0?.decimals]
  );
  const { executeApproval, isPending: approvalPending } = useApproval(
    router as any,
    mul(amount, Math.pow(10, token0?.decimals ?? 18))
  );

  const switchTokens = useCallback(() => {
    const t0 = tknStateData.firstSelectedToken;
    const t1 = tknStateData.secondSelectedToken;

    dispatch(setFirstSelectedToken({ chainId, address: t1 }));
    dispatch(setSecondSelectedToken({ chainId, address: t0 }));
  }, [chainId, dispatch, tknStateData.firstSelectedToken, tknStateData.secondSelectedToken]);

  useWatchBlocks({
    onBlock: async () => {
      if (amount > 0) {
        await refetchBestQuery();
        await refetchBestPath();
        await refetchAllowance();
      }
    }
  });

  useEffect(() => {
    if (amount > 0) {
      setActiveStep(6);
    } else {
      setActiveStep(-1);
    }
  }, [amount, token0Balance]);

  useEffect(() => {
    if (txError) console.error(txError.message);
  }, [txError]);

  return (
    <>
      <div className="w-full flex flex-col md:flex-row justify-start md:justify-center items-center gap-5 px-3 my-6 md:my-40 animate-fade-down animate-once">
        <div className="w-full md:w-1/3 self-stretch">
          <BorderlessArtboard width="100%" height="100%">
            <div className="flex flex-col justify-start items-center w-full gap-6 pt-4 pb-16 relative">
              <div className="flex flex-col gap-6 justify-start items-center w-full">
                <div className="flex justify-between items-center gap-3 w-full">
                  <h4 className="text-[#fff] font-[500] capitalize text-sm md:text-lg">swap</h4>
                  <span className=" text-[#cfcfcf] font-[500] capitalize text-xs md:text-sm">
                    available {balance0.toFixed(4)} {token0?.symbol}
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
                    <span className=" text-[#cfcfcf] font-[500] uppercase text-xs md:text-sm">{token0?.symbol}</span>
                    <FiChevronDown size={20} color="#cfcfcf" />
                  </button>
                  <input
                    onChange={ev => setAmount(Number(parseFloat(!!ev.target.value ? ev.target.value : "0").toFixed(3)))}
                    type="number"
                    step={0.0001}
                    className={clsx({
                      "justify-center join-item items-start px-2.5  rounded-xl border-l border-[#2b2b2b] bg-transparent text-[#fff] font-[500] text-sm md:text-lg w-full outline-none":
                        true,
                      "border-t border-r border-b border-y-[#ffb443] border-r-[#ffb443]": amount > balance0
                    })}
                  />
                </div>
              </div>
              {/* TO DO: Switch */}
              <div className="w-full flex flex-col justify-center items-center relative py-8">
                <div className="bg-[#2b2b2b] w-full h-[1px]" />
                <button
                  onClick={switchTokens}
                  className="btn btn-ghost btn-sm md:btn-md btn-square rounded-[10px] relative -top-3 md:-top-6 bg-[#47473f] flex justify-center items-center"
                >
                  <CgArrowsExchangeV color="#fff" size={28} />
                </button>
              </div>
              <div className="flex flex-col gap-6 justify-start items-center w-full">
                <div className="flex justify-between items-center gap-3 w-full">
                  <h4 className=" text-[#fff] font-[500] capitalize text-sm md:text-lg">for</h4>
                  <span className=" text-[#cfcfcf] font-[500] capitalize text-xs md:text-sm">
                    available {balance1.toFixed(4)} {token1?.symbol}
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
                    <span className=" text-[#cfcfcf] font-[500] uppercase text-xs md:text-sm">{token1?.symbol}</span>
                    <FiChevronDown size={20} color="#cfcfcf" />
                  </button>
                  <input
                    disabled
                    value={amountOutFormatted}
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
            <div className="flex flex-col justify-start items-center w-full gap-10 pb-16">
              <div className="flex justify-between items-center gap-3 w-full">
                <h4 className=" text-[#fff] font-[500] capitalize text-lg md:text-xl">swap</h4>
                <Image src="/images/hive.svg" width={60} height={60} alt="hive" />
              </div>
              <div className="flex justify-start items-start w-full">
                <StepGroup activeStep={activeStep}>
                  <Step
                    customIcon={activeStep >= 0 ? <MdOutlineCalculate /> : undefined}
                    content={
                      <>
                        {amount <= 0 ? (
                          <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                            Start by selecting the token to swap from and the amount you want to exchange
                          </span>
                        ) : (
                          <>
                            {bestQueryFetching ? (
                              <div className="flex justify-start gap-1 items-center w-full">
                                <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                                  Searching for ideal rate...
                                </span>
                                <span className="loading loading-sm loading-spinner text-[#f5f5f5]"></span>
                              </div>
                            ) : (
                              <>
                                {bestQueryData &&
                                bestQueryData.adapter &&
                                bestQueryData.amountOut > 0 &&
                                !bestQueryError ? (
                                  <div className="flex flex-col justify-start items-start gap-2">
                                    <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                                      Best exchange rate found
                                    </span>
                                    <div className="flex justify-start items-center w-full gap-2">
                                      <span className="text-[#cfcfcf] text-sm md:text-lg text-justify uppercase font-medium">
                                        1 {token0?.symbol}
                                      </span>
                                      <IoIosSwap color="#cfcfcf" size={20} />
                                      <span className="text-[#cfcfcf] text-sm md:text-lg text-justify uppercase font-medium">
                                        {(amountOutFormatted / amount).toFixed(3)} {token1?.symbol}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
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
                    customIcon={activeStep >= 1 ? <FiPlusSquare /> : undefined}
                    content={
                      <>
                        {activeStep >= 1 ? (
                          <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                            {slippage}% slippage applied.
                          </span>
                        ) : (
                          <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                            Pick the token you want to exchange for
                          </span>
                        )}
                      </>
                    }
                  />
                  <Step
                    customIcon={activeStep >= 2 ? <CgArrowsExchangeV /> : undefined}
                    content={
                      <>
                        {activeStep >= 2 && bestQueryData ? (
                          <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                            Minimum received:
                            {amountOutFormatted.toFixed(4)} {token1?.symbol}
                          </span>
                        ) : (
                          <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                            The quotes will be ready in a moment
                          </span>
                        )}
                      </>
                    }
                  />
                  {amount > 0 && tknStateData.firstSelectedToken !== __ETHER__ && (
                    <Step
                      customIcon={
                        allowanceFetching ? (
                          <span className="loading loading-spinner loading-sm text-[#fff]"></span>
                        ) : (
                          <>
                            {!allowance || allowedToSpend < amount ? (
                              <FaLock color={allowanceError ? "#800020" : "#bab300"} />
                            ) : (
                              <FaUnlockKeyhole />
                            )}
                          </>
                        )
                      }
                      content={
                        <>
                          {allowanceFetching ? (
                            <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                              Checking allowance for {token0?.symbol}
                            </span>
                          ) : (
                            <>
                              {!allowance || allowedToSpend < amount ? (
                                <div className="flex flex-col justify-start items-start gap-2">
                                  <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                                    Allowance too low for {token0?.symbol}
                                  </span>
                                  <button
                                    disabled={
                                      allowedToSpend >= amount ||
                                      !isConnected ||
                                      tknStateData.firstSelectedToken === __ETHER__
                                    }
                                    onClick={executeApproval}
                                    className="bg-[#1e1e1e] border border-[#2b2b2b] capitalize px-4 py-3 flex justify-center items-center rounded-[12.8px] gap-2"
                                  >
                                    <span className="text-[#cfcfcf] text-sm md:text-xl">
                                      Allow to spend {token0?.symbol}
                                    </span>
                                    <FaLock color="#fff" size={16} />
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                                  Approved to spend {token0?.symbol}
                                </span>
                              )}
                            </>
                          )}
                        </>
                      }
                    />
                  )}
                  {(approvalPending || swapPending || amount > 0) && !swapHash && (
                    <Step
                      customIcon={<span className="loading loading-spinner loading-sm text-[#cfcfcf]"></span>}
                      content={
                        <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                          Waiting for pending actions
                        </span>
                      }
                    />
                  )}
                  {(swapSuccess || !!swapHash) && (
                    <Step
                      customIcon={<PiConfetti />}
                      content={
                        <div className="flex flex-col justify-start items-start gap-2">
                          <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">Swap completed</span>
                          <a href={txUrl} target="_blank" className="flex justify-center items-center gap-2">
                            <span className="text-[#cfcfcf] text-sm underline">View on explorer</span>
                            <FiExternalLink color="#cfcfcf" size={16} />
                          </a>
                          <a
                            onClick={() => {
                              resetSwap();
                              setAmount(0);
                            }}
                            className="flex justify-center items-center cursor-pointer"
                          >
                            <span className="text-[#cfcfcf] text-sm underline capitalize">reset</span>
                          </a>
                        </div>
                      }
                    />
                  )}
                  {!!swapError && (
                    <Step
                      customIcon={<MdOutlineError color="#800020" />}
                      content={
                        <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                          Error occured while swapping
                        </span>
                      }
                    />
                  )}
                </StepGroup>
              </div>
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
              {(allowedToSpend >= amount || tknStateData.firstSelectedToken === __ETHER__) && amount > 0 && (
                <button
                  disabled={swapPending || !isConnected}
                  onClick={executeSwap}
                  className="rounded-[12.8px] bg-[#ffb443] flex justify-center items-center w-full px-4 py-4"
                >
                  <span className="text-[#fff] text-sm md:text-lg capitalize">swap</span>
                </button>
              )}
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
};

export default Swap;
