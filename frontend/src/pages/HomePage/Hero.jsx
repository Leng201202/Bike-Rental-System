import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';

const Hero = ({ isAuthenticated }) => {
    return (
        <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
            <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 animate-blob animation-delay-4000"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                    The Smartest Way to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Ride on Campus</span>
                </h1>
                <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Experience seamless bike rentals with our campus-exclusive platform. Eco-friendly, affordable, and just a click away.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {isAuthenticated ? (
                        <Link to="/rider">
                            <Button variant="primary" className="px-10 py-4 text-lg">
                                Go to Dashboard
                            </Button>
                        </Link>
                    ) : (
                        <>
                            <Link to="/register">
                                <Button variant="primary" className="px-10 py-4 text-lg">
                                    Join Now — It's Free
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="outline" className="px-10 py-4 text-lg">
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
