'use client';

import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/dashboard/Navbar';
import DeviceMonitoring from '../components/device-monitoring';
import ProductsTable from '../components/products-table';
import { useParams } from 'next/navigation';

const API_BASE_URL = 'http://localhost:8000/api';

interface Device {
  _id: string;
  deviceName: string;
  data:string;
  createdAt: string;
}

interface DeviceData {
  _id: string;
  device: {
    _id: string;
    deviceName: string;
  };
  temperature: number;
  humidity: number;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
}

interface Product {
  id: string;
  name: string;
  source: string;
  destination: string;
  purchaseDate: string;
  expiryDate: string;
}

export default function DeviceDetails() {
  const params = useParams();
  const { auth } = useAuth();
  const [device, setDevice] = useState<Device | null>(null);
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [deviceDataList, setDeviceDataList] = useState<DeviceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    source: '',
    destination: '',
    purchaseDate: '',
    expiryDate: '',
    
  });

  useEffect(() => {
    const fetchDeviceDetails = async () => {
      try {
        console.log('Fetching device details for ID:', params.id);
        setIsLoading(true);
        setError(null);

        const [deviceRes, dataRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/v1/devices/${params.id}`, {
            headers: { 'Authorization': `Bearer ${auth.token}` }
          }),
          axios.get(`${API_BASE_URL}/v1/device-data/${params.id}`, {
            headers: { 'Authorization': `Bearer ${auth.token}` }
          })
        ]);

        console.log('Device Response:', deviceRes.data);
        console.log('Device Data Response:', dataRes.data);
        
        if (!deviceRes.data.device) {
          throw new Error('Invalid device data format');
        }

        setDevice(deviceRes.data.device);
        if (Array.isArray(dataRes.data)) {
          setDeviceDataList(dataRes.data);
          if (dataRes.data.length > 0) {
            console.log('Most recent device data:', dataRes.data[0]);
            setDeviceData(dataRes.data[0]);
          }
        } else {
          throw new Error('Invalid device data format');
        }
      } catch (err) {
        console.error('Error fetching device details:', err);
        if (axios.isAxiosError(err)) {
          const errorMessage = err.response?.data?.message || 'Failed to load device details';
          setError(errorMessage);
          toast.error(errorMessage);
        } else {
          setError('An unexpected error occurred');
          toast.error('An unexpected error occurred');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (auth.token && params.id) {
      fetchDeviceDetails();
    }
  }, [params.id, auth.token]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        deviceId: params.id,
        ...newProduct,
      };
      
      console.log('Submitting product data:', productData);

      const response = await axios.post(`${API_BASE_URL}/products`, productData, {
        headers: { 'Authorization': `Bearer ${auth.token}` }
      });

      console.log('Product creation response:', response.data);

      setProducts([...products, response.data.product]);
      setNewProduct({
        name: '',
        source: '',
        destination: '',
        purchaseDate: '',
        expiryDate: '',
      });
      setIsDialogOpen(false);
      toast.success('Product added successfully');
    } catch (err) {
      console.error('Error adding product:', err);
      if (axios.isAxiosError(err)) {
        const errorMessage = err.response?.data?.message || 'Failed to add product';
        toast.error(errorMessage);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    if (deviceData) {
      console.log('Current device monitoring data:', {
        temperature: deviceData.temperature,
        humidity: deviceData.humidity,
        location: deviceData.location,
        timestamp: deviceData.createdAt
      });
    }
  }, [deviceData]);

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

  if (error || !device) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-red-500 mb-4">{error || 'Device not found'}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {device?.deviceName}
              </h1>
              <p className="text-sm text-gray-500">ID: {device?._id}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              Back to Devices
            </Button>
          </div>

          {deviceData && (
            <DeviceMonitoring 
              data={{
                temperature: deviceData.temperature,
                humidity: deviceData.humidity,
                timestamp: deviceData.createdAt,
                location: deviceData.location
              }}
              deviceName={device?.deviceName || 'Unknown Device'}
            />
          )}

          {/* Add a section to show historical data if needed */}
          {deviceDataList.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Historical Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Time</th>
                      <th className="px-4 py-2">Temperature</th>
                      <th className="px-4 py-2">Humidity</th>
                      <th className="px-4 py-2">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {deviceDataList.map((data) => (
                      <tr key={data._id}>
                        <td className="px-4 py-2">
                          {new Date(data.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-2">{data.temperature}°C</td>
                        <td className="px-4 py-2">{data.humidity}%</td>
                        <td className="px-4 py-2">
                          {data.location.latitude}, {data.location.longitude}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Products</h2>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </Button>
            </div>

            <ProductsTable products={products} />
          </div>
        </div>
      </main>

      {/* Add Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="productName" className="text-sm font-medium text-gray-700">
                Product Name
              </label>
              <Input
                id="productName"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="source" className="text-sm font-medium text-gray-700">
                Source Location
              </label>
              <Input
                id="source"
                value={newProduct.source}
                onChange={(e) => setNewProduct({ ...newProduct, source: e.target.value })}
                placeholder="Enter source location"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="destination" className="text-sm font-medium text-gray-700">
                Destination Location
              </label>
              <Input
                id="destination"
                value={newProduct.destination}
                onChange={(e) => setNewProduct({ ...newProduct, destination: e.target.value })}
                placeholder="Enter destination location"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="purchaseDate" className="text-sm font-medium text-gray-700">
                Purchase Date
              </label>
              <Input
                id="purchaseDate"
                type="date"
                value={newProduct.purchaseDate}
                onChange={(e) => setNewProduct({ ...newProduct, purchaseDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
                Expiry Date
              </label>
              <Input
                id="expiryDate"
                type="date"
                value={newProduct.expiryDate}
                onChange={(e) => setNewProduct({ ...newProduct, expiryDate: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Product
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
