import Image from "next/image";
import LogPose from "../img/mark.png";
import Copyright from "../img/copyright.png";
import ITB from "../img/itb.png";
import Dummy from "../img/dummy.png";
import Instagram from "../img/instagram.png";
import Github from "../img/github.png";
import dynamic from "next/dynamic";
import IconMap from "../img/iconmap.png";

const Map = dynamic(() => import("./map"), { ssr: false });

export default function Home() {
  return (
    <div>
      <nav className="flex flex-row bg-white drop-shadow-lg sticky top-0 z-[99999]">
        <div className="flex flex-row justify-content items-center px-8 gap-4">
          <Image src={LogPose} className="w-[2rem]" alt="tes" />
          <h2 className="text-2xl font-bold tracking-widest">LOG POSE</h2>
        </div>
        <ul className="flex flex-row justify-content items-center ml-auto tracking-widest">
          <li className="p-5">
            <a className="hover:cursor-pointer font-semibold" href="#features">
              FEATURES
            </a>
          </li>
          <li className="p-5">
            <a
              className="hover:cursor-pointer font-semibold"
              href="#contact-us"
            >
              CONTACT US
            </a>
          </li>
          <li className="p-5">
            <a className="hover:cursor-pointer font-semibold">ABOUT</a>
          </li>
        </ul>
      </nav>
      <div
        id="features"
        className="mt-8 text-center h-[90vh] flex flex-row gap-10"
      >
        <div className="w-1/2">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-4 mx-auto justify-content">
              <Image src={IconMap} alt="" width={50} />
              <h1 className="font-semibold text-3xl">MAP</h1>
            </div>
            <Map />
          </div>
          <input type="file" id="fileInput" />
          <button
            id="a*"
            className="mt-6 border-2 py-2 px-4 border-black mr-4 bg-white rounded-xl"
          >
            A*
          </button>
          <button
            id="ucs"
            className="mt-6 border-2 py-2 px-4 border-black mr-4 bg-white rounded-xl"
          >
            UCS
          </button>
          <button
            id="restart"
            className="mt-6 border-2 py-2 px-4 border-black bg-white rounded-xl"
          >
            Restart
          </button>
        </div>
        <div className="w-1/2 flex flex-col gap-10 mt-10">
          <div className="flex flex-col">
            <h1 className="font-semibold text-3xl mb-4">CHOOSE START & GOAL</h1>
            <div className="flex flex-row gap-20 items-center w-full px-10">
              <div className="flex flex-col w-full gap-2">
                <h2 className="text-lg font-semibold">Start Node</h2>
                <select
                  id="start-node"
                  className="shadow-lg rounded-xl py-2 px-2"
                ></select>
              </div>
              <div className="flex flex-col w-full gap-2">
                <h2 className="text-lg font-semibold">Goal Node</h2>
                <select
                  id="goal-node"
                  className="shadow-lg rounded-xl py-2 px-2"
                ></select>
              </div>
            </div>
          </div>
          <div>
            <div className="bg-white w-2/3 mx-auto shadow-lg rounded-xl p-4 min-h-[8rem]">
              <h1 className="font-semibold text-2xl mb-2">ROUTE</h1>
              <hr className="border-[1px] border-black"></hr>
              <p className="text-lg my-auto font-semibold mt-2" id="route"></p>
            </div>
          </div>
          <div>
            <div className="bg-white w-2/3 mx-auto shadow-lg rounded-xl p-4 min-h-[8rem]">
              <h1 className="font-semibold text-2xl mb-2">DISTANCE</h1>
              <hr className="border-[1px] border-black"></hr>
              <p
                className="text-lg my-auto font-semibold mt-2"
                id="distance"
              ></p>
            </div>
          </div>
        </div>
      </div>
      <div id="contact-us" className="mb-12 flex flex-col gap-10">
        <h1 className="text-center text-6xl font-bold">CONTACT US</h1>
        <div className="bg-white rounded-xl flex flex-row w-5/6 mx-auto p-8 items-center gap-16 shadow-4 shadow-black drop-shadow-lg">
          <div className="">
            <Image src={Dummy} alt="" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-5xl">KENNETH EZEKIEL 13521089</p>
            <hr className="border-2 border-black"></hr>
            <a
              className="flex flex-row items-center gap-4"
              href="https://www.instagram.com/kennezekiel/"
              target="_blank"
            >
              <div>
                <Image src={Instagram} alt="" />
              </div>
              <p className="text-3xl">@KENNEZEKIEL</p>
            </a>
            <a
              className="flex flex-row items-center gap-4"
              href="https://github.com/KenEzekiel"
              target="_blank"
            >
              <div>
                <Image src={Github} alt="" />
              </div>
              <p className="text-3xl">KENEZEKIEL</p>
            </a>
          </div>
        </div>
        <div className="bg-white rounded-xl flex flex-row w-5/6 mx-auto p-8 items-center gap-16 shadow-4 shadow-black drop-shadow-lg">
          <div className="">
            <Image src={Dummy} alt="" />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-5xl">MICHAEL JONATHAN HALIM 13521124</p>
            <hr className="border-2 border-black"></hr>
            <a
              className="flex flex-row items-center gap-4"
              href="https://www.instagram.com/michael.jh/"
              target="_blank"
            >
              <div>
                <Image src={Instagram} alt="" />
              </div>
              <p className="text-3xl">@MICHAEL.JH</p>
            </a>
            <a
              className="flex flex-row items-center gap-4"
              href="https://github.com/maikeljh"
              target="_blank"
            >
              <div>
                <Image src={Github} alt="" />
              </div>
              <p className="text-3xl">MAIKELJH</p>
            </a>
          </div>
        </div>
      </div>

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
    </div>
  );
}
