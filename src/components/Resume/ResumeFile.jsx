import React from 'react'
import resumeimage from '../../assets/pdf_page-0001.jpg'

const ResumeFile = () => {
  return (
    <div className='justify-center flex mt-16 '>
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500"></div>
        <img src={resumeimage} alt="resume.jpg" />
    </div>
  )
}

export default ResumeFile