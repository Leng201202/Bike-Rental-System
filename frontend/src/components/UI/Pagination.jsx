import React from 'react';
import Button from './Button';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between px-8 py-6 bg-black/10 border-t border-gray-700/50">
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Page <span className="text-white">{currentPage}</span> of <span className="text-white">{totalPages}</span>
            </div>
            <div className="flex gap-2">
                <Button
                    variant="outline"
                    className="px-4 py-2 text-[10px] uppercase font-black tracking-widest disabled:opacity-30"
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
                            className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all border ${currentPage === page
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-transparent border-gray-700/50 text-gray-500 hover:text-white hover:border-gray-500'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    className="px-4 py-2 text-[10px] uppercase font-black tracking-widest disabled:opacity-30"
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
