import React from 'react';

const Button = ({
    children,
    onClick,
    type = "button",
    variant = "primary",
    className = "",
    disabled = false,
    loading = false,
    icon: Icon
}) => {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25",
        secondary: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25",
        outline: "bg-transparent border border-gray-700 hover:border-gray-500 text-white hover:bg-gray-800/50",
        ghost: "bg-transparent hover:bg-white/5 text-gray-400 hover:text-white",
        danger: "bg-red-600/10 hover:bg-red-600/20 text-red-500 border border-red-500/20"
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`
                px-6 py-3 rounded-2xl font-bold transition-all transform active:scale-95 flex items-center justify-center gap-2
                ${variants[variant] || variants.primary}
                ${disabled || loading ? 'opacity-50 cursor-not-allowed scale-100' : 'hover:scale-[1.02]'}
                ${className}
            `}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            )}
            {!loading && Icon && <span className="text-lg">{Icon}</span>}
            {children}
        </button>
    );
};

export default Button;
