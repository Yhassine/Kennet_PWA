import { useState } from "react";
import { MapPin, Navigation, Eye } from "lucide-react";
import type { Accommodation } from "../types/guest";

interface MapViewProps {
  accommodations: Accommodation[];
  onSelectAccommodation: (acc: Accommodation) => void;
}

export default function MapView({
  accommodations,
  onSelectAccommodation,
}: MapViewProps) {
  const [selectedPin, setSelectedPin] = useState<Accommodation | null>(null);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] bg-[#121316] overflow-hidden rounded-2xl border border-white/10 m-4 max-w-full">
      {/* Map visual background with mock coastline and streets */}
      <div className="absolute inset-0 bg-[#0E1013] overflow-hidden">
        {/* Subtle SVG Grid / Map lines representing Mozambique coastline / Maputo Bay */}
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* Stylized Bay / Coastline shape */}
          <path
            d="M 120 0 C 180 150, 140 300, 260 450 C 340 550, 280 700, 320 900"
            fill="none"
            stroke="#D95A1A"
            strokeWidth="3"
            strokeDasharray="6 6"
          />
        </svg>

        {/* Floating location indicator */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#121316]/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15 text-xs text-neutral-300 shadow-lg">
          <Navigation className="w-3.5 h-3.5 text-[#D95A1A]" />
          <span>Moçambique • Maputo, Gaza, Inhambane</span>
        </div>

        {/* Clickable price pins */}
        {accommodations.map((acc, index) => {
          // Calculate relative positions for map visual demo
          const positions = [
            { top: "35%", left: "45%" },
            { top: "42%", left: "55%" },
            { top: "60%", left: "30%" },
            { top: "50%", left: "48%" },
            { top: "25%", left: "68%" },
            { top: "38%", left: "58%" },
          ];
          const pos = positions[index % positions.length];
          const isSelected = selectedPin?.id === acc.id;

          return (
            <button
              key={acc.id}
              type="button"
              style={{ top: pos.top, left: pos.left }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 group transition-all duration-300 ${
                isSelected ? "scale-125 z-30" : "hover:scale-110"
              }`}
              onClick={() => setSelectedPin(acc)}
            >
              <div
                className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-xl flex items-center gap-1 border transition-all ${
                  isSelected
                    ? "bg-[#D95A1A] text-white border-white scale-110 ring-4 ring-[#D95A1A]/40"
                    : "bg-[#121316] text-white border-white/30 hover:border-[#D95A1A]"
                }`}
              >
                <MapPin className="w-3 h-3 text-[#D95A1A]" />
                <span>
                  {acc.price >= 1000 ? `${(acc.price / 1000).toFixed(0)}k` : acc.price} MT
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Accommodation Card Drawer inside Map */}
      {selectedPin && (
        <div className="absolute bottom-4 left-4 right-4 sm:max-w-md sm:left-auto sm:right-4 z-30 bg-[#121316]/95 backdrop-blur-md border border-white/20 rounded-2xl p-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex gap-3">
            <img
              src={selectedPin.image}
              alt=""
              className="w-24 h-24 object-cover rounded-xl shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#D95A1A] block">
                {selectedPin.categoryLabel}
              </span>
              <h4 className="font-bold text-white text-sm truncate">{selectedPin.title}</h4>
              <span className="text-xs text-neutral-400 block truncate">{selectedPin.city}, {selectedPin.province.replace(/_/g, " ")}</span>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">
                  {selectedPin.price.toLocaleString("pt-MZ")} {selectedPin.priceUnit}
                </span>
                <button
                  type="button"
                  className="px-3 py-1 bg-[#D95A1A] text-white rounded-full text-xs font-bold flex items-center gap-1"
                  onClick={() => onSelectAccommodation(selectedPin)}
                >
                  <Eye className="w-3 h-3" />
                  <span>Ver</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
