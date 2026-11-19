import { CalendarCheck, CheckCircle2, Clock, MapPin, Receipt, Compass } from "lucide-react";
import type { Booking } from "../types/guest";

interface BookingsViewProps {
  bookings: Booking[];
  onGoToExplore: () => void;
}

export default function BookingsView({ bookings, onGoToExplore }: BookingsViewProps) {
  return (
    <div className="px-4 py-4 max-w-3xl mx-auto space-y-4">
      <div className="border-b border-white/10 pb-3">
        <h2 className="text-2xl font-bold text-white font-['Outfit'] flex items-center gap-2">
          <CalendarCheck className="w-6 h-6 text-[#D95A1A]" />
          <span>Minhas Reservas & Visitas</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          Acompanhe o estado das suas propostas de arrendamento, diárias e visitas agendadas.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-400">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Sem reservas ativas</h3>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            Ainda não realizou nenhuma reserva de estadia ou agendamento de visita em Moçambique.
          </p>
          <button
            type="button"
            className="auth-pill-btn max-w-xs mx-auto !py-2 text-xs flex items-center justify-center gap-1.5"
            onClick={onGoToExplore}
          >
            <Compass className="w-4 h-4" />
            <span>Encontrar Acomodação</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4 flex gap-3.5 items-start hover:border-white/20 transition-all"
            >
              <img
                src={b.accommodationImage}
                alt=""
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D95A1A]">
                    {b.type === "visita" ? "Visita Presencial" : b.type === "arrendamento" ? "Arrendamento Mensal" : "Diária de Pensão"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Confirmada</span>
                  </span>
                </div>

                <h4 className="font-bold text-white text-sm truncate">{b.accommodationTitle}</h4>

                <div className="flex items-center gap-1 text-xs text-neutral-400">
                  <MapPin className="w-3 h-3 text-[#D95A1A]" />
                  <span>{b.city}, {b.province.replace(/_/g, " ")}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-300 pt-1">
                  <Clock className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Data: <strong>{b.startDate}</strong></span>
                </div>

                {b.totalPriceMZN > 0 && (
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-neutral-400">
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Pago via {b.paymentMethod === "mpesa" ? "M-Pesa" : "e-Mola"}</span>
                    </div>
                    <span className="font-extrabold text-[#D95A1A] text-sm">
                      {b.totalPriceMZN.toLocaleString("pt-MZ")} MT
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
