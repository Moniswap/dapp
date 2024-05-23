/* eslint-disable react/display-name */
import * as React from "react";
import Image from "next/image";
import { forwardRef } from "react";
import { useConfig, useConnect } from "wagmi";
import { FiX } from "react-icons/fi";
import { __PROVIDERS__ } from "@/constants";

interface ModalProps {
  close?: () => any;
}

const WalletConnectModal = forwardRef<HTMLInputElement, ModalProps>(({ close }, ref) => {
  const { connect, connectors } = useConnect();
  const { chains } = useConfig();

  return (
    <>
      <input type="checkbox" className="modal-toggle" id="connect-wallet-modal" ref={ref} />
      <div className="modal" role="dialog">
        <div className="bg-[#111] rounded-[8.61px] modal-box p-3 flex flex-col justify-start items-center gap-7 z-20 overflow-visible">
          <label
            htmlFor="connect-wallet-modal"
            className="cursor-pointer self-end rounded-full bg-white p-2 border border-gray-300 hover:bg-gray-200 focus:outline-none relative -top-6 -right-6"
          >
            <FiX size={20} />
          </label>

          <div className="flex flex-col px-2 md:px-6 gap-4 w-full max-md:pl-5 max-md:max-w-full">
            <div className="flex flex-col justify-start items-start gap-4">
              <h1 className="text-xl md:text-3xl text-white italic font-medium max-md:max-w-full">
                Welcome to Moniswap
              </h1>
              <p className="text-base italic text-stone-300 max-md:max-w-full">
                To get started, please connect your wallet.
              </p>
            </div>
            <div className="flex flex-col justify-start items-center w-full overflow-auto gap-5 max-sm:h-96">
              {connectors
                .filter(conn => conn.id !== "io.metamask")
                .map((connector, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      connect({ connector, chainId: chains[0].id });

                      if (close) close();
                    }}
                    className="flex gap-4 justify-between items-center text-white rounded-2xl bg-[#1E1E1E] hover:bg-zinc-700 w-full"
                  >
                    <div className="shrink-0 self-stretch w-3 rounded-l-2xl bg-zinc-500 h-[79px]" />
                    <Image
                      src={__PROVIDERS__[connector.id as keyof typeof __PROVIDERS__]?.image}
                      alt={__PROVIDERS__[connector.id as keyof typeof __PROVIDERS__]?.name}
                      width={24}
                      height={24}
                      className="shrink-0 self-stretch my-auto w-6 aspect-square"
                    />
                    <div className="flex-auto self-stretch my-auto italic text-sm md:text-lg">
                      Connect with {__PROVIDERS__[connector.id as keyof typeof __PROVIDERS__]?.name}
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default WalletConnectModal;
