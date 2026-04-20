import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutGrid, List, Search } from "lucide-react";
import useBikeStore from "../../store/useBikeStore";
import BikeCard from "../../components/Bikes/BikeCard";
import BikeFilterBar from "../../components/Bikes/BikeFilterBar";
import RentalModal from "../../components/Bikes/RentalModal";
import { showToast } from '../../components/UI/toast';
import { requestPreciseLocation, verifyBikeCodeWithPrompt } from "../../utils/rideAccess";

const BikesPage = ({ isCompact = false }) => {
  const navigate = useNavigate();
  const { bikes, fetchBikes, rentBike, loading, activeRentals } = useBikeStore();
  const [filter, setFilter] = useState("ALL");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState(isCompact ? "list" : "grid");
  const [selectedBike, setSelectedBike] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSeed, setModalSeed] = useState(0);

  useEffect(() => {
    fetchBikes();
  }, [fetchBikes]);

  const filteredBikes = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return bikes.filter((bike) => {
      const typeMatches = filter === "ALL" || bike.type === filter;
      if (!typeMatches) return false;

      if (!normalizedQuery) return true;
      const haystack = [
        bike.name,
        bike.type,
        bike.location?.zone,
        bike.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [bikes, filter, query]);

  const hasOpenRental = useMemo(
    () => activeRentals.some((rental) => rental.status === "ACTIVE" || rental.status === "RESERVED"),
    [activeRentals],
  );

  const handleRentClick = (bike) => {
    if (hasOpenRental) {
      showToast.error("You already have an active or reserved rental. Please end it before renting another bike.");
      return;
    }
    setSelectedBike(bike);
    setModalSeed((prev) => prev + 1);
    setIsModalOpen(true);
  };

  const handleConfirmRental = async (method, rentalType) => {
    if (!selectedBike) return;

    if (hasOpenRental) {
      showToast.error("You already have an active or reserved rental. Please end it before renting another bike.");
      setIsModalOpen(false);
      return;
    }

    if (rentalType !== "RESERVE_30_MIN") {
      try {
        await requestPreciseLocation();
      } catch (error) {
        showToast.error(error.message || "Please enable GPS before starting your ride.");
        return;
      }

      const verification = verifyBikeCodeWithPrompt({
        bikeId: selectedBike.id,
        bikeName: selectedBike.name,
      });

      if (!verification.ok) {
        if (verification.reason === "MISMATCH") {
          showToast.error(`QR code does not match this bike. Expected ${verification.expected}.`);
        }
        return;
      }
    }

    const result = await rentBike(selectedBike.id, method, rentalType);
    if (result?.success) {
      const isReservation = result.rental?.status === "RESERVED";
      showToast.success(
        isReservation
          ? `${selectedBike.name} reserved for 30 minutes. Start ride before it expires.`
          : `Started rental for ${selectedBike.name}!`,
      );
      setIsModalOpen(false);
      if (!isReservation) {
        navigate("/map");
      }
    } else {
      showToast.error(result?.error || `Failed to start rental for ${selectedBike.name}.`);
    }
  };

  return (
    <div
      className={`${isCompact ? "py-0 px-0" : "min-h-screen py-12 px-4"} max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500`}
    >
      {!isCompact && (
        <div className="mb-12">
          <h1 className="text-4xl font-black mb-2 uppercase tracking-tight">
            Our Fleet
          </h1>
          <p className="text-gray-400 font-medium">
            Choose your perfect ride for the day.
          </p>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        {isCompact && (
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-400 mr-auto">
            Available Fleet
          </h2>
        )}
        <BikeFilterBar activeFilter={filter} onChange={setFilter} />
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <label className="relative block w-full md:max-w-md">
          <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search bike, type, or zone..."
            className="w-full rounded-md border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-3 text-sm text-[#2F2F2F] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#8B2E2E] focus:ring-2 focus:ring-[#8B2E2E]/15"
          />
        </label>

        <div className="flex items-center justify-between md:justify-end gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280]">
            {filteredBikes.length} bike{filteredBikes.length === 1 ? "" : "s"}
          </p>
          <div className="flex items-center rounded-md border border-[#E5E7EB] bg-white p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${viewMode === "list" ? "bg-[#FCEAEA] text-[#8B2E2E]" : "text-[#6B7280] hover:text-[#8B2E2E]"}`}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${viewMode === "grid" ? "bg-[#FCEAEA] text-[#8B2E2E]" : "text-[#6B7280] hover:text-[#8B2E2E]"}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-96 bg-gray-800/20 rounded-[2.5rem] animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <>
          {filteredBikes.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-white/5">
              <div className="text-5xl mb-6 opacity-20">🚲</div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest px-8 leading-relaxed">
                No bikes matched your filter/search.
                <br />
                Try another keyword or type.
              </p>
            </div>
          ) : (
            <div
              className={
                viewMode === "list"
                  ? "space-y-4"
                  : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              }
            >
              {filteredBikes.map((bike) => (
                <BikeCard
                  key={bike.id}
                  bike={bike}
                  onRent={() => handleRentClick(bike)}
                  layout={viewMode === "list" ? "list" : "card"}
                />
              ))}
            </div>
          )}
        </>
      )}

      <RentalModal
        key={modalSeed}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        bike={selectedBike}
        onConfirm={handleConfirmRental}
      />
    </div>
  );
};

export default BikesPage;
