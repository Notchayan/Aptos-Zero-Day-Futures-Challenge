import React, { useContext, useState, useEffect, useRef } from 'react';
import './profile.css'
import { Provider, Network } from "aptos";
// import LineChart from '../../components/chart/LineChart';
import { accountContext } from '../../Context';
import Popup from '../../components/popup/pop';
import { GoArrowDown, GoArrowSwitch, GoArrowUp } from "react-icons/go";
// import RedChart from '../../components/chart/RedChart';
// import GreenChart from '../../components/chart/GreenChart';
import { motion } from 'framer-motion';
import { Backward, Downward, Leftward, Rightward, Sideward, Upward } from '../../Framer';
import Loader from '../../components/Loader/Loader';
import { Line } from 'react-chartjs-2';
import ReactApexChart from 'react-apexcharts';

const provider = new Provider(Network.DEVNET);

const moduleAddress = "0x4141c1954708e9f30d5e9342bd223d7ba1681c9278774327b4f81e522015efbb";
const Profile = () => {

  const { account } = useContext(accountContext);
  const [buyList, setBuyList] = useState([]);
  const [sellList, setSellList] = useState([]);
  const [successList, setSuccessList] = useState([1, 2]);
  const [clickSuccessData, setClickSuccessData] = useState([]);
  const [paymenttype, setpaymenttype] = useState(false);
  const [side, setSide] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [marketPrice, setMarketPrice] = useState(1);
  const [index, setIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [limitprice, setLimitPrice] = useState(1);
  const [leverage, setLeverage] = useState(5);
  const [editNDays, setEditNDays] = useState(1);
  const [payload, setPayload] = useState(null);
  const [coin, setCoin] = useState(0);
  const coinArray = ["Coin1", "Coin2"];
  const [buyPrice, setBuyPrice] = useState(1000);
  const [sellPrice, setSellPrice] = useState(1000);
  const [currentTab, setCurrentTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [RiskStatus, SetRiskStatus] = useState("wait ...");
  const focusElement = useRef(null);
  const focusElement2 = useRef(null);
  const InstrumentNumber = ["5001", "5002", "5003", "6001", "6002", "6003"];
  const [InstrumentTokenSelected, SetInstrumentTokenSelected] = useState(0);
  const [lasthigh, setlasthigh] = useState([0, 0, 0, 0, 0, 0]);
  const [lastopen, setlastopen] = useState([0, 0, 0, 0, 0, 0]);
  const [lastclosed, setlastclosed] = useState([0, 0, 0, 0, 0, 0]);
  const [lastlow, setlastlow] = useState([0, 0, 0, 0, 0, 0]);
  const [length1, setlength1] = useState([0, 0, 0, 0, 0, 0]);
  const [series1, setSeries1] = useState(() => {
    const storedSeries = localStorage.getItem('candlestickSeries');
    return storedSeries ? JSON.parse(storedSeries) : [{ data: [] }];
  });
  const [series2, setSeries2] = useState(() => {
    const storedSeries = localStorage.getItem('candlestickSeries');
    return storedSeries ? JSON.parse(storedSeries) : [{ data: [] }];
  });
  const [series3, setSeries3] = useState(() => {
    const storedSeries = localStorage.getItem('candlestickSeries');
    return storedSeries ? JSON.parse(storedSeries) : [{ data: [] }];
  });
  const [series4, setSeries4] = useState(() => {
    const storedSeries = localStorage.getItem('candlestickSeries');
    return storedSeries ? JSON.parse(storedSeries) : [{ data: [] }];
  });
  const [series5, setSeries5] = useState(() => {
    const storedSeries = localStorage.getItem('candlestickSeries');
    return storedSeries ? JSON.parse(storedSeries) : [{ data: [] }];
  });
  const [series6, setSeries6] = useState(() => {
    const storedSeries = localStorage.getItem('candlestickSeries');
    return storedSeries ? JSON.parse(storedSeries) : [{ data: [] }];
  });
  const [dataSet, setData] = useState([100, 200, 300]);

  const dataArray = [];
  const [Marketlist, setMarketlist] = useState([[1], [1], [1], [1], [1], [1]]);
  // const storedData1 = JSON.parse(localStorage.getItem('CMP1')) || [];
  // const [CMP1, setCMP1] = useState(storedData1);
  // const storedDate2 = JSON.parse(localStorage.getItem('CMP2')) || [];
  // const [CMP2, setCMP2] = useState(storedData2);
  // const storedDate3 = JSON.parse(localStorage.getItem('CMP3')) || [];
  // const [CMP3, setCMP3] = useState(storedData3);
  // const storedDate4 = JSON.parse(localStorage.getItem('CMP4')) || [];
  // const [CMP4, setCMP4] = useState(storedData4);
  // const storedDate5 = JSON.parse(localStorage.getItem('CMP5')) || [];
  // const [CMP5, setCMP5] = useState(storedData5);
  // const storedDate6 = JSON.parse(localStorage.getItem('CMP6')) || [];
  // const [CMP6, setCMP6] = useState(storedData6);

  //   dataArray[i] = {
  //     labels: dataSet?.map((chart, index) => index) || [],
  //     datasets: [
  //       {
  //         label: 'Current BuyPrice Per Min',
  //         data: Array.isArray(Marketlist[i]) ? Marketlist[i].map((chart, index) => chart) : [],
  //         backgroundColor: 'green',
  //         borderColor: 'green',
  //         borderWidth: 2,
  //         pointRadius: 2,
  //       }
  //     ],
  //   };
  // }
  // async function CurrentMarketPricefetch() {
  //   try {

  //       let returnvalue = [];
  //       for(let i = 0; i < 6; i++){
  //         const Instrument = InstrumentNumber[i];
  //         const response = await fetch(`http://127.0.0.1:8000/MarketHistory/${Instrument}`);
  //         const data = await response.json();
  //         const list1 = data["Market History List"].map(entry => parseFloat(entry.price));
  //         returnvalue.push(list1[list1.length - 1]);
  //       }
  //     return returnvalue;
  //   } catch (error) {
  //     console.error('Error fetching market price:', error.message);
  //     return '';
  //   }
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //         const newCurrentMarketPrice = await CurrentMarketPricefetch();
  //       console.log('New Current Market Price:', newCurrentMarketPrice);

  //       // Update state and localStorage
  //       for(let i = 0; i < 6 ; i++){
  //         const updatedCMP = [...CMP1, newCurrentMarketPrice[i]];
  //         const marketlissst = updatedCMP.slice(-21); 
  //         setCMP(marketlissst);
  //         localStorage.setItem('CMP1', JSON.stringify(updatedCMP));
  //       }
  //     } catch (error) {
  //       console.error('Error fetching current market prices:', error.message);
  //     }
  //   };

  //   const intervalId = setInterval(fetchData, 1 * 1000);

  //   return () => clearInterval(intervalId);
  // }, [CMP]);

  // const storedData1 = JSON.parse(localStorage.getItem('CMP1')) || [];
  // const [CMP1, setCMP1] = useState(storedData1);
  // const storedData2 = JSON.parse(localStorage.getItem('CMP2')) || [];
  // const [CMP2, setCMP2] = useState(storedData2);
  // const storedData3 = JSON.parse(localStorage.getItem('CMP3')) || [];
  // const [CMP3, setCMP3] = useState(storedData3);
  // const storedData4 = JSON.parse(localStorage.getItem('CMP4')) || [];
  // const [CMP4, setCMP4] = useState(storedData4);
  // const storedData5 = JSON.parse(localStorage.getItem('CMP5')) || [];
  // const [CMP5, setCMP5] = useState(storedData5);
  // const storedData6 = JSON.parse(localStorage.getItem('CMP6')) || [];
  // const [CMP6, setCMP6] = useState(storedData6);

  // const storedData = JSON.parse(localStorage.getItem('CMP')) || [];
  const [CMP, setCMP] = useState([0]);
  const [MarketCMP, setMarketCMP] = useState(0);


  async function CurrentMarketPricefetch() {
    try {
      const response = await fetch(`http://127.0.0.1:8000/MarketHistory/5001`);
      const data = await response.json();
      const list1 = data["Market History List"].map(entry => parseFloat(entry.price));
      console.log(list1);
      console.log("yes hayn")
      setMarketCMP(list1[list1.length - 1]);
      return list1[list1.length - 1];
    } catch (error) {
      console.error('Error fetching market price:', error.message);
      return [];
    }
  }
  // async function CurrentMarketPricefetch() {
  //   let cointype=coinArray[coin];
  //   try {
  //     const response = await fetch(`http://localhost:8000/update`+`/${cointype}`);

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const responseData = await response.json();
  //     const list11 = responseData["Market History List"].map(entry => parseFloat(entry.price));
  //     // Assuming responseData.data is an array
  //     const marketPrice = list11.data[list11.data.length - 1];
  //     return marketPrice;
  //   } catch (error) {
  //     console.error('Error fetching market price:', error.message);
  //     return '';
  //   }
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newCurrentMarketPrice = await CurrentMarketPricefetch();
        console.log('New Current Market Price:', newCurrentMarketPrice);

        // Update state and localStorage
        const updatedCMP = [...CMP, newCurrentMarketPrice];
        const marketlissst = updatedCMP.slice(-21);
        console.log("Market", marketlissst);
        setCMP(marketlissst);
        // localStorage.setItem('CMP', JSON.stringify(updatedCMP));

      } catch (error) {
        console.error('Error fetching current market prices:', error.message);
      }
    };

    const intervalId = setInterval(fetchData, 1 * 1000);

    return () => clearInterval(intervalId);
  }, [CMP]);


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

  // Fetching Buy and Sell Price
  async function SellMarketPricefetch() {
    let cointype = coinArray[coin];
    let Instrument = InstrumentNumber[coin];
    try {
      const response = await fetch(`http://127.0.0.1:8000/SellMarketPrice/5001`);


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
    // let cointype=coinArray[coin];
    let Instrument = InstrumentNumber[coin];

    try {
      // const response = await fetch(`http://localhost:8000/BuyMarketPrice`+`/${cointype}`);
      const response = await fetch(`http://127.0.0.1:8000/BuyMarketPrice/5001`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();


      // Extract the integer value from the JSON response
      const buymarketprice = parseInt(data.BuyMarketPrice.Price, 10);

      // You can return the integer directly or wrap it in an array, as needed
      return buymarketprice;
    } catch (error) {
      console.error('Error fetching SellMarketPrice:', error.message);
      // You might want to handle errors appropriately based on your use case
      // For simplicity, returning an empty array in case of an error
      return 0;
    }
  }

  //Risk Status

  async function RiskStatusfetch() {
    let cointype = coinArray[coin];
    let Instrument = InstrumentNumber[coin];
    try {
      const response = await fetch(`http://127.0.0.1:8000/riskStat/5001`);

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
      return 'Wait...';
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newSellprice = await SellMarketPricefetch();
        const newBuyprice = await BuyMarketPricefetch();
        const newRiskStatus = await RiskStatusfetch();
        SetRiskStatus(newRiskStatus);
        setBuyPrice(newBuyprice);
        setSellPrice(newSellprice);
      } catch (error) {
        console.error('Error fetching market prices:', error.message);
      }
    };

    const intervalId = setInterval(fetchData, 1000);

    return () => clearInterval(intervalId);
  }, [buyPrice, sellPrice, RiskStatus]);



  const seriesArray = [series1, series2, series3, series4, series5, series6];
  async function openHighLowClosed() {
    try {
      let returnarray = [];
      for (let i = 0; i < 6; i++) {
        const Instrument = InstrumentNumber[i];
        const response = await fetch(`http://127.0.0.1:8000/MarketHistory/5001`);
        const data = await response.json();
        // console.log("Hello");
        // console.log(data);
        const marketPrice = data["Market History List"].map(entry => parseFloat(entry.price));

        if (marketPrice.length !== length1[i]) {
          let high = 0;
          let low = 100000;
          let open = marketPrice[length1[i]];
          let closed = marketPrice[marketPrice.length - 1];

          for (let index = marketPrice.length - 1; index >= length1[i]; index--) {

            const element = marketPrice[index];
            console.log("Elemnt", element);
            if (element > high) {
              high = element;
            }
            else if (element < low) {
              low = element;
            }
          }

          lastopen[i] = closed;
          lasthigh[i] = closed;
          lastclosed[i] = closed;
          lastlow[i] = closed;
          length1[i] = marketPrice.length;

          setMarketlist(marketPrice);
          setlastopen(lastopen);
          setlasthigh(lasthigh);
          setlastclosed(lastclosed);
          setlastlow(lastlow);
          returnarray.push(open);
          returnarray.push(high);
          returnarray.push(low);
          returnarray.push(closed);
        } else {
          returnarray.push(lastopen[i]);
          returnarray.push(lasthigh[i]);
          returnarray.push(lastlow[i]);
          returnarray.push(lastclosed[i]);
        }
      }
      return returnarray;

    } catch (error) {
      console.error('Error fetching Candle stick', error.message);
      return '';
    }
  }


  async function fetchDataAndUpdateSeries() {
    const data = await openHighLowClosed();

    const updateSeries = (prevSeries, dataSlice) => {
      const seriesData = prevSeries[0].data;
      const newSeriesData = {
        x: new Date().getTime(),
        y: dataSlice,
      };


      const updatedSeriesData = [...seriesData.slice(-19), newSeriesData];

      return [{ data: updatedSeriesData }];
    };
    setSeries1((prevSeries) => updateSeries(prevSeries, [data[0], data[1], data[2], data[3]]));
    setSeries2((prevSeries) => updateSeries(prevSeries, [data[4], data[5], data[6], data[7]]));
    setSeries3((prevSeries) => updateSeries(prevSeries, [data[8], data[9], data[10], data[11]]));
    setSeries4((prevSeries) => updateSeries(prevSeries, [data[12], data[13], data[14], data[15]]));
    setSeries5((prevSeries) => updateSeries(prevSeries, [data[16], data[17], data[18], data[19]]));
    setSeries6((prevSeries) => updateSeries(prevSeries, [data[20], data[21], data[22], data[23]]));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDataAndUpdateSeries();
    }, 3 * 1000); // update every 3 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [Marketlist]);







  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
  const handleTab = (num) => {
    setCurrentTab(num);
  }

  const updateSuccessOrder = async (data, index) => {
    togglePopup();
    setClickSuccessData(data);
    setIndex(index);

  }
  const handleCOin = (e) => {
    setLoading(true);
    setCoin(e.target.value);
    setLoading(false);
    console.log(e.target.value);
  }
  const handleQuantity = (e) => {
    setQuantity(e.target.value);
  }
  const handleLeverage = (e) => {
    setLeverage(e.target.value);
  }
  const handleLimitPrice = (e) => {
    setLimitPrice(e.target.value);
  }
  const handleEditDays = (e) => {
    setEditNDays(e.target.value);
  }


  // setIndex(index);


  const getMarketPrice = async () => {
    let cointype = coinArray[coin];

    try {
      const marketPrice = await provider.getAccountResource(
        moduleAddress,
        `${moduleAddress}::TOKEN5001::MarketPrice`,
      );
      let a = Number(marketPrice.data.data);
      console.log("MarketPrice", a);
      setMarketPrice(a);

    } catch (error) {
      console.log(error);

    }
  }
  const fetchBuySellList = async () => {
    // let cointype = coinArray[coin];
    let cointype = "TOKEN5001";
    try {
      const buyList = await provider.getAccountResource(
        moduleAddress,
        `${moduleAddress}::${cointype}::BuyOrder`,
      );
      setBuyList(buyList.data.orders);
      console.log("Data", buyList.data.orders);
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
    // let cointype = coinArray[coin];
    let cointype = "TOKEN5001";

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



  const options = {
    responsive: true,
    animation: false,
    plugins: {
      title: {
        // display: true,
        text: 'Current Price Line Chart',
      },

    },

    scales: {
      y: {
        beginAtZero: true,
        max: 5000,
      },
    }
  };




  // const generateChartData = (Marketlist, index) => {
  //   return {
  //     labels: (Marketlist?.map((chart, index) => index)),
  //     datasets: [
  //       {
  //         label: `Current BuyPrice Per Min ${index + 1}`,
  //         data: Marketlist?.map((chart, index) => chart),
  //         backgroundColor: 'green',
  //         borderColor: 'green',
  //         borderWidth: 2,
  //         pointRadius: 2,
  //       }
  //     ],
  //   };
  // };
  // const numberOfInstrumentToken = InstrumentNumber.length();
  // const chartDataArray = Array.from({ length: numberOfInstrumentToken }, (_, index) => {
  //   const Marketlist = Marketlist[index];
  //     return generateChartData(Marketlist, index + 1);
  // });

  const optionsApex = {
    chart: {

      type: 'candlestick',
      height: 450,
    },
    title: {
      text: 'MarketPrice Chart',
      align: 'left'
    },
    xaxis: {
      type: 'datetime'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
    ,
  };

  const buyTransaction = async () => {
    // let cointype = coinArray[coin];
    let cointype = "TOKEN5001";

    if (!account) return [];
    if (leverage == 0) {
      alert("Leverage can,t be Zero");
      return [];
    }
    const date = new Date(Date.now());
    const today = date.getDate();

    // build a transaction payload to be submited 
    // const payload=null;
    let payload = {
      type: "entry_function_payload",
      function: `${moduleAddress}::${cointype}::place_Order`,
      type_arguments: [],
      arguments: [quantity, limitprice, new Date().getHours() * 100 + new Date().getMinutes(), today, side, leverage],
    }
    try {
      // sign and submit transaction to chain
      const response = await window.aptos.signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      fetchBuySellList();
      fetchSuccessOrderList();
      getMarketPrice();
    } catch (error) {
      console.log(error);
    }
  };
  const buyMarketTransaction = async () => {
    let cointype = coinArray[coin];

    if (!account) return [];
    if (leverage == 0) {
      alert("Leverage can,t be Zero");
      return [];
    }
    const date = new Date(Date.now());
    const today = date.getDate();
    // build a transaction payload to be submited 
    // const payload=null;
    let payload = {

      type: "entry_function_payload",
      function: `${moduleAddress}::TOKEN5001::market_place_Order`,
      type_arguments: [],
      arguments: [quantity, Math.floor(new Date().getTime() / 1000), today, side, leverage],
    };

    try {
      // sign and submit transaction to chain
      const response = await window.aptos.signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      fetchBuySellList();
      fetchSuccessOrderList();
      getMarketPrice();
    } catch (error) {
      console.log(error);
    }
  };

  const nDayChange = async () => {
    let cointype = coinArray[coin];
    if (!account) return [];
    const date = new Date(Date.now());
    const today = date.getDate();
    // build a transaction payload to be submited 
    const payload = {

      type: "entry_function_payload",
      function: `${moduleAddress}::TOKEN5001::editSuccessOrders`,
      type_arguments: [],
      arguments: [index, editNDays],
    };
    try {
      // sign and submit transaction to chain
      const response = await window.aptos.signAndSubmitTransaction(payload);
      // wait for transaction
      await provider.waitForTransaction(response.hash);
      // fetchBuySellList();
      fetchSuccessOrderList();
      setIsOpen(false);
      setEditNDays(1);
    } catch (error) {
      console.log(error);
    }

  }

  const calculateProfit = (side, price) => {
    if (side) {
      if (price >= marketPrice) {
        return true;
      }
    }
    else {
      if (price <= marketPrice) {
        return true;
      }
    }
    return false;

  }

  const buyClick = () => {
    setSide(false);
  }
  const sellClick = () => {
    setSide(true);
  }
  const handlePaymentType = (paymenttype) => {
    setpaymenttype(paymenttype);
  }


  useEffect(() => {
    if (focusElement.current) {
      focusElement.current.scrollTop = focusElement.current.scrollHeight;
    }

  }, [sellList, buyList]);
  useEffect(() => {

    if (focusElement2.current) {
      focusElement2.current.scrollTop = focusElement2.current.scrollHeight;
    }
  }, [sellList, buyList]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // setLoading(true);
      fetchBuySellList();
      fetchSuccessOrderList();
      getMarketPrice();
      setLoading(false);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [coin, marketPrice]);
  return (
    <>{loading ? <Loader /> :
      <div className='content_page'>
        <div className='sec-1'>
          <div className='top_bar'>
            <select onChange={handleCOin} name='coin'>
              <option value={0}>AXT</option>
              <option value={1}>FGV</option>
            </select>
            <select>
              <option value={1}>{new Date(Date.now()).getDate() + 1} {new Date().toLocaleString('default', { month: 'long' }).slice(0, 3)}</option>
              <option value={2}>{new Date(Date.now()).getDate() + 2} {new Date().toLocaleString('default', { month: 'long' }).slice(0, 3)}</option>
              <option value={3}>{new Date(Date.now()).getDate() + 3} {new Date().toLocaleString('default', { month: 'long' }).slice(0, 3)}</option>
            </select>
            <div className='market_price'>

              <div className=''>
                <motion.p {...Leftward} whileHover={{ scale: 1.05 }} className='text_small'>Market Price</motion.p>
                <p className='center '>{MarketCMP} &nbsp; <GoArrowSwitch size={23} /> </p>

              </div>

              {/* <div>
                <motion.p {...Sideward} whileHover={{ scale: 1.05 }} className='text_small' >Expiry Time (EOD)</motion.p>
                <p className='orange_'>{new Date(Date.now()).getDate() + 1} {new Date().toLocaleString('default', { month: 'long' }).slice(0,3)}</p>
              </div> */}
            </div>


          </div>
          <div className='risk-box'>
            <motion.p whileHover={{ scale: 1.02 }} {...Leftward} className='risk'>Risk Status</motion.p>
            <motion.p whileHover={{ scale: 1.05 }} {...Leftward} className='orange_ risk_text'>{RiskStatus}</motion.p>
          </div>
        </div>
        <div className='sec-2'>
          <div className='place_order'>

            <div className='place_order1'>
              <div className='tab_'>
                <p className={!side ? "active_tab place_buy" : "place_buy"} onClick={buyClick}>Buy</p>
                <p className={side ? "active_tab place_buy" : "place_buy"} onClick={sellClick}>Sell</p>

              </div>
              <h3>Place Order</h3>
              <div className='market_area'>
                <motion.p whileHover={{ scale: 1.1 }} {...Leftward} className={paymenttype ? "unactive" : "active"} onClick={() => handlePaymentType(false)}>Market</motion.p>
                <motion.p whileHover={{ scale: 1.1 }} {...Rightward} className={paymenttype ? "active" : "unactive"} onClick={() => handlePaymentType(true)}>Limit</motion.p>

              </div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <label>Amount:</label>
                <input className='order_input' name='quantity' value={quantity} onChange={handleQuantity} placeholder='Enter Amount' type='number' />
              </motion.div>
              <motion.div whileHover={{ scale: 1.01 }}>
                <label>Price :</label>
                <input className='order_input' name='limitprice' disabled={!paymenttype} value={paymenttype ? limitprice : MarketCMP }onChange={handleLimitPrice} placeholder='Enter Price' type='number' />

              </motion.div>


              <div>
                <input className='place_range' name='leverage' type='range' min={0} max={20} step={5} value={leverage} onChange={handleLeverage} />
                <span className='span_test'>Leverage Value : {leverage}</span>

              </div>

              <p>Total Amount : {!paymenttype ? quantity * marketPrice : quantity * limitprice} </p>
              {!side ?
                <p className='span_test'>Liquidation Price: {!paymenttype ? (Math.round(marketPrice - ((marketPrice * 90) / (leverage * 100))) * 1000) / 1000 : Number(limitprice) - Number((limitprice * 90) / (leverage * 100))}</p>
                :
                <p className='span_test'>Liquidation Price: {!paymenttype ? (marketPrice + ((marketPrice * 90) / (leverage * 100))) : Number(limitprice) + Number((limitprice * 90) / (leverage * 100))}</p>

              }
              <div className='place_button'>
                <motion.button whileHover={{ scale: 1.01 }} className='place_buy orange' onClick={paymenttype ? buyTransaction : buyMarketTransaction}>Create Order</motion.button>
              </div>


            </div>
          </div>
          <div className='order_book'>
            <div className='order_book1'>
              <h3>Order Book</h3>
              <div className='table_book'>
                <p>Bid</p>
                <p>Quantity</p>
                <p>Total</p>

              </div>
              <hr></hr>

              <div ref={focusElement2} className='sell_order order-content'>
                {sellList.map((d, i) => (
                  <div key={i} className='table_book' >
                    {!d.matched &&
                      <>
                        <span className='sell_price'>{d.price}</span>
                        <span>{d.amount}</span>
                        <span>{d.amount * d.price}</span>

                      </>
                    }

                  </div>

                ))}
              </div>
              <hr />
              <div className='table_book'>
                <p>Ask</p>
                <p>Quantity</p>
                <p>Total</p>

              </div>
              <hr />
              <div ref={focusElement} className='sell_order order-content'>
                {buyList.map((d, i) => (

                  <div key={i} className='table_book'>
                    {!d.matched &&
                      <>
                        <span className='buy_price'>{d.price}</span>
                        <span>{d.amount}</span>
                        <span>{d.amount * d.price}</span>

                      </>
                    }

                  </div>

                ))}
              </div>


            </div>
          </div>
          <div className='chart_book'>
            {currentTab === 2 && (
              <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center' }}>
                {<Line options={options} data={data} />}
              </div>
            )}
            {
              currentTab === 1 && InstrumentTokenSelected >= 0 && InstrumentTokenSelected < seriesArray.length && (
                <div id="chart" style={{ color: 'black' }}>
                  <ReactApexChart options={optionsApex} series={seriesArray[InstrumentTokenSelected]} type="candlestick" height={400} />
                </div>
              )
            }
            <div className='chart_tab'>
              <p className={currentTab == 1 && "active_tab"} id='chart_tab1' onClick={() => handleTab(1)}>Candle Stick Graphics</p>
              <p className={currentTab == 2 && "active_tab"} id='chart_tab1' onClick={() => handleTab(2)}>Line Graphics</p>

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
                <th>Bid/Ask</th>
                <th>Profit / Loss</th>
                <th>Edit</th>
              </tr>


              {successList.map((d, i) => (
                <>

                  {d.trader == account &&
                    <motion.tr whileHover={{ backgroundColor: "#232836" }} key={i} {...Leftward} custom={i} className='suc-sub' id={calculateProfit(d.side, d.price) ? "green" : "red"}>
                      <td>{d.amount}</td>
                      <td>{d.price}</td>
                      <td>{d.trader.slice(0, 8) + "..." + d.trader.slice(-4)}</td>
                      <td>{d.n_days}</td>
                      <td>{d.side ? "Seller" : "Buyer"}</td>
                      <td>{!d.side ? (marketPrice - d.price) * d.amount : (d.price - marketPrice) * d.amount}</td>
                      <td><button className='n_day_button' onClick={() => updateSuccessOrder(d, i)}>Edit</button></td>

                    </motion.tr>}</>

              ))}


            </table>
            {isOpen && <Popup
              handleClose={togglePopup}
              content={<div className='EditSuccessData'>

                <h2>Successful Order</h2>
                <p>Address : {clickSuccessData?.trader.slice(0, 7) + "..." + clickSuccessData.trader.slice(-7)}</p>
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
                  onChange={(e) => setEditNDays(e.target.value)}
                  className='n_days-input'
                />
                <button className='n_day_button' onClick={nDayChange}>Confirm</button>
              </div>
              } />}



          </div>
        </div>


      </div>}</>
  );
};

export default Profile;
