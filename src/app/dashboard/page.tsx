'use client'

<<<<<<< HEAD
import { useState } from 'react'
import { Plus, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

interface Device {
  id: string
  name: string
}

export default function Dashboard() {
  const [devices, setDevices] = useState<Device[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newDevice, setNewDevice] = useState({
    name: '',
    password: ''
  })

  const handleAddDevice = (e: React.FormEvent) => {
    e.preventDefault()
    const device = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDevice.name
    }
    setDevices([...devices, device])
    setNewDevice({ name: '', password: '' })
    setIsDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link 
              href="/"
              className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            >
              FRESHTRACK
            </Link>
            <Button 
              variant="outline"
              onClick={() => console.log('Logout clicked')}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              LOG OUT
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Devices</h1>
            {devices.length > 0 && (
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                ADD DEVICES
              </Button>
            )}
          </div>

          {devices.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <Button
                onClick={() => setIsDialogOpen(true)}
                size="lg"
                className="flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                ADD DEVICES
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900">{device.name}</h3>
                  <p className="text-sm text-gray-500">Device ID: {device.id}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Device Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Device</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddDevice} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="deviceName" className="text-sm font-medium text-gray-700">
                Device Name
              </label>
              <Input
                id="deviceName"
                value={newDevice.name}
                onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                placeholder="Enter device name"
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
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Device
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
=======
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

const Dashboard = () => {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      {/* Add your dashboard content here */}
    </div>
  )
}

export default Dashboard
>>>>>>> e67eb1b (Implement authentication with Jotai state management and middleware for protected routes)
