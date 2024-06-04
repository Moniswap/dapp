/* eslint-disable react/display-name */
import * as React from "react";
import { forwardRef } from "react";
import { useAccount, useDisconnect, useChainId } from "wagmi";
import { FiX } from "react-icons/fi";
import { customEllipsize, isValidUrl } from "@/helpers/utils";
import { BiCopy, BiWallet } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/configs/store";
import {
  changeAllowUnsafeTrades,
  changeExecutionDeadlineInMinutes,
  changeRPCNodeUrl,
  changeSlippageTolerance
} from "@/configs/store/slices/walletSettingsSlice";
import { useNativeBalance } from "@/hooks/onchain/wallet";
import { __CHAIN_INFO__ } from "@/constants";

interface ModalProps {
  close?: () => any;
}

const WalletSettingsModal = forwardRef<HTMLInputElement, ModalProps>(({ close }, ref) => {
  const { address, connector } = useAccount();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const dispatch = useDispatch();
  const { balance } = useNativeBalance();
  const { slippageTolerance, rpcNode, allowUnsafeTrades, executionDeadlineInMinutes } = useSelector(
    (state: RootState) => state.wallet
  );
  const slippageToleranceOptions = [0.01, 0.1, 0.5, 1, 5];

  // RPC node
  const [newRPC, setNewRPC] = React.useState(rpcNode[chainId].url);

  React.useEffect(() => {
    if (rpcNode[chainId] && rpcNode[chainId].url) {
      setNewRPC(rpcNode[chainId].url);
    }
  }, [chainId, rpcNode]);

  return (
    <>
      <input
        onChange={ev => {
          if (!ev.target.checked && isValidUrl(newRPC)) {
            dispatch(changeRPCNodeUrl({ chainId, value: newRPC }));
          }
        }}
        type="checkbox"
        className="modal-toggle"
        id="wallet-settings-modal"
        ref={ref}
      />
      <div className="modal" role="dialog">
        <div className="bg-[#111] rounded-[5px] modal-box p-3 flex flex-col justify-start items-center gap-7 overflow-visible">
          <section className="flex flex-col pb-14 w-full rounded-xl bg-[#111] max-md:max-w-full z-20">
            <label
              htmlFor="wallet-settings-modal"
              className="cursor-pointer self-end rounded-full bg-white p-2 border border-gray-300 hover:bg-gray-200 focus:outline-none relative -top-6 -right-6"
            >
              <FiX size={20} />
            </label>
            <div className="flex flex-col px-6 mt-4 w-full max-md:pl-5 max-md:max-w-full">
              <div className="flex gap-1.5 items-start text-base max-md:flex-wrap">
                <div className="self-end rounded-full bg-[#7d7d7d] p-2 w-12 h-12">
                  <BiWallet className="w-full h-full text-white" />
                </div>
                <div className="flex flex-col grow shrink-0 self-start basis-0 w-fit max-md:max-w-full">
                  <div className="flex gap-5 justify-between items-start w-full font-medium whitespace-nowrap text-stone-300 max-md:flex-wrap max-md:max-w-full">
                    <div className="flex gap-2 self-end items-center">
                      <div className="grow ">{customEllipsize(address as string, 6, 4)}</div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(address as string);
                        }}
                      >
                        <BiCopy className="shrink-0 w-3 aspect-square text-zinc-500 hover:text-white" />
                      </button>
                    </div>
                  </div>
                  <div className=" text-zinc-500 max-md:max-w-full">
                    Balance: {`${balance.toFixed(4)} ${__CHAIN_INFO__[chainId].symbol}`}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col px-6 w-full max-md:pl-5 max-md:max-w-full overflow-auto h-96 md:h-[600px]">
              <div className="flex flex-col py-3.5 mt-3.5 rounded-none border-t border-solid border-zinc-800 max-md:max-w-full">
                <div className="flex flex-col px-4 py-5 text-sm rounded-xl bg-[#1E1E1E] text-stone-300 max-md:max-w-full">
                  <div className=" max-md:max-w-full">
                    To communicate with the network with your personal RPC, add it here and reload the page. This is
                    saved only in your browser, locally.
                    <br />
                  </div>
                  <input
                    type="text"
                    className="justify-center items-start px-2.5 py-4 mt-5 rounded-xl border border-solid bg-[#1E1E1E] border-stone-700 text-zinc-500 max-md:pr-5 max-md:max-w-full"
                    placeholder="RPC URL......."
                    value={newRPC}
                    onChange={ev => setNewRPC(ev.target.value)}
                  />
                  <div className="mt-6  max-md:max-w-full">
                    Leave blank if you want to use the RPC provided by us.
                    <br />
                  </div>
                </div>
              </div>

              <div className="flex flex-col py-3.5 mt-3.5 rounded-none border-t border-solid border-zinc-800 max-md:max-w-full">
                <div className="flex flex-col px-4 py-6 text-sm rounded-xl bg-[#1E1E1E] text-stone-300 max-md:max-w-full gap-3">
                  <div className=" max-md:max-w-full">Slippage tolerance: {slippageTolerance}%</div>

                  <div className="flex justify-center items-center gap-5 border border-stone-700 rounded-xl bg-[#1e1e1e] w-full">
                    {slippageToleranceOptions.map((option, index) => (
                      <button
                        style={{ width: `${(1 / slippageToleranceOptions.length) * 100}%` }}
                        key={index}
                        className={`flex justify-center items-center text-center py-3 border-none font-[700]  text-[#cfcfcf] text-xs md:text-sm ${
                          index === 0 && "rounded-l-xl"
                        } ${index === slippageToleranceOptions.length - 1 && "rounded-r-xl"} ${
                          option === slippageTolerance ? "bg-[#FC8415]" : "bg-transparent"
                        } hover:bg-[#FC8415]`}
                        onClick={() => dispatch(changeSlippageTolerance(option))}
                      >
                        {option}%
                      </button>
                    ))}
                  </div>
                  <div className="w-full flex justify-center items-center">
                    <span className="text-[#cfcfcf] text-sm">or</span>
                  </div>
                  <input
                    type="number"
                    className="justify-center items-start px-2.5 py-4 mt-5  rounded-xl border border-solid bg-[#1E1E1E] border-stone-700 text-zinc-500 max-md:pr-5 max-md:max-w-full"
                    placeholder="Custom slippage......."
                    value={slippageTolerance}
                    onChange={ev =>
                      dispatch(changeSlippageTolerance(isNaN(ev.target.valueAsNumber) ? 0.01 : ev.target.valueAsNumber))
                    }
                  />
                </div>
              </div>
              <div className="flex z-10 flex-col pt-3 mt-2 mb-0 rounded-none border-t border-solid border-zinc-800 max-md:mb-2.5 max-md:max-w-full">
                <div className="flex gap-5 px-4 py-3.5 text-sm rounded-xl bg-[#1E1E1E] text-stone-300 max-md:flex-wrap max-md:max-w-full">
                  <div className="flex flex-col">
                    <div className="">Transaction execution deadline</div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={executionDeadlineInMinutes}
                      className="range bg-[#444242] mt-4"
                      style={{ height: "0.5rem", overflow: "inherit", "--range-shdw": "none" } as React.CSSProperties}
                      onChange={ev => dispatch(changeExecutionDeadlineInMinutes(Number(ev.target.value)))}
                    />
                  </div>
                  <div className="flex-auto self-end mt-7  font-bold text-right">
                    {executionDeadlineInMinutes} minutes
                  </div>
                </div>
                <div className="flex flex-col py-3.5 mt-3.5 rounded-none border-t border-solid border-zinc-800 max-md:max-w-full">
                  <div className="py-3.5 px-4 rounded-xl bg-[#1E1E1E] max-md:pr-5 max-md:max-w-full">
                    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
                      <div className="flex flex-col w-[85%] max-md:ml-0 max-md:w-full">
                        <div className="flex flex-col text-sm max-md:mt-10">
                          <div className=" font-semibold text-stone-300">Allow unsafe trades</div>
                          <div className="mt-3.5  text-zinc-500">
                            Enabling this will allow trading on quotes with high price impact and could lead to loss of
                            funds.
                          </div>
                        </div>
                      </div>
                      <div className="flex align-items ml-5 w-[15%] max-md:ml-0 max-md:w-full">
                        <input
                          type="checkbox"
                          className="toggle self-end bg-[#FC8415] border-none hover:bg-[#FC8415] "
                          style={{ "--tglbg": "#444242" } as React.CSSProperties}
                          checked={allowUnsafeTrades}
                          onChange={() => dispatch(changeAllowUnsafeTrades(!allowUnsafeTrades))}
                        />
                      </div>
                    </div>
                  </div>
                  <button
                    className="justify-center items-center px-16 py-7 mt-5 text-sm  font-bold text-center rounded-xl border border-solid bg-[#1E1E1E] border-zinc-800 text-stone-300 max-md:px-5 max-md:max-w-full"
                    onClick={() => {
                      disconnect({ connector });

                      if (close) close();
                    }}
                  >
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
});

export default WalletSettingsModal;
