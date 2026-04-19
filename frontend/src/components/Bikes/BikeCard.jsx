import React from "react";
import Card from "../UI/Card";
import StatusBadge from "../UI/StatusBadge";
import Button from "../UI/Button";
import SafeBikeImage from "../UI/SafeBikeImage";

const BikeCard = ({ bike, onRent, isOwner = false }) => {
  return (
    <Card className="group overflow-hidden !p-0">
      <div className="relative h-64 overflow-hidden">
        <SafeBikeImage
          bike={bike}
          alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-6 left-6 flex gap-2">
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide text-[#8B2E2E] bg-[#FCEAEA] border border-[#F2CACA]">
            {bike.type}
          </span>
          <StatusBadge status={bike.status} />
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-[#2F2F2F] transition-colors tracking-tight">
            {bike.name}
          </h3>
          <div className="text-right">
            <div className="text-xl font-semibold text-[#2F2F2F]">
              ฿{bike.pricePerHour}/hr
            </div>
            <div className="text-sm font-semibold text-[#8B2E2E]">
              ฿{bike.pricePerKm || "2.0"}/km
            </div>
          </div>
        </div>
        <p className="text-[#6B7280] text-sm leading-relaxed mb-8 font-medium line-clamp-2">
          "{bike.description}"
        </p>

        {!isOwner && (
          <Button
            variant={bike.status === "AVAILABLE" ? "primary" : "outline"}
            onClick={() => onRent && onRent(bike)}
            disabled={bike.status !== "AVAILABLE"}
            className="w-full py-3 text-sm font-medium"
          >
            {bike.status === "AVAILABLE"
              ? "Rent This Bike"
              : bike.status === "RESERVED"
                ? "Reserved (30 Min Hold)"
                : bike.status.replace("_", " ")}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default BikeCard;
