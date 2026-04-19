import React, { useState } from 'react';
import Button from '../UI/Button';
import Input from '../UI/Input';

const buildInitialFormData = (bike) => {
    if (bike) {
        return {
            name: bike.name,
            type: bike.type,
            status: bike.status,
            pricePerHour: bike.pricePerHour,
            pricePerKm: bike.pricePerKm || '',
            imageUrl: bike.imageUrl,
            description: bike.description || '',
            currentZone: bike.location?.zone || bike.currentZone || '',
            currentLat: bike.location?.lat ?? bike.currentLat ?? '',
            currentLng: bike.location?.lng ?? bike.currentLng ?? ''
        };
    }

    return {
        name: '',
        type: 'CITY',
        status: 'AVAILABLE',
        pricePerHour: '',
        pricePerKm: '',
        imageUrl: '',
        description: '',
        currentZone: '',
        currentLat: '',
        currentLng: ''
    };
};

const BikeModal = ({ isOpen, onClose, onSave, bike = null, loading = false }) => {
    const [formData, setFormData] = useState(() => buildInitialFormData(bike));

    const handleDetectGps = () => {
        if (!('geolocation' in navigator)) {
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setFormData((prev) => ({
                    ...prev,
                    currentLat: Number(position.coords.latitude.toFixed(7)),
                    currentLng: Number(position.coords.longitude.toFixed(7)),
                    currentZone: prev.currentZone || 'GPS Captured',
                }));
            },
            () => {
                // No-op: keep manual entry available.
            },
            { enableHighAccuracy: true }
        );
    };

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white border border-[#E5E7EB] w-full max-w-2xl rounded-2xl shadow-xl p-8 relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-3xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">
                    {bike ? 'Edit Bike Details' : 'Add New Bike'}
                </h2>
                <p className="text-[#6B7280] font-medium mb-8">
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
                            <label className="text-[11px] font-medium tracking-wide text-[#6B7280] ml-1">Bike Type</label>
                            <select
                                className="w-full bg-white border border-[#D1D5DB] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#8B2E2E] focus:ring-2 focus:ring-[#8B2E2E]/15 transition-all font-medium text-[#2F2F2F] appearance-none"
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
                            <label className="text-[11px] font-medium tracking-wide text-[#6B7280] ml-1">Initial Status</label>
                            <select
                                className="w-full bg-white border border-[#D1D5DB] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#8B2E2E] focus:ring-2 focus:ring-[#8B2E2E]/15 transition-all font-medium text-[#2F2F2F] appearance-none"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="AVAILABLE">AVAILABLE</option>
                                <option value="RENTED">RENTED</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Input
                                label="Zone"
                                placeholder="e.g. Engineering Gate"
                                value={formData.currentZone}
                                onChange={(e) => setFormData({ ...formData, currentZone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Latitude"
                            type="number"
                            step="0.0000001"
                            placeholder="20.0461000"
                            value={formData.currentLat}
                            onChange={(e) => setFormData({ ...formData, currentLat: e.target.value })}
                        />
                        <Input
                            label="Longitude"
                            type="number"
                            step="0.0000001"
                            placeholder="99.8949000"
                            value={formData.currentLng}
                            onChange={(e) => setFormData({ ...formData, currentLng: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            className="px-5 py-2 text-xs font-medium tracking-wide"
                            onClick={handleDetectGps}
                        >
                            Use My GPS
                        </Button>
                    </div>

                    <Input
                        label="Image URL"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-[11px] font-medium tracking-wide text-[#6B7280] ml-1">Description</label>
                        <textarea
                            className="w-full bg-white border border-[#D1D5DB] rounded-md px-4 py-3 text-sm focus:outline-none focus:border-[#8B2E2E] focus:ring-2 focus:ring-[#8B2E2E]/15 transition-all font-medium text-[#374151] min-h-[100px]"
                            placeholder="Briefly describe this bike..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="pt-6 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 py-3 text-sm font-medium"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1 py-3 text-sm font-medium"
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
