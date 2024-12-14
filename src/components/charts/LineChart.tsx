"use client";

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

// Register only required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  data: ChartData<'line'>;
  options: ChartOptions<'line'>;
}

export default function LineChart({ data, options }: LineChartProps) {
  return (
    <div className="w-full h-full">
      <Line 
        data={data} 
        options={{
          ...options,
          responsive: true,
          maintainAspectRatio: false,
        }} 
      />
    </div>
  );
}
