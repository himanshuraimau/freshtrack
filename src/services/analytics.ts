import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface DeviceReading {
  _id: { $oid: string };
  device: { $oid: string };
  temperature: number;
  humidity: number;
  createdAt: { $date: string };
  location: {
    latitude: number;
    longitude: number;
  };
}

export const analyticsService = {
  async getDeviceReadings(deviceId: string): Promise<DeviceReading[]> {
    try {
      // Use the public directory path
      const response = await fetch('/freshtrack.devicedatas.json');
      if (!response.ok) {
        throw new Error('Failed to load data');
      }
      
      const allData: DeviceReading[] = await response.json();
      const readings = allData.filter(
        reading => reading.device.$oid === deviceId
      );
      
      return readings.sort((a, b) => 
        new Date(a.createdAt.$date).getTime() - new Date(b.createdAt.$date).getTime()
      );
    } catch (error) {
      console.error('Error loading mock data:', error);
      return [];
    }
  }
};
