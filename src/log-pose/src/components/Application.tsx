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
      className="mt-6 text-center h-[80vh] flex flex-row gap-10"
    >
      <div className="w-1/2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-row items-center gap-4 mx-auto justify-content">
            <Image src={IconMap} alt="" width={50} />
            <h1 className="font-semibold text-3xl">MAP</h1>
          </div>
          <Map />
        </div>
        <input type="file" id="fileInput" className="w-1/3" />
        <button
          id="a*"
          className={`mt-6 border-2 py-2 px-4 border-black mr-4 bg-white rounded-xl ${
            activeTab === "Start & Goal" ? "" : "hidden"
          }`}
        >
          A*
        </button>
        <button
          id="ucs"
          className={`mt-6 border-2 py-2 px-4 border-black mr-4 bg-white rounded-xl ${
            activeTab === "Start & Goal" ? "" : "hidden"
          }`}
        >
          UCS
        </button>
        <button
          id="add-path"
          className={`mt-6 border-2 py-2 px-4 border-black mr-4 bg-white rounded-xl ${
            activeTab === "Add Path" ? "" : "hidden"
          }`}
        >
          Add
        </button>
        <button
          id="restart"
          className="mt-6 border-2 py-2 px-4 border-black bg-white rounded-xl"
        >
          Restart
        </button>
      </div>
      <div className="w-1/2 flex flex-col gap-10">
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
