import React from 'react';

const Card = ({ children, className = "", hover = true, padding = "p-8" }) => {
    return (
        <div className={`
            bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-3xl transition-all duration-300
            ${hover ? 'hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10' : ''}
            ${padding}
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;
