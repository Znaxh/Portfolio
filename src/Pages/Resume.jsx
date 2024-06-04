import React from 'react'
import resumeimage from '../assets/pdf_page-0001.jpg'

const onButtonClick = () => {
  const pdfUrl = "Sample.pdf";
  const link = document.createElement("a");
  link.href = pdfUrl;
  link.download = "document.pdf"; // specify the filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Resume = () => {
  return (
    <>
      <img src={resumeimage} />
      <button className='pixel-button' onClick={()=>{
        window.open('https://drive.google.com/file/d/1OWMh-iav8fue-ztvt7q5OOqZE_s-2WUx/view','_blank')
      }}>Download CV</button>
      
    </>
  )
}

export default Resume