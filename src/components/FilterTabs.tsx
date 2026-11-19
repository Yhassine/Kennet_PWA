import { CATEGORIES, PROVINCES } from "../data/accommodations";
import type { CategoryId } from "../types/guest";
import { MapPin, Calendar, Home as HomeIcon } from "lucide-react";

interface FilterTabsProps {
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  selectedProvince: string;
  onSelectProvince: (prov: string) => void;
  rentalFilter: "all" | "monthly" | "daily";
  onSelectRentalFilter: (mode: "all" | "monthly" | "daily") => void;
}

export default function FilterTabs({
  selectedCategory,
  onSelectCategory,
  selectedProvince,
  onSelectProvince,
  rentalFilter,
  onSelectRentalFilter,
}: FilterTabsProps) {
  return (
    <div className="space-y-3 px-4 pt-2">
      {/* Quick Type Switcher (Todas | Casas/Mensal | Diárias) */}
      <div className="flex items-center gap-1.5 p-1 bg-white/5 rounded-full border border-white/10 text-xs">
        <button
          type="button"
          className={`flex-1 py-1.5 px-3 rounded-full font-semibold transition-all text-center ${
            rentalFilter === "all"
              ? "bg-[#D95A1A] text-white shadow-md shadow-[#D95A1A]/30"
              : "text-neutral-400 hover:text-white"
          }`}
          onClick={() => onSelectRentalFilter("all")}
        >
          Todas
        </button>
        <button
          type="button"
          className={`flex-1 py-1.5 px-3 rounded-full font-semibold transition-all flex items-center justify-center gap-1.5 text-center ${
            rentalFilter === "monthly"
              ? "bg-[#D95A1A] text-white shadow-md shadow-[#D95A1A]/30"
              : "text-neutral-400 hover:text-white"
          }`}
          onClick={() => onSelectRentalFilter("monthly")}
        >
          <HomeIcon className="w-3.5 h-3.5" />
          <span>Arrendamento (Casas)</span>
        </button>
        <button
          type="button"
          className={`flex-1 py-1.5 px-3 rounded-full font-semibold transition-all flex items-center justify-center gap-1.5 text-center ${
            rentalFilter === "daily"
              ? "bg-[#D95A1A] text-white shadow-md shadow-[#D95A1A]/30"
              : "text-neutral-400 hover:text-white"
          }`}
          onClick={() => onSelectRentalFilter("daily")}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Diárias & Pensões</span>
        </button>
      </div>

      {/* Provinces select & Horizontal Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {/* Province Pill Selector */}
        <div className="relative shrink-0 flex items-center">
          <MapPin className="w-3.5 h-3.5 text-[#D95A1A] absolute left-3 pointer-events-none" />
          <select
            className="bg-white/5 border border-white/15 rounded-full pl-8 pr-7 py-1.5 text-xs font-semibold text-white appearance-none cursor-pointer focus:outline-none focus:border-[#D95A1A]"
            value={selectedProvince}
            onChange={(e) => onSelectProvince(e.target.value)}
          >
            {PROVINCES.map((prov) => (
              <option key={prov.id} value={prov.id} className="bg-[#121316] text-white">
                {prov.name}
              </option>
            ))}
          </select>
          <span className="text-[10px] text-neutral-400 absolute right-2.5 pointer-events-none">▼</span>
        </div>

        {/* Categories Pills */}
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                isSelected
                  ? "bg-white text-[#121316] font-bold shadow-md"
                  : "bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-white/30"
              }`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
