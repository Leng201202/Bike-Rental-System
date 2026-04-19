import React from 'react';
import Section from '../../components/UI/Section';
import Card from '../../components/UI/Card';

const Features = () => {
    const features = [
        {
            title: 'Quick Unlock',
            desc: 'Scan the QR code and be on your way in seconds. No keys, no hassle.',
            icon: '⚡'
        },
        {
            title: 'Flexible Plans',
            desc: 'Pay as you go or choose a monthly pass that fits your student budget.',
            icon: '💳'
        },
        {
            title: 'Live Tracking',
            desc: 'Find the nearest bike station in real-time with our interactive map.',
            icon: '📍'
        }
    ];

    return (
        <Section className="bg-white border-y border-[#E5E7EB]">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-semibold mb-4 text-[#2F2F2F]">Why Students Choose This Service</h2>
                <p className="text-[#6B7280] max-w-2xl mx-auto">Everything you need for quick and safe travel around campus, from live map guidance to flexible ride plans.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <Card key={i} className="group overflow-hidden">
                        <div className="text-4xl mb-6 bg-[#FCEAEA] text-[#8B2E2E] w-16 h-16 flex items-center justify-center rounded-xl group-hover:bg-[#F2CACA] transition-colors shadow-sm">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-[#2F2F2F]">{feature.title}</h3>
                        <p className="text-[#6B7280] leading-relaxed">{feature.desc}</p>
                    </Card>
                ))}
            </div>
        </Section>
    );
};

export default Features;
