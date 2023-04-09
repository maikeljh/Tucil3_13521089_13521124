const Tab = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) => {
  return (
    <div className="bg-white w-5/6 mx-auto shadow-xl rounded-xl">
      <div className="text-left flex flex-row">
        <button
          onClick={() => setActiveTab("Add Path")}
          className={`w-1/2 p-4 rounded-tl-xl ${
            activeTab === "Add Path" ? "font-semibold" : "bg-gray-200"
          }`}
        >
          Add Path
        </button>
        <button
          onClick={() => setActiveTab("Start & Goal")}
          className={`w-1/2 p-4 rounded-tr-xl ${
            activeTab === "Start & Goal" ? "font-semibold" : "bg-gray-200"
          }`}
        >
          Choose Start And Goal
        </button>
      </div>
      <div className="px-4 pb-8 pt-4">
        <div
          className={`flex flex-col ${
            activeTab === "Start & Goal" ? "" : "hidden"
          }`}
        >
          <h1 className="font-semibold text-3xl mb-2">CHOOSE START & GOAL</h1>
          <hr className="border-[1px] border-black mb-4"></hr>
          <div className="flex flex-row gap-20 items-center w-full px-10">
            <div className="flex flex-col w-full gap-2">
              <h2 className="text-lg font-semibold">Start Node</h2>
              <select
                id="start-node"
                className="shadow-lg rounded-xl py-2 px-2 border-2 border-black scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-rounded-xl break-words"
              ></select>
            </div>
            <div className="flex flex-col w-full gap-2">
              <h2 className="text-lg font-semibold">Goal Node</h2>
              <select
                id="goal-node"
                className="shadow-lg rounded-xl py-2 px-2 border-2 border-black scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-rounded-xl break-words"
              ></select>
            </div>
          </div>
        </div>
        <div
          className={`flex flex-col ${
            activeTab === "Start & Goal" ? "hidden" : ""
          }`}
        >
          <h1 className="font-semibold text-3xl mb-2">ADD PATH</h1>
          <hr className="border-[1px] border-black mb-4"></hr>
          <div className="flex flex-row gap-20 items-center w-full px-10">
            <div className="flex flex-col w-full gap-2">
              <h2 className="text-lg font-semibold">First Node</h2>
              <select
                id="first-node"
                className="shadow-lg rounded-xl py-2 px-2 border-2 border-black scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-rounded-xl break-words"
              ></select>
            </div>
            <div className="flex flex-col w-full gap-2">
              <h2 className="text-lg font-semibold">Second Node</h2>
              <select
                id="second-node"
                className="shadow-lg rounded-xl py-2 px-2 border-2 border-black scrollbar scrollbar-thin scrollbar-thumb-gray-400 scrollbar-rounded-xl break-words"
              ></select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tab;
