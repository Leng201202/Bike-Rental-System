import React from 'react';
import useAuthStore from '../store/useAuthStore';
import Hero from './HomePage/Hero';
import Stats from './HomePage/Stats';
import Features from './HomePage/Features';
import HowItWorks from './HomePage/HowItWorks';

const HomePage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F7]">
      <Hero isAuthenticated={isAuthenticated} />
      <Stats />
      <Features />
      <HowItWorks />

      {/* Footer */}
      <footer className="py-12 border-t border-[#E5E7EB] text-center bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="font-semibold text-xl text-[#8B2E2E] mb-3">MFU Bike Rental</div>
          <p className="text-[#6B7280] text-sm mb-6">Built for students, by students. &copy; 2026 Mae Fah Luang University.</p>
          <div className="flex justify-center gap-8 text-sm text-[#6B7280]">
            <a href="#" className="hover:text-[#8B2E2E] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#8B2E2E] transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-[#8B2E2E] transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
