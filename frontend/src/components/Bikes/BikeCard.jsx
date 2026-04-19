import React from "react";
import Card from "../UI/Card";
import StatusBadge from "../UI/StatusBadge";
import Button from "../UI/Button";
import SafeBikeImage from "../UI/SafeBikeImage";

const BikeCard = ({ bike, onRent, isOwner = false, layout = "card" }) => {
  if (layout === "list") {
    return (
      <Card className="!p-4 md:!p-5">
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden border border-[#E5E7EB] shrink-0">
            <SafeBikeImage
              bike={bike}
              alt={bike.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[#2F2F2F] tracking-tight truncate">
                {bike.name}
              </h3>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide text-[#8B2E2E] bg-[#FCEAEA] border border-[#F2CACA]">
                {bike.type}
              </span>
              <StatusBadge status={bike.status} />
            </div>

            <p className="text-[#6B7280] text-sm leading-relaxed font-medium line-clamp-2 mb-3">
              {bike.description || "No description provided."}
            </p>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="text-sm font-semibold text-[#2F2F2F]">
                ฿{bike.pricePerHour}/hr
                <span className="ml-2 text-[#8B2E2E]">• ฿{bike.pricePerKm || "2.0"}/km</span>
              </div>

              {!isOwner && (
                <Button
                  variant={bike.status === "AVAILABLE" ? "primary" : "outline"}
                  onClick={() => onRent && onRent(bike)}
                  disabled={bike.status !== "AVAILABLE"}
                  className="w-full md:w-auto px-5 py-2.5 text-sm font-medium"
                >
                  {bike.status === "AVAILABLE"
                    ? "Rent"
                    : bike.status === "RESERVED"
                      ? "Reserved"
                      : bike.status.replace("_", " ")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    );
  }

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
