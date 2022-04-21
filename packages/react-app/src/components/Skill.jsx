import React from "react";

const Skill = ({ src, alt, label }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <img className="shadow-lg rounded w-60 mb-2 p-4" src={src} alt={alt} />
      <span className="mb-5 font-semibold">{label}</span>
    </div>
  );
};

export default Skill;
