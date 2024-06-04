import React from "react";
import { BiDownload } from "react-icons/bi";

const Downloadcv = () => {
  return (
    <div>
      <button
        className="flex bg-gray-500 rounded-md my-2 py-2 px-4 border place-items-center hover:bg-white hover:border-black hover:border-2"
        onClick={() => {
          window.open(
            "https://drive.google.com/file/d/1OWMh-iav8fue-ztvt7q5OOqZE_s-2WUx/view",
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
