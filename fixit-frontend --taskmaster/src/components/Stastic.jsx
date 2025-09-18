
import React, { useEffect, useRef } from 'react';
// import '../css/stats.css';
import {LineChart1,LineChart2} from './Chart/LineChart';

export default function Stastic() {
  const taskChartRef = useRef(null);
  const revenueChartRef = useRef(null);

  const totalTasks = 50;
  const completedTasks = 30;
  const pendingTasks = 15;
  const rejectedTasks = 5;
  const totalRevenue = 1500;
  const averageRevenue = totalRevenue / completedTasks;


  return (
    <div className="p-6 space-y-8">

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div className="bg-white  rounded-xl shadow-md p-5">
          <h4 className="text-lg font-semibold text-indigo-700">Total Requests</h4>
          <p className="text-3xl font-bold text-gray-800">124</p>
        </div>

        <div className="bg-white  rounded-xl shadow-md p-5">
          <h4 className="text-lg font-semibold text-green-700">Completed Tasks</h4>
          <p className="text-3xl font-bold text-gray-800">92</p>
        </div>

        <div className="bg-white  rounded-xl shadow-md p-5">
          <h4 className="text-lg font-semibold text-red-600">Pending Tasks</h4>
          <p className="text-3xl font-bold text-gray-800">32</p>
        </div>

        <div className="bg-white  rounded-xl shadow-md p-5">
          <h4 className="text-lg font-semibold text-yellow-600">Avg. Completion Time</h4>
          <p className="text-3xl font-bold text-gray-800">2.3 hrs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow-md p-5 h-[350px] flex items-center justify-center">
          <p className="text-gray-400"></p>
          <LineChart1/>
        </div>


        <div className="bg-white rounded-xl shadow-md p-5 h-[350px] flex items-center justify-center">
          <p className="text-gray-400"></p>
          <LineChart2/>
        </div>
      </div>
    </div>

  );
}