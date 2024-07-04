import React, { useContext, useState } from 'react'

import './navbar.css'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/logo.png'
import banner from '../../assets/LOGO.jpg'
import { Link } from "react-router-dom";
import { accountContext } from '../../Context';
import {motion} from "framer-motion";
import { Sideward, Sideward2 } from '../../Framer';
const Menu = () => (
  <>
    <Link to="/"><p>Explore</p> </Link>

  </>
)

const Navbar = () => {
  const {setAccount}= useContext(accountContext);
  const [connected, setConnection] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false)
  const [user, setUser] = useState(false)

  const handleLogout = () => {
    setUser(false);
  }
  const handleLogin = () => {
    setUser(true);
  }
  const connect = async () => {
    if (window.aptos != undefined) {
      console.log("Helli")
      try {
        const response = await window.aptos.connect();
        setConnection(true);
        setAccount(response.address);
        console.log(response);

      } catch (error) {
        setConnection(false);
        console.log(error);

      }
    }

  }
  const disconnect = async () => {
    await window.aptos.disconnect();
    setConnection(false);

  }

  return (
    <div className='navbar'>
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img src={logo} alt="logo" />
          <Link to="/">
            <motion.h1 {...Sideward} whileHover={{scale:1.1}}>A P T U R E S</motion.h1>
          </Link>
        </div>
      </div>
      <div className="navbar-sign">
        
          <>
            <motion.button whileHover={{scale:1.1}} {...Sideward2} type='button' className={connected ? "secondary-btn" : "primary-btn"} onClick={connected ? disconnect : connect}>{connected ? "Disconnect" : "Connect"}</motion.button>
          </>



      </div>
      <div className="navbar-menu">
        {toggleMenu ?
          <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
          <div className="navbar-menu_container scale-up-center" >
            <div className="navbar-menu_container-links">
              <Menu />
            </div>
            <div className="navbar-menu_container-links-sign">
                  <button type='button' className='secondary-btn' onClick={connected ? disconnect : connect}>{connected ? "Disconnect" : "Connect"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
