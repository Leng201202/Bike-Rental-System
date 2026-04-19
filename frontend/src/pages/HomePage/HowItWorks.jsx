import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../../components/UI/Section';

const HowItWorks = () => {
    const steps = [
        { step: '01', title: 'Register Account', desc: 'Sign up with your campus email in minutes.' },
        { step: '02', title: 'Find a Bike', desc: 'Use the live map to locate the nearest available bike.' },
        { step: '03', title: 'Enjoy the Ride', desc: 'Unlock, ride, and park at any designated station.' }
    ];

    return (
        <Section>
            <div className="bg-[#8B2E2E] rounded-2xl p-10 md:p-14 flex flex-col md:flex-row items-center gap-10 overflow-hidden relative shadow-lg">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffffff14] rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-semibold mb-5 text-white leading-tight">Ready to start your ride?</h2>
                    <p className="text-[#FDE8E8] text-base mb-8 max-w-md">Create your account and start renting bikes across campus in just a few steps.</p>
                    <Link to="/register">
                        <button className="px-8 py-3 bg-white text-[#8B2E2E] rounded-md font-semibold text-base hover:bg-[#F9FAFB] transition-colors">
                            Get Started
                        </button>
                    </Link>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 gap-6">
                    {steps.map((item, i) => (
                        <div key={i} className="flex gap-5 items-start bg-[#A63A3A] p-5 rounded-xl border border-[#C75B5B] transition-colors">
                            <div className="text-xl font-semibold text-[#FDE8E8] uppercase tracking-wide">{item.step}</div>
                            <div>
                                <h4 className="font-semibold text-white mb-1 tracking-wide">{item.title}</h4>
                                <p className="text-sm text-[#FDE8E8] leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default HowItWorks;
