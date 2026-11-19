import { useState } from "react";
import {
  X,
  Star,
  MapPin,
  ShieldCheck,
  Calendar,
  Home,
  CheckCircle2,
  Users,
  Bed,
  Bath,
  Maximize2,
} from "lucide-react";
import type { Accommodation } from "../types/guest";

interface AccommodationModalProps {
  accommodation: Accommodation | null;
  onClose: () => void;
  onStartBooking: (acc: Accommodation) => void;
}

export default function AccommodationModal({
  accommodation,
  onClose,
  onStartBooking,
}: AccommodationModalProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  if (!accommodation) return null;

  const photos = accommodation.gallery?.length ? accommodation.gallery : [accommodation.image];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-2xl max-h-[92vh] bg-[#121316] border border-white/15 rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        {/* Top Header / Actions */}
        <div className="relative aspect-[16/10] bg-neutral-900 shrink-0">
          <img
            src={photos[activePhotoIndex]}
            alt={accommodation.title}
            className="w-full h-full object-cover"
          />

          <button
            type="button"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#121316]/80 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#D95A1A] transition-colors shadow-lg"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Photo Gallery Thumbnails */}
          {photos.length > 1 && (
            <div className="absolute bottom-3 left-4 right-4 flex gap-2 overflow-x-auto py-1">
              {photos.map((photo, idx) => (
                <button
                  key={photo}
                  type="button"
                  className={`w-14 h-10 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activePhotoIndex === idx ? "border-[#D95A1A] scale-105" : "border-white/30 opacity-70"
                  }`}
                  onClick={() => setActivePhotoIndex(idx)}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable Body Details */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Category & Verified Badge */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D95A1A]/20 text-[#FFA07A] border border-[#D95A1A]/40">
              {accommodation.categoryLabel}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
              <ShieldCheck className="w-4 h-4" />
              <span>Anfitrião Verificado</span>
            </div>
          </div>

          {/* Title & Rating */}
          <div>
            <h2 className="text-2xl font-bold text-white font-['Outfit'] mb-2">
              {accommodation.title}
            </h2>
            <div className="flex items-center gap-3 text-sm text-neutral-400">
              <div className="flex items-center gap-1 text-white font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{accommodation.rating}</span>
                <span className="text-neutral-500">({accommodation.reviewsCount} avaliações)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1 truncate">
                <MapPin className="w-4 h-4 text-[#D95A1A]" />
                <span>{accommodation.address}</span>
              </div>
            </div>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-4 gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 text-center text-xs">
            <div className="p-1">
              <Users className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
              <span className="text-white font-bold block">{accommodation.specs.guests}</span>
              <span className="text-neutral-400 text-[10px]">Hóspedes</span>
            </div>
            <div className="p-1">
              <Bed className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
              <span className="text-white font-bold block">{accommodation.specs.beds}</span>
              <span className="text-neutral-400 text-[10px]">Quartos</span>
            </div>
            <div className="p-1">
              <Bath className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
              <span className="text-white font-bold block">{accommodation.specs.baths}</span>
              <span className="text-neutral-400 text-[10px]">WCs</span>
            </div>
            <div className="p-1">
              <Maximize2 className="w-4 h-4 mx-auto mb-1 text-neutral-400" />
              <span className="text-white font-bold block">{accommodation.specs.size}</span>
              <span className="text-neutral-400 text-[10px]">Área</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Sobre este Imóvel
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {accommodation.description}
            </p>
          </div>

          {/* Amenities List */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Comodidades Incluídas
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-200">
              {accommodation.amenities.map((item) => (
                <div key={item} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-[#D95A1A] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host Card */}
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D95A1A] flex items-center justify-center font-bold text-white text-sm">
                {accommodation.hostName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-xs text-neutral-400 block">Proprietário / Anfitrião</span>
                <span className="font-bold text-white text-sm">{accommodation.hostName}</span>
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-semibold px-2.5 py-1 bg-emerald-950/70 border border-emerald-500/30 rounded-full">
              Identidade Validada
            </span>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-4 bg-[#0A0B0D] border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
          <div>
            <span className="text-xs text-neutral-400 block">Preço</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-white font-['Outfit']">
                {accommodation.price.toLocaleString("pt-MZ")}
              </span>
              <span className="text-xs font-semibold text-[#D95A1A]">
                {accommodation.priceUnit}
              </span>
            </div>
          </div>

          <button
            type="button"
            className="flex-1 max-w-xs py-3 px-5 rounded-full bg-[#D95A1A] hover:bg-[#B8430E] text-white font-bold text-sm shadow-lg shadow-[#D95A1A]/40 transition-all flex items-center justify-center gap-2"
            onClick={() => onStartBooking(accommodation)}
          >
            {accommodation.isHouseRental ? (
              <>
                <Home className="w-4 h-4" />
                <span>Agendar Visita / Arrendar</span>
              </>
            ) : (
              <>
                <Calendar className="w-4 h-4" />
                <span>Reservar Quarto</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
