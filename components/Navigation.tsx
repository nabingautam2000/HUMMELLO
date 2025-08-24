'use client';

import Link from 'next/link';
import { Music } from 'lucide-react';

export default function Navigation() {
  return (
    <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3 text-white hover:text-blue-400 transition-colors">
            <Music className="h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              HUMMELLO
            </span>
          </Link>
          
          <div className="flex items-center space-x-8">
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}