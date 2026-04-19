import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useBikeStore from '../../store/useBikeStore';
import Button from '../../components/UI/Button';
import Card from '../../components/UI/Card';
import RouteMap from '../../components/UI/RouteMap';
import { showToast } from '../../components/UI/toast';
import SafeBikeImage from '../../components/UI/SafeBikeImage';
import { buildPromptPayQrUrl, getPromptPayAccount } from '../../utils/promptpay';

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
    const [transactionCode, setTransactionCode] = useState('');
    const [gpsReady, setGpsReady] = useState(false);

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
                        setGpsReady(true);
                    },
                    () => setGpsReady(false),
                    { enableHighAccuracy: true }
                );
            }
        }
    }, [rental, navigate]);

    if (!rental) return null;

    const promptPayReference = `RENTAL-${rental.id}`;
    const qrUrl = buildPromptPayQrUrl({
        amount: rental.currentCost,
        reference: promptPayReference,
        size: 280,
    });

    const captureCurrentLocation = async () => {
        if (!("geolocation" in navigator)) {
            showToast.error("Geolocation is not supported on this device.");
            return null;
        }

        return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const nextLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setUserLocation(nextLocation);
                    setGpsReady(true);
                    resolve(nextLocation);
                },
                () => {
                    setGpsReady(false);
                    showToast.error("Please keep GPS enabled while riding. Turn on location to end your ride.");
                    resolve(null);
                },
                { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
            );
        });
    };

    const handlePaymentConfirm = async () => {
        const latestLocation = await captureCurrentLocation();
        if (!latestLocation) {
            return;
        }

        setStep('PROCESSING');

        const result = await returnBike(
            rental.id,
            null,
            {
                finalLat: latestLocation.lat,
                finalLng: latestLocation.lng,
                routePoints: readRideTrack(rental.id),
            }
        );
        if (result?.success) {
            clearRideTrack(rental.id);
            setTransactionCode(result?.payment?.transactionCode || '');
            setStep('SUCCESS');
        } else {
            showToast.error(result?.error || "Payment verification failed. Please try again.");
            setStep('QR');
        }
    };

    const getDurationLabel = () => {
        if (!rental?.startTime) return '-';
        const startedAt = new Date(rental.startTime).getTime();
        const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return `${h}h ${m}m`;
    };

    return (
        <div className="min-h-screen py-12 px-4 bg-[#F3F4F6]">
            <div className="max-w-6xl mx-auto">
                <div className="mb-10">
                    <Button
                        variant="outline"
                        onClick={() => navigate('/rider?tab=manage')}
                        className="mb-6 py-2 px-6"
                    >
                        ← Back to Management
                    </Button>
                    <h1 className="text-4xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">Ride Summary</h1>
                    <p className="text-[#6B7280] font-medium">Review your ride details and complete payment.</p>
                </div>

                {/* Prominent Map Hero for MILEAGE rentals */}
                {rental.method === 'MILEAGE' && (
                    <div className="mb-8 animate-in fade-in duration-500">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <div className="text-[10px] font-semibold text-[#8B2E2E] uppercase tracking-[0.24em]">Route Summary</div>
                            <div className="px-3 py-1 bg-[#FCEAEA] border border-[#F2CACA] rounded-full text-[10px] font-semibold text-[#8B2E2E] uppercase tracking-widest">
                                Mileage Ride
                            </div>
                        </div>
                        <RouteMap
                            route={rental.route}
                            isExpanded={true}
                            className="!h-[360px] !rounded-2xl"
                        />
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    {/* Left Side: Summary Card */}
                    <Card className="!p-8 rounded-2xl overflow-hidden relative h-full shadow-sm">
                        <div className="flex items-center gap-5 mb-8">
                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-[#E5E7EB]">
                                <SafeBikeImage bike={rental} src={rental.bikeImage} alt={rental.bikeName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="text-[10px] font-semibold uppercase text-[#8B2E2E] tracking-[0.2em] mb-1">Rental Active</div>
                                <h2 className="text-2xl font-semibold text-[#2F2F2F] tracking-tight">{rental.bikeName}</h2>
                                <span className="px-3 py-1 bg-[#F9FAFB] border border-[#E5E7EB] text-[#6B7280] text-[9px] font-semibold rounded-lg uppercase tracking-widest">
                                    {rental.bikeType}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-5 mb-8 pb-8 border-b border-[#E5E7EB]">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-[#6B7280] font-semibold uppercase tracking-widest text-[10px]">Plan Selection</span>
                                <span className={`px-4 py-1.5 rounded-xl font-semibold text-[10px] uppercase tracking-widest ${rental.method === 'HOURLY' ? 'bg-[#FCEAEA] text-[#8B2E2E] border border-[#F2CACA]' : 'bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0]'
                                    }`}>
                                    {rental.method} PLAN
                                </span>
                            </div>

                            {/* HOURLY Plan Details */}
                            {rental.method === 'HOURLY' && (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-500">
                                    <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                                        <div className="text-[9px] font-semibold text-[#6B7280] uppercase mb-1">Start Time</div>
                                        <div className="text-sm font-semibold text-[#2F2F2F] tracking-tight">{new Date(rental.startTime).toLocaleTimeString()}</div>
                                    </div>
                                    <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB]">
                                        <div className="text-[9px] font-semibold text-[#6B7280] uppercase mb-1">End Time</div>
                                        <div className="text-sm font-semibold text-[#2F2F2F] tracking-tight">{new Date().toLocaleTimeString()}</div>
                                    </div>
                                    <div className="col-span-2 bg-[#FCEAEA] p-4 rounded-xl border border-[#F2CACA] flex justify-between items-center">
                                        <div className="text-[9px] font-semibold text-[#8B2E2E] uppercase">Total Duration</div>
                                        <div className="text-sm font-semibold text-[#2F2F2F]">{getDurationLabel()}</div>
                                    </div>
                                </div>
                            )}

                            {/* MILEAGE Checkpoints (Simple list since map is now above) */}
                            {rental.method === 'MILEAGE' && (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <div className="bg-[#F9FAFB] p-5 rounded-xl border border-[#E5E7EB] space-y-3">
                                        <div className="text-[9px] font-semibold text-[#8B2E2E] uppercase tracking-widest">Journey Log</div>
                                        {(rental.route || []).length > 0 ? (
                                            rental.route.map((point, index) => (
                                                <div key={index} className="flex items-center gap-3">
                                                    <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-[#047857]' : index === rental.route.length - 1 ? 'bg-[#8B2E2E]' : 'bg-[#9CA3AF]'}`}></div>
                                                    <span className="text-[11px] font-medium text-[#4B5563]">{point.name}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-[11px] text-[#6B7280] font-medium">No route points available for this ride.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-[10px] font-semibold uppercase text-[#6B7280] tracking-widest mb-1">Grand Total Fee</div>
                                <div className="text-4xl font-semibold text-[#2F2F2F] tracking-tight">
                                    <span className="text-xl text-[#8B2E2E] mr-1 uppercase">฿</span>
                                    {rental.currentCost.toFixed(2)}
                                </div>
                            </div>
                            {step === 'CHECKOUT' && (
                                <div className="flex flex-col items-end gap-2">
                                    <div className="bg-[#ECFDF3] text-[#047857] text-[10px] font-semibold px-3 py-1.5 rounded-lg border border-[#A7F3D0] uppercase tracking-wide">
                                        Ready
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Right Side: Payment Terminal */}
                    <Card className="!p-8 rounded-2xl shadow-sm min-h-[500px] flex flex-col justify-center text-center">

                        {step === 'CHECKOUT' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
                                <div className="mb-6 w-16 h-16 bg-[#FCEAEA] text-[#8B2E2E] rounded-2xl flex items-center justify-center text-2xl mx-auto">💳</div>
                                <h3 className="text-2xl font-semibold text-[#2F2F2F] mb-2 uppercase tracking-tight">Checkout</h3>
                                <p className="text-[#6B7280] text-sm font-medium mb-8 mx-auto max-w-[260px]">Confirm your details and proceed to secure payment.</p>
                                <Button
                                    onClick={() => setStep('QR')}
                                    variant="primary"
                                    className="w-full py-4 rounded-xl font-semibold uppercase text-xs tracking-widest"
                                >
                                    Proceed to QR Payment
                                </Button>
                            </div>
                        )}

                        {step === 'QR' && (
                            <div className="animate-in zoom-in-95 duration-500 w-full">
                                <h3 className="text-xl font-semibold text-[#2F2F2F] mb-6 uppercase tracking-widest">Scan QR Code</h3>
                                <div className="bg-white p-4 rounded-2xl mb-6 inline-block border border-[#E5E7EB]">
                                    <img src={qrUrl} alt="PromptPay QR" className="w-56 h-56 rounded-xl object-contain" />
                                </div>
                                <div className="mb-8 text-center">
                                    <p className="text-sm font-medium text-[#6B7280]">PromptPay account: {getPromptPayAccount()}</p>
                                    <p className="text-[11px] font-semibold text-[#8B2E2E] tracking-wide mt-1">Reference: {promptPayReference}</p>
                                </div>
                                <div className="space-y-4">
                                    {!gpsReady && (
                                        <div className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-3 py-2 text-[11px] font-semibold text-[#B91C1C]">
                                            GPS is required to finish ride and update bike location.
                                        </div>
                                    )}
                                    <Button
                                        onClick={handlePaymentConfirm}
                                        variant="primary"
                                        className="w-full py-4 rounded-xl font-semibold uppercase text-xs tracking-widest"
                                    >
                                        I Have Paid via PromptPay
                                    </Button>
                                    <button
                                        onClick={() => setStep('CHECKOUT')}
                                        className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-widest hover:text-[#2F2F2F] transition-colors"
                                    >
                                        Back to summary
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 'PROCESSING' && (
                            <div className="text-center">
                                <div className="w-16 h-16 border-4 border-[#F2CACA] border-t-[#8B2E2E] rounded-full animate-spin mx-auto mb-6"></div>
                                <h3 className="text-xl font-semibold text-[#2F2F2F] uppercase tracking-widest mb-2">Verifying Payment</h3>
                                <p className="text-[#6B7280] text-sm font-medium">Contacting payment service...</p>
                            </div>
                        )}

                        {step === 'SUCCESS' && (
                            <div className="animate-in zoom-in-50 duration-700">
                                <div className="w-20 h-20 bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0] rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                                <h3 className="text-2xl font-semibold text-[#2F2F2F] uppercase tracking-widest mb-2">Success!</h3>
                                <p className="text-[#6B7280] text-sm font-medium mb-2">Your journey is complete.</p>
                                {transactionCode && (
                                    <p className="text-[#8B2E2E] text-xs font-semibold tracking-wide mb-8">Transaction: {transactionCode}</p>
                                )}
                                <Button
                                    onClick={() => navigate('/rider?tab=history')}
                                    variant="primary"
                                    className="w-full py-4 rounded-xl font-semibold uppercase text-xs"
                                >
                                    View in History
                                </Button>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
