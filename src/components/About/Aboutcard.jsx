import React from "react";
import profile from '../../assets/profile.webp';

const Aboutcard = () => {
  return (
    <div className="h-screen flex justify-center">
      <div className="flex font-raleway text-white px-6 md:px-10">
        <div className="absolute inset-0 bg-grid-gray-700 bg-grid-16 [mask-image:linear-gradient(180deg,black,transparent)] z-0" />
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 z-10" />
        <div className="relative flex flex-col md:flex-row h-full z-10">
          <div className="flex justify-center md:justify-start w-full md:w-2/5">
            <img src={profile} alt="Profile" className="rounded-md mt-10 md:mt-0 md:self-center filter brightness-90" />
          </div>
          <div className="flex flex-col justify-center mt-10 md:mt-0 space-y-4 w-full md:w-3/5 p-4 md:p-10">
            <div className="flex justify-center">
              <div className="text-3xl font-semibold text-center">
                KNOW WHO <span className="text-indigo-200">I'M</span>
              </div>
            </div>
            <div className="text-xl leading-loose text-center md:text-left">
              Hi Everyone, I am{" "}
              <span className="text-indigo-200 font-semibold">Anurag Pratap Singh</span> from
              Raipur, India. I am currently a third year student at International
              Institute Of Information Technology Naya Raipur.
            </div>
            <div className="text-lg text-center md:text-left">
              <div>Apart from coding, other activities that I love to do:</div>
              <ul className="list-disc list-inside md:pl-4">
                <li>Playing Games</li>
                <li>Drawing</li>
                <li>Football</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aboutcard;
