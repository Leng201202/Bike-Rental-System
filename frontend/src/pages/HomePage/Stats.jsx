import React from 'react';
import Section from '../../components/UI/Section';

const Stats = () => {
    const stats = [
        { label: 'Available Bikes', value: '150+' },
        { label: 'Active Riders', value: '1.2k' },
        { label: 'Stations', value: '45' },
        { label: 'Cities', value: '12' },
    ];

    return (
        <Section padding="py-12" className="border-y border-gray-800 bg-gray-900/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center group">
                        <div className="text-3xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                            {stat.value}
                        </div>
                        <div className="text-gray-500 text-sm uppercase tracking-wider">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Stats;
