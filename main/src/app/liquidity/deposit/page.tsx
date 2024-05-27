/* eslint-disable @next/next/no-img-element */
"use client";

import { RootState } from "@/configs/store";
import { setFirstSelectedToken, setSecondSelectedToken } from "@/configs/store/slices/tokensSlice";
import { useERC20Allowance, useERC20Balance, useNativeBalance } from "@/hooks/onchain/wallet";
import { Step, StepGroup } from "@/ui/Step";
import BorderlessArtboard from "@/ui/artboards/BorderlessArtboard";
import TokenlistModal from "@/ui/modals/TokenlistModal";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CgArrowsExchangeV } from "react-icons/cg";
import { FiChevronDown, FiExternalLink, FiPlusSquare } from "react-icons/fi";
import { MdOutlineCalculate, MdOutlineError } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useAccount, useChainId, useWatchBlocks } from "wagmi";
import clsx from "clsx";
import { IoIosSwap } from "react-icons/io";
import { div, mul } from "@/helpers/math";
import { __ADDRESS_0__, __CHAIN_INFO__, __ETHER__, __PROTOCOL_ROUTERS__, __WRAPPED_ETHER__ } from "@/constants";
import { FaLock, FaUnlockKeyhole } from "react-icons/fa6";
import { PiConfetti } from "react-icons/pi";
import { usePoolMetadata, useProtocolCore } from "@/hooks/onchain/core";
import { ButtonGroup, ButtonGroupItem } from "@/ui/ButtonGroup";
import { useSinglePoolInfo } from "@/hooks/offchain/core";
import { BsExclamationCircle } from "react-icons/bs";
import { LuDot } from "react-icons/lu";
import { useSearchParams } from "next/navigation";
import { formatUnits } from "viem";

const Deposit: React.FC = () => {
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
  const [amount0In, setAmount0In] = useState(0);
  const [amount1In, setAmount1In] = useState(0);
  const [activeStep, setActiveStep] = useState(-1);

  // Wrapped ETHER
  const wrappedEther = useMemo(() => __WRAPPED_ETHER__[chainId], [chainId]);

  // Router
  const router = useMemo(() => __PROTOCOL_ROUTERS__[chainId], [chainId]);

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

  const [stable, setStable] = useState(1);

  // Wallet settings
  const slippage = useSelector((state: RootState) => state.wallet.slippageTolerance);

  // Pool-related functions
  const { useAddLiquidity, useQuoteAddLiquidity, useGetPool, usePoolFee, useStableFee, useVolatileFee } =
    useProtocolCore();
  const { data: stableFee } = useStableFee();
  const { data: volatileFee } = useVolatileFee();
  const {
    data: poolAddress,
    isFetching: getPoolFetching,
    refetch: refetchPool
  } = useGetPool(address0 as any, address1 as any, Boolean(stable));
  const { usePoolSymbol, usePoolTotalSupply } = usePoolMetadata(poolAddress as any);
  const { data: totalSupply } = usePoolTotalSupply();
  const { data: symbol } = usePoolSymbol();
  const { data: fee } = usePoolFee(poolAddress as any, Boolean(stable));
  const {
    data: quote,
    isFetching: quoteFetching,
    refetch: refetchQuote,
    isError: quoteError
  } = useQuoteAddLiquidity(
    address0 as any,
    address1 as any,
    Boolean(stable),
    mul(Number(amount0In.toFixed(3)), Math.pow(10, token0?.decimals ?? 18)),
    mul(Number(amount1In.toFixed(3)), Math.pow(10, token1?.decimals ?? 18))
  );
  const {
    executeAddLiquidity,
    executeAddLiquidityETH,
    hash: depositHash,
    isPending: depositPending,
    isSuccess: depositSuccess,
    isError: depositError,
    reset: resetDeposit,
    error: txError
  } = useAddLiquidity(
    address0 as any,
    address1 as any,
    Boolean(stable),
    mul(Number(amount0In.toFixed(3)), Math.pow(10, token0?.decimals ?? 18)),
    mul(Number(amount1In.toFixed(3)), Math.pow(10, token1?.decimals ?? 18))
  );

  const executeTx = useCallback(
    () =>
      address0.toLowerCase() === wrappedEther.toLowerCase() || address1.toLowerCase() === wrappedEther.toLowerCase()
        ? executeAddLiquidityETH()
        : executeAddLiquidity(),
    [address0, address1, executeAddLiquidity, executeAddLiquidityETH, wrappedEther]
  );

  const txUrl = useMemo(() => __CHAIN_INFO__[chainId].explorer.concat(`/tx/${depositHash}`), [chainId, depositHash]);

  // Wallet-relevant on-chain functions
  const { useAllowance: useAllowance0, useApproval: useApproval0 } = useERC20Allowance(address0 as any);
  const { useAllowance: useAllowance1, useApproval: useApproval1 } = useERC20Allowance(address1 as any);
  const {
    data: allowance0,
    isFetching: allowance0Fetching,
    isError: allowance0Error,
    refetch: refetchAllowance0
  } = useAllowance0(router as any);
  const {
    data: allowance1,
    isFetching: allowance1Fetching,
    isError: allowance1Error,
    refetch: refetchAllowance1
  } = useAllowance1(router as any);

  const allowedToSpend0 = useMemo(
    () => div(Number(allowance0 ?? 0), Math.pow(10, token0?.decimals ?? 18)),
    [allowance0, token0?.decimals]
  );

  const allowedToSpend1 = useMemo(
    () => div(Number(allowance1 ?? 0), Math.pow(10, token1?.decimals ?? 18)),
    [allowance1, token1?.decimals]
  );
  const { executeApproval: executeApproval0, isPending: approval0Pending } = useApproval0(
    router as any,
    mul(Number(amount0In.toFixed(3)), Math.pow(10, token0?.decimals ?? 18))
  );

  const { executeApproval: executeApproval1, isPending: approval1Pending } = useApproval1(
    router as any,
    mul(Number(amount1In.toFixed(3)), Math.pow(10, token1?.decimals ?? 18))
  );

  // Off-chain indexing
  const indexedPool = useSinglePoolInfo(poolAddress?.toLowerCase());

  // Calculate positions
  const { balance: position } = useERC20Balance(poolAddress as any);
  const formattedTS = useMemo(() => Number(formatUnits(totalSupply ?? BigInt(1), 18)), [totalSupply]);
  const positionRatio = useMemo(() => div(position, formattedTS), [formattedTS, position]);
  const token0Deposited = useMemo(
    () => positionRatio * Number(indexedPool?.reserve0 ?? "0"),
    [indexedPool?.reserve0, positionRatio]
  );
  const token1Deposited = useMemo(
    () => positionRatio * Number(indexedPool?.reserve1 ?? "0"),
    [indexedPool?.reserve1, positionRatio]
  );

  const switchTokens = useCallback(() => {
    const t0 = tknStateData.firstSelectedToken;
    const t1 = tknStateData.secondSelectedToken;

    dispatch(setFirstSelectedToken({ chainId, address: t1 }));
    dispatch(setSecondSelectedToken({ chainId, address: t0 }));
  }, [chainId, dispatch, tknStateData.firstSelectedToken, tknStateData.secondSelectedToken]);

  const searchParams = useSearchParams();
  const queryToken0 = useMemo(() => searchParams.get("token0"), [searchParams]);
  const queryToken1 = useMemo(() => searchParams.get("token1"), [searchParams]);
  const queryStable = useMemo(() => searchParams.get("stable"), [searchParams]);

  useEffect(() => {
    if (queryToken0) {
      const t = tknStateData.tokenlist.find(t => t.address.toLowerCase() === queryToken0.toLowerCase());

      if (t) dispatch(setFirstSelectedToken({ chainId, address: t.address }));
    }

    if (queryToken1) {
      const t = tknStateData.tokenlist.find(t => t.address.toLowerCase() === queryToken1.toLowerCase());

      if (t) dispatch(setFirstSelectedToken({ chainId, address: t.address }));
    }

    if (queryStable) {
      setStable(Number(queryStable));
    }
  }, [chainId, dispatch, queryStable, queryToken0, queryToken1, tknStateData.tokenlist]);

  useWatchBlocks({
    onBlock: async () => {
      await refetchPool();

      if (amount0In > 0) {
        await refetchAllowance0();
      }

      if (amount1In > 0) {
        await refetchAllowance1();
      }

      await refetchQuote();
    }
  });

  useEffect(() => {
    if (amount0In > 0) {
      setActiveStep(6);
    } else {
      setActiveStep(-1);
    }
  }, [amount0In, token0Balance]);

  useEffect(() => {
    if (poolAddress !== __ADDRESS_0__ && !!quote && Number(quote[1]) > 0)
      setAmount1In(div(Number(quote[1]), Math.pow(10, token1?.decimals ?? 18)));
  }, [poolAddress, quote, token1?.decimals]);

  useEffect(() => {
    if (txError) {
      console.error(txError);
      console.log(txError.message);
      console.debug(txError.cause);
      console.info(txError.stack);
    }
  }, [txError]);

  return (
    <>
      <div className="w-full flex flex-col md:flex-row justify-start md:justify-center items-center gap-5 px-3 my-6 md:my-40 animate-fade-down animate-once">
        <div className="w-full md:w-1/3 self-stretch">
          <BorderlessArtboard width="100%" height="100%">
            <div className="flex flex-col justify-start items-center w-full gap-6 pt-4 pb-16 relative">
              <div className="flex justify-start items-start w-full border-b border-[#2b2b2b] py-3">
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
                    <h3 className="font-[500] text-xl text-[#fff]">
                      {symbol ?? (Boolean(stable) ? "sAMM" : "vAMM").concat(`-${token0?.symbol}/${token1?.symbol}`)}
                    </h3>
                    <div className="flex justify-center items-center gap-1">
                      <span className="text-[#cfcfcf] font-[400] text-sm capitalize">
                        {stable ? "stable pool" : "volatile pool"}
                      </span>{" "}
                      <LuDot color="#cfcfcf" />{" "}
                      <span className="text-[#cfcfcf] font-[400] text-sm">
                        {Number(fee ?? (Boolean(stable) ? stableFee : volatileFee)) / 100}%
                      </span>{" "}
                      <LuDot color="#cfcfcf" /> <BsExclamationCircle color="#cfcfcf" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex justify-between items-center border-b border-[#2b2b2b] py-3 gap-2">
                <div className="flex flex-col justify-start items-start gap-2">
                  <h3 className="text-[#7d7d7d] font-[400] text-sm capitalize">liquidity</h3>
                  <span className="text-[#cfcfcf] text-lg">
                    {indexedPool
                      ? `${Number(indexedPool.reserve0).toPrecision(3)} ${indexedPool.token0.symbol}`
                      : `0.00 ${token0?.symbol}`}
                  </span>
                  <span className="text-[#cfcfcf] text-lg">
                    {indexedPool
                      ? `${Number(indexedPool.reserve1).toPrecision(3)} ${indexedPool.token1.symbol}`
                      : `0.00 ${token1?.symbol}`}
                  </span>
                </div>

                <div className="flex flex-col justify-start items-end gap-2">
                  <h3 className="text-[#7d7d7d] font-[400] text-sm capitalize">your positiom</h3>
                  <span className="text-[#cfcfcf] text-lg">
                    {indexedPool
                      ? `${token0Deposited.toPrecision(3)} ${indexedPool.token0.symbol}`
                      : `0.00 ${token0?.symbol}`}
                  </span>
                  <span className="text-[#cfcfcf] text-lg">
                    {indexedPool
                      ? `${token1Deposited.toPrecision(3)} ${indexedPool.token1.symbol}`
                      : `0.00 ${token1?.symbol}`}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-6 justify-start items-center w-full">
                <div className="flex justify-between items-center gap-3 w-full">
                  <h4 className="text-[#fff] font-[500] capitalize text-sm md:text-lg">first token</h4>
                  <span className=" text-[#cfcfcf] font-[500] capitalize text-xs md:text-sm">
                    available {balance0.toPrecision(4)} {token0?.symbol}
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
                    min={0}
                    onChange={ev =>
                      setAmount0In(Number(parseFloat(!!ev.target.value ? ev.target.value : "0").toFixed(3)))
                    }
                    type="number"
                    step={0.0001}
                    className={clsx({
                      "justify-center join-item items-start px-2.5  rounded-xl border-l border-[#2b2b2b] bg-transparent text-[#fff] font-[500] text-sm md:text-lg w-full outline-none":
                        true,
                      "border-t border-r border-b border-y-[#ffb443] border-r-[#ffb443]": amount0In > balance0
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
                  <h4 className=" text-[#fff] font-[500] capitalize text-sm md:text-lg">second token</h4>
                  <span className=" text-[#cfcfcf] font-[500] capitalize text-xs md:text-sm">
                    available{" "}
                    {tknStateData.secondSelectedToken === __ETHER__
                      ? etherBalance.toPrecision(4)
                      : token1Balance.toPrecision(4)}{" "}
                    {token1?.symbol}
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
                    min={0}
                    onChange={ev =>
                      setAmount1In(Number(parseFloat(!!ev.target.value ? ev.target.value : "0").toFixed(3)))
                    }
                    disabled={poolAddress !== __ADDRESS_0__ && Number(totalSupply) > 0 && amount1In > 0}
                    value={
                      poolAddress !== __ADDRESS_0__ && !!quote && Number(quote[1]) > 0 && Number(totalSupply) > 0
                        ? amount1In
                        : undefined
                    }
                    type="number"
                    step={0.0001}
                    className={clsx({
                      "justify-center join-item items-start px-2.5  rounded-xl border-l border-[#2b2b2b] bg-transparent text-[#fff] font-[500] text-sm md:text-lg w-full outline-none":
                        true,
                      "border-t border-r border-b border-y-[#ffb443] border-r-[#ffb443]": amount1In > balance1
                    })}
                  />
                </div>
              </div>
              <div className="flex justify-start w-full items-center my-3 md:my-5">
                <ButtonGroup activeButtonIndex={stable} onSingleItemClick={index => setStable(index)}>
                  <ButtonGroupItem alt>
                    <span className="capitalize font-medium text-xs md:text-sm">volatile pool</span>
                  </ButtonGroupItem>
                  <ButtonGroupItem alt>
                    <span className="capitalize font-medium text-xs md:text-sm">stable pool</span>
                  </ButtonGroupItem>
                </ButtonGroup>
              </div>
            </div>
          </BorderlessArtboard>
        </div>
        <div className="w-full md:w-1/4 self-stretch">
          <BorderlessArtboard width="100%" height="100%">
            <div className="flex flex-col justify-start items-center w-full gap-10">
              <div className="flex justify-between items-center gap-3 w-full">
                <h4 className=" text-[#fff] font-[500] capitalize text-lg md:text-xl">new deposit</h4>
                <Image src="/images/hive.svg" width={60} height={60} alt="hive" />
              </div>
              <StepGroup activeStep={activeStep}>
                <Step
                  customIcon={activeStep >= 0 ? <MdOutlineCalculate /> : undefined}
                  content={
                    <>
                      {amount0In <= 0 ? (
                        <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                          Start by selecting the first pool token, and the amount you want to deposit.
                        </span>
                      ) : (
                        <>
                          {quoteFetching ? (
                            <div className="flex justify-center gap-1 items-center w-full">
                              <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                                Searching for liquidity quote...
                              </span>
                              <span className="loading loading-sm loading-spinner text-[#f5f5f5]"></span>
                            </div>
                          ) : (
                            <>
                              {quote && quote[1] > 0 && !quoteError ? (
                                <div className="flex flex-col justify-start items-start gap-2">
                                  <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">Quote found</span>
                                  <div className="flex justify-center items-center w-full gap-2">
                                    <span className="text-[#cfcfcf] text-sm md:text-lg text-justify uppercase font-medium">
                                      {amount0In} {token0?.symbol}
                                    </span>
                                    <IoIosSwap color="#cfcfcf" size={20} />
                                    <span className="text-[#cfcfcf] text-sm md:text-lg text-justify uppercase font-medium">
                                      {div(Number(quote[1]), Math.pow(10, token1?.decimals ?? 18)).toPrecision(4)}{" "}
                                      {token1?.symbol}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                                  Quote too low or not found
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
                          Next select the second pool token. If the liquidity pool exists, you will see the estimated
                          amount required to match the conversion rate for the liquidity pool.
                        </span>
                      )}
                    </>
                  }
                />

                {amount0In <= 0 && (
                  <Step
                    content={
                      <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                        If the liquidity pool needs to be created, you can choose the initial pool amount for each of
                        the tokens. You will have to create the pool first before completing the deposit.
                      </span>
                    }
                  />
                )}

                {amount0In <= 0 && (
                  <Step
                    content={
                      <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                        Confirm, and deposit the liquidity.
                      </span>
                    }
                  />
                )}

                {amount0In > 0 && tknStateData.firstSelectedToken !== __ETHER__ && (
                  <Step
                    customIcon={
                      allowance0Fetching ? (
                        <span className="loading loading-spinner loading-sm text-[#fff]"></span>
                      ) : (
                        <>
                          {!allowance0 || allowedToSpend0 < amount0In ? (
                            <FaLock color={allowance0Error ? "#800020" : "#bab300"} />
                          ) : (
                            <FaUnlockKeyhole />
                          )}
                        </>
                      )
                    }
                    content={
                      <>
                        {allowance0Fetching ? (
                          <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                            Checking allowance for {token0?.symbol}
                          </span>
                        ) : (
                          <>
                            {!allowance0 || allowedToSpend0 < amount0In ? (
                              <div className="flex flex-col justify-start items-start gap-2">
                                <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                                  Allowance too low for {token0?.symbol}
                                </span>
                                <button
                                  disabled={
                                    allowedToSpend0 >= amount0In ||
                                    !isConnected ||
                                    tknStateData.firstSelectedToken === __ETHER__
                                  }
                                  onClick={executeApproval0}
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
                {amount0In > 0 && amount1In > 0 && tknStateData.secondSelectedToken !== __ETHER__ && (
                  <Step
                    customIcon={
                      allowance0Fetching ? (
                        <span className="loading loading-spinner loading-sm text-[#fff]"></span>
                      ) : (
                        <>
                          {!allowance1 || allowedToSpend1 < amount1In ? (
                            <FaLock color={allowance1Error ? "#800020" : "#bab300"} />
                          ) : (
                            <FaUnlockKeyhole />
                          )}
                        </>
                      )
                    }
                    content={
                      <>
                        {allowance1Fetching ? (
                          <span className="text-[#cfcfcf] text-sm md:text-lg text-justify ">
                            Checking allowance for {token1?.symbol}
                          </span>
                        ) : (
                          <>
                            {!allowance1 || allowedToSpend1 < amount1In ? (
                              <div className="flex flex-col justify-start items-start gap-2">
                                <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                                  Allowance too low for {token1?.symbol}
                                </span>
                                <button
                                  disabled={
                                    allowedToSpend1 >= amount1In ||
                                    !isConnected ||
                                    tknStateData.secondSelectedToken === __ETHER__
                                  }
                                  onClick={executeApproval1}
                                  className="bg-[#1e1e1e] border border-[#2b2b2b] capitalize px-4 py-3 flex justify-center items-center rounded-[12.8px] gap-2"
                                >
                                  <span className="text-[#cfcfcf] text-sm md:text-xl">
                                    Allow to spend {token1?.symbol}
                                  </span>
                                  <FaLock color="#fff" size={16} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                                Approved to spend {token1?.symbol}
                              </span>
                            )}
                          </>
                        )}
                      </>
                    }
                  />
                )}
                {(approval0Pending || approval1Pending || depositPending || (amount0In > 0 && amount1In > 0)) &&
                  !depositHash && (
                    <Step
                      customIcon={<span className="loading loading-spinner loading-sm text-[#cfcfcf]"></span>}
                      content={
                        <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                          Waiting for pending actions
                        </span>
                      }
                    />
                  )}
                {(depositSuccess || !!depositHash) && (
                  <Step
                    customIcon={<PiConfetti />}
                    content={
                      <div className="flex flex-col justify-start items-start gap-2">
                        <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">Deposit completed</span>
                        <a href={txUrl} target="_blank" className="flex justify-center items-center gap-2">
                          <span className="text-[#cfcfcf] text-sm underline">View on explorer</span>
                          <FiExternalLink color="#cfcfcf" size={16} />
                        </a>
                        <a
                          onClick={() => {
                            resetDeposit();
                            setAmount0In(0);
                            setAmount1In(0);
                          }}
                          className="flex justify-center items-center cursor-pointer"
                        >
                          <span className="text-[#cfcfcf] text-sm underline capitalize">reset</span>
                        </a>
                      </div>
                    }
                  />
                )}
                {!!depositError && (
                  <Step
                    customIcon={<MdOutlineError color="#800020" />}
                    content={
                      <span className="text-[#cfcfcf] text-sm md:text-lg text-justify">
                        Error occured while depositing
                      </span>
                    }
                  />
                )}
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
              {(token0?.address !== __ETHER__ ? allowedToSpend0 >= amount0In : amount0In <= balance0) &&
                (token1?.address !== __ETHER__ ? allowedToSpend1 >= amount1In : amount1In <= balance1) &&
                amount0In > 0 &&
                amount1In > 0 && (
                  <button
                    disabled={depositPending || !isConnected}
                    onClick={executeTx}
                    className="rounded-[12.8px] bg-[#ffb443] flex justify-center items-center w-full px-4 py-4"
                  >
                    <span className="text-[#fff] text-sm md:text-lg capitalize">deposit</span>
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

export default Deposit;
