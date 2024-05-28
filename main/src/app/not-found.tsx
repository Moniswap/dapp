import { LuConstruction } from "react-icons/lu";

const NotFound: React.FC = () => {
  return (
    <div className="container mx-auto my-14 flex justify-center items-center bg-[#7d7d7d] rounded-[12.8px]">
      <div className="flex flex-col justify-start items-center gap-12 w-full">
        <LuConstruction color="#fff" size={200} />
        <span className="font-semibold text-xl md:text-3xl text-[#cfcfcf] capitalize text-center">
          page not found, or is under construction
        </span>
      </div>
    </div>
  );
};

export default NotFound;
