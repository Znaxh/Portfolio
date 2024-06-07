import React from 'react';
import Type from "../components/Home/Type";
import Intro from "../components/Home/Intro";

export default function Home() {
  return (
    <>
      <div className=" bg-[#151a1e] text-[#F2613F] h-screen flex flex-col justify-center items-center">
        <div className="font-pixel mb-4">Hi There!</div>
        <div className="mb-4"> I am </div>
        <Type />
      </div>
        <Intro />
    </>
  );
}
