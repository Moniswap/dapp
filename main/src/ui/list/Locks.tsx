import Link from "next/link";
import BorderlessArtboard from "../artboards/BorderlessArtboard";
import { BsQuestionCircle } from "react-icons/bs";

function Locks() {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-7">
      <div className="w-full flex justify-start items-center gap-2">
        <h2 className="text-[#fff] text-lg md:text-xl font-[500] capitalize">locks</h2>
        <BsQuestionCircle color="#cfcfcf" size={20} />
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

export default Locks;
