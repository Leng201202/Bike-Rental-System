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
        <Section padding="py-12" className="border-y border-[#E5E7EB] bg-[#F9FAFB]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <div key={i} className="text-center group">
                        <div className="text-3xl font-semibold text-[#8B2E2E] mb-1">
                            {stat.value}
                        </div>
                        <div className="text-[#6B7280] text-sm uppercase tracking-wide">
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
};

export default Stats;
