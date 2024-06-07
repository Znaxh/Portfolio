import React from "react";

const Aboutcard = () => {
  return (
    <>
      <div className="flex h-screen  text-white px-10">
        <div className="justify-center place-content-evenly space-y-4  relative w-3/5">
          <div className="flex space-x-1 justify-center">
            <div className="text-3xl">
              KNOW WHO <span className="text-gray-500">I'M</span>
            </div>
          </div>
          <div className="text-lg leading-loose">
            Hi Everyone, I am{" "}
            <span className="text-gray-500">Anurag Pratap Singh</span> from
            Raipur, India. I am currently a third year student at International
            Institute Of Information Technology Naya Raipur.
          </div>
          <div className="text-lg ">
            <div>Apart from coding other actvities that I love to do!</div>
            <div className="px-4">
              <li>Gaming</li>
              <li>Bakchodi</li>
              <li>Football</li>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutcard;
