"use client";

import { __CHAIN_INFO__, __CHAIN_IDS__, __PROVIDERS__ } from "@/constants";
import Image from "next/image";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { BiChevronUp } from "react-icons/bi";
import { FiChevronDown, FiChevronUp, FiSettings, FiX } from "react-icons/fi";
import { RiMenu3Fill } from "react-icons/ri";
import { useChains, useChainId, useSwitchChain, useAccount } from "wagmi";
import WalletSettingsModal from "@/ui/modals/WalletSettingsModal";
import WalletConnectModal from "@/ui/modals/WalletConnectModal";
import { customEllipsize } from "@/helpers/utils";

const ActiveLink: React.FC<LinkProps & { children: any }> = ({ href, children, ...props }) => {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href={href}
      className={`flex justify-start rounded-[5px] w-full items-center gap-3 px-2 py-2  ${
        pathname.startsWith(href.toString()) ? "font-[500] text-[#fff]" : "text-[#cfcfcf] font-[400]"
      }`}
    >
      {children}
    </Link>
  );
};

const ActiveFloatingLink: React.FC<LinkProps & { children: any }> = ({ href, children, ...props }) => {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href={href}
      className={`rounded-[15px] w-full py-3 px-3 bg-[--border] ${
        pathname.startsWith(href.toString())
          ? "border-l-[--border-left-active-bg] text-[#fff] font-[500]"
          : "text-[#cfcfcf] font-[400]"
      } border-l-[15px] my-2 cursor-pointer hover:bg-[--border-left-bg-hover] transition-all delay-75 hover:text-[--border-left-active-bg]`}
    >
      {children}
    </Link>
  );
};

function Header() {
  const [isFixed, setIsFixed] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const { isConnected, address, connector } = useAccount();
  const [showMore, setShowMore] = useState(false);
  const chains = useChains();
  const chainId = useChainId();
  const chainInfo = useMemo(() => __CHAIN_INFO__[chainId ?? __CHAIN_IDS__.bera_testnet], [chainId]);
  const [chainSwitchOpen, setChainSwitchOpen] = useState(false);
  const { switchChain } = useSwitchChain();
  const walletConnectModalRef = useRef<HTMLInputElement>(null);
  const walletSettingsModalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = window.scrollY;
      const triggerHeight = 100; // Set your desired scroll height here

      setIsFixed(scrollHeight > triggerHeight);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="w-screen relative">
        <div className={`flex h-[70px] md:h-[70px] ${isFixed ? " bg-[#000] fixed top-0 z-50 w-full" : ""} `}>
          <div className="w-full mx-[20px] flex items-center justify-between border-[rgba(43,43,43,1)]  border-b-2">
            <div className="flex items-center justify-start w-1/3">
              <Link href={"/"}>
                <Image src="/images/logo.png" width={150} height={60} alt="logo" className="hidden md:flex" />
                <Image src="/images/md_logo.png" width={40} height={40} alt="logo" className="flex md:hidden" />
              </Link>
            </div>
            <div className="flex items-center justify-center w-1/2">
              <ul
                className={`md:flex gap-8 text-sm font-[400] ${
                  isConnected ? "justify-around" : "justify-center"
                } w-full hidden items-center`}
              >
                <li>
                  <ActiveLink href="/swap">
                    <span className="capitalize text-lg">swap</span>
                  </ActiveLink>
                </li>
                {isConnected && (
                  <li>
                    <ActiveLink href="/dashboard">
                      <span className="capitalize text-lg">dashboard</span>
                    </ActiveLink>
                  </li>
                )}
                <li>
                  <ActiveLink href="/liquidity">
                    <span className="capitalize text-lg">liquidity</span>
                  </ActiveLink>
                </li>
                {isConnected && (
                  <>
                    <li>
                      <ActiveLink href="#">
                        <span className="capitalize text-lg">vote</span>
                      </ActiveLink>
                    </li>
                    <li>
                      <details
                        className="dropdown"
                        open={showMore}
                        onToggle={event => setShowMore(event.currentTarget.open)}
                      >
                        <summary
                          role="button"
                          className="btn m-1 outline-none h-fit border-0 capitalize btn-ghost text-[#cfcfcf] text-lg "
                        >
                          more {!showMore ? <FiChevronDown color="#cfcfcf" /> : <FiChevronUp color="#cfcfcf" />}
                        </summary>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu shadow rounded-box w-52">
                          <li className="p-[4px]">
                            <ActiveFloatingLink href="#">
                              <span className="capitalize">incentives</span>
                            </ActiveFloatingLink>
                          </li>
                          <li className="p-[4px]">
                            <ActiveFloatingLink href="#">
                              <span className="capitalize">launchpad</span>
                            </ActiveFloatingLink>
                          </li>
                          <li className="p-[4px]">
                            <ActiveFloatingLink href="#">
                              <span className="capitalize">seekers</span>
                            </ActiveFloatingLink>
                          </li>
                        </ul>
                      </details>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="flex items-center justify-end gap-3 w-1/3">
              <details
                className="dropdown hidden md:block dropdown-end"
                open={chainSwitchOpen}
                onToggle={event => setChainSwitchOpen(event.currentTarget.open)}
              >
                <summary className="bg-[#3e3831] py-2 px-4 md:px-8 btn btn-ghost btn-sm md:btn-md flex justify-center items-center">
                  <Image src={chainInfo.image} width={20} height={20} alt={chainInfo.name} />
                </summary>
                <ul className="p-2 w-60 dropdown-content menu rounded-[5px] z-[1] bg-[#111111] menu-lg shadow-lg">
                  <li className="menu-title">
                    <div className="flex justify-between items-center w-full">
                      <span className="capitalize font-[400] text-[#cfcfcf] text-sm">select network</span>
                      <button className="btn btn-ghost btn-square btn-sm" onClick={() => setChainSwitchOpen(false)}>
                        <BiChevronUp size={15} color="#8c8c8c" />
                      </button>
                    </div>
                  </li>
                  {chains.map(chain => (
                    <li key={chain.id}>
                      <a
                        onClick={() => {
                          switchChain({ chainId: chain.id });
                          setChainSwitchOpen(false);
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
              </details>
              <button className="bg-[#3e3831] p-2 btn btn-ghost btn-sm flex justify-center items-center md:hidden">
                <Image src={chainInfo.image} width={16} height={16} alt={chainInfo.name} />
              </button>
              {!isConnected ? (
                <button
                  className="btn md:btn-md outline-none border-0 text-white text-sm font-[400] bg-gradient-to-br from-yellow-400 to-orange-500 h-10 min-h-10 rounded-md capitalize"
                  onClick={() => {
                    if (walletConnectModalRef.current) walletConnectModalRef.current.checked = true;
                  }}
                >
                  connect
                </button>
              ) : (
                <button
                  className="w-50 m-1 btn btn-ghost flex justify-start items-center gap-3 bg-[#111111] capitalize px-2 py-2 rounded-[5px]"
                  onClick={() => {
                    if (walletSettingsModalRef.current) walletSettingsModalRef.current.checked = true;
                  }}
                >
                  <Image
                    src={__PROVIDERS__[connector?.id as keyof typeof __PROVIDERS__]?.image}
                    width={25}
                    height={25}
                    alt={__PROVIDERS__[connector?.id as keyof typeof __PROVIDERS__]?.name}
                    className="rounded-full"
                  />
                  <span className="text-sm md:text-lg font-[500] text-zinc-500">
                    {customEllipsize(address as string, 6, 4)}
                  </span>
                  <FiSettings color="#8c8c8c" />
                </button>
              )}
              {showDrawer ? (
                <button
                  className="btn btn-sm btn-ghost btn-square bg-[#1e1e1e] text-lg font-[400] rounded-[5px] p-[2px] cursor-pointer md:hidden flex transition-all delay-75"
                  onClick={() => setShowDrawer(false)}
                >
                  <FiX color="#8c8c8c" />
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-ghost btn-square bg-[#1e1e1e] text-lg font-[400] rounded-[5px] p-[2px] cursor-pointer md:hidden flex transition-all delay-75"
                  onClick={() => setShowDrawer(true)}
                >
                  <RiMenu3Fill color="#8c8c8c" />
                </button>
              )}
            </div>
          </div>
        </div>
        {showDrawer && (
          <div
            className={`flex md:hidden fixed top-[70px] bottom-0 h-screen bg-[#000] w-full z-20 transiton-all delay-75`}
          >
            <div className="w-full my-10 flex flex-col gap-3 justify-start items-center px-3">
              <ActiveFloatingLink href="/swap">
                <span className="capitalize">swap</span>
              </ActiveFloatingLink>
              {isConnected && (
                <ActiveFloatingLink href="/dashboard">
                  <span className="capitalize">dashboard</span>
                </ActiveFloatingLink>
              )}
              <ActiveFloatingLink href="/liquidity">
                <span className="capitalize">liquidity</span>
              </ActiveFloatingLink>
              {isConnected && (
                <ActiveFloatingLink href="#">
                  <span className="capitalize">vote</span>
                </ActiveFloatingLink>
              )}
            </div>
          </div>
        )}
      </div>
      <WalletConnectModal
        ref={walletConnectModalRef}
        close={() => {
          if (walletConnectModalRef.current) walletConnectModalRef.current.checked = false;
        }}
      />
      {isConnected && (
        <WalletSettingsModal
          ref={walletSettingsModalRef}
          close={() => {
            if (walletSettingsModalRef.current) walletSettingsModalRef.current.checked = false;
          }}
        />
      )}
    </>
  );
}

export default Header;
