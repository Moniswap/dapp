import { PiWarningCircleBold } from "react-icons/pi";
import { useAccount } from "wagmi";

const ConnectWalletGuard: React.FC<{ children: any }> = ({ children }) => {
  const { isConnected } = useAccount();
  return (
    <>
      {isConnected ? (
        children
      ) : (
        <div className="container mx-auto my-14 flex justify-center items-center bg-[#7d7d7d] rounded-[12.8px]">
          <div className="flex flex-col justify-start items-center gap-12 w-full">
            <PiWarningCircleBold color="red" size={200} />
            <span className="font-semibold text-xl md:text-3xl text-[#cfcfcf] capitalize text-center">
              please connect wallet
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectWalletGuard;
