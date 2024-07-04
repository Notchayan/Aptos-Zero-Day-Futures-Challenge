import './App.css';
import {Navbar,Footer} from './components'
import {Home,Profile,Item,Login} from './pages'
import { Routes, Route } from "react-router-dom";
import { AptosClient, Network, Provider } from "aptos";
import { useState } from 'react';
import { accountContext } from './Context';
import Profile2 from "./components/Myprofile/Profile"

export const provider = new Provider(Network.TESTNET);
// change this to be your module account address
export const moduleAddress = "0x92a01c3c59651dd142311da7b9e4e37a01bda3da7bbceb51119f83e0e0c058a1";

function App() {
  const [account,setAccount]=useState("");

  return (
    <div>
    <accountContext.Provider value={{account,setAccount}}>
    <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path=":item/:id" element={<Profile2 />} />
            <Route path="/trade" element={<Profile />} />
            <Route path="/login" element={ <Login />} />
          </Routes>
      <Footer />

    </accountContext.Provider>
      
    </div>
  );
}

export default App;
