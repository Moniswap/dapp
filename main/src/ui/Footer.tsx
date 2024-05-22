import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaXTwitter, FaMedium } from "react-icons/fa6";
import { PiRocket, PiTelegramLogo } from "react-icons/pi";
import { RxDiscordLogo } from "react-icons/rx";
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <>
      <div className="w-screen p-9 md:p-20 border-t-[1px] border-[rgba(64,59,59,1)] rounded-t-[70px] bg-[#0e0e0f] mt-auto">
        <div className="w-full flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col order-1 md:order-none my-10 md:my-0 justify-center md:justify-start text-center md:text-left md:items-start items-center ">
            <Image src="/images/logo.png" width={150} height={60} alt="logo" />
            <div className="md:py-20 flex flex-col justify-start items-center gap-3">
              <h1 className="uppercase text-[#fff] text-xl md:text-2xl">audited by</h1>
              <Image src="/images/certik.png" width={200} height={70} alt="logo" />
            </div>
          </div>
          <div className="flex flex-col justify-start items-center w-full">
            <div className="flex items-center justify-start flex-col w-full gap-1">
              <h1 className="text-white text-xl md:text-2xl uppercase  text-center">Don&apos;t miss the good news</h1>
              <h1 className="text-white text-3xl md:text-4xl  text-center">Subscribe to Our Newsletter</h1>
            </div>
            <div className="py-10 gap-5 flex flex-col md:flex-row justify-start md:justify-center items-center">
              <input
                type="text"
                name=""
                id=""
                placeholder="you@email.com"
                className="rounded-[100px] bg-[#1e1e1e] outline-none border px-3 border-[#403b3b] py-3 text-[#7a7a7a] w-full text-sm md:text-lg"
              />
              <button className="btn btn-ghost outline-none border-0 text-white text-sm md:text-lg font-[400] bg-gradient-to-br from-yellow-400 to-orange-500 capitalize rounded-[100px] px-4">
                subscribe
              </button>
            </div>
            <div className="flex flex-col md:flex-row justify-start items-center gap-10 md:gap-48 w-full md:justify-center">
              <div className="flex flex-col justify-center items-center gap-3 md:justify-start md:items-start">
                <h1 className="text-white text-lg md:text-xl  font-[600]">Company</h1>
                <ul className="text-sm text-white flex flex-col gap-3 justify-center items-center md:justify-start md:items-start">
                  <li className="pb-2 text-sm md:text-lg ">
                    <Link className="capitalize" href="/">
                      about moniswap
                    </Link>
                  </li>
                  <li className="pb-2 text-sm md:text-lg ">
                    <Link className="capitalize" href="/">
                      documentation
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 md:justify-start md:items-start">
                <h1 className="text-white text-lg md:text-xl  font-[600]">Project &amp; Developers</h1>
                <ul className="text-sm text-white flex flex-col gap-3 justify-center items-center md:justify-start md:items-start">
                  <li className="pb-2 text-sm md:text-lg ">
                    <Link className="capitalize" href="/">
                      submit your project
                    </Link>
                  </li>
                  <li className="pb-2 text-sm md:text-lg ">
                    <Link className="capitalize" href="/">
                      partner
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="order-2 md:order-none">
            <Link
              href="/swap"
              className="rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 p-5 w-[100px] h-[100px] flex items-center justify-center text-center flex-col gap-3 text-[12px] text-white my-5 leading-tight"
            >
              <PiRocket color="#fff" size={30} />
              <p className="text-sm capitalize">swap</p>
            </Link>
          </div>
        </div>
        <div className="flex justify-between items-center mt-10 flex-col-reverse md:flex-row w-full gap-7">
          <div className="flex">
            <h1 className="text-sm md:text-lg  text-[#cfcfcf] text-center">
              Copyright &copy; 2024 Moniswap. All rights reserved.
            </h1>
          </div>
          <div className="flex gap-4 items-center justify-center">
            <a
              href="https://t.me/Moniswap_Xyz"
              target="_blank"
              className="bg-[#000] btn btn-ghost btn-square p-3 rounded-[5px]"
            >
              <PiTelegramLogo className="w-[25px] h-[25px]" color="#fff" />
            </a>
            <a
              href="https://twitter.com/Moniswap_"
              target="_blank"
              className="bg-[#000] btn btn-ghost btn-square p-3 rounded-[5px]"
            >
              <FaXTwitter className="w-[25px] h-[25px]" color="#fff" />
            </a>
            <a
              href="https://discord.gg/SVjPB28n5y"
              target="_blank"
              className="bg-[#000] btn btn-ghost btn-square p-3 rounded-[5px]"
            >
              <RxDiscordLogo className="w-[25px] h-[25px]" color="#fff" />
            </a>
            <a
              href="https://github.com/Moniswap"
              target="_blank"
              className="bg-[#000] btn btn-ghost btn-square p-3 rounded-[5px]"
            >
              <FaGithub className="w-[25px] h-[25px]" color="#fff" />
            </a>
            <a className="bg-[#000] btn btn-ghost btn-square p-3 rounded-[5px]">
              <FaMedium className="w-[25px] h-[25px]" color="#fff" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
