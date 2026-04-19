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
            bg: "bg-[#FCEAEA] border-[#F2CACA]",
            iconActive: "bg-[#8B2E2E] text-white",
            checkActive: "bg-[#8B2E2E] border-[#8B2E2E]",
            text: "text-[#8B2E2E] hover:text-[#6F2323]"
        },
        indigo: {
            bg: "bg-[#FFF7ED] border-[#FED7AA]",
            iconActive: "bg-[#9A3412] text-white",
            checkActive: "bg-[#9A3412] border-[#9A3412]",
            text: "text-[#9A3412] hover:text-[#7C2D12]"
        }
    };

    const colors = colorClasses[activeColor] || colorClasses.blue;

    return (
        <div
            onClick={onToggle}
            className={`p-6 rounded-xl border transition-all cursor-pointer flex items-center gap-6 group/item ${isActive ? colors.bg : 'bg-white border-[#E5E7EB] hover:border-[#D1D5DB]'}`}
        >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? colors.iconActive : 'bg-[#F3F4F6] text-[#6B7280]'}`}>
                {Icon}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-[#2F2F2F] mb-1 whitespace-nowrap">{title}</h4>
                <p className="text-sm text-[#6B7280] mb-2">{description}</p>
                {onReadMore && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onReadMore();
                        }}
                        className={`text-xs font-medium tracking-wide transition-colors ${colors.text} hover:underline`}
                    >
                        {readMoreLabel}
                    </button>
                )}
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isActive ? colors.checkActive + ' text-white' : 'border-[#D1D5DB] bg-white'}`}>
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
