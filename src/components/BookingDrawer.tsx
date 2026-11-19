import { useState, type FormEvent } from "react";
import {
  X,
  CheckCircle2,
  Clock,
  Phone,
  ArrowRight,
  Loader2,
} from "lucide-react";
import type { Accommodation, Booking, GuestUser } from "../types/guest";

interface BookingDrawerProps {
  accommodation: Accommodation | null;
  user: GuestUser;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
}

export default function BookingDrawer({
  accommodation,
  user,
  onClose,
  onBookingSuccess,
}: BookingDrawerProps) {
  const [mode, setMode] = useState<"book" | "visit">("book");
  const [nightsOrMonths, setNightsOrMonths] = useState<number>(
    accommodation?.isHouseRental ? accommodation.contractMinMonths || 6 : 2
  );
  const [startDate, setStartDate] = useState<string>("2026-11-20");
  const [preferredTime, setPreferredTime] = useState<string>("Manhã (09h - 12h)");
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "emola">("mpesa");
  const [paymentPhone, setPaymentPhone] = useState<string>(user.cell || "841234567");
  const [step, setStep] = useState<"form" | "ussd_push" | "completed">("form");

  if (!accommodation) return null;

  const totalPrice = accommodation.price * nightsOrMonths;
  const deposit = accommodation.depositRequired || 0;
  const grandTotal = accommodation.isHouseRental ? totalPrice + deposit : totalPrice;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (mode === "visit") {
      // Direct visit booking confirmation
      const newBooking: Booking = {
        id: `VIS-${Date.now().toString().slice(-5)}`,
        accommodationId: accommodation.id,
        accommodationTitle: accommodation.title,
        accommodationImage: accommodation.image,
        city: accommodation.city,
        province: accommodation.province,
        startDate: startDate,
        endDate: startDate,
        type: "visita",
        totalPriceMZN: 0,
        status: "confirmado",
        paymentMethod: paymentMethod,
        clientCode: user.clientCode,
        createdAt: new Date().toISOString(),
      };
      onBookingSuccess(newBooking);
      onClose();
      return;
    }

    // Payment simulation with USSD Push
    setStep("ussd_push");

    setTimeout(() => {
      setStep("completed");

      const newBooking: Booking = {
        id: `RES-${Date.now().toString().slice(-5)}`,
        accommodationId: accommodation.id,
        accommodationTitle: accommodation.title,
        accommodationImage: accommodation.image,
        city: accommodation.city,
        province: accommodation.province,
        startDate: startDate,
        endDate: "2026-11-25",
        type: accommodation.isHouseRental ? "arrendamento" : "diaria",
        totalPriceMZN: grandTotal,
        depositMZN: deposit,
        status: "confirmado",
        paymentMethod: paymentMethod,
        clientCode: user.clientCode,
        createdAt: new Date().toISOString(),
      };
      onBookingSuccess(newBooking);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full sm:max-w-lg bg-[#121316] border border-white/15 rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl max-h-[95vh]">
        {/* Header */}
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs text-[#D95A1A] font-bold uppercase tracking-wider block">
              {accommodation.isHouseRental ? "Arrendamento & Visitas" : "Reserva Imediata"}
            </span>
            <h3 className="font-bold text-white text-base truncate max-w-xs">
              {accommodation.title}
            </h3>
          </div>

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-neutral-300 hover:text-white"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Form Details */}
        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
            {/* Mode Switcher for House Rentals */}
            {accommodation.isHouseRental && (
              <div className="flex rounded-full bg-white/5 p-1 border border-white/10 text-xs font-semibold">
                <button
                  type="button"
                  className={`flex-1 py-1.5 rounded-full transition-all ${
                    mode === "book" ? "bg-[#D95A1A] text-white shadow" : "text-neutral-400"
                  }`}
                  onClick={() => setMode("book")}
                >
                  Proposta de Arrendamento
                </button>
                <button
                  type="button"
                  className={`flex-1 py-1.5 rounded-full transition-all ${
                    mode === "visit" ? "bg-[#D95A1A] text-white shadow" : "text-neutral-400"
                  }`}
                  onClick={() => setMode("visit")}
                >
                  Agendar Visita Grátis
                </button>
              </div>
            )}

            {mode === "visit" ? (
              /* Agendamento de Visita */
              <div className="space-y-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-xs text-amber-300 bg-amber-950/60 p-2.5 rounded-xl border border-amber-500/30">
                  <Clock className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Visitas presenciais acompanhadas pelo senhorio sem custos.</span>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1 font-semibold">Data Preferencial</label>
                  <input
                    type="date"
                    className="w-full bg-[#0A0B0D] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D95A1A]"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 block mb-1 font-semibold">Horário</label>
                  <select
                    className="w-full bg-[#0A0B0D] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D95A1A]"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                  >
                    <option>Manhã (09h - 12h)</option>
                    <option>Tarde (14h - 17h)</option>
                    <option>Final de Tarde (17h - 18h30)</option>
                  </select>
                </div>

                <button type="submit" className="auth-pill-btn w-full mt-2">
                  Confirmar Agendamento de Visita
                </button>
              </div>
            ) : (
              /* Reserva / Pagamento */
              <div className="space-y-4">
                {/* Date / Duration */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-neutral-400 block mb-1 font-semibold">
                      {accommodation.isHouseRental ? "Início do Contrato" : "Check-in"}
                    </label>
                    <input
                      type="date"
                      className="w-full bg-[#0A0B0D] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D95A1A]"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs text-neutral-400 block mb-1 font-semibold">
                      {accommodation.isHouseRental ? "Duração (Meses)" : "Noites"}
                    </label>
                    <input
                      type="number"
                      min={accommodation.isHouseRental ? accommodation.contractMinMonths || 1 : 1}
                      max={accommodation.isHouseRental ? 24 : 30}
                      className="w-full bg-[#0A0B0D] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D95A1A]"
                      value={nightsOrMonths}
                      onChange={(e) => setNightsOrMonths(Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-white/5 border border-white/10 p-3.5 rounded-2xl space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-300">
                    <span>
                      {accommodation.price.toLocaleString("pt-MZ")} MT x {nightsOrMonths}{" "}
                      {accommodation.isHouseRental ? "meses" : "noites"}
                    </span>
                    <span className="font-semibold text-white">
                      {totalPrice.toLocaleString("pt-MZ")} MT
                    </span>
                  </div>

                  {accommodation.isHouseRental && deposit > 0 && (
                    <div className="flex justify-between text-neutral-300">
                      <span>Caução Reembolsável (Custódia Kennet)</span>
                      <span className="font-semibold text-amber-400">
                        {deposit.toLocaleString("pt-MZ")} MT
                      </span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold text-white">
                    <span>Total a Pagar</span>
                    <span className="text-[#D95A1A] font-extrabold text-base">
                      {grandTotal.toLocaleString("pt-MZ")} MT
                    </span>
                  </div>
                </div>

                {/* Mobile Money Selector (M-Pesa e e-Mola Moçambique) */}
                <div>
                  <label className="text-xs text-neutral-400 block mb-1.5 font-semibold">
                    Método de Pagamento Moçambique (Push STK Automático)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        paymentMethod === "mpesa"
                          ? "bg-red-950/40 border-red-500 text-white"
                          : "bg-white/5 border-white/10 text-neutral-400"
                      }`}
                      onClick={() => setPaymentMethod("mpesa")}
                    >
                      <div className="w-4 h-4 rounded-full bg-red-600 flex items-center justify-center text-[10px] text-white font-bold">
                        M
                      </div>
                      <div>
                        <span className="font-bold text-xs block text-white">M-Pesa</span>
                        <span className="text-[10px] text-neutral-400">Vodacom MZ</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        paymentMethod === "emola"
                          ? "bg-amber-950/40 border-amber-500 text-white"
                          : "bg-white/5 border-white/10 text-neutral-400"
                      }`}
                      onClick={() => setPaymentMethod("emola")}
                    >
                      <div className="w-4 h-4 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-black font-bold">
                        e
                      </div>
                      <div>
                        <span className="font-bold text-xs block text-white">e-Mola</span>
                        <span className="text-[10px] text-neutral-400">Movitel MZ</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Phone for Payment */}
                <div>
                  <label className="text-xs text-neutral-400 block mb-1 font-semibold">
                    Número de Celular para Autorizar Débito
                  </label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
                    <input
                      type="tel"
                      className="w-full bg-[#0A0B0D] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-[#D95A1A]"
                      placeholder="84 / 85 / 86 / 87"
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="auth-pill-btn w-full flex items-center justify-center gap-2"
                >
                  <span>Pagar {grandTotal.toLocaleString("pt-MZ")} MT via {paymentMethod === "mpesa" ? "M-Pesa" : "e-Mola"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </form>
        )}

        {/* Step 2: USSD Push Simulation */}
        {step === "ussd_push" && (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#D95A1A]/20 border border-[#D95A1A] flex items-center justify-center mx-auto animate-pulse">
              <Loader2 className="w-8 h-8 text-[#D95A1A] animate-spin" />
            </div>
            <h4 className="text-xl font-bold text-white">A enviar solicitação para o seu telemóvel...</h4>
            <p className="text-sm text-neutral-300 max-w-xs mx-auto leading-relaxed">
              Verifique o ecrã do seu celular <strong className="text-white">({paymentPhone})</strong> e insira o seu PIN do {paymentMethod === "mpesa" ? "M-Pesa" : "e-Mola"} para confirmar o pagamento de <strong className="text-[#D95A1A]">{grandTotal.toLocaleString("pt-MZ")} MT</strong>.
            </p>
          </div>
        )}

        {/* Step 3: Success Screen */}
        {step === "completed" && (
          <div className="p-8 text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-emerald-400 mx-auto" />
            <h4 className="text-2xl font-bold text-white font-['Outfit']">Reserva Confirmada com Sucesso!</h4>
            <p className="text-sm text-neutral-300 max-w-xs mx-auto leading-relaxed">
              O valor foi processado com segurança pela rede Kennet. O senhorio foi notificado via SMS e o recibo eletrónico foi gerado.
            </p>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-neutral-300">
              Código de Identificação: <strong className="text-white">{user.clientCode}</strong>
            </div>
            <button
              type="button"
              className="auth-pill-btn w-full mt-2"
              onClick={onClose}
            >
              Concluir & Ver Reservas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
