// src/App.jsx
import React from 'react';
import ProjectPanel from './ProjectPanels';
import image from '../../assets/Project1.webp'

const projects = [
  {
    title: 'Youtube Summarizer',
    description: 'Model Comparison of different youtube summarizer models using ROUGE',
    link: 'https://github.com/AnuragSingh4845/Youtube_Summarizer_Model_Comparison',
    demolink: 'https://youtubesummarizermodelcomparison-miwyvm7xgfyeuirzw9spal.streamlit.app/',
    image: image
  },
];

const Projects = () => {
  return (
    <div className="">
      <div className="absolute font-raleway inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
      <div className="comic-grid mb-4">
        {projects.map((project, index) => (
          <ProjectPanel
            key={index}
            title={project.title}
            description={project.description}
            link={project.link}
            demo={project.demolink}
            image={project.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
