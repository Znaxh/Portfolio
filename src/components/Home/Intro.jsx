import React from 'react';

const Intro = () => {
  return (
    <div className='h-screen font-raleway text-white flex justify-center items-center' style={{ marginTop: '-50px' }}>
      <div className="max-w-4xl p-8 text-center space-y-6">
        <div className="text-4xl font-bold mb-4">Let Me Introduce Myself</div>
        <div className="text-lg leading-relaxed">
          Whenever possible, I also apply my passion for developing products with
          <span className="text-indigo-200 font-semibold"> Node.js</span> and Modern Javascript
          Library and Frameworks like <span className="text-indigo-200 font-semibold">React.js</span> and
          <span className="text-indigo-200 font-semibold"> Next.js</span>.
        </div>
        <div className="text-lg leading-relaxed">
          My field of interest includes building new Web Technologies and Products, as well as areas related to
          <span className="text-indigo-200 font-semibold"> Blockchain</span>.
        </div>
        <div className="text-lg leading-relaxed">
          I am fluent in classics like <span className="text-indigo-200 font-semibold">C++</span>, 
          <span className="text-indigo-200 font-semibold"> Javascript</span>, and <span className="text-indigo-200 font-semibold">Python</span>.
        </div>
        <div className="text-lg leading-relaxed">
          My field of interest includes building new Web Technologies and Products, as well as areas related to
          <span className="text-indigo-200 font-semibold"> Cybersecurity</span>.
        </div>
      </div>
    </div>
  );
}

export default Intro;
