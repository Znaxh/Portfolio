import React from 'react';
import Intro from "../components/Home/Intro";
import Typewriter from 'typewriter-effect';

export default function Home() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>
      <div className=" text-white h-screen flex flex-col justify-center items-center space-y-4">
        <div className="font-pixel text-xl md:text-3xl mb-2">HI THERE!</div>
        <div className="text-2xl font-raleway md:text-4xl ">I AM</div>
        <div className="text-[#F2613F] font-raleway font-bold text-2xl md:text-4xl">
          <Typewriter
            options={{
              strings: [
                "SOFTWARE DEVELOPER",
                "FREELANCER",
                "MERN STACK DEVELOPER",
                "OPEN SOURCE CONTRIBUTOR",
              ],
              autoStart: true,
              loop: true,
              deleteSpeed: 50,
            }}
          />
        </div>
      </div>
      <Intro />
    </>
  );
}
