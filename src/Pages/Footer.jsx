import React from "react";

const Footer = () => {
  let date = new Date();
  let year = date.getFullYear();
  return (
    <div>
      <div>
        <h3> © {year} </h3>
      </div>
      <div>
        HAVE A PROJECT IN MIND?
      </div>
      <div>
        LET'S TALK
      </div>
      <div className="flex space-x-2">
        <button type='button'>INSTAGRAM</button>
        <button type='button'>LINKEDIN</button>
        <button type='button'>TWITTER</button>
      </div>
      <div>
        <div>
        BACK TO TOP
        </div>
        <button type='button'>Arrow Up</button>
      </div>
    </div>
  );
};

export default Footer;
