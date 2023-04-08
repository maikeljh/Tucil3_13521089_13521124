const About = () => {
  return (
    <div id="about" className="flex flex-col gap-10">
      <div className="mt-[5rem]"></div>
      <div className="bg-white w-5/6 p-8 mx-auto rounded-xl shadow-xl">
        <h1 className="text-5xl mb-4">ABOUT & HOW TO USE</h1>
        <hr className="border-[2px] border-black w-1/2 mb-4"></hr>
        <div className="flex flex-col text-2xl gap-4">
          <p>
            Hello, this is our simple mini-application made for Tucil 3 IF2211
            Strategi Algoritma 2022/2023. We are from Informatics Engineering
            STEI ITB. We are really happy that we can develop this application
            for you to use and we hope you enjoy using our application! :D
          </p>
          <p>To use this application :</p>
          <ol type="1" className="list-decimal ml-6 gap-3 flex flex-col">
            <li>Prepare JSON File</li>
            <li>Choose JSON File</li>
            <li>Choose Start Node</li>
            <li>Choose Goal Node</li>
            <li>Choose A* or UCS</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default About;
