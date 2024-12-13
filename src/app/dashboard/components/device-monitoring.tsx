interface DeviceMonitoringProps {
  data: {
    temperature: number;
    humidity: number;
    timestamp: string;
  };
  deviceName: string;
}

export default function DeviceMonitoring({ data, deviceName }: DeviceMonitoringProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <h2 className="col-span-2 text-xl font-bold">{deviceName}</h2>
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium">Temperature</h3>
        <p className="text-2xl font-bold">{data.temperature}°C</p>
      </div>
      <div className="p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium">Humidity</h3>
        <p className="text-2xl font-bold">{data.humidity}%</p>
      </div>
    </div>
  );
}

