import React from 'react';
import Card from '../UI/Card';
import StatusBadge from '../UI/StatusBadge';
import Button from '../UI/Button';

const BikeCard = ({ bike, onRent, isOwner = false }) => {
    return (
        <Card className="group overflow-hidden !p-0">
            <div className="relative h-64 overflow-hidden">
                <img
                    src={bike.imageUrl}
                    alt={bike.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-6 left-6 flex gap-2">
                    <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-white border border-white/10">
                        {bike.type}
                    </span>
                    <StatusBadge status={bike.status} />
                </div>
            </div>

            <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">
                        {bike.name}
                    </h3>
                    <div className="text-right">
                        <div className="text-2xl font-black text-white">${bike.pricePerHour}</div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase">per hour</div>
                    </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mb-8 font-medium italic line-clamp-2">
                    "{bike.description}"
                </p>

                {!isOwner && (
                    <Button
                        variant={bike.status === 'AVAILABLE' ? 'primary' : 'outline'}
                        onClick={() => onRent && onRent(bike)}
                        disabled={bike.status !== 'AVAILABLE'}
                        className="w-full py-4 uppercase tracking-widest text-xs"
                    >
                        {bike.status === 'AVAILABLE' ? 'Rent This Bike' : bike.status.replace('_', ' ')}
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default BikeCard;
