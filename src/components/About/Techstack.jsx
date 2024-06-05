import React from "react";
import { CgCPlusPlus } from "react-icons/cg";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
} from "react-icons/di";
import { SiThreedotjs } from "react-icons/si";

const Techstack = () => {
  return (
    <div className="px-4">
      <div className="flex justify-center text-3xl mb-10 space-x-1">
        <div>Professional</div>
        <span className="text-gray-700"> Skillset</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 px-10">
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiPython />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiJavascript1 />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiReact />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiNodejs />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiMongodb />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiGit />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <CgCPlusPlus />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiThreedotjs />
        </div>
      </div>
    </div>
  );
};

export default Techstack;
