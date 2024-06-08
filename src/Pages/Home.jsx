import React from 'react';
import Intro from "../components/Home/Intro";
import Typewriter from 'typewriter-effect';

export default function Home() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>
      <div className="flex flex-col justify-center items-center h-screen text-white space-y-4"style={{ marginTop: '-50px' }}>
        <div className="font-pixeltext-xl md:text-3xl mb-2">HI!</div>
        <div className="text-xl font-raleway md:text-3xl">
          I'M <span className="text-[#F2613F] font-raleway font-semibold">ANURAG PRATAP SINGH</span>
        </div>
        <div className="text-[#F2613F] font-raleway font-bold text-2xl md:text-4xl">
          <Typewriter
            options={{
              strings: [
                "SOFTWARE DEVELOPER",
                "FREELANCER",
                "MERN STACK DEVELOPER",
                "OPEN SOURCE CONTRIBUTOR",
                "ML Enthusiast"
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
