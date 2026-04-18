import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useBikeStore from '../../store/useBikeStore';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import RouteMap from '../../components/UI/RouteMap';
import { showToast } from '../../components/UI/toast';
import SafeBikeImage from '../../components/UI/SafeBikeImage';

const getRideTrackStorageKey = (rentalId) => `ride-gps-track-${rentalId}`;

const readRideTrack = (rentalId) => {
    if (!rentalId) return [];
    try {
        const raw = localStorage.getItem(getRideTrackStorageKey(rentalId));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed
            .map((point) => ({
                lat: Number(point?.lat),
                lng: Number(point?.lng),
            }))
            .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));
    } catch {
        return [];
    }
};

const clearRideTrack = (rentalId) => {
    if (!rentalId) return;
    localStorage.removeItem(getRideTrackStorageKey(rentalId));
};

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { returnBike } = useBikeStore();
    const [step, setStep] = useState('CHECKOUT'); // CHECKOUT -> QR -> PROCESSING -> SUCCESS
    const [userLocation, setUserLocation] = useState(null);

    // Get rental data from navigation state
    const rental = location.state?.rental;

    useEffect(() => {
        if (!rental) {
            navigate('/rider?tab=manage');
        } else {
            // Pre-fetch location to avoid delay during payment
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setUserLocation({
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        });
                    },
                    (error) => console.log("Geolocation error:", error),
                    { enableHighAccuracy: true }
                );
            }
        }
    }, [rental, navigate]);

    if (!rental) return null;

    const handlePaymentConfirm = async () => {
        setStep('PROCESSING');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const success = await returnBike(
            rental.id,
            null,
            {
                finalLat: userLocation?.lat,
                finalLng: userLocation?.lng,
                routePoints: readRideTrack(rental.id),
            }
        );
        if (success) {
            clearRideTrack(rental.id);
            setStep('SUCCESS');
        } else {
            showToast.error("Payment verification failed. Please try again.");
            setStep('QR');
        }
    };

    return (
        <div className="min-h-screen py-20 px-4 bg-[#0a0a0a] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.1),transparent_50%)]"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/rider?tab=manage')}
                        className="mb-8 border-gray-800 text-gray-500 hover:text-white py-2 px-6"
                    >
                        ← Back to Management
                    </Button>
                    <h1 className="text-5xl font-black mb-4 uppercase tracking-tighter text-white">Ride Summary</h1>
                    <p className="text-gray-400 font-bold italic">Thank you for riding with us today.</p>
                </div>

                {/* Prominent Map Hero for MILEAGE rentals */}
                {rental.method === 'MILEAGE' && (
                    <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em]">Route Traversed Highlight</div>
                            <div className="px-4 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full text-[10px] font-black text-white italic tracking-widest uppercase">
                                ~4.2 km Odyssey
                            </div>
                        </div>
                        <RouteMap
                            route={rental.route}
                            isExpanded={true}
                            className="!h-[400px] border-purple-500/20 shadow-2xl shadow-purple-500/10 hover:border-purple-500/40 !rounded-[4rem]"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    {/* Left Side: Summary Card */}
                    <Card className="!p-10 border-gray-800/50 bg-gray-900/20 backdrop-blur-3xl rounded-[3rem] overflow-hidden relative h-full">
                        {/* Bike Image Spotlight */}
                        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 blur-[80px] -mr-20 -mt-20"></div>

                        <div className="flex items-center gap-6 mb-10 relative z-10">
                            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl">
                                <SafeBikeImage bike={rental} src={rental.bikeImage} alt={rental.bikeName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-[10px] font-black uppercase text-blue-500 tracking-[0.3em] mb-1">Rental Active</div>
                                <h2 className="text-2xl font-black text-white">{rental.bikeName}</h2>
                                <span className="px-3 py-1 bg-gray-800 border border-gray-700 text-gray-400 text-[9px] font-black rounded-lg uppercase tracking-widest">
                                    {rental.bikeType}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-6 mb-10 pb-10 border-b border-gray-800/50 relative z-10">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Plan Selection</span>
                                <span className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest ${rental.method === 'HOURLY' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                    }`}>
                                    {rental.method} PLAN
                                </span>
                            </div>

                            {/* HOURLY Plan Details */}
                            {rental.method === 'HOURLY' && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-700">
                                    <div className="bg-gray-800/20 p-4 rounded-2xl border border-gray-800/50">
                                        <div className="text-[9px] font-black text-gray-500 uppercase mb-1">Start Time</div>
                                        <div className="text-sm font-bold text-white tracking-tight">{new Date(rental.startTime).toLocaleTimeString()}</div>
                                    </div>
                                    <div className="bg-gray-800/20 p-4 rounded-2xl border border-gray-800/50">
                                        <div className="text-[9px] font-black text-gray-500 uppercase mb-1">End Time</div>
                                        <div className="text-sm font-bold text-white tracking-tight">{new Date().toLocaleTimeString()}</div>
                                    </div>
                                    <div className="col-span-2 bg-blue-500/5 p-4 rounded-2xl border border-blue-500/10 flex justify-between items-center">
                                        <div className="text-[9px] font-black text-blue-400 uppercase">Total Duration</div>
                                        <div className="text-sm font-black text-white">1h 24m</div>
                                    </div>
                                </div>
                            )}

                            {/* MILEAGE Checkpoints (Simple list since map is now above) */}
                            {rental.method === 'MILEAGE' && (
                                <div className="space-y-4 animate-in fade-in duration-700">
                                    <div className="bg-purple-500/5 p-6 rounded-3xl border border-purple-500/10 space-y-4">
                                        <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest">Journey Log</div>
                                        {rental.route?.map((point, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full ${index === 0 ? 'bg-green-500' : index === rental.route.length - 1 ? 'bg-blue-500' : 'bg-gray-600'}`}></div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{point.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-end relative z-10">
                            <div>
                                <div className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Grand Total Fee</div>
                                <div className="text-5xl font-black text-white tracking-tighter shadow-blue-500/20 drop-shadow-2xl">
                                    <span className="text-xl text-blue-500 mr-2 uppercase">฿</span>
                                    {rental.currentCost.toFixed(2)}
                                </div>
                            </div>
                            {step === 'CHECKOUT' && (
                                <div className="flex flex-col items-end gap-2">
                                    <div className="bg-green-500/20 text-green-400 text-[9px] font-black px-3 py-1.5 rounded-lg border border-green-500/20 uppercase tracking-tighter animate-pulse shadow-lg shadow-green-500/10">
                                        Terminal Ready
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Right Side: Payment Terminal */}
                    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden min-h-[500px]">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

                        {step === 'CHECKOUT' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
                                <div className="mb-8 w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-3xl mx-auto shadow-2xl shadow-blue-500/20">💳</div>
                                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-tight">Checkout</h3>
                                <p className="text-gray-500 text-xs font-bold mb-10 mx-auto max-w-[200px]">Confirm your details and proceed to secure payment.</p>
                                <Button
                                    onClick={() => setStep('QR')}
                                    variant="primary"
                                    className="w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest"
                                >
                                    Proceed to QR Payment
                                </Button>
                            </div>
                        )}

                        {step === 'QR' && (
                            <div className="animate-in zoom-in-95 duration-500 w-full">
                                <h3 className="text-xl font-black text-white mb-8 uppercase tracking-widest">Scan QR Code</h3>
                                <div className="bg-white p-4 rounded-3xl mb-10 inline-block relative overflow-hidden group">
                                    <div className="w-56 h-56 bg-gray-50 flex items-center justify-center text-5xl relative">
                                        📱
                                        <div className="absolute inset-0 grid grid-cols-4 gap-2 p-6 opacity-10">
                                            {Array.from({ length: 16 }).map((_, i) => (
                                                <div key={i} className="bg-black rounded-sm"></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute left-4 right-4 h-0.5 bg-blue-500 top-4 animate-scan shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
                                </div>
                                <div className="space-y-4">
                                    <Button
                                        onClick={handlePaymentConfirm}
                                        variant="primary"
                                        className="w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest"
                                    >
                                        I've Paid Site-Wide
                                    </Button>
                                    <button
                                        onClick={() => setStep('CHECKOUT')}
                                        className="text-[10px] font-black text-gray-500 uppercase tracking-widest hover:text-white transition-colors"
                                    >
                                        Back to summary
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'PROCESSING' && (
                            <div className="text-center">
                                <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto mb-8"></div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2">Verifying Payment</h3>
                                <p className="text-gray-500 text-xs font-bold italic">Contacting campus bank terminals...</p>
                            </div>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="animate-in zoom-in-50 duration-700">
                                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-5xl mx-auto mb-8 shadow-2xl shadow-green-500/20">✓</div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">Success!</h3>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Your journey is complete.</p>
                                <Button
                                    onClick={() => navigate('/rider?tab=history')}
                                    variant="primary"
                                    className="w-full py-4 rounded-2xl font-black uppercase text-xs"
                                >
                                    View in History
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
