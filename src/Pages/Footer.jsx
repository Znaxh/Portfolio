import React from "react";
import { AiFillStar } from "react-icons/ai";
import { CgGitFork } from "react-icons/cg";
import { PiArrowCircleUpFill } from "react-icons/pi";

const Footer = () => {
  let date = new Date();
  let year = date.getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="bg-[#151a1e] border-t py-10 text-white">
      <div className="flex flex-col md:flex-row place-items-center justify-between px-6 md:px-12 mb-8">
        <h3> © {year} </h3>
        <div className="flex place-items-center space-x-2 text-sm font-bold mt-4 md:mt-0">
          <div>BACK TO TOP</div>
          <PiArrowCircleUpFill
            className="text-3xl md:text-6xl cursor-pointer text-gray-500 hover:text-white"
            onClick={scrollToTop}
          />
        </div>
      </div>
      <div className="text-center mb-8 px-6 md:px-0">
        <div className="text-lg font-semibold mb-0 p-0">HAVE A PROJECT IN MIND?</div>
        <div className="text-3xl md:text-5xl font-bold mt-0 p-0 leading-none">LET'S TALK</div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 space-y-4 md:space-y-0">
        <div className="flex space-x-2">
          <button
            className="flex space-x-2 place-content-evenly px-4 py-2 md:px-6 text-sm font-bold rounded-full border-2 border-gray-500 hover:bg-gray-700 hover:border-white"
            type="button"
            onClick={() => {
              window.open("https://www.linkedin.com", "_blank");
            }}
          >
            LINKEDIN
          </button>
          <button
            className="flex space-x-2 place-content-evenly px-4 py-2 md:px-6 text-sm font-bold rounded-full border-2 border-gray-500 hover:bg-gray-700 hover:border-white"
            type="button"
            onClick={() => {
              window.open("https://www.instagram.com", "_blank");
            }}
          >
            DISCORD
          </button>
          <button
            className="flex space-x-2 place-content-evenly px-4 py-2 md:px-6 text-sm font-bold rounded-full border-2 border-gray-500 hover:bg-gray-700 hover:border-white"
            type="button"
            onClick={() => {
              window.open("https://www.instagram.com", "_blank");
            }}
          >
            MAIL
          </button>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            className="flex space-x-2 bg-gray-900 place-content-evenly px-4 py-2 text-xl rounded-md border-2 border-gray-500 hover:bg-gray-700 hover:border-white"
            type="button"
            onClick={() => {
              window.open("https://github.com/AnuragSingh4845/port", "_blank");
            }}
          >
            <CgGitFork />
            <AiFillStar />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
