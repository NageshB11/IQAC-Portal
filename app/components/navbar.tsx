'use client'

import Link from 'next/link'
import { Button } from '@/app/components/ui/button'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">IQ</span>
            </div>
            <span className="font-bold text-xl text-gray-900">IQAC Portal</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium">
              Home
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 font-medium">
              About Us
            </Link>
            <Link href="#contact" className="text-gray-600 hover:text-gray-900 font-medium">
              Contact Us
            </Link>
          </div>

          {/* Login Button */}
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
