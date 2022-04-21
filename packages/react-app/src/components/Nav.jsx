import React from 'react'
import './styles.css'

const Nav = ({ label }) => {
  return (
    <div>
      <span className="hover-underline-animation mr-6 cursor-pointer font-semibold text-lg md:text-xl font mt-2">
        {label}
      </span>
    </div>
  )
}

export default Nav
