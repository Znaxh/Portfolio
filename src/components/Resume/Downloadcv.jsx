import React from "react";
import { BiDownload } from "react-icons/bi";

const Downloadcv = () => {
  return (
    <div className="flex justify-center text-white font-raleway">
      <button
        className="flex space-x-2 place-content-evenly px-4 py-2 md:px-6 text-sm font-bold rounded-md my-4 border-2 border-gray-500 hover:bg-gray-700 hover:border-white"
        onClick={() => {
          window.open(
            "https://drive.google.com/file/d/1kEhgU9wS9Cxj_uRioF0BwAuOoxVQHxTx/view?usp=sharing",
            "_blank"
          );
        }}
      >
        <BiDownload className="place-items-center text-lg" />
        <div className=" mx-2">Download CV</div>
      </button>
    </div>
  );
};

export default Downloadcv;
