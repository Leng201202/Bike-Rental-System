import React, { useState } from "react";
import Button from "../UI/Button";

const RentalModal = ({ isOpen, onClose, bike, onConfirm }) => {
  const [selectedMethod, setSelectedMethod] = useState("HOURLY");
  const [selectedTiming, setSelectedTiming] = useState("IMMEDIATE");

  if (!isOpen || !bike) return null;

  const methods = [
    {
      id: "HOURLY",
      title: "Hourly Plan",
      price: `฿${bike.pricePerHour}/hr`,
      description: "Perfect for short trips and quick errands around campus.",
      icon: "⏱️",
    },
    {
      id: "MILEAGE",
      title: "Mileage Plan",
      price: `฿${bike.pricePerKm}/km`,
      description:
        "Best for long-distance travel and exploring far-off trails.",
      icon: "🛣️",
    },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white border border-[#E5E7EB] w-full max-w-lg rounded-2xl shadow-xl p-8 relative animate-in zoom-in-95 duration-300 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#8B2E2E]"></div>

        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-10">
          <div className="mb-4 inline-block px-4 py-1.5 bg-[#FCEAEA] border border-[#F2CACA] rounded-full text-[10px] font-semibold uppercase tracking-widest text-[#8B2E2E]">
            Rental Configuration
          </div>
          <h2 className="text-3xl font-semibold mb-2 tracking-tight text-[#2F2F2F]">
            Choose Your Plan
          </h2>
          <p className="text-[#6B7280] text-sm font-medium">
            Select how you want to pay for your ride on {bike.name}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-10">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`group relative p-6 rounded-3xl border-2 text-left transition-all duration-300 ${
                selectedMethod === method.id
                  ? "bg-[#FCEAEA] border-[#8B2E2E] shadow-sm"
                  : "bg-[#F9FAFB] border-[#E5E7EB] hover:border-[#D1D5DB]"
              }`}
            >
              <div className="flex items-center gap-5">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-transform duration-500 ${
                    selectedMethod === method.id
                      ? "bg-[#8B2E2E] text-white scale-110"
                      : "bg-[#F3F4F6] text-[#6B7280] group-hover:scale-105"
                  }`}
                >
                  {method.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4
                      className={`font-semibold uppercase tracking-tight ${selectedMethod === method.id ? "text-[#2F2F2F]" : "text-[#4B5563]"}`}
                    >
                      {method.title}
                    </h4>
                    <span
                      className={`text-xl font-semibold ${selectedMethod === method.id ? "text-[#8B2E2E]" : "text-[#2F2F2F]"}`}
                    >
                      {method.price}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#6B7280] font-medium leading-relaxed">
                    {method.description}
                  </p>
                </div>
                {selectedMethod === method.id && (
                  <div className="absolute -top-3 -right-3 bg-[#8B2E2E] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md animate-in zoom-in duration-300">
                    ✓
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="mb-10">
          <div className="mb-4 p-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB]">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#6B7280] mb-1">
              Bike QR Code
            </div>
            <p className="text-xs text-[#4B5563] font-medium">
              Print and attach this code as a QR label on the bike: <span className="font-semibold text-[#8B2E2E]">BIKE-{bike.id}</span>
            </p>
          </div>

          <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-[#6B7280]">
            Start Time
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedTiming("IMMEDIATE")}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                selectedTiming === "IMMEDIATE"
                  ? "bg-[#FCEAEA] border-[#8B2E2E] text-[#2F2F2F]"
                  : "bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563] hover:border-[#D1D5DB]"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-widest">
                Rent Now
              </div>
              <div className="text-[11px] mt-1 font-medium">
                Start ride immediately after confirming.
              </div>
            </button>
            <button
              onClick={() => setSelectedTiming("RESERVE_30_MIN")}
              className={`p-4 rounded-2xl border text-left transition-all duration-300 ${
                selectedTiming === "RESERVE_30_MIN"
                  ? "bg-[#FFF7ED] border-[#FB923C] text-[#2F2F2F]"
                  : "bg-[#F9FAFB] border-[#E5E7EB] text-[#4B5563] hover:border-[#D1D5DB]"
              }`}
            >
              <div className="text-xs font-semibold uppercase tracking-widest">
                Reserve 30 Minutes
              </div>
              <div className="text-[11px] mt-1 font-medium">
                Bike is held for 30 minutes and auto-cancels if not started.
              </div>
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 py-4 uppercase font-semibold tracking-widest text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => onConfirm(selectedMethod, selectedTiming)}
            className="flex-1 py-4 uppercase font-semibold tracking-widest text-xs"
          >
            {selectedTiming === "RESERVE_30_MIN"
              ? "Confirm Reservation"
              : "Confirm Rental"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RentalModal;
