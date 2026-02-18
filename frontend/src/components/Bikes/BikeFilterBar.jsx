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
        <div className="flex bg-gray-800/50 p-1.5 rounded-2xl border border-gray-700/50 backdrop-blur-xl overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat.id}
                    onClick={() => onChange(cat.id)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeFilter === cat.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                >
                    {cat.label}
                </button>
            ))}
        </div>
    );
};

export default BikeFilterBar;
