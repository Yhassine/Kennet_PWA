import { Search, SlidersHorizontal, Bell } from "lucide-react";
import type { GuestUser } from "../types/guest";

interface HeaderProps {
  user: GuestUser;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenFilters?: () => void;
}

export default function Header({
  user,
  searchQuery,
  onSearchChange,
  onOpenFilters,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-[#0A0B0D]/90 backdrop-blur-md border-b border-white/10 px-4 pt-3 pb-3">
      {/* Top Bar: Brand, Client Code & Notifications */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D95A1A] to-[#B8430E] flex items-center justify-center font-['Bebas_Neue'] text-xl text-white shadow-lg shadow-[#D95A1A]/30">
            K
          </div>
          <div>
            <span className="font-['Bebas_Neue'] text-2xl tracking-wider text-white">
              KENNET
            </span>
            <span className="text-[10px] font-semibold text-[#D95A1A] block -mt-1 tracking-wider uppercase">
              Hóspedes & Estadias
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] font-semibold">{user.clientCode}</span>
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
            aria-label="Notificações"
          >
            <Bell className="w-4 h-4" />
          </button>

          <div className="w-8 h-8 rounded-full bg-[#D95A1A] flex items-center justify-center text-white font-bold text-xs shadow-md">
            {user.avatar || "AM"}
          </div>
        </div>
      </div>

      {/* Search Input Bar with Filter Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white placeholder-neutral-400 focus:outline-none focus:border-[#D95A1A] transition-all"
            placeholder="Pesquisar vivenda, pensão ou bairro (ex: Polana, Tofo)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {onOpenFilters && (
          <button
            type="button"
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-[#D95A1A] transition-all"
            onClick={onOpenFilters}
            aria-label="Filtros avançados"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#D95A1A]" />
          </button>
        )}
      </div>
    </header>
  );
}
