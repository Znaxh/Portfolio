// src/App.jsx
import React from 'react';
import ProjectPanel from '../components/Projects/ProjectPanels';
import image from '../assets/Panel.png'

const projects = [
  {
    title: 'Project One',
    description: 'This is the first project description. hello hello hello heel',
    link: 'https://example.com/project-one',
    image: image
  },
  {
    title: 'Project Two',
    description: 'This is the second project description.',
    link: 'https://example.com/project-two',
    image: image
  },
  {
    title: 'Project One',
    description: 'This is the first project description.',
    link: 'https://example.com/project-one',
    image: image
  },
  // Add more projects here
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
            image={project.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Projects;
