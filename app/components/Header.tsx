'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, LayoutDashboard, FileText, UserPlus, LogIn } from 'lucide-react';

const Header = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  // Handler for signing out, now with a redirect to the homepage
  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const renderNavLinks = () => {
    if (userRole === 'STUDENT') {
      return (
        <>
          <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
            <LayoutDashboard className="w-4 h-4 mr-2" />
            Report an Issue
          </Link>
          <Link href="/tickets" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
            <FileText className="w-4 h-4 mr-2" />
            View All Tickets
          </Link>
        </>
      );
    }
    if (userRole === 'WARDEN') {
      return (
        <Link href="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center">
          <LayoutDashboard className="w-4 h-4 mr-2" />
          Warden Dashboard
        </Link>
      );
    }
    return null;
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-800">
              FixIt Hostel
            </Link>
          </div>
          <nav className="hidden md:flex md:items-center md:space-x-8">
            {renderNavLinks()}
          </nav>
          <div className="flex items-center space-x-4">
            {session?.user ? (
              <>
                <span className="hidden sm:inline text-sm text-gray-600">
                  Welcome, {session.user.name}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center text-sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center">
                   <LogIn className="w-4 h-4 mr-2" />
                   Student Login
                </Link>
                 <Link href="/register" className="text-sm font-medium bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center">
                   <UserPlus className="w-4 h-4 mr-2" />
                   Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
