import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexChart = () => {
    const [olddata,setData]=useState([1,2,3,4]);
    const [newData,setNewData]=useState([]);
    const [series, setSeries] = useState([{
        data: []
      }]);
    
      const options = {
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

      // const createData=()=>{
      //   const data=[1,2,3,4,5,6,7,8,7,3,5,3,5,6,2,1,2,8,4,5,3,8,5,4,6,3,2,1,9,7,8,7,5,4,6,5,3,8,7,5,9,8,6,5,3,2,4];
      //   let oldlength=olddata.length;
      //   let newdata=data.slice(oldlength);
      //   let open=newdata[0];
      //   let close=newdata[newdata.length-1];
      //   let high=Math.max(...newdata);
      //   let low=Math.min(...newdata);
      //   console.log(newdata);
      //   console.log(open,close,high,low);
      //   setData(data);
      //   return {
      //       x: new Date().getTime(),
      //       y: [open, high, low, close]
      //     };
      // }
      // useEffect(() => {
      //   const candlestickData = createData();
      //   setSeries(prevSeries => [{
      //     data: [...prevSeries[0].data, candlestickData]
      //   }]);
      //   console.log(olddata)
      // }, []);

      // useEffect(() => {
      //   const intervalId = setInterval(() => {
      //       let new1 = Math.random() * 10 + 10;
      //       let new2 = Math.random() * 10 + 10;
      //       let new3 = Math.random() * 10 + 10;
      //       let new4 = Math.random() * 10 + 10;
      //       let newArr = [new1, new2, new3, new4];
          
      //       setNewData(newArr);
      //       setData(prevData => [...prevData, newArr]);
      //     }, 10000);
          
      //     return () => clearInterval(intervalId);

      // },[]);


  useEffect(() => {
    const interval = setInterval(() => {
      setSeries(prevSeries => {
        const newData = {
          x: new Date().getTime(),
          y: [Math.random() * 1000, Math.random() * 1000, Math.random() * 1000, Math.random() * 1000]
        };

        return [{
          data: [...prevSeries[0].data, newData]
        }];
      });
    }, 5000); // update every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);


  return (
    <div id="chart" style={{color:"black"}}>
      <ReactApexChart options={options} series={series} type="candlestick" height={430} />
    </div>
  );
};

export default ApexChart;