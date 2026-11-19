import AccommodationCard from "../components/AccommodationCard";
import type { Accommodation } from "../types/guest";

interface ExploreViewProps {
  accommodations: Accommodation[];
  savedIds: string[];
  onToggleSave: (id: string) => void;
  onSelectAccommodation: (acc: Accommodation) => void;
}

export default function ExploreView({
  accommodations,
  savedIds,
  onToggleSave,
  onSelectAccommodation,
}: ExploreViewProps) {
  if (accommodations.length === 0) {
    return (
      <div className="p-8 text-center text-neutral-400 space-y-2">
        <p className="text-base font-semibold text-white">Nenhum imóvel encontrado.</p>
        <p className="text-xs">Tente ajustar os filtros de categoria ou província.</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between text-xs text-neutral-400 px-1">
        <span>{accommodations.length} acomodações e casas disponíveis em Moçambique</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accommodations.map((acc) => (
          <AccommodationCard
            key={acc.id}
            accommodation={acc}
            isSaved={savedIds.includes(acc.id)}
            onToggleSave={onToggleSave}
            onClick={onSelectAccommodation}
          />
        ))}
      </div>
    </div>
  );
}
