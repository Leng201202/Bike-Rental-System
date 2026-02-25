import React from 'react';

const PermissionCard = ({
    icon: Icon,
    title,
    description,
    isActive,
    onToggle,
    onReadMore,
    readMoreLabel = "Read More",
    activeColor = "blue"
}) => {
    const colorClasses = {
        blue: {
            bg: "bg-blue-600/10 border-blue-500/50",
            iconActive: "bg-blue-500 text-white",
            checkActive: "bg-blue-500 border-blue-500",
            text: "text-blue-400 hover:text-blue-300"
        },
        indigo: {
            bg: "bg-indigo-600/10 border-indigo-500/50",
            iconActive: "bg-indigo-500 text-white",
            checkActive: "bg-indigo-500 border-indigo-500",
            text: "text-indigo-400 hover:text-indigo-300"
        }
    };

    const colors = colorClasses[activeColor] || colorClasses.blue;

    return (
        <div
            onClick={onToggle}
            className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center gap-6 group/item ${isActive ? colors.bg : 'bg-gray-900/30 border-gray-700 hover:border-gray-600'}`}
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isActive ? colors.iconActive : 'bg-gray-800 text-gray-500'}`}>
                {Icon}
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white mb-1 whitespace-nowrap">{title}</h4>
                <p className="text-[11px] text-gray-400 mb-2">{description}</p>
                {onReadMore && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onReadMore();
                        }}
                        className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${colors.text} hover:underline`}
                    >
                        {readMoreLabel}
                    </button>
                )}
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? colors.checkActive + ' text-white' : 'border-gray-600'}`}>
                {isActive && (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path>
                    </svg>
                )}
            </div>
        </div>
    );
};

export default PermissionCard;
