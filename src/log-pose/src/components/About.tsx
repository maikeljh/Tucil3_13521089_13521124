const About = () => {
  return (
    <div id="about" className="flex flex-col gap-10">
      <div className="mt-[5rem]"></div>
      <div className="bg-white w-5/6 p-8 mx-auto rounded-xl shadow-xl">
        <h1 className="text-5xl mb-4">ABOUT & HOW TO USE</h1>
        <hr className="border-[2px] border-black w-1/2 mb-4"></hr>
        <div className="flex flex-col text-2xl gap-2">
          <p className="text-justify">
            Hello, this is our simple mini-application made for Tucil 3 IF2211
            Strategi Algoritma 2022/2023. We are from Informatics Engineering
            STEI ITB. We are really happy that we can develop this application
            for you to use and we hope you enjoy using our application! :D
          </p>
          <p className="font-semibold mt-4">To use this application :</p>
          <ol type="1" className="list-decimal ml-6 gap-3 flex flex-col">
            <li>Prepare JSON File {"(Optional)"}.</li>
            <li>Choose your JSON file {"(Optional)"}.</li>
            <li>
              You can add a new node by double clicking the map on the position
              that you want. You can also delete a node by clicking the marker
              and press the delete button.
            </li>
            <li>
              You can add a new path between two markers by choosing the first
              and second node in {`"Add Path"`} tab, then press the add button
              below the map.
            </li>
            <li>
              Choose the start node from the select element in{" "}
              {`"Choose Start And Goal"`} tab.
            </li>
            <li>
              Choose the goal node from the select element in{" "}
              {`"Choose Start And Goal"`} tab.
            </li>
            <li>Press A* or UCS algorithm to find the route.</li>
          </ol>
          <pre className="lg:text-[1.5rem] text-[0.75rem] mt-6">
            The example valid JSON format :{"\n"}
            {JSON.stringify(
              {
                nodes: [
                  {
                    id: 1,
                    name: "Parkir Sipil",
                    latitude: -6.89308,
                    longitude: 107.60864,
                  },
                  {
                    id: 2,
                    name: "Kubus",
                    latitude: -6.893225341866101,
                    longitude: 107.6104810985063,
                  },
                ],
                matrix: [
                  [0, 1],
                  [1, 0],
                ],
              },
              null,
              4
            )}
          </pre>
          <p className="mt-4">
            The id represents the index that starts from 1, the name{`'`}s
            length must be lower than 19, the latitude and longitude must be
            valid, and the matrix also must be an adjacency matrix.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
