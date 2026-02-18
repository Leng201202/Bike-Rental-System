import React from 'react';

const Input = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required = false,
    error,
    className = ""
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-gray-300 mb-2 ml-1 uppercase tracking-wider">
                    {label}
                </label>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`
                    w-full px-5 py-4 bg-gray-900/50 border rounded-2xl outline-none transition-all placeholder:text-gray-600 font-medium
                    ${error ? 'border-red-500/50 focus:ring-red-500/40' : 'border-gray-700/50 focus:ring-blue-500/40 focus:border-blue-500 focus:ring-2'}
                `}
            />
            {error && (
                <p className="mt-2 ml-1 text-xs font-bold text-red-400 uppercase tracking-tight">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
