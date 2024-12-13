'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import DeviceMonitoring from '../components/device-monitoring';
import ProductsTable from '../components/products-table';

interface Product {
  id: string;
  name: string;
  source: string;
  destination: string;
  purchaseDate: string;
  expiryDate: string;
}

export default function DeviceDetails({ params }: { params: { id: string } }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    source: '',
    destination: '',
    purchaseDate: '',
    expiryDate: '',
  });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const product = {
      id: Math.random().toString(36).substr(2, 9),
      ...newProduct,
    };
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      source: '',
      destination: '',
      purchaseDate: '',
      expiryDate: '',
    });
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Device: {params.id}
          </h1>

          <DeviceMonitoring />

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
