import React, { useEffect, useState } from 'react';
import { Chart1, Chart2, Chart3 } from '../Chart/BigChart';
const backend = import.meta.env.VITE_backend;

export default function Stastic() {
  const [data, setdata] = useState(null);
  const [pending, setpending] = useState(null);
  const [totalRequests, setTotalReq] = useState(null);

  useEffect(() => {
    const fetchstats = async () => {
      try {
        const response = await fetch(`${backend}/api/admin/stats`, {
          method: "GET",
          headers: {
            'auth-token': localStorage.getItem('auth-token')
          }
        });
        const result = await response.json();
        setdata(result);
        setpending(result.pendingCount);
        setTotalReq(result.totalRequests);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchstats();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 m-5 auto-rows-auto w-full">

      {/* Total Requests */}
      <div className="bg-gray-200 rounded-xl shadow-md p-5">
        <h4 className="text-lg font-semibold text-indigo-700">Total Requests</h4>
        <p className="text-3xl font-bold text-gray-800">{data?.totalRequests}</p>
      </div>

      {/* Total Users */}
      <div className="bg-gray-200 rounded-xl shadow-md p-5">
        <h4 className="text-lg font-semibold text-green-700">Total Users</h4>
        <p className="text-3xl font-bold text-gray-800">{data?.totalUsers}</p>
      </div>

      {/* Pending Tasks */}
      <div className="bg-gray-200 rounded-xl shadow-md p-5">
        <h4 className="text-lg font-semibold text-red-600">Pending Tasks</h4>
        <p className="text-3xl font-bold text-gray-800">{data?.pendingCount}</p>
      </div>

      {/* Avg Visit */}
      <div className="bg-gray-200 rounded-xl shadow-md p-5">
        <h4 className="text-lg font-semibold text-yellow-600">Avg. Visit per hour</h4>
        <p className="text-3xl font-bold text-gray-800">2.3 hrs</p>
      </div>

      {/* Chart 1 - LineChart */}
      <div className="bg-gray-200 rounded-xl shadow-md p-5 col-span-1 sm:col-span-2 lg:col-span-3 min-h-[300px]">
        <Chart1 stastics={data} />
      </div>

      {/* Chart 3 - PieChart */}
      <div className="bg-gray-200 rounded-xl shadow-md p-5 flex items-center justify-center col-span-1">
        <div className="w-full h-80">
          <Chart3 summary={{
            pending: pending || 0,
            completed: (totalRequests || 0) - (pending || 0)
          }} />
        </div>
      </div>

    </div>
  );
}
