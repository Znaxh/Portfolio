import React from "react";
import Github from "./Github";
import Techstack from "./Techstack";
import Toolstack from "./Toolstack";
import Aboutcard from "./Aboutcard";

const About = () => {
  return (
    <>
      <div className="space-y-16">
        <Aboutcard />
        <Techstack />
        <Toolstack />
        <Github />
      </div>
    </>
  );
};

export default About;
