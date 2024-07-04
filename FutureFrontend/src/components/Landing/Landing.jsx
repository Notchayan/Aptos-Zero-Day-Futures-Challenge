import React from 'react'
import "./landing.css"
import { motion } from "framer-motion";
import { Leftward, Sideward, Sideward2, Upward, textVariant, zoomIn } from '../../Framer';
import { useNavigate } from 'react-router';
const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className='landing'>
      <motion.h1 {...Sideward2} whileHover={{ scale: 1.06 }} className='landing-header'>Feel The Power Of Futures</motion.h1>
      <motion.p {...Sideward} whileHover={{ scale: 1.05 }} className='landing-para'>Trade in Future</motion.p>
      <motion.div {...Sideward2} whileTap={{ scale: 0.95 }} whileHover={{ backgroundColor: "#0e73c2", scale: 1.1 }} className='landing_div' onClick={() => navigate("/trade")}>Trade Now</motion.div>
      <motion.img {...zoomIn} whileHover={{ scale: 1.02 }} custom={.5} src='./trade.svg' alt='trade'></motion.img>
    </div>
  )
}

export default Landing
