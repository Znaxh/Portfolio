import React from 'react';

const ProjectPanel = ({ title, description, link, image }) => {
  return (
    <div className="project-panel">
      <div className="image-container">
        {image && <img src={image} alt={title} className="project-image" />}
        <div className="text-container">
          <h3 className='font-montserrat font-bold text-xl'>PROJECT NAME</h3>
          <p className="description">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default ProjectPanel;
