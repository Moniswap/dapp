/* eslint-disable react/display-name */
import * as React from "react";
import Image from "next/image";
import { forwardRef } from "react";
import { customEllipsize } from "@/helpers/utils";
import { useERC20Balance, useNativeBalance } from "@/hooks/onchain/wallet";
import { FiSearch, FiX } from "react-icons/fi";
import { useSelector } from "react-redux";
import { RootState } from "@/configs/store";
import { useChainId } from "wagmi";
import { __ETHER__ } from "@/constants";

interface ModalProps {
  close?: () => any;
  onSingleItemClick: (address: string) => void;
}

interface ListItemProps {
  onItemPressed?: React.MouseEventHandler<HTMLButtonElement>;
  disabled: boolean;
  imgSrc: string;
  tokenAddress: string | `0x${string}`;
  tokenSymbol: string;
}

const ListItem: React.FC<ListItemProps> = ({ tokenAddress, disabled, imgSrc, tokenSymbol, onItemPressed }) => {
  const { balance: erc20Balance, isLoading } = useERC20Balance(tokenAddress as `0x${string}`);
  const { balance: nativeBalance } = useNativeBalance();
  const balance = React.useMemo(
    () => (tokenAddress === __ETHER__ ? nativeBalance : erc20Balance),
    [erc20Balance, nativeBalance, tokenAddress]
  );
  return (
    <button
      disabled={disabled}
      className="w-full btn-ghost flex justify-between items-center gap-4 py-2"
      onClick={onItemPressed}
    >
      <div className="flex justify-center items-center gap-2 md:gap-4">
        <Image src={imgSrc} alt={tokenSymbol} width={60} height={60} className="rounded-full" />
        <div className="flex flex-col justify-start items-start gap-3 md:gap-4 self-stretch">
          <h3 className="uppercase font-[500] text-lg md:text-xl text-[#fff]">{tokenSymbol}</h3>
          <span className="text-[#7d7d7d] font-[400]  text-sm md:text-lg">{customEllipsize(tokenAddress, 5, 5)}</span>
        </div>
      </div>
      <div className="flex flex-col justify-start items-end gap-3 md:gap-4 self-stretch">
        {isLoading ? (
          <span className="loading loading-spinner loading-sm md:loading-md text-[#fff]"></span>
        ) : (
          <h3 className="uppercase font-[500]  text-lg md:text-xl text-[#cfcfcf]">{balance.toPrecision(4)}</h3>
        )}
        <span className="text-[#7d7d7d] font-[400]  text-sm md:text-lg">$0.0025</span>
      </div>
    </button>
  );
};

const TokenlistModal = forwardRef<HTMLInputElement, ModalProps>(({ close, onSingleItemClick }, ref) => {
  const modalId = React.useMemo(() => `token-list-modal-${Date.now()}-${Math.ceil(Math.random() * Date.now())}`, []);
  const chainId = useChainId();
  const tkn = useSelector((state: RootState) => state.tokens);
  const tknStateData = React.useMemo(() => tkn[chainId], [chainId, tkn]);
  const [searchValue, setSearchValue] = React.useState("");
  return (
    <>
      <input type="checkbox" className="modal-toggle" id={modalId} ref={ref} />
      <div className="modal" role="dialog">
        <div className="bg-[#111111] rounded-[5px] modal-box p-8 flex flex-col justify-start items-center gap-7 overflow-visible">
          <label
            htmlFor={modalId}
            className="cursor-pointer self-end rounded-full bg-white p-2 border border-gray-300 hover:bg-gray-200 focus:outline-none relative -top-12 -right-12"
          >
            <FiX size={20} />
          </label>

          <div className="w-full bg-transparent border-[0.76px] border-[#33332d] rounded-[9.74px] flex justify-center items-center gap-2 px-2 py-2">
            <FiSearch size={20} color="#fff" />
            <input
              type="text"
              onChange={ev => setSearchValue(ev.target.value)}
              className="bg-transparent w-full text-[#7d7d7d] py-1 outline-none"
              placeholder="WETH, USDC, 0x..."
            />
          </div>

          <div className="w-full flex justify-between items-center gap-2">
            <h4 className="text-[#7d7d7d]  font-[400] text-sm md:text-lg capitalize">
              {tknStateData.tokenlist.length} tokens
            </h4>
            <h4 className="text-[#7d7d7d]  font-[400] text-sm md:text-lg capitalize">balance</h4>
          </div>
          <div className="h-[0.8px] bg-[#7d7d7d] w-full" />

          <div className="flex flex-col w-full overflow-auto h-96 gap-2">
            {tknStateData.tokenlist
              .filter(
                tk =>
                  tk.address.toLowerCase().startsWith(searchValue.toLowerCase()) ||
                  tk.symbol.toLowerCase().startsWith(searchValue.toLowerCase()) ||
                  tk.name.toLowerCase().startsWith(searchValue.toLowerCase())
              )
              .map((tk, index) => (
                <ListItem
                  imgSrc={tk.logoURI}
                  tokenSymbol={tk.symbol}
                  tokenAddress={tk.address}
                  disabled={
                    tknStateData.firstSelectedToken === tk.address || tknStateData.secondSelectedToken === tk.address
                  }
                  key={`${tk.address}-${index}`}
                  onItemPressed={() => {
                    onSingleItemClick(tk.address);
                    if (close) close();
                  }}
                />
              ))}
          </div>
        </div>
      </div>
    </>
  );
});

export default TokenlistModal;
