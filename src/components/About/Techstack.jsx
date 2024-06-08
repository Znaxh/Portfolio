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
    <div className="px-4  font-raleway">
      <div className="flex justify-center font-semibold text-3xl mb-10 space-x-1 ">
        <div className="text-white">Professional</div>
        <span className="text-[#F2613F]"> Skillsets</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 px-10">
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center transition-transform hover:scale-110">
          <DiPython className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center transition-transform hover:scale-110">
          <DiJavascript1 className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center transition-transform hover:scale-110">
          <DiReact className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center transition-transform hover:scale-110">
          <DiNodejs className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center transition-transform hover:scale-110">
          <DiMongodb className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center transition-transform hover:scale-110">
          <DiGit className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center transition-transform hover:scale-110">
          <CgCPlusPlus className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center transition-transform hover:scale-110">
          <SiThreedotjs className="text-white"/>
        </div>
      </div>
    </div>
  );
};

export default Techstack;
