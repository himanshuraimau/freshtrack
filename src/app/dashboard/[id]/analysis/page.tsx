"use client";

import React, { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement } from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, LineElement, PointElement);

const AnalyticsPage = () => {
  // Mock data for temperature, humidity, and time labels
  const [data] = useState({
    temperature: [22, 24, 23, 26, 28, 27, 25], // Example temperature values
    humidity: [40, 42, 43, 38, 37, 39, 41],   // Example humidity values
    timeLabels: ["10:00", "10:05", "10:10", "10:15", "10:20", "10:25", "10:30"], // Time labels for the x-axis
  });

  // Options for the graphs
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Sensor Data Analytics",
      },
    },
  };

  // Graph data structures
  const temperatureGraphData = {
    labels: data.timeLabels,
    datasets: [
      {
        label: "Average Temperature (°C)",
        data: data.temperature,
        backgroundColor: "rgba(255, 99, 132, 0.5)", // Light red for temperature bars
        borderColor: "rgba(255, 99, 132, 1)",     // Dark red for border color
        borderWidth: 1,
      },
    ],
  };

  const humidityGraphData = {
    labels: data.timeLabels,
    datasets: [
      {
        label: "Average Humidity (%)",
        data: data.humidity,
        backgroundColor: "rgba(54, 162, 235, 0.5)", // Light blue for humidity line
        borderColor: "rgba(54, 162, 235, 1)",      // Dark blue for border color
        borderWidth: 1,
        fill: false, // No fill for the line graph
      },
    ],
  };

  return (
    <div className="analytics-container p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>

      <div className="graph-container grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="graph">
          <Bar options={options} data={temperatureGraphData} />
        </div>
        <div className="graph">
          <Line options={options} data={humidityGraphData} />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
