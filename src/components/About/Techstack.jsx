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
    <div className="px-4 ">
      <div className="flex justify-center text-3xl mb-10 space-x-1 ">
        <div className="text-white">Professional</div>
        <span className="text-white"> Skillset</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 px-10">
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiPython className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiJavascript1 className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiReact className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiNodejs className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiMongodb className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <DiGit className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <CgCPlusPlus className="text-white"/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiThreedotjs className="text-white"/>
        </div>
      </div>
    </div>
  );
};

export default Techstack;
