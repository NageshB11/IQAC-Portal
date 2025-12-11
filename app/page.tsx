'use client'

import Link from 'next/link'
import { Button } from '@/app/components/ui/button'
import Navbar from '@/app/components/navbar'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Quality Assurance & Institutional Excellence
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-balance max-w-2xl mx-auto">
            Empower your institution with a comprehensive platform for quality management,
            document tracking, and institutional development.
          </p>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="font-bold text-gray-900 mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600 text-sm">Track institutional quality metrics and performance indicators</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl mb-4">📁</div>
            <h3 className="font-bold text-gray-900 mb-2">Document Management</h3>
            <p className="text-gray-600 text-sm">Organize and manage quality assurance documents efficiently</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl mb-4">👥</div>
            <h3 className="font-bold text-gray-900 mb-2">Multi-Role Access</h3>
            <p className="text-gray-600 text-sm">Admin, Coordinator, Faculty, and Student roles with tailored views</p>
          </div>
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="font-bold text-gray-900 mb-2">Secure & Reliable</h3>
            <p className="text-gray-600 text-sm">Enterprise-grade security for institutional data protection</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="bg-gray-50 py-20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">About Us</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <p className="text-gray-600 mb-4 leading-relaxed">
                The IQAC Portal is designed to streamline quality assurance processes
                in educational institutions. Our platform provides comprehensive tools
                for institutional excellence and continuous improvement.
              </p>
              <p className="text-gray-600 mb-4 leading-relaxed">
                We serve administrators, coordinators, faculty, and students by
                providing a unified platform for quality management, document
                tracking, and institutional feedback.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Real-time document tracking and approval workflow</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Comprehensive analytics and reporting</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Multi-role access control and permissions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold">✓</span>
                  <span>Feedback collection and survey management</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Contact Us</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-2xl mb-4">📧</div>
            <h3 className="font-bold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600">support@iqacportal.com</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-4">📞</div>
            <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
            <p className="text-gray-600">+91 (555) 123-4567</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-4">📍</div>
            <h3 className="font-bold text-gray-900 mb-2">Address</h3>
            <p className="text-gray-600">Education Hub, India</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">© 2025 IQAC Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
