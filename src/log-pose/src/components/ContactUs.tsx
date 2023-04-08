import Image from "next/image";
import Ken from "../../public/img/anjay.jpg";
import Mike from "../../public/img/mabar.jpeg";
import Instagram from "../../public/img/instagram.png";
import Github from "../../public/img/github.png";

const ContactUs = () => {
  return (
    <div id="contact-us" className="mb-12 flex flex-col gap-10">
      <div className="mt-[4rem]"></div>
      <h1 className="text-center text-6xl font-bold">CONTACT US</h1>
      <div className="bg-white rounded-xl flex flex-row w-5/6 mx-auto p-8 items-center gap-16 shadow-4 shadow-black drop-shadow-lg">
        <div className="">
          <Image src={Ken} alt="" width={300} />
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
          <Image src={Mike} alt="" width={300} />
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
  );
};

export default ContactUs;
