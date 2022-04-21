import React from "react";
import "./header.css";

const Nav = ({ label }) => {
  return (
    <div>
      <span className="hover-underline-animation mr-6 cursor-pointer">
        {label}
      </span>
    </div>
  );
};

export default Nav;
