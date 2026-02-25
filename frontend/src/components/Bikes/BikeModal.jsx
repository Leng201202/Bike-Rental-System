import React, { useState, useEffect } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';

const BikeModal = ({ isOpen, onClose, onSave, bike = null, loading = false }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'CITY',
        status: 'AVAILABLE',
        pricePerHour: '',
        pricePerKm: '',
        imageUrl: '',
        description: ''
    });

    useEffect(() => {
        if (bike) {
            setFormData({
                name: bike.name,
                type: bike.type,
                status: bike.status,
                pricePerHour: bike.pricePerHour,
                pricePerKm: bike.pricePerKm || '',
                imageUrl: bike.imageUrl,
                description: bike.description || ''
            });
        } else {
            setFormData({
                name: '',
                type: 'CITY',
                status: 'AVAILABLE',
                pricePerHour: '',
                pricePerKm: '',
                imageUrl: '',
                description: ''
            });
        }
    }, [bike, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-[#1f1f1f] border border-gray-800 w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-10 relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl font-black mb-2 uppercase tracking-tight">
                    {bike ? 'Edit Bike Details' : 'Add New Bike'}
                </h2>
                <p className="text-gray-400 font-medium mb-10">
                    {bike ? 'Update the specifications for this fleet unit.' : 'Register a new bike into the campus rental system.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Bike Name"
                            placeholder="e.g. Electric Spark S5"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Bike Type</label>
                            <select
                                className="w-full bg-black/20 border border-gray-800 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all font-bold text-white appearance-none"
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="CITY">CITY</option>
                                <option value="MOUNTAIN">MOUNTAIN</option>
                                <option value="ROAD">ROAD</option>
                                <option value="ELECTRIC">ELECTRIC</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Price Per Hour (Baht)"
                            type="number"
                            step="0.1"
                            placeholder="e.g. 20"
                            value={formData.pricePerHour}
                            onChange={(e) => setFormData({ ...formData, pricePerHour: parseFloat(e.target.value) })}
                            required
                        />
                        <Input
                            label="Price Per KM (Baht)"
                            type="number"
                            step="0.1"
                            placeholder="e.g. 2.0"
                            value={formData.pricePerKm}
                            onChange={(e) => setFormData({ ...formData, pricePerKm: parseFloat(e.target.value) })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Initial Status</label>
                            <select
                                className="w-full bg-black/20 border border-gray-800 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all font-bold text-white appearance-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="RENTED">RENTED</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            {/* Empty space for alignment if needed, or another field */}
                        </div>
                    </div>

                    <Input
                        label="Image URL"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Description</label>
                        <textarea
                            className="w-full bg-black/20 border border-gray-800 rounded-2xl px-5 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium text-gray-300 min-h-[100px]"
                            placeholder="Briefly describe this bike..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 py-4 uppercase tracking-widest text-xs"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1 py-4 uppercase tracking-widest text-xs"
                            loading={loading}
                        >
                            {bike ? 'Update Bike' : 'Register Bike'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BikeModal;
