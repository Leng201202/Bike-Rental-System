import React from 'react';
import useAuthStore from '../store/useAuthStore';
import Hero from './HomePage/Hero';
import Stats from './HomePage/Stats';
import Features from './HomePage/Features';
import HowItWorks from './HomePage/HowItWorks';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen">
      <Hero isAuthenticated={isAuthenticated} />
      <Stats />
      <Features />
      <HowItWorks />

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800 text-center bg-black/20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="font-bold text-xl text-blue-500 mb-4">BikeRental</div>
          <p className="text-gray-500 text-sm mb-6">Built for students, by students. &copy; 2026 Campus Rides Inc.</p>
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
