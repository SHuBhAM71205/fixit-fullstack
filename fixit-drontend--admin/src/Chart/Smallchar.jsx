// components/Chart/SmallCircleChart.js

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Completed', value: 60 },
  { name: 'Pending', value: 30 },
  { name: 'Failed', value: 10 },
];

const COLORS = ['#22c55e', '#facc15', '#ef4444']; // green, yellow, red

export default function SmallCircleChart() {
  return (
    <div className="w-40 h-40">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            innerRadius={35}
            outerRadius={60}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <p>green-</p>
    </div>
  );
}
