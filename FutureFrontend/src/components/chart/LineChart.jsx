import React, { useEffect, useState } from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = () => {
    const [dataSet, setData] = useState([]);
    const [redData, setRedData] = useState([]);

    const [greenData,setGreenData] = useState([]);
    // const url = "http://localhost:3000";
    // const getData = async () => {
    //     const prices = await axios.get(`${url}/getdata`, {
    //         withCredentials: true,
    //     });
    //     setData(prices.data);
    // }

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
              max:25,
            },
          }
    };
    // const labels=dataSet.map((chart, index) => index);


    const data = {
        labels: (dataSet?.map((chart, index) => index)),
        datasets: [
            {
                label: 'Current Price Per Min',
                data: dataSet?.map((chart, index) => chart),
                backgroundColor: 'orange',
                borderColor: 'yellow',
                borderWidth: 2,
                pointRadius:2,

            },
            {
                label: 'Current SellPrice Per Min',
                data: redData?.map((chart, index) => chart),
                backgroundColor: 'red',
                borderColor: 'red',
                borderWidth: 2,
                pointRadius:2,

            },
            {
                label: 'Current BuyPrice Per Min',
                data: greenData?.map((chart, index) => chart),
                backgroundColor: 'green',
                borderColor: 'green',
                borderWidth: 2,
                pointRadius:2,

            }
        ],
    };
    // useEffect(() => {
    //     const data=localStorage.getItem("CandleData");
    //     const redData=localStorage.getItem("RedData");
    //     const greenData=localStorage.getItem("GreenData");
    //     setData(data);
    //     setGreenData(greenData);
    //     setRedData(redData);
    // },[]);

    useEffect(() => {
        
        const intervalId = setInterval(()=>{
            let num = Math.random() * (13 - 10) + 10;
            let red = Math.random() * (13 - 10) + 10;
            let green = Math.random() * (13 - 10) + 10;
        setRedData({...redData,red});
        setGreenData({...greenData,green});
        setData({...dataSet,num});
       
        },3*1000);

        

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div style={{height:"100%",width:"100%", display:"flex",justifyContent:"center"}}>{
            data &&
            <Line options={options} data={data} />

        }


        </div>
    )
}

export default LineChart