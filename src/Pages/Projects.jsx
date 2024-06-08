// src/App.jsx
import React from 'react';
import ProjectPanel from '../components/Projects/ProjectPanels';
import image from '../assets/Project1.png'

const projects = [
  {
    title: 'Youtube Summarizer',
    description: 'This is the first project description. hello hello hello heel',
    link: 'https://github.com/AnuragSingh4845/Youtube_Summarizer_Model_Comparison',
    demolink: 'https://youtubesummarizermodelcomparison-miwyvm7xgfyeuirzw9spal.streamlit.app/',
    image: image
  },
  {
    title: 'Project Two',
    description: 'This is the second project description.',
    link: 'https://example.com/project-two',
    demolink: 'https://google.com',
    image: image
  },
  {
    title: 'Project Three',
    description: 'This is the first project description.',
    link: 'https://example.com/project-one',
    demolink: 'https://google.com',
    image: image
  },
  {
    title: 'Project Four',
    description: 'This is the first project description.',
    link: 'https://example.com/project-one',
    demolink: 'https://google.com',
    image: image
  }
];

const Projects = () => {
  return (
    <div className="">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>
      <div className="comic-grid">
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
