import Image from "next/image";
import Copyright from "../../public/img/copyright.png";
import ITB from "../../public/img/itb.png";

const Footer = () => {
  return (
    <div className="absolute sticky w-full bottom-0 flex flex-row bg-white shadow-lg py-4 shadow-black">
      <div className="flex flex-row justify-content items-center px-8 gap-4">
        <Image src={Copyright} className="w-[1.5rem]" alt="" />
        <h2 className="text-2xl font-semibold tracking-widest">
          KELOMPOK 25 - KEN & MIKE
        </h2>
      </div>
      <div className="flex flex-row justify-content items-center px-8 gap-2 ml-auto z-[99999]">
        <Image src={ITB} className="w-[2.5rem]" alt="" />
      </div>
    </div>
  );
};

export default Footer;
