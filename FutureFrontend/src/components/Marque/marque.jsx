
import React, { useEffect, useState } from 'react';
import Marquee from 'react-fast-marquee';
import './MarqueeComponent.css'; // Create a CSS file for styling

const MarqueeComponent = () => {
  const [coinForm,setCoinForm] =useState({coin1:0,coin2:0,coin3:0,coin4:0,coin5:0,coin6:0});
  const InstrumentNumber = ["5001", "5002", "5003", "6001", "6002", "6003"];
  const fetchCoinsMarketPrice=async()=>{
    try {
      const response1 = await fetch(`https://apturesapitrade.onrender.com/MarketHistory/5001`);
      const data1 = await response1.json();
      
      const response2 = await fetch(`https://apturesapitrade.onrender.com/MarketHistory/5002`);
      const data2 = await response2.json();
      
      const response3 = await fetch(`https://apturesapitrade.onrender.com/MarketHistory/5003`);
      const data3 = await response3.json();
      
      console.log("Helllllllll",data3 , data1 ,data2);
      
    //  setCoinForm({coin1:data1[0].price,coin2:data2[0].price,coin3:data3[0].price,coin4:0,coin5:0,coin6:0});
      
      
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("COinPage")
    fetchCoinsMarketPrice();

    const intervalId = setInterval(fetchCoinsMarketPrice, 5000); // 5000 milliseconds = 5 seconds
    return () => clearInterval(intervalId);
}, []); // Empty dependency array means this effect runs once on mount and unmount
  return (
    <div className='marquee-container'>
      <Marquee>
        <div className='coin'>
          <h3> &nbsp; Coin 1 : +5.12% &nbsp;&nbsp; |&nbsp; </h3>
        </div>
        <div className='coin'>
          <h3>&nbsp; Coin 2 : +2.12% &nbsp;&nbsp;| &nbsp;</h3>
        </div>
        <div className='coin'>
          <h3> &nbsp;Coin 3 : -3.12% &nbsp;&nbsp;|&nbsp; </h3>
        </div>
        <div className='coin'>
          <h3>&nbsp; Coin 4 : +2.12% &nbsp;&nbsp;|&nbsp; </h3>
        </div>
        <div className='coin'>
          <h3>&nbsp; Coin 5 : +1.12% &nbsp;&nbsp;| &nbsp;</h3>
        </div>
        <div className='coin'>
          <h3> &nbsp; Coin 1 : +5.12% &nbsp;&nbsp; |&nbsp; </h3>
        </div>
        <div className='coin'>
          <h3>&nbsp; Coin 2 : +2.12% &nbsp;&nbsp;| &nbsp;</h3>
        </div>
        <div className='coin'>
          <h3> &nbsp;Coin 3 : -3.12% &nbsp;&nbsp;|&nbsp; </h3>
        </div>
        <div className='coin'>
          <h3>&nbsp; Coin 4 : +2.12% &nbsp;&nbsp;|&nbsp; </h3>
        </div>
        <div className='coin'>
          <h3>&nbsp; Coin 5 : +1.12% &nbsp;&nbsp;| &nbsp;</h3>
        </div>
        <div className='coin'>
          <h3> &nbsp; Coin 1 : +5.12% &nbsp;&nbsp; |&nbsp; </h3>
        </div>
        <div className='coin'>
          <h3>&nbsp; Coin 2 : +2.12% &nbsp;&nbsp;| &nbsp;</h3>
        </div>
        <div className='coin'>
          <h3> &nbsp;Coin 3 : -3.12% &nbsp;&nbsp;|&nbsp; </h3>
        </div>
        <div className='coin'>
          <h3>&nbsp; Coin 4 : +2.12% &nbsp;&nbsp;|&nbsp; </h3>
        </div>
        <div className='coin'>
          <h3>&nbsp; Coin 5 : +1.12% &nbsp;&nbsp;| &nbsp;</h3>
        </div>
      </Marquee>
    </div>
  );
};

export default MarqueeComponent;
