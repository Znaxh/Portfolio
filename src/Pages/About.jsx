import React from "react";
import Github from "../components/About/Github";
import Techstack from "../components/About/Techstack";
import Toolstack from "../components/About/Toolstack";
import Aboutcard from "../components/About/Aboutcard";

const About = () => {
  return (
    <>
      <div className="space-y-24">
        <Aboutcard />
        <Techstack />
        <Toolstack />
        <Github />
      </div>
    </>
  );
};

export default About;
