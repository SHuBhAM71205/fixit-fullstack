import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar,
  PieChart, Pie, Cell,ResponsiveContainer
} from 'recharts';

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#FFBB28', '#0088FE']; 

export const Chart1 = ({ stastics }) => {
  if (!stastics || stastics.length === 0) return <p>Loading chart...</p>;

  const [data, setData] = useState([]);

  useEffect(() => {
    const formattedData = stastics?.stats.map(ele => ({
      month: monthLabels[ele.month-1],
      totalRequests: ele.totalRequests,
      pendingRequests: ele.pendingRequests
    }));
    setData(formattedData);
    console.log('Formatted Data:', formattedData);
  }, [stastics]);

  return (
  
      <ResponsiveContainer width="100%" height="100%" >
        <LineChart data={data} margin={{ top: 10, right: 30, left: -30, bottom: 10 }}>
          <CartesianGrid strokeDasharray="4 12" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalRequests" stroke="#8884d8" />
          <Line type="monotone" dataKey="pendingRequests" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
  );
};



export function Chart2({ stats }) {
  if (!stats?.length === 0) return <p>Loading chart...</p>;
  
  return (
    <div className="shadow-lg rounded-xl bg-white p-4 h-fit">
      <h2 className="text-lg font-semibold mb-2">User Growth</h2>
      <BarChart width={500} data={stats}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalUsers" fill="#8884d8" />
      </BarChart>
    </div>
  );
}


export function Chart3({ summary }) {
  const data = [
    { name: 'pending', value: summary?.pending || 0 },
    { name: 'completed', value: summary?.completed || 0 }
  ];
  console.log(summary,data)
  return (
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
