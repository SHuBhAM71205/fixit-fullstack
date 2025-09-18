import React, { useState } from 'react'
import {
    Chart as ChartJS, CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
import { faker } from '@faker-js/faker';

export function LineChart1() {
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                text:"chart"
            },
            title: {
                display: true,
                text: 'total number of request',
            },
        }
    }


    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
            
            {
                label: 'total request completed',
                data: labels.map(() => faker.number.int({ min: 1, max: 100 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return <Line options={options} data={data} />
}



export function LineChart2(){
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
                
            },
            title: {
                display: true,
                text: 'Revenue Generated',
            },
        }
    }


    const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

    const data = {
        labels,
        datasets: [
           
            {
                label: 'revenue generated',
                data: labels.map(() => faker.number.int({ min: 1, max: 1000 })),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return <Line options={options} data={data}/>

}