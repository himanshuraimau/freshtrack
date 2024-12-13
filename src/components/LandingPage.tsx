import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, BarChart2, Globe, Shield, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Truck className="h-6 w-6 text-blue-600" />
          <span className="ml-2 text-2xl font-bold text-gray-900">SupplyChainPro</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#">
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-r from-blue-600 to-green-500">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                    Revolutionize Your Supply Chain
                  </h1>
                  <p className="max-w-[600px] text-gray-200 md:text-xl">
                    Streamline operations, increase efficiency, and boost profitability with our cutting-edge supply chain solutions.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-white text-blue-600 hover:bg-gray-100">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                    Learn More
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-white">
                  <Shield className="h-6 w-6" />
                  <p className="text-sm">Trusted by 500+ companies worldwide</p>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] md:w-[500px] md:h-[500px]">
                  <Image
                    src="/placeholder.svg?height=500&width=500"
                    alt="Global supply chain network visualization"
                    layout="fill"
                    objectFit="cover"
                    className="rounded-full bg-gray-200 border-4 border-white shadow-lg"
                    priority
                  />
                  <div className="absolute -top-4 -left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg">
                    <Truck className="h-6 w-6" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg">
                    <Globe className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center text-gray-900 mb-8">
              Our Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <BarChart2 className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Real-time Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Get instant insights into your supply chain performance with our advanced analytics tools.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Globe className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Global Visibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Track your shipments and inventory across the globe with our comprehensive visibility solutions.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Shield className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle>Risk Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Identify and mitigate risks in your supply chain with our AI-powered risk assessment tools.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Truck className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Optimized Logistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Streamline your logistics operations with our intelligent route optimization and carrier selection.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gray-900">
                  Ready to Transform Your Supply Chain?
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-600 md:text-xl">
                  Join thousands of companies that have revolutionized their supply chain with SupplyChainPro.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex space-x-2">
                  <Input className="flex-1" placeholder="Enter your email" type="email" />
                  <Button className="bg-blue-600 text-white hover:bg-blue-700">
                    Get Started
                  </Button>
                </form>
                <p className="text-xs text-gray-500">
                  By signing up, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 SupplyChainPro. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

