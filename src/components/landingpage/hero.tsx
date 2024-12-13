import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-400 text-white">
      <div className="max-w-10xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center">
          <div className=" mb-8 lg:mb-0">
            <Image
              src="/supplyone.jpeg"
              alt="Supply Chain Management"
              width={900}
              height={600}
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className=" lg:pl-32">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Revolutionize Your Supply Chain
            </h1>
            <p className="mt-6 text-xl max-w-3xl">
              Freshtrack provides real-time monitoring and tracking for your entire supply chain. Ensure product quality and optimize logistics with our cutting-edge technology.
            </p>
            <div className="mt-10">
              <Link href="/signup" className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-md text-lg font-medium">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

