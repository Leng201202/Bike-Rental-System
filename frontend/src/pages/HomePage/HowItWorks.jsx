import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../../components/UI/Section';
import Button from '../../components/UI/Button';

const HowItWorks = () => {
    const steps = [
        { step: '01', title: 'Register Account', desc: 'Sign up with your campus email in minutes.' },
        { step: '02', title: 'Find a Bike', desc: 'Use the live map to locate the nearest available bike.' },
        { step: '03', title: 'Enjoy the Ride', desc: 'Unlock, ride, and park at any designated station.' }
    ];

    return (
        <Section>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden relative shadow-3xl shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">Ready to get rolling?</h2>
                    <p className="text-blue-100/80 text-lg mb-8 max-w-md">Join thousands of students who have already simplified their daily commute.</p>
                    <Link to="/register">
                        <button className="px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all shadow-xl shadow-black/20 transform hover:scale-105 active:scale-95">
                            Get Started Now
                        </button>
                    </Link>
                </div>

                <div className="flex-1 w-full grid grid-cols-1 gap-6">
                    {steps.map((item, i) => (
                        <div key={i} className="flex gap-6 items-start bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/10 hover:bg-white/20 transition-all group">
                            <div className="text-2xl font-black text-white/40 group-hover:text-white/80 transition-colors uppercase tracking-widest">{item.step}</div>
                            <div>
                                <h4 className="font-bold text-white mb-1 uppercase tracking-wider">{item.title}</h4>
                                <p className="text-sm text-blue-100/70 leading-relaxed font-medium">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default HowItWorks;
