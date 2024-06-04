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
    <div className="bg-gray-100 py-10">
      <div className="flex place-items-center justify-between px-12 mb-8">
        <h3> © {year} </h3>
        <div className="flex place-items-center space-x-2 text-sm font-bold" >
          <div>BACK TO TOP</div>
          <PiArrowCircleUpFill className="text-6xl cursor-pointer" onClick={scrollToTop} />
        </div>
      </div>
      <div className="text-center mb-8">
        <div className="text-lg font-semibold mb-0 p-0">HAVE A PROJECT IN MIND?</div>
        <div className="text-5xl text-gray-500 font-bold mt-0 p-0 leading-none">LET'S TALK</div>
      </div>
      <div className="flex justify-between px-12">
        <div className="flex space-x-2">
          <button
            className="flex space-x-2 place-content-evenly px-6 py-2 text-sm font-bold rounded-full border-2 border-gray-500 hover:bg-white hover:border-black"
            type="button"
            onClick={() => {
              window.open("https://www.linkedin.com", "_blank");
            }}
          >
            LINKEDIN
          </button>
          <button
            className="flex space-x-2 place-content-evenly px-6 py-2 text-sm font-bold rounded-full border-2 border-gray-500 hover:bg-white hover:border-black"
            type="button"
            onClick={() => {
              window.open("https://www.twitter.com", "_blank");
            }}
          >
            TWITTER
          </button>
          <button
            className="flex space-x-2 place-content-evenly px-6 py-2 text-sm font-bold rounded-full border-2 border-gray-500 hover:bg-white hover:border-black"
            type="button"
            onClick={() => {
              window.open("https://www.instagram.com", "_blank");
            }}
          >
            INSTAGRAM
          </button>
        </div>
        <div>
          <button
            className="flex space-x-2 bg-gray-500 place-content-evenly px-4 py-2 text-xl rounded-md border-2 border-white hover:bg-white hover:border-black"
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
