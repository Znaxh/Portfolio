import React from 'react'
import {
    SiVisualstudiocode,
    SiPostman,
    SiWindows,
    SiNetlify,
    SiWindows10,
    SiWindows95,
    SiVercel,
    
  } from "react-icons/si";

const Toolstack = () => {
  return (
    <div className="px-4 ">
      <div className="flex justify-center text-3xl mb-10 space-x-1">
        <div>Tools I</div>
        <span className="text-gray-700">Use</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 px-10">
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiVisualstudiocode/>
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiPostman />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiWindows10 />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiNetlify />
        </div>
        <div className="text-6xl bg-gray-200 border border-black rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiVercel />
        </div>
      </div>
    </div>
  )
}

export default Toolstack