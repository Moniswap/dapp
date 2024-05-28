import BorderlessArtboard from "../artboards/BorderlessArtboard";
import { BsQuestionCircle } from "react-icons/bs";

function VotingRewards() {
  return (
    <div className="w-full flex flex-col justify-start items-start gap-7">
      <div className="w-full flex justify-start items-center gap-2">
        <h2 className="text-[#fff] text-lg md:text-xl font-[500] capitalize">voting rewards</h2>
        <BsQuestionCircle color="#cfcfcf" size={20} />
      </div>
      <BorderlessArtboard width="100%">
        <div className="w-full flex justify-start items-center px-2 py-3">
          <span className="text-[#cfcfcf] text-sm">No rewards found</span>
        </div>
      </BorderlessArtboard>
    </div>
  );
}

export default VotingRewards;
