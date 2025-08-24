'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { HardHat } from 'lucide-react';

const Header = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-gray-900">
          <HardHat className="w-7 h-7 text-gray-800" />
          FixIt Hostel
        </Link>
        <nav className="flex items-center gap-4">
          {session?.user ? (
            <>
              {/* --- MODIFICATION: Added navigation links for students --- */}
              {userRole === 'STUDENT' && (
                <>
                  <Link href="/dashboard" className="font-semibold text-gray-600 hover:text-black">
                    Report an Issue
                  </Link>
                  <Link href="/tickets" className="font-semibold text-gray-600 hover:text-black">
                    View All Tickets
                  </Link>
                </>
              )}
               {userRole === 'WARDEN' && (
                <Link href="/dashboard" className="font-semibold text-gray-600 hover:text-black">
                  Warden Dashboard
                </Link>
              )}
              <span className="text-gray-700 hidden sm:block">Welcome, {session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 font-semibold text-white bg-gray-800 rounded-md hover:bg-black"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 font-semibold text-white bg-gray-800 rounded-md hover:bg-black"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
