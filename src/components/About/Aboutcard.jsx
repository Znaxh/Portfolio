import React from "react";

const Aboutcard = () => {
  return (
    <>
    <div className="flex h-screen font-raleway text-white px-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
        <div className="justify-center mt-[100px]  space-y-4 relative w-3/5">
          <div className="flex space-x-1 justify-center">
            <div className="text-3xl font-semibold">
              KNOW WHO <span className="text-[#F2613F]">I'M</span>
            </div>
          </div>
          <div className="text-xl leading-loose">
            Hi Everyone, I am{" "}
            <span className="text-[#F2613F] font-semibold">Anurag Pratap Singh</span> from
            Raipur, India. I am currently a third year student at International
            Institute Of Information Technology Naya Raipur.
          </div>
          <div className="text-lg ">
            <div>Apart from coding other actvities that I love to do!</div>
            <div className="px-4">
              <li>Playing Games</li>
              <li>Drawing</li>
              <li>Football</li>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Aboutcard;
