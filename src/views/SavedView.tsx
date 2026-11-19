import { Heart, Compass } from "lucide-react";
import AccommodationCard from "../components/AccommodationCard";
import type { Accommodation } from "../types/guest";

interface SavedViewProps {
  accommodations: Accommodation[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectAccommodation: (acc: Accommodation) => void;
  onGoToExplore: () => void;
}

export default function SavedView({
  accommodations,
  savedIds,
  onToggleSave,
  onSelectAccommodation,
  onGoToExplore,
}: SavedViewProps) {
  const savedAccommodations = accommodations.filter((acc) => savedIds.includes(acc.id));

  return (
    <div className="px-4 py-4 max-w-5xl mx-auto space-y-4">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <span>Acomodações Salvas</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Lista de vivendas, pensões e quartos que guardou para comparar ou arrendar mais tarde.
        </p>
      </div>

      {savedAccommodations.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Nenhum imóvel salvo</h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Toque no ícone de coração em qualquer anúncio para adicioná-lo aos seus favoritos.
          </p>
          <button
            type="button"
            className="auth-pill-btn max-w-xs mx-auto !py-2 text-xs flex items-center justify-center gap-1.5"
            onClick={onGoToExplore}
          >
            <Compass className="w-4 h-4" />
            <span>Explorar Imóveis</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedAccommodations.map((acc) => (
            <AccommodationCard
              key={acc.id}
              accommodation={acc}
              isSaved={true}
              onToggleSave={onToggleSave}
              onClick={onSelectAccommodation}
            />
          ))}
        </div>
      )}
    </div>
  );
}
