import { User, Phone, ShieldCheck, LogOut, Sparkles, MapPin, ExternalLink } from "lucide-react";
import type { GuestUser } from "../types/guest";

interface ProfileViewProps {
  user: GuestUser;
  onLogout: () => void;
}

export default function ProfileView({ user, onLogout }: ProfileViewProps) {
  return (
    <div className="px-4 py-4 max-w-2xl mx-auto space-y-5">
      {/* User Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D95A1A]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D95A1A] to-[#B8430E] flex items-center justify-center font-bold text-white text-2xl shadow-lg shadow-[#D95A1A]/30">
            {user.avatar || "AM"}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-xl font-bold text-white font-['Outfit'] truncate">
                {user.name}
              </h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                <ShieldCheck className="w-3 h-3" />
                <span>Verificado</span>
              </span>
            </div>

            <p className="text-xs text-neutral-400">@{user.username}</p>

            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-xs font-mono text-neutral-200 border border-white/10">
              <Sparkles className="w-3 h-3 text-[#D95A1A]" />
              <span>Código Kennet: <strong>{user.clientCode}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Account Info Details */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
          Dados da Conta de Hóspede
        </h4>

        <div className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
          <span className="text-neutral-400 flex items-center gap-2">
            <Phone className="w-4 h-4 text-[#D95A1A]" />
            <span>Telemóvel Nacional (+258)</span>
          </span>
          <span className="font-semibold text-white">+258 {user.cell}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-white/5 text-sm">
          <span className="text-neutral-400 flex items-center gap-2">
            <User className="w-4 h-4 text-[#D95A1A]" />
            <span>Perfil</span>
          </span>
          <span className="font-semibold text-white">Hóspede / Inquilino</span>
        </div>

        <div className="flex items-center justify-between py-2 text-sm">
          <span className="text-neutral-400 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D95A1A]" />
            <span>País de Operação</span>
          </span>
          <span className="font-semibold text-white">Moçambique 🇲🇿</span>
        </div>
      </div>

      {/* Portal Senhorios Link */}
      <div className="bg-gradient-to-r from-neutral-900 to-[#121316] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <h4 className="font-bold text-white text-sm">É Proprietário ou Senhorio?</h4>
          <p className="text-xs text-neutral-400 mt-0.5">
            Aceda ao Portal Web Kennet para cadastrar vivendas e gerir diárias.
          </p>
        </div>
        <a
          href="http://localhost:5173"
          target="_blank"
          rel="noreferrer"
          className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold text-white hover:bg-white/20 flex items-center gap-1 shrink-0"
        >
          <span>Aceder</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        className="w-full py-3 px-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-900/50 transition-colors"
        onClick={onLogout}
      >
        <LogOut className="w-4 h-4" />
        <span>Terminar Sessão</span>
      </button>
    </div>
  );
}
