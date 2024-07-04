import React from 'react'
import './bids.css'
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import bids1 from '../../assets/bids1.png'
import bids2 from '../../assets/bids2.png'
import bids3 from '../../assets/bids3.png'
import bids4 from '../../assets/bids4.png'
import bids5 from '../../assets/bids5.png'
import bids6 from '../../assets/bids6.png'
import bids7 from '../../assets/bids7.png'
import bids8 from '../../assets/bids8.png'
import { Link } from 'react-router-dom';
const BidCard = () => {
  return (
    <div className="card-column" >
      <div className="bids-card">
        <div className="bids-card-top">
          <img src={bids1} alt="" />
          <Link to={`/post/123`}>
            <p className="bids-title">Abstact Smoke Red</p>
          </Link>
        </div>
        <div className="bids-card-bottom">
          <p>1.25 <span>ETH</span></p>
          <p> <AiFillHeart /> 92</p>
        </div>
      </div>
    </div>

  )
}

const Bids = ({ title }) => {
  const clickHandler=()=>{
    
  }
  return (
    <div className='bids section__padding'>
      <div className="bids-container">
        <div className="bids-container-text">
          <h1>{title}</h1>
        </div>
        <div className="bids-container-card">
            <BidCard onClick={clickHandler}/> 
        </div>
      </div>

    </div>
  )
}

export default Bids
