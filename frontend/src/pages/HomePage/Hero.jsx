import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';

const Hero = ({ isAuthenticated }) => {
    return (
        <section className="relative min-h-[78vh] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#FCEAEA,transparent_42%),radial-gradient(circle_at_80%_80%,#F3F4F6,transparent_38%)]">
            <div className="absolute top-10 left-8 w-40 h-40 border border-[#F2CACA] rounded-full opacity-70"></div>
            <div className="absolute bottom-12 right-10 w-56 h-56 border border-[#E5E7EB] rounded-full opacity-70"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <div className="inline-flex items-center px-4 py-1.5 mb-6 rounded-full border border-[#F2CACA] bg-[#FCEAEA] text-[#8B2E2E] text-xs font-semibold tracking-[0.12em] uppercase">
                    Mae Fah Luang University
                </div>
                <h1 className="text-4xl md:text-6xl font-semibold mb-6 tracking-tight leading-tight text-[#2F2F2F]">
                    Campus Bike Rental,
                    <span className="block text-[#8B2E2E]">Simple and Reliable</span>
                </h1>
                <p className="text-lg text-[#6B7280] mb-10 max-w-2xl mx-auto leading-relaxed">
                    Find a bike, start your ride, and return it in minutes. Designed for daily student life with clear pricing and live location support.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {isAuthenticated ? (
                        <Link to="/rider">
                            <Button variant="primary" className="px-8 py-3 text-base font-medium">
                                Go to Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/register">
                                <Button variant="primary" className="px-8 py-3 text-base font-medium">
                                    Create Account
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" className="px-8 py-3 text-base font-medium">
                                    Log In
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Hero;
