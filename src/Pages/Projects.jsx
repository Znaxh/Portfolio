// src/App.jsx
import React from 'react';
import ProjectPanel from '../components/Projects/ProjectPanels';
import image from '../assets/Panel.png'
import Currently from '../components/Projects/Currently';

const projects = [
  {
    title: 'Project One',
    description: 'This is the first project description. hello hello hello heel',
    link: 'https://example.com/project-one',
    demolink: 'https://google.com',
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
      <Currently />
    </div>
  );
};

export default Projects;
