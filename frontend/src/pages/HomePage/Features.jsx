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
        <Section className="bg-gray-900/10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Why Choose Us?</h2>
                <p className="text-gray-400 max-w-xl mx-auto">Everything you need for a smooth and enjoyable ride across your campus.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, i) => (
                    <Card key={i} className="group overflow-hidden">
                        <div className="text-4xl mb-6 bg-gray-700/50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:bg-blue-600 transition-all group-hover:scale-110 group-hover:rotate-3 shadow-lg">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">{feature.title}</h3>
                        <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                    </Card>
                ))}
            </div>
        </Section>
    );
};

export default Features;
