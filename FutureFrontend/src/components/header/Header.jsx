import React from 'react'
import './header.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

import LineChart from '../chart/LineChart';
const Header = () => {
  
  return (
    <div className='header section__padding'>
      <div className="header-content">
      <LineChart/>

        
      </div>
      
    </div>
  )
}

export default Header