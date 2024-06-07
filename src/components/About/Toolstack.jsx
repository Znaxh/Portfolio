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
      <div className="flex justify-center text-3xl mb-10 space-x-1 text-white">
        <div>Tools I</div>
        <span className="text-[#F2613F]">Use</span>
      </div>
      <div className="flex flex-wrap justify-center gap-4 px-10">
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiVisualstudiocode className='text-white'/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiPostman className='text-white'/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiWindows10 className='text-white'/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiNetlify className='text-white'/>
        </div>
        <div className="text-6xl border border-white rounded-md w-48 h-28 py-2 flex items-center justify-center">
          <SiVercel className='text-white'/>
        </div>
      </div>
    </div>
  )
}

export default Toolstack