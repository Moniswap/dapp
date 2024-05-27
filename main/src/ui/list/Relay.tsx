import Link from "next/link";
import BorderlessArtboard from "../artboards/BorderlessArtboard";
import { BsQuestionCircle } from "react-icons/bs";
import { FiX } from "react-icons/fi";

function Relay() {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-7">
      <div className="flex w-full justify -between items-center">
        <div className="w-full flex justify-start items-center gap-2">
          <h2 className="text-[#fff] text-lg md:text-xl font-[500] capitalize">relay</h2>
          <BsQuestionCircle color="#cfcfcf" size={20} />
        </div>
        <Link
          href="/relay"
          className="rounded-[12.8px] bg-[#000004] border border-[#1e1e1a] flex justify-start items-center px-3 py-3 gap-2"
        >
          <span className="text-[#fff] text-xs md:text-sm capitalize whitespace-nowrap">add relays</span>
          <FiX color="#fff" size={16} />
        </Link>
      </div>
      <BorderlessArtboard width="100%">
        <div className="w-full flex justify-start items-center px-2 py-3">
          <div>
            <span className="text-[#cfcfcf] text-sm">To receive incentives, and fees,</span>{" "}
            <Link href="/lock">
              <span className="text-[#fc8415] text-sm underline">create a lock</span>
            </Link>{" "}
            <span className="text-[#cfcfcf] text-sm">, and vote with it</span>
          </div>
        </div>
      </BorderlessArtboard>
    </div>
  );
}

export default Relay;
