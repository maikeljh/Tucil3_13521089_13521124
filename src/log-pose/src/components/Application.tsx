import Image from "next/image";
import IconMap from "../../public/img/iconmap.png";
import dynamic from "next/dynamic";
import Tab from "./Tab";
import { useState } from "react";

const Map = dynamic(() => import("./map"), { ssr: false });

const Application = () => {
  const [activeTab, setActiveTab] = useState("Add Path");

  return (
    <div
      id="features"
      className="mt-6 text-center xl:h-[80vh] flex flex-col xl:flex-row gap-10"
    >
      <div className="xl:w-1/2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4 mx-auto justify-content">
            <Image src={IconMap} alt="" width={50} />
            <h1 className="font-semibold text-3xl">MAP</h1>
          </div>
          <Map />
        </div>
        <input
          type="file"
          id="fileInput"
          className="w-1/3 shadow-lg mr-6 flex-auto rounded border border-solid border-neutral-400 bg-clip-padding px-3 py-[0.32rem] text-base font-semibold text-black transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-white focus:border-primary focus:text-neutral-700 focus:shadow-[0_0_0_1px] focus:shadow-primary focus:outline-none"
        />
        <button
          id="a*"
          className={`mt-6 mr-4 bg-white border-2 rounded-xl px-6 py-2 font-semibold text-black border-b-4 rounded shadow-lg active:shadow-none active:translate-y-[2px] ${
            activeTab === "Start & Goal" ? "" : "hidden"
          }`}
        >
          A*
        </button>
        <button
          id="ucs"
          className={`mt-6 mr-4 bg-white border-2 rounded-xl px-6 py-2 font-semibold text-black border-b-4 rounded shadow-lg active:shadow-none active:translate-y-[2px] ${
            activeTab === "Start & Goal" ? "" : "hidden"
          }`}
        >
          UCS
        </button>
        <button
          id="add-path"
          className={`mt-6 mr-4 bg-white border-2 rounded-xl px-6 py-2 font-semibold text-black border-b-4 rounded shadow-lg active:shadow-none active:translate-y-[2px] ${
            activeTab === "Add Path" ? "" : "hidden"
          }`}
        >
          Add
        </button>
        <button
          id="restart"
          className="mt-6 bg-white border-2 rounded-xl px-6 py-2 font-semibold text-black border-b-4 rounded shadow-lg active:shadow-none active:translate-y-[2px]"
        >
          Restart
        </button>
      </div>
      <div className="xl:w-1/2 flex flex-col gap-10">
        <Tab activeTab={activeTab} setActiveTab={setActiveTab} />
        <div>
          <div className="bg-white w-5/6 mx-auto shadow-lg rounded-xl p-4 min-h-[8rem]">
            <h1 className="font-semibold text-2xl mb-2">ROUTE</h1>
            <hr className="border-[1px] border-black"></hr>
            <p className="text-lg my-auto font-semibold mt-2" id="route"></p>
          </div>
        </div>
        <div>
          <div className="bg-white w-5/6 mx-auto shadow-lg rounded-xl p-4 min-h-[8rem]">
            <h1 className="font-semibold text-2xl mb-2">DISTANCE</h1>
            <hr className="border-[1px] border-black"></hr>
            <p className="text-lg my-auto font-semibold mt-2" id="distance"></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;
