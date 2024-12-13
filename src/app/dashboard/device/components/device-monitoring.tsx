export default function DeviceMonitoring() {
    // In a real application, these would be fetched from an API
    const deviceData = {
      temperature: "24°C",
      humidity: "45%",
      location: "12.9716° N, 77.5946° E"
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Temperature</h3>
          <p className="text-2xl font-semibold text-blue-600">{deviceData.temperature}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Humidity</h3>
          <p className="text-2xl font-semibold text-green-600">{deviceData.humidity}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
          <p className="text-2xl font-semibold text-purple-600">{deviceData.location}</p>
        </div>
      </div>
    )
  }
  
  