import React from 'react'
import Header from '../components/Header'

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center bg pt-28">{children}</div>
    </>
  )
}

export default Layout
