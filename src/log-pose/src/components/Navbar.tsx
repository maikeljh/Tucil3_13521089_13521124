import Image from "next/image";
import LogPose from "../../public/img/mark.png";
import Link from "next/link";

const Navbar = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <nav className="flex flex-row bg-white drop-shadow-lg sticky top-0 z-[9999]">
      <div className="flex flex-row justify-content items-center px-8 gap-4">
        <Image src={LogPose} className="w-[2rem]" alt="" />
        <h2 className="text-2xl font-bold tracking-widest">LOG POSE</h2>
      </div>
      <ul className="flex flex-row justify-content items-center ml-auto tracking-widest">
        <li className="p-5">
          <span
            className="hover:cursor-pointer font-semibold"
            onClick={() => scrollToTop()}
          >
            FEATURES
          </span>
        </li>
        <li className="p-5">
          <Link
            className="hover:cursor-pointer font-semibold"
            href="#about"
            scroll={false}
          >
            ABOUT
          </Link>
        </li>
        <li className="p-5">
          <Link
            className="hover:cursor-pointer font-semibold"
            href="#contact-us"
            scroll={false}
          >
            CONTACT US
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
