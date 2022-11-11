import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export function PieChart({chartData, title}) {
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'left' },
      title: { display: true, text: title },
      datalabels: {
        color: 'black',
        font: {
          weight: 'bold'
        }
      }
    }
  }

  return <Pie options={options} data={chartData} />;
}
