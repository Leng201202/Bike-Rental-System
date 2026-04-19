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
    readOnly = false,
    className = ""
}) => {
    return (
        <div className={`w-full ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-[#374151] mb-2">
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
                readOnly={readOnly}
                className={`
                    w-full px-4 py-2.5 bg-white border rounded-md outline-none transition-all placeholder:text-[#9CA3AF] font-normal text-[#2F2F2F]
                    ${error ? 'border-[#B91C1C] focus:ring-[#B91C1C]/20' : 'border-[#D1D5DB] focus:ring-[#8B2E2E]/15 focus:border-[#8B2E2E] focus:ring-2'}
                `}
            />
            {error && (
                <p className="mt-1 text-xs font-medium text-[#B91C1C]">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
