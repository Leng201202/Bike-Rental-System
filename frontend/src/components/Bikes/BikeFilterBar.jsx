import React from 'react';

const BikeFilterBar = ({ activeFilter, onChange }) => {
    const categories = [
        { id: 'ALL', label: 'All Bikes' },
        { id: 'MOUNTAIN', label: 'Mountain' },
        { id: 'ROAD', label: 'Road' },
        { id: 'CITY', label: 'City' },
        { id: 'ELECTRIC', label: 'Electric' },
    ];

    return (
        <div className="flex bg-white p-1.5 rounded-xl border border-[#E5E7EB] overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onChange(cat.id)}
                    className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${activeFilter === cat.id
                            ? 'bg-[#8B2E2E] text-white'
                            : 'text-[#4B5563] hover:text-[#8B2E2E] hover:bg-[#F9FAFB]'
                        }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
};

export default BikeFilterBar;
