// app/components/LandingPage.tsx
'use client';

import Link from 'next/link';
import { ShieldCheck, Zap, BarChart, HardHat } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans px-14">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <HardHat className="w-7 h-7 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">FixIt Hostel</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login" // Assuming a single login page for now
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Student Login
            </Link>
            <Link
              href="/admin/login" // This can be a different route later, e.g., /admin/login
              className="px-4 py-2 text-sm font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Hero Text */}
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-100 rounded-full">
              Official College & Hostel Maintenance Portal
            </span>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Report issues in minutes. Get clear updates.
            </h1>
            <p className="text-lg text-gray-600">
              FixIt Hostel makes maintenance simple for students and staff. Create a ticket, choose your hostel & room, add details, and track progress with clear SLAs.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/register"
                className="px-6 py-3 font-semibold text-white bg-gray-800 rounded-md hover:bg-gray-900"
              >
                Report an Issue
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 font-semibold text-gray-800 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Student Login
              </Link>
            </div>
          </div>

          {/* Right Side: Info Box */}
          <div className="bg-white p-8 rounded-lg border border-gray-200">
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full font-bold">1</div>
                <p className="text-gray-700">Select your <span className="font-semibold">Hostel / Block / Room</span>.</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full font-bold">2</div>
                <p className="text-gray-700">Describe the <span className="font-semibold">problem</span> and attach photos (optional).</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-800 text-white rounded-full font-bold">3</div>
                <p className="text-gray-700">Receive a <span className="font-semibold">ticket ID</span> and live <span className="font-semibold">status updates</span>.</p>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Your request is routed to the right technician automatically. Critical issues are prioritized.
              </p>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Transparent SLAs</h3>
            <p className="mt-2 text-gray-600">Clear response & resolution timelines.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Trackable</h3>
            <p className="mt-2 text-gray-600">Every ticket has a status & timeline.</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Accessible</h3>
            <p className="mt-2 text-gray-600">Clean UI, bilingual-ready labels.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="container mx-auto px-6 py-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} FixIt Hostel • A clean, accessible maintenance portal for colleges & hostels.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
