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
import {Line } from 'react-chartjs-2';
// import axios from 'axios';

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

const RedChart = () => {
    const [redData,setRedData] = useState([]);
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
              max:25
            }
          }
    };

    const data = {
        labels: (redData.map((chart, index) => index)),
        datasets: [
            {
                label: 'Current SellPrice Per Min',
                data: redData.map((chart, index) => chart),
                backgroundColor: 'red',
                borderColor: 'red',
    borderWidth: 2,
    pointRadius:2,

            },
            
        ],
    };
    useEffect(() => {
        const intervalId = setInterval(()=>{
            let red=Math.random()*10+10;
            setRedData([...redData, red]);

        },3*1000);

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [redData]);

    return (
        <div style={{height:"100%",width:"100%", display:"flex",justifyContent:"center"}}>{
            data &&
            <Line options={options} data={data} />

        }


        </div>
    )
}

export default RedChart