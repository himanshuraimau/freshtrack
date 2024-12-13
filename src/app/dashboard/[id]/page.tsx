'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/dashboard/Navbar';

const API_BASE_URL = 'http://localhost:8000/api/v1';

interface DeviceData {
  _id: string;
  device?: {
    _id: string;
    deviceName: string;
  };
  temperature?: number;
  humidity?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function DeviceDetails() {
  const params = useParams();
  const deviceId = params?.id as string;
  const { auth } = useAuth();
  const [deviceData, setDeviceData] = useState<DeviceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [products, setProducts] = useState<Product[]>([]);
  // const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  useEffect(() => {
    const fetchDeviceData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/device-data/${deviceId}`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        console.log('Device data response:', response.data);

        if (Array.isArray(response.data) && response.data.length > 0) {
          setDeviceData(response.data[0]);
        } else {
          throw new Error('No data available for this device');
        }
      } catch (err) {
        console.error('Failed to fetch device data:', err);
        setError('Could not load device data');
        toast.error('Failed to load device data');
      } finally {
        setIsLoading(false);
      }
    };

    // const fetchProducts = async () => {
    //   try {
    //     const response = await axios.get(`${API_BASE_URL}/products/${deviceId}`, {
    //       headers: { Authorization: `Bearer ${auth.token}` },
    //     });
    //     setProducts(response.data);
    //   } catch (err) {
    //     console.error('Failed to fetch products:', err);
    //     toast.error('Failed to load products');
    //   }
    // };

    if (deviceId && auth.token) {
      fetchDeviceData();
      // fetchProducts();
    }
  }, [deviceId, auth.token]);

  // const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
  //   try {
  //     const response = await axios.post(
  //       `${API_BASE_URL}/products/${deviceId}`,
  //       newProduct,
  //       {
  //         headers: { Authorization: `Bearer ${auth.token}` },
  //       }
  //     );
  //     setProducts([...products, response.data]);
  //     toast.success('Product added successfully');
  //   } catch (err) {
  //     console.error('Failed to add product:', err);
  //     toast.error('Failed to add product');
  //   }
  // };

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

  if (error || !deviceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        <Navbar />
        <div className="flex flex-col justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-red-500 mb-4">{error || 'No data available'}</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <main className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {deviceData?.device?.deviceName || 'Unknown Device'}
          </h1>
          <Button onClick={() => window.history.back()}>Back</Button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Temperature</h3>
              <p className="text-2xl">{deviceData?.temperature ?? 'N/A'}°C</p>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-medium mb-2">Humidity</h3>
              <p className="text-2xl">{deviceData?.humidity ?? 'N/A'}%</p>
            </div>
          </div>

          {deviceData?.location && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Location</h3>
              <p>
                {deviceData.location.latitude}, {deviceData.location.longitude}
              </p>
            </div>
          )}

          <div className="text-sm text-gray-500 mt-4">
            Last Updated:{' '}
            {deviceData?.updatedAt
              ? new Date(deviceData.updatedAt).toLocaleString()
              : 'Never'}
          </div>
        </div>

        {/* <div className="mt-8 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Products</h2>
          <Button onClick={() => setIsAddProductModalOpen(true)}>Add Product</Button>
        </div>

        <ProductsTable products={products} />

        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
          onAddProduct={handleAddProduct}
        /> */}
      </main>
    </div>
  );
}

