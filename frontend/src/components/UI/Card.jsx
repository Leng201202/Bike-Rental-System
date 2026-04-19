import React from 'react';

const Card = ({ children, className = "", hover = true, padding = "p-8" }) => {
    return (
        <div className={`
            bg-white border border-[#E5E5E5] rounded-lg transition-colors duration-150
            ${hover ? 'hover:border-[#D4D4D4]' : ''}
            ${padding}
            ${className}
        `}>
            {children}
        </div>
    );
};

export default Card;
