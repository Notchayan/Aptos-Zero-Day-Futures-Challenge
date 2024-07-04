import React, { useContext, useState ,useEffect, useRef} from 'react';
import './Profile.css'
import { Provider, Network } from "aptos";
import LineChart from '../../components/chart/LineChart';
import { accountContext } from '../../Context';
import Popup from '../../components/popup/pop';
import { GoArrowDown, GoArrowSwitch, GoArrowUp } from "react-icons/go";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
// import RedChart from '../../components/chart/RedChart';
import GreenChart from '../../components/chart/GreenChart';
import MarqueeComponent from '../../components/Marque/marque';
import { Leftward, Rightward, Sideward, Upward } from '../../Framer';
import {motion} from "framer-motion";
import Loader from "../Loader/Loader";
import ReactApexChart from 'react-apexcharts';
import { Line } from 'react-chartjs-2';

const provider = new Provider(Network.DEVNET);

const moduleAddress = "0x238aadd09c5abd7016f05e0df345c624ba85e1d0a2fb52584936180d55abb327";
const Profile = () => {
  const { account } = useContext(accountContext);
  const [buyList,setBuyList]=useState([]);
  const [sellList,setSellList]=useState([]);
  const [successList,setSuccessList]=useState([1,2]);
  const [clickSuccessData,setClickSuccessData] = useState([]);
  const [paymenttype,setpaymenttype]=useState(false);
  const [side, setSide] = useState(false);
  const [isOpen, setIsOpen]= useState(false);
  const [marketPrice,setMarketPrice]=useState(1);
  const [index,setIndex]= useState(0);
  const [quantity,setQuantity]=useState(1);
  const [limitprice,setLimitPrice]=useState(1);
  const [leverage,setLeverage]=useState(5);
  const [editNDays,setEditNDays]=useState(1);
  const [payload,setPayload]=useState(null);
  const [coin,setCoin]=useState(1);
  const [buyPrice,setBuyPrice]=useState(1000);
  const [sellPrice,setSellPrice]=useState(1000);
  const [currentTab,setCurrentTab]=useState(1);
  //Chayan
  const [Marketlist, setMarketlist] = useState([]);
  const [lasthigh, setlasthigh] = useState(0);
  const [lastopen, setlastopen] = useState(0);
  const [lastclosed, setlastclosed] = useState(0);
  const [lastlow, setlastlow] = useState(0);
  const [length1, setlength1] = useState(0);
  const [RiskStatus, SetRiskStatus] = useState("wait ...");
  const [loading,setLoading]=useState(true);


  const focusElement = useRef(null);
  const focusElement2 = useRef(null);
///Chayan
  const [series, setSeries] = useState(() => {
    const storedSeries = localStorage.getItem('candlestickSeries');
    return storedSeries ? JSON.parse(storedSeries) : [{ data: [] }];
  });

  const storedData = JSON.parse(localStorage.getItem('CMP')) || [];
  const [CMP, setCMP] = useState(storedData);
  const coinArray=["Coin1","Coin2","Coin3","Coin4","Coin5"];

  async function openHighLowClosed() {
    let cointype=coinArray[coin];
    try {
      const response = await fetch(`http://localhost:8000/update`+`/${cointype}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      const marketPrice = data.data;
      console.log(marketPrice);
      if (marketPrice.length !== length1) {
        let high = 0;
        let low = 100000;
        let open = marketPrice[length1];
        let closed = marketPrice[marketPrice.length - 1];
        for (let index = Marketlist.length - 1; index < marketPrice.length; index++) {
          const element = marketPrice[index];
          if (element > high) {
            high = element;
          }
          if (element < low) {
            low = element;
          }
        }
        setMarketlist(marketPrice);
        setlastopen(closed);
        setlasthigh(closed);
        setlastclosed(closed);
        setlastlow(closed);
        setlength1(marketPrice.length);
        return [open, high, low, closed];
      } else {
        return [lastopen, lasthigh, lastlow, lastclosed];
      }
    } catch (error) {
      console.error('Error fetching Candle stick', error.message);
      return '';
    }
  }

  async function fetchDataAndUpdateSeries() {
    const arrayoffour = await openHighLowClosed();
    const newopen = arrayoffour[0];
    const newhigh = arrayoffour[1];
    const newlow = arrayoffour[2];
    const closed = arrayoffour[3];
  
    console.log("****This is Series*****");
    console.log(series[0].data);
    
    setSeries((prevSeries) => {
      const seriesData = prevSeries[0].data;
      const newSeriesData = {
        x: new Date().getTime(),
        y: [newopen, newhigh, newlow, closed],
      };
  
      // Keep only the last 20 elements in the series data
      const updatedSeriesData = [...seriesData.slice(-19), newSeriesData];
  
      return [{ data: updatedSeriesData }];
    });
  }
  

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDataAndUpdateSeries();
    }, 5000); // update every 5 seconds
  
    return () => clearInterval(interval); // cleanup on unmount
  }, [Marketlist]); // Add Marketlist as a dependency

  ///Chayan

  const optionsApex = {
    chart: {
      type: 'candlestick',
      height: 450,
    },
    title: {
      text: 'MarketPrice Chart',
      align: 'left',
    },
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      tooltip: {
        enabled: true,
      },
    },
  };
  
  

  const options = {
    responsive: true,
    animation: false,
    plugins: {
      title: {
        text: 'Current Price Line Chart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5000,
      },
    },
  };

  const data = {
    labels: CMP.map((_, index) => index),
    datasets: [
      {
        label: 'Current Market Price',
        data: CMP,
        backgroundColor: 'green',
        borderColor: 'green',
        borderWidth: 2,
        pointRadius: 2,
      },
    ],
  };

  async function CurrentMarketPricefetch() {
    let cointype=coinArray[coin];
    try {
      const response = await fetch(`http://localhost:8000/update`+`/${cointype}`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();

      // Assuming responseData.data is an array
      const marketPrice = responseData.data[responseData.data.length - 1];

      return marketPrice;
    } catch (error) {
      console.error('Error fetching market price:', error.message);
      return '';
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newCurrentMarketPrice = await CurrentMarketPricefetch();
        console.log('New Current Market Price:', newCurrentMarketPrice);

        // Update state and localStorage
        const updatedCMP = [...CMP, newCurrentMarketPrice];
        const marketlissst = updatedCMP.slice(-21); 
        setCMP(marketlissst);
        localStorage.setItem('CMP', JSON.stringify(updatedCMP));

      } catch (error) {
        console.error('Error fetching current market prices:', error.message);
      }
    };

    const intervalId = setInterval(fetchData, 1 * 1000);

    return () => clearInterval(intervalId);
  }, [CMP]);

//Chyaan

  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
  const handleTab=(num)=>{
    setCurrentTab(num);
  }
  
  const updateSuccessOrder = async (data,index) => {
    togglePopup();
    setClickSuccessData(data);
    setIndex(index);
    
  }
  const handleCOin=(e)=>{
    setCoin(e.target.value);
    console.log(e.target.value);
  }
  const handleQuantity=(e)=>{
    setQuantity(e.target.value);
  }
  const handleLeverage=(e)=>{
    setLeverage(e.target.value);
  }
  const handleLimitPrice=(e)=>{
    setLimitPrice(e.target.value);
  }
  const handleEditDays=(e)=>{
    setEditNDays(e.target.value);
  }
  
  
  // setIndex(index);
    

  const getMarketPrice=async()=>{
    let cointype=coinArray[coin];

try {
  const marketPrice = await provider.getAccountResource(
    moduleAddress,
    `${moduleAddress}::${cointype}::MarketPrice`,
  );
  console.log(`${moduleAddress}::${cointype}::MarketPrice`)
  let a=Number(marketPrice.data.data);
  console.log("MarketPrice",a);
  setMarketPrice(a);
  
} catch (error) {
  console.log(error);
  
}
  }
const fetchBuySellList = async () => {
  let cointype=coinArray[coin];
  console.log("Cointype",cointype);

  try {
    const buyList = await provider.getAccountResource(
      moduleAddress,
      `${moduleAddress}::${cointype}::BuyOrder`,
    );
    setBuyList(buyList.data.orders);
    const sellList = await provider.getAccountResource(
      moduleAddress,
      `${moduleAddress}::${cointype}::SellOrder`,
    );
    setSellList(sellList.data.orders);
    
  } catch (error) {
    console.log(error);
  }
}
  const fetchSuccessOrderList = async () => {
    let cointype=coinArray[coin];

    try {
      const successList = await provider.getAccountResource(
        moduleAddress,
        `${moduleAddress}::${cointype}::TotalSuccessOrder`,
      );
      setSuccessList(successList.data.orders);
      
    } catch (error) {
      console.log(error);
    }
  }

  // const getBuySellMarketPrice=()=>{
  //   let cointype="Coin1";
  //   if(coin==1){
  //     cointype="Coin1";
  //   }
  //   else{
  //     cointype="Coin2";
  //   }
  //   if(side){
  //     return marketPrice;
  //   }
  //   else{
  //     return marketPrice;
  //   }
  // }

  

  const buyTransaction = async () => {
    let cointype=coinArray[coin];
    if (!account) return [];
    if(leverage==0){
      alert("Leverage can,t be Zero");
      return [];
    }
    const date=new Date(Date.now());
    const today=date.getDate();

    // build a transaction payload to be submited 
    // const payload=null;
      let payload={
        type: "entry_function_payload",
        function: `${moduleAddress}::${cointype}::place_Order`,
        type_arguments: [],
        arguments:  [leverage*quantity,limitprice, Math.floor(new Date().getTime() / 1000),today, side, leverage],
      }
    try {
      // sign and submit transaction to chain
      const response = await window.aptos.signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);

      ///Check**************************
      await fetch(`http://localhost:8000/Orderplaced`+`/${cointype}`);

      fetchBuySellList();
      fetchSuccessOrderList();
      getMarketPrice();
    } catch (error) {
      console.log(error);
    }
  };
  const buyMarketTransaction = async () => {
    let cointype=coinArray[coin];
    if (!account) return [];
    if(leverage==0){
      alert("Leverage can,t be Zero");
      return [];
    }
    const date=new Date(Date.now());
    const today=date.getDate();
    // build a transaction payload to be submited 
    // const payload=null;
      let payload = {

        type: "entry_function_payload",
        function: `${moduleAddress}::${cointype}::market_place_Order`,
        type_arguments: [],
        arguments:  [leverage*quantity, Math.floor(new Date().getTime() / 1000),today, side, leverage],
      };

    try {
      // sign and submit transaction to chain
      const response = await window.aptos.signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);

      /// Check Name 
      await fetch(`http://localhost:8000/Orderplaced`+`/${cointype}`);
      
      fetchBuySellList();
      fetchSuccessOrderList();
      getMarketPrice();
    } catch (error) {
      console.log(error);
    }
  };

  const nDayChange = async() => {
    let cointype=coinArray[coin];
    
    if (!account) return [];
    const date=new Date(Date.now());
    const today=date.getDate();
    // build a transaction payload to be submited 
    const payload = {

      type: "entry_function_payload",
      function: `${moduleAddress}::${cointype}::editSuccessOrders`,
      type_arguments: [],
      arguments:  [index,editNDays],
    };
    try {
      // sign and submit transaction to chain
      const response = await window.aptos.signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      console.log("Order Placed");
      // fetchBuySellList();
      fetchSuccessOrderList();
      setIsOpen(false);
      setEditNDays(1);
    } catch (error) {
      console.log(error);
    }

  }
  const calculateProfit=(side ,price)=>{
    if(side){
      if(price>=marketPrice){
        return true;
      }
    }
    else{
      if(price<=  marketPrice){
        return true;
      }
    }
    return false;

  }

  const buyClick=()=>{
    setSide(false);
  }
  const sellClick=()=>{
    setSide(true);
  }
  const handlePaymentType=(paymenttype)=>{
    setpaymenttype(paymenttype);
  }

  //****Chayan***************** */

  async function SellMarketPricefetch() {
    let cointype=coinArray[coin];
    try {
      const response = await fetch(`http://localhost:8000/SellMarketPrice`+`/${cointype}`);
      console.log(`http://localhost:8000/SellMarketPrice`+`/${cointype}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      // Extract the integer value from the JSON response
      const sellmarketprice = parseInt(data.SellMarketPrice, 10);
      // You can return the integer directly or wrap it in an array, as needed
      return sellmarketprice;
    } catch (error) {
      console.error('Error fetching SellMarketPrice:', error.message);
      // You might want to handle errors appropriately based on your use case
      // For simplicity, returning an empty array in case of an error
      return 0;
    }
  }
  async function BuyMarketPricefetch() {
    let cointype=coinArray[coin];
    try {
      const response = await fetch(`http://localhost:8000/BuyMarketPrice`+`/${cointype}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      // Extract the integer value from the JSON response
      const buymarketprice = parseInt(data.BuyMarketPrice, 10);
      // You can return the integer directly or wrap it in an array, as needed
      return buymarketprice;
    } catch (error) {
      console.error('Error fetching SellMarketPrice:', error.message);
      // You might want to handle errors appropriately based on your use case
      // For simplicity, returning an empty array in case of an error
      return 0;
    }
  }
  
  async function CurrentMarketPricefetch() {
   let cointype=coinArray[coin];
    try {
      const response = await fetch(`http://localhost:8000/update`+`/${cointype}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      // Extract the last element from the "data" array
      const marketPrice = data.data[data.data.length - 1];
  
      return marketPrice;
  
    } catch (error) {
      console.error('Error fetching market price:', error.message);
      // You might want to handle errors appropriately based on your use case
      // For simplicity, returning an empty string in case of an error
      return '';
    }
  }
  

  


  async function RiskStatusfetch() {
    let cointype=coinArray[coin];
    try {
      const response = await fetch(`http://localhost:8000/riskStat`+`/${cointype}`);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      // Extract the last element from the "data" array
      return data.result;
  
    } catch (error) {
      console.error('Error fetching market price:', error.message);
      // You might want to handle errors appropriately based on your use case
      // For simplicity, returning an empty string in case of an error
      return '';
    }
  }


  useEffect(() => {
    const fetchData = async () => {
      try {
        const newSellprice = await SellMarketPricefetch();
        const newBuyprice = await BuyMarketPricefetch();
  
        setBuyPrice(newBuyprice);
        setSellPrice(newSellprice);
      } catch (error) {
        console.error('Error fetching market prices:', error.message);
      }
    };
  
    const intervalId = setInterval(fetchData, 1000);
  
    return () => clearInterval(intervalId);
  }, [buyPrice, sellPrice]);


  useEffect( () => {
    const fetchData = async () => {
        try {
          const newCurrentMarketPrice = await CurrentMarketPricefetch();
          setMarketPrice(newCurrentMarketPrice);
        } catch (error){
          console.error('Error fetching current market prices:', error.message);
        }
    };
    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, [marketPrice]);

  useEffect( () => {
    const fetchData = async () => {
        try {
          const newRiskStatus = await RiskStatusfetch();
          SetRiskStatus(newRiskStatus);
        } catch (error){
          console.error('Error fetching current market prices:', error.message);
        }
    };
    const intervalId = setInterval(fetchData, 3 * 1000);

    return () => clearInterval(intervalId);
  }, [RiskStatus]);


  // **************Chayan*****************


//   useEffect(() => {
//     const intervalId = setInterval(()=>{
//         let num=Math.random()*100+4637;
//         // console.log(num);
//         // console.log(dataSet);
//         setBuyPrice(num+10);
        
//         // setBuyList({...buyList, newObject: {price: num, amount: num }})
//         setSellPrice(num-10);
//     },3*1000);

//     // Clear the interval when the component unmounts
//     return () => clearInterval(intervalId);
// }, [buyPrice,sellPrice]);

useEffect(() => {
  if (focusElement.current) {
    focusElement.current.scrollTop=focusElement.current.scrollHeight;
  }
  
}, [sellList, buyList]);
useEffect(() => {
  
  if (focusElement2.current) {
    focusElement2.current.scrollTop=focusElement2.current.scrollHeight;
  }
}, [sellList, buyList]);
 
useEffect(() => {
  const intervalId = setInterval(() => {
      console.log("coinChange",coin);

      fetchBuySellList();
      console.log("hel")
      fetchSuccessOrderList();
      getMarketPrice();
      setLoading(false);
  }, 2000); // 5000 milliseconds = 5 seconds

  // Cleanup function to clear the interval when the component unmounts
  return () => clearInterval(intervalId);
}, [coin, marketPrice]);


  return (
    <>{loading  ? <Loader/> :
    <div className='content_page'>
      <div className='sec-1'>
        <div className='top_bar'>
          <select onChange={handleCOin} name='coin'>
            <option value={1}>Coin1</option>
            <option value={2}>Coin2</option>
          </select>
        <div className='market_price'>
          <div className=''>
          <motion.p {...Upward} whileHover={{scale:1.05}} className='text_small'>Sell Price</motion.p>
          <p className='center textred'>{sellPrice} <GoArrowDown size={23} /> </p>

          </div>
          <div className=''>
            <motion.p  {...Rightward} whileHover={{scale:1.05}}  className='text_small'>Buy Price</motion.p>
            <p className='center textgreen'>{buyPrice} <GoArrowUp size={23} /> </p>
          </div>
          <div>
            <motion.p {...Sideward} whileHover={{scale:1.05}} >Expiry Time</motion.p>
            <p className='orange_'>{new Date(Date.now()).getDate()+1}</p>
          </div>
        </div>
        
        
        </div>
        <div className='risk-box'>
          <motion.p whileHover={{scale:1.02}} {...Leftward}  className='text_small risk'>Risk Status</motion.p>
          <motion.p whileHover={{scale:1.05}} {...Leftward}  className='orange_'>Noty ho raha hai ke ..... ke</motion.p>
        </div>
      </div>
      <div className='sec-2'>
        <div className='place_order'>

          <div className='place_order1'>
          <div className='tab_'>
          <p className={!side ? "active_tab place_buy" : "place_buy" } onClick={buyClick}>Buy</p>
          <p className={side ? "active_tab place_buy" : "place_buy"} onClick={sellClick}>Sell</p>

          </div>
          <h3>Place Order</h3>
          <div className='market_area'>
            <motion.p whileHover={{scale:1.1}} className={paymenttype ? "unactive" : "active"} onClick={()=>handlePaymentType(false)}>Market</motion.p>
            <motion.p whileHover={{scale:1.1}} className={paymenttype ? "active" : "unactive"} onClick={()=>handlePaymentType(true)}>Limit</motion.p>

          </div>
          <motion.div whileHover={{scale:1.01}}>
            <label>Amount:</label>
            <input className='order_input' name='quantity' value={quantity} onChange={handleQuantity} placeholder='Enter Amount' type='number'/>
          </motion.div>
          <motion.div whileHover={{scale:1.01}}>
            <label>Price :</label>
            <input className='order_input' name='limitprice' disabled={!paymenttype} value={paymenttype ? limitprice : marketPrice  } onChange={handleLimitPrice} placeholder='Enter Price' type='number'/>

          </motion.div>
          
          
          <div>
            <input className='place_range' name='leverage' type='range' min={0} max={20} step={5} value={leverage} onChange={handleLeverage}/>
            <span className='span_test'>Leverage Value : {leverage}</span>

          </div>
          
          <p>Total Amount : {!paymenttype ? quantity*marketPrice : quantity*limitprice} </p>
          {!side ? 
          <p className='span_test'>Liquidation Price: {!paymenttype ? (marketPrice-((marketPrice*90)/(quantity*leverage*100)) ): Number(limitprice)-Number((limitprice*90)/(quantity*leverage*100)) }</p>
:
          <p className='span_test'>Liquidation Price: {!paymenttype ? (marketPrice+((marketPrice*90)/(quantity*leverage*100)) ): Number(limitprice)+Number((limitprice*90)/(quantity*leverage*100)) }</p>
          
          }
          <div className='place_button'>
            <motion.button whileHover={{scale:1.01}} className='place_buy orange' onClick={paymenttype ?buyTransaction : buyMarketTransaction}>Create Order</motion.button>
          </div>


          </div>
        </div>
        <div className='order_book'>
          <div className='order_book1'>
            <h3>Order Book</h3>
            <div className='table_book'>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>

            </div>
            <hr></hr>
            
            <div ref={focusElement2} className='sell_order order-content'>
            {sellList.map((d,i)=>(
              <div key={i} className='table_book' > 
                {!d.matched &&
              <>
              <span className='sell_price'>{d.price}</span>
                <span>{d.amount}</span>
                <span>{d.amount*d.price}</span>

              </>
                }

              </div>
              
            ))}
            </div>
            <hr/>
            <p className='center'>Market Price : {marketPrice} &nbsp; <GoArrowSwitch/></p>
            <hr/>
            <div ref={focusElement} className='sell_order order-content'>
              {buyList.map((d,i)=>(
                
                <div key={i} className='table_book'> 
                {!d.matched &&
              <>
              <span className='buy_price'>{d.price}</span>
                <span>{d.amount}</span>
                <span>{d.amount*d.price}</span>

              </>
                }

              </div>
                
              ))}
            </div>

            
          </div>
        </div>
        <div className='chart_book'>
        {currentTab==2 && <Line options={options} data={data} />}
        {currentTab==1 && 
      <ReactApexChart options={optionsApex} series={series} type="candlestick" height={450} />
      }
          <div className='chart_tab'>
            <p className={currentTab==1 && "active_tab"} id='chart_tab1' onClick={()=>handleTab(1)}>Candle</p>
            <p className={currentTab==2 && "active_tab"} id='chart_tab1' onClick={()=>handleTab(2)}>Normal</p>

          </div>
        </div>
      </div>
      {/* <GreenChart/> */}
      <div className="success-book-box">
          <motion.h2 {...Sideward}>Successful Order</motion.h2>
          <div className="suc-content">
                <table>
                <tr>
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Trader</th>
                  <th>Expiry</th>
                  <th>Type</th>
                  <th>Profit / Loss</th>
                  <th>Edit</th>
                </tr>
                
            
                {successList.map((d,i)=>(
                  <>
                
                  {d.trader == account &&
                    <motion.tr whileHover={{scale:1.06}} key={i} {...Leftward} custom={i} className='suc-sub' id={calculateProfit(d.side,d.price) ? "green" :"red"}>
                  <td>{d.amount}</td>
                  <td>{d.price}</td>
                  <td>{d.trader.slice(0,8)+"..."+d.trader.slice(-4)}</td>
                  <td>{d.n_days}</td>
                  <td>{d.side? "Seller" : "Buyer"}</td>
                  <td>{!d.side ? (marketPrice-d.price)*d.amount : (d.price-marketPrice)*d.amount}</td>
                  <td><button className='n_day_button' onClick={()=>updateSuccessOrder(d,i)}>Edit</button></td> 
                  
                  </motion.tr>}</>
                
              ))}

      
              </table>
              {isOpen && <Popup 
              handleClose={togglePopup}
              content={<div className='EditSuccessData'>
           
                <h2>Successful Order</h2>
                <p>Address : {clickSuccessData?.trader.slice(0,7)+"..."+clickSuccessData.trader.slice(-7)}</p>
                <p>Price : {clickSuccessData.price}</p>
                <p>Quantity : {clickSuccessData.amount}</p>
                <p>Days fo expiry : {clickSuccessData.n_days}</p>
                <label htmlFor="quantity" className="quantity-text">
              Extend Expiry Date
            </label>
            <input
              type="number"
              id="quantity"
              name="editNDays"
              placeholder='Enter No. of Days '
              value={editNDays}
              onChange={(e)=>setEditNDays(e.target.value)}
              className='n_days-input'
            />
                <button className='n_day_button' onClick={nDayChange}>Confirm</button>
              </div>
              }/>}
            
             
              
          </div>
      </div>
      <MarqueeComponent/>


    </div>}</>
  );
};

export default Profile;
