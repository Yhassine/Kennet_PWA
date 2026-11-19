import { Star, ShieldCheck, Heart, Zap, Droplets, Bed, Users } from "lucide-react";
import type { Accommodation } from "../types/guest";

interface AccommodationCardProps {
  accommodation: Accommodation;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClick: (acc: Accommodation) => void;
}

export default function AccommodationCard({
  accommodation,
  isSaved,
  onToggleSave,
  onClick,
}: AccommodationCardProps) {
  return (
    <article
      className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-lg hover:border-white/20 transition-all cursor-pointer group flex flex-col"
      onClick={() => onClick(accommodation)}
    >
      {/* Cover Image + Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
        <img
          src={accommodation.image}
          alt={accommodation.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category & Rental Type Pill */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#121316]/80 backdrop-blur-md text-white border border-white/15">
            {accommodation.categoryLabel}
          </span>
          {accommodation.isHouseRental && (
            <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#D95A1A] text-white shadow-md">
              Contrato Mensal
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          type="button"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#121316]/75 backdrop-blur-md flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-transform shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(accommodation.id);
          }}
          aria-label={isSaved ? "Remover dos favoritos" : "Salvar nos favoritos"}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isSaved ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>

        {/* Price Tag Overlay at Bottom */}
        <div className="absolute bottom-3 left-3 bg-[#121316]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15">
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-neutral-400">a partir de</span>
            <span className="text-lg font-extrabold text-white font-['Outfit']">
              {accommodation.price.toLocaleString("pt-MZ")}
            </span>
            <span className="text-xs font-semibold text-[#D95A1A]">
              {accommodation.priceUnit}
            </span>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
            <span className="truncate">{accommodation.city}, {accommodation.province.replace(/_/g, " ")}</span>
            <div className="flex items-center gap-1 text-white font-semibold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{accommodation.rating}</span>
              <span className="text-neutral-500 font-normal">({accommodation.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-white leading-snug line-clamp-2 group-hover:text-[#FFA07A] transition-colors mb-2">
            {accommodation.title}
          </h3>

          {/* Crucial Amenities Badges (Moçambique: Gerador, Água, Quartos) */}
          <div className="flex items-center gap-2 flex-wrap mb-3 text-[11px] text-neutral-300">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
              <Users className="w-3 h-3 text-neutral-400" />
              <span>{accommodation.specs.guests} hóspedes</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/10">
              <Bed className="w-3 h-3 text-neutral-400" />
              <span>{accommodation.specs.beds} camas</span>
            </span>
            {accommodation.hasGenerator && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-950/60 text-amber-300 border border-amber-500/30 font-medium">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>Gerador 24/7</span>
              </span>
            )}
            {accommodation.hasHotWater && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/60 text-sky-300 border border-sky-500/30 font-medium">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span>Água Quente</span>
              </span>
            )}
          </div>
        </div>

        {/* Host Info & Quick Action */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-neutral-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{accommodation.hostName}</span>
          </div>

          <span className="text-[#D95A1A] font-bold group-hover:underline flex items-center gap-1">
            Ver detalhes →
          </span>
        </div>
      </div>
    </article>
  );
}
