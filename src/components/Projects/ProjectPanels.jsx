import React from 'react';
import { BsGithub } from "react-icons/bs";
import { BiLink } from 'react-icons/bi';

const ProjectPanel = ({ title, description, link, demo ,image }) => {
  return (
    <div className="project-panel border border-black border-2   mt-2 mb-4 h-screen">
      <div className="image-container">
        {image && <img src={image} alt={title} className="project-image" />}
        <div className="text-container">
          <h3 className='font-montserrat font-bold text-xl'>PROJECT NAME</h3>
          <p className="description">{description}</p>
          <div className='flex flex-col-2 justify-between relative'>
            <button type='button' onClick={()=>{
              window.open(link, "_blank");
            }} className='inline-flex h-[50px] text-white items-center px-6 py-3 font-medium bg-orange-700 rounded-lg hover:opacity-75' >
              <BsGithub />Github
            </button>
            <button type='button' onClick={()=>{
              window.open(demo, "_blank")
            }} className='inline-flex h-[50px] text-white items-center px-6 py-3 font-medium bg-orange-700 rounded-lg hover:opacity-75'>
              <BiLink />
              Demo 
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPanel;
