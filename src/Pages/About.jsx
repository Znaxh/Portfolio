import React from "react";
import Github from "../components/About/Github";
import Techstack from "../components/About/Techstack";
import Toolstack from "../components/About/Toolstack";
import Aboutcard from "../components/About/Aboutcard";

const About = () => {
  return (
    <>
      <div className="space-y-16">
        <div className="absolute inset-0 bg-grid-white/10 bg-grid-16 [mask-image:linear-gradient(180deg,black,transparent)]" />
        <Aboutcard />
        <Techstack />
        <Toolstack />
        <Github />
      </div>
    </>
  );
};

export default About;
