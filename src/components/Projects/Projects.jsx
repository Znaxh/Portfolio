// src/App.jsx
import React from 'react';
import ProjectPanel from './ProjectPanels';
import image from '../../assets/Project1.webp'
import dev_secure from '../../assets/Project1.webp'
import algo from '../../assets/final.webp'

const projects = [
  {
    title: 'Youtube Summarizer',
    description: 'Model Comparison of different youtube summarizer models using ROUGE',
    link: 'https://github.com/Znaxh/Youtube_Summarizer_Model_Comparison',
    demolink: 'https://youtubesummarizermodelcomparison-miwyvm7xgfyeuirzw9spal.streamlit.app/',
    image: image
  },
  {
    title: 'Algorithm Visualizer',
    description: 'Visual way to understand the working of algorithms',
    link: 'https://github.com/Znaxh/Algo-Visualizer',
    demolink: 'https://imagine-algo.netlify.app/',
    image: algo
  },
  {
    title: 'Dev Secure',
    description: 'AI-driven web app that detects code vulnerabilities',
    link: 'https://github.com/Znaxh/Devsecure_Hack-a-sol',
    demolink: 'https://github.com/Znaxh/Devsecure_Hack-a-sol',
<<<<<<< HEAD
    image: dev_secure
=======
    image: 
>>>>>>> 9715590bae4313dd61ccaabb7e3735c6b8b5d5b7
  },
];

const Projects = () => {
  return (
    <div className="">
      <div className="absolute font-raleway  inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500" />
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
