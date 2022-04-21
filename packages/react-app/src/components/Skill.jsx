import React from 'react'

const Skill = ({ src, alt, label }) => {
  return (
    <div className="flex flex-col justify-center items-center rounded w-64 md:w-56 lg:w-64 mr-10 mb-10 bg-white shadow-color">
      <img className="shadow-lg rounded w-60 mb-2 p-4" src={src} alt={alt} />
      <span className="mb-5 font-semibold text-lg font">{label}</span>
    </div>
  )
}

export default Skill
