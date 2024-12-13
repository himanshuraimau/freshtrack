'use client'
import { useState, useEffect } from 'react'
import { Plus, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Device {
  _id: string       // Changed from 'id' to '_id' to match MongoDB
  deviceName: string
  createdAt: string
}

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newDevice, setNewDevice] = useState({
    deviceName: '',  // Changed from 'name' to 'deviceName'
    password: ''
  })
  const router = useRouter()
  const { auth, logout } = useAuth()

  const fetchDevices = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/devices/list', {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      })
      
      if (response.status === 401) {
        logout();
        router.push('/login');
        return;
      }

      const data = await response.json()
      if (response.ok) {
        setDevices(data.devices)
      } else {
        console.error('Error fetching devices:', data.message)
      }
    } catch (error) {
      console.error('Error fetching devices:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (auth.token) {
      fetchDevices()
    }
  }, [auth.token])

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:8000/api/devices/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(newDevice)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setNewDevice({ deviceName: '', password: '' })
        setIsDialogOpen(false)
        // Fetch updated list of devices after adding new one
        fetchDevices()
      } else {
        alert(data.message || 'Error adding device')
      }
    } catch (error) {
      console.error('Error adding device:', error)
      alert('Error connecting to server')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link 
              href="/"
              className="text-2xl font-bold text-white hover:text-blue-100 transition-colors"
            >
              FRESHTRACK
            </Link>
            <Button 
              variant="ghost"
              onClick={logout}
              className="flex items-center gap-2 text-white hover:text-blue-100 hover:bg-blue-700/50"
            >
              <LogOut className="h-4 w-4" />
              LOG OUT
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Devices</h1>
            {devices.length > 0 && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                ADD DEVICES
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : devices.length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
              <p className="text-gray-500">No devices added yet</p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="lg"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                ADD DEVICES
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <div
                  key={device._id}
                  className="p-6 border rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-[1.02] bg-white/90 cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900 text-lg mb-2">{device.deviceName}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                    ID: {device._id}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Added: {new Date(device.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Device Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-600">Add New Device</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDevice} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="deviceName" className="text-sm font-medium text-gray-700">
                Device Name
              </label>
              <Input
                id="deviceName"
                value={newDevice.deviceName}
                onChange={(e) => setNewDevice({ ...newDevice, deviceName: e.target.value })}
                placeholder="Enter device name"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="devicePassword" className="text-sm font-medium text-gray-700">
                Device Password
              </label>
              <Input
                id="devicePassword"
                type="password"
                value={newDevice.password}
                onChange={(e) => setNewDevice({ ...newDevice, password: e.target.value })}
                placeholder="Enter device password"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                className="hover:bg-gray-100"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Add Device
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

