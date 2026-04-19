import React from 'react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between px-8 py-6 bg-[#F9FAFB] border-t border-[#E5E7EB]">
            <div className="text-sm font-medium text-[#6B7280]">
                Page <span className="text-[#2F2F2F] font-semibold">{currentPage}</span> of <span className="text-[#2F2F2F] font-semibold">{totalPages}</span>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="px-4 py-2 text-xs font-medium disabled:opacity-40"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>

                <div className="flex gap-1">
                    {pages.map(page => (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-8 h-8 rounded-md text-xs font-semibold transition-all border ${currentPage === page
                                    ? 'bg-[#8B2E2E] border-[#8B2E2E] text-white'
                                    : 'bg-white border-[#D1D5DB] text-[#6B7280] hover:text-[#8B2E2E] hover:border-[#8B2E2E]/50'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    className="px-4 py-2 text-xs font-medium disabled:opacity-40"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

export default Pagination;
