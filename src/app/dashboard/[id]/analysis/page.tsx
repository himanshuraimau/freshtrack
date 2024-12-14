"use client";

import { useState, useEffect } from "react";
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import Navbar from '@/components/dashboard/Navbar';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { RefreshCw } from 'lucide-react';
import type { ChartData, ChartOptions } from 'chart.js';
import { analyticsService } from '@/services/analytics';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';  // Add this line

// Dynamic import with no SSR
const LineChart = dynamic(() => import('@/components/charts/LineChart'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-gray-100 animate-pulse rounded-lg" />
  )
});

interface ChartDataState {
  temperature: number[];
  humidity: number[];
  timeLabels: string[];
}

// Add these chart customizations
const chartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function(context: any) {
          const label = context.dataset.label || '';
          const value = context.parsed.y;
          return `${label}: ${value}${context.dataset.label?.includes('Temperature') ? '°C' : '%'}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false, // Changed to false for better scale
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
      },
      ticks: {
        callback: (value) => `${value}${value > 50 ? '%' : '°C'}`, // Add units
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        maxRotation: 45, // Angle the timestamps for better readability
      }
    },
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  },
};

const AnalyticsPage = () => {
  const params = useParams();
  const deviceId = params?.id as string;
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ChartDataState>({
    temperature: [],
    humidity: [],
    timeLabels: [],
  });

  const fetchAnalytics = async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      if (!deviceId) {
        throw new Error('Missing device ID');
      }

      const response = await axios.get(`${API_BASE_URL}/device-data/${deviceId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      // Get the data array from response
      const deviceReadings = Array.isArray(response.data) ? response.data : [];
      
      if (deviceReadings.length === 0) {
        throw new Error('No data available');
      }

      // Take last 24 readings and reverse for chronological order
      const recentReadings = deviceReadings.slice(-24).reverse();

      const processedData = {
        temperature: recentReadings.map(d => Number(d.temperature) || 0),
        humidity: recentReadings.map(d => Number(d.humidity) || 0),
        timeLabels: recentReadings.map(d => 
          new Date(d.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })
        ),
      };

      setData(processedData);

      // Calculate averages
      const avgTemp = recentReadings.reduce((sum, d) => sum + (Number(d.temperature) || 0), 0) / recentReadings.length;
      const avgHumidity = recentReadings.reduce((sum, d) => sum + (Number(d.humidity) || 0), 0) / recentReadings.length;

      toast.success(
        `Average Temperature: ${avgTemp.toFixed(1)}°C\n` +
        `Average Humidity: ${avgHumidity.toFixed(1)}%`
      );

    } catch (err) {
      console.error('Data fetch error:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('No data available for this device');
        } else if (err.response?.status === 401) {
          setError('Authentication failed');
        } else {
          setError('Failed to fetch device data');
        }
      } else {
        setError('An unexpected error occurred');
      }
      toast.error('Error loading data');
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (deviceId && auth.token) {
      fetchAnalytics();
    } else {
      setError('Invalid device or authentication');
      setIsLoading(false);
    }
  }, [deviceId, auth.token]);

  const createChartData = (
    label: string,
    data: number[],
    color: string,
    bgColor: string
  ): ChartData<'line'> => ({
    labels: data.timeLabels,
    datasets: [{
      label,
      data,
      backgroundColor: bgColor,
      borderColor: color,
      borderWidth: 2,
      tension: 0.3,
      fill: false, // Remove fill option
    }],
  });

  const temperatureGraphData = createChartData(
    "Temperature (°C)",
    data.temperature,
    "rgb(239, 68, 68)",
    "rgba(239, 68, 68, 0.2)"
  );

  const humidityGraphData = createChartData(
    "Humidity (%)",
    data.humidity,
    "rgb(59, 130, 246)",
    "rgba(59, 130, 246, 0.2)"
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Navbar />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <div className="flex gap-3">
            <Button
              onClick={fetchAnalytics}
              variant="outline"
              className="hover:bg-gray-100"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="hover:bg-gray-100"
            >
              Back
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Temperature Trend</h2>
            <div className="h-[400px]"> {/* Add fixed height container */}
              <LineChart options={chartOptions} data={temperatureGraphData} />
            </div>
          </div>
          
          <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Humidity Trend</h2>
            <div className="h-[400px]"> {/* Add fixed height container */}
              <LineChart options={chartOptions} data={humidityGraphData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
