import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export function PieChart({chartData, title}) {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'left' },
      title: { display: true, text: title }
    }
  }

  return <Pie options={options} data={chartData} />;
}
