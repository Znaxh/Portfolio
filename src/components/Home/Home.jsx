import React from "react";
import Intro from "./Intro";
import Typewriter from "typewriter-effect";
import { Sparkles } from "../Sparkles";

export default function Home() {
  return (
    <>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
      <div className="flex mt-16 flex-col justify-center items-center h-screen text-white space-y-4">
        <div className="font-pixel text-lg md:text-xl mb-2">HI!</div>
        <div className="text-xl font-raleway md:text-3xl">
          I'M{" "}
          <span className=" font-display font-semibold">
            ANURAG PRATAP SINGH
          </span>
        </div>
        <div className="text-indigo-200 font-raleway font-bold text-2xl md:text-4xl relative">
          <Typewriter
            options={{
              strings: [
                "SOFTWARE DEVELOPER",
                "MERN STACK DEVELOPER",
                "OPEN SOURCE CONTRIBUTOR",
                "ML ENTHUSIAST",
              ],
              autoStart: true,
              loop: true,
              deleteSpeed: 50,
            }}
          />
        </div>
        <div className="relative mt-32 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-40 after:absolute after:-left-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-[#7876c566] after:bg-zinc-900">
          <Sparkles
            density={1200}
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
          />
        </div>
      </div>
      <Intro />
    </>
  );
}
