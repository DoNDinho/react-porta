import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export function StackedBarChart({ chartData, title }) {
  const options = {
    plugins: {
      title: {
        display: true,
        text: title,
      },
      datalabels: {
        color: 'black',
        font: {
          weight: 'bold'
        }
      }
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  }

  return <Bar options={options} data={chartData} />;
}
