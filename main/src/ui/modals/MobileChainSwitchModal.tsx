/* eslint-disable react/display-name */
import { __CHAIN_INFO__ } from "@/constants";
import { forwardRef, useMemo } from "react";
import { FiX } from "react-icons/fi";
import Image from "next/image";
import { useChainId, useChains, useSwitchChain } from "wagmi";

// interface ModalProps {
//   close?: () => void;
// }

const MobileChainSwitchModal = forwardRef<HTMLInputElement, { close?: () => void }>((_, ref) => {
  const modalId = useMemo(() => `chain-switch-modal-${Date.now()}-${Math.ceil(Math.random() * Date.now())}`, []);
  const chainId = useChainId();
  const chains = useChains();
  const chainInfo = useMemo(() => __CHAIN_INFO__[chainId], [chainId]);
  const { switchChain } = useSwitchChain();
  return (
    <div className="block md:hidden">
      <input type="checkbox" className="modal-toggle" id={modalId} ref={ref} />
      <div className="modal" role="dialog">
        <div className="bg-[#111111] rounded-[5px] modal-box p-2 flex flex-col justify-start items-center gap-2 overflow-visible">
          <label
            htmlFor={modalId}
            className="cursor-pointer self-end rounded-full bg-white p-2 border border-gray-300 hover:bg-gray-200 focus:outline-none relative -top-6 -right-6"
          >
            <FiX size={20} />
          </label>
          <ul className="p-2 w-full menu rounded-[5px] z-[1] bg-[#111111] menu-lg">
            <li className="menu-title">
              <div className="flex justify-start items-center w-full">
                <span className="capitalize font-[400] text-[#cfcfcf] text-lg">select network</span>
              </div>
            </li>
            {chains.map(chain => (
              <li key={chain.id}>
                <a
                  onClick={() => {
                    switchChain({ chainId: chain.id });
                    if (_.close) {
                      _.close();
                    }
                  }}
                  className={`flex justify-start items-center gap-3 ${
                    chain.id === parseInt(chainInfo.chainIDHex)
                      ? "text-[--border-left-active-bg] font-[500]"
                      : "font-[400] text-[#fff]"
                  }`}
                >
                  <Image
                    src={__CHAIN_INFO__[chain.id].image}
                    width={25}
                    height={25}
                    alt={__CHAIN_INFO__[chain.id].name}
                    className="rounded-full"
                  />
                  <span className="capitalize text-sm">{__CHAIN_INFO__[chain.id].name}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default MobileChainSwitchModal;
