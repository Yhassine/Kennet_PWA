import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  validateNome,
  validateTelefoneMZ,
  maskTelefoneMZ,
  checkPasswordStrength,
  validatePasswordConfirmation,
} from "../utils/validation";
import type { GuestUser } from "../types/guest";
import { supabase } from "../lib/supabaseClient";
import { toGuestUser } from "../lib/guestUser";
import LegalDocsModal, { type LegalDocType } from "../components/LegalDocsModal";

interface GuestAuthViewProps {
  onLoginSuccess: (user: GuestUser) => void;
}

const mapAuthErrorMessage = (errorMsg: string): string => {
  if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError")) {
    return "Não foi possível conectar ao servidor Supabase. Verifique se o servidor está ativo e com as credenciais corretas.";
  }
  return errorMsg;
};

export default function GuestAuthView({ onLoginSuccess }: GuestAuthViewProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authMessage, setAuthMessage] = useState<string | null>(null);

  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMessage(null);

    const phone = validateTelefoneMZ(loginIdentifier);
    if (!phone.isValid) {
      setAuthError(phone.error);
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: phone.formatted,
        password: loginPassword,
      });
      if (error) {
        setAuthError(mapAuthErrorMessage(error.message));
        return;
      }
      if (!data.user) {
        setAuthError("Não foi possível iniciar sessão. Tente novamente.");
        return;
      }
      onLoginSuccess(toGuestUser(data.user));
    } catch {
      setAuthError("Ocorreu um erro inesperado ao iniciar sessão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [regNome, setRegNome] = useState("");
  const [regCell, setRegCell] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regTermos, setRegTermos] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  const passwordStrength = checkPasswordStrength(regPassword);

  const validateField = (name: string, value: string | boolean): string | null => {
    switch (name) {
      case "nome":
        return validateNome(String(value));
      case "cell": {
        const res = validateTelefoneMZ(String(value));
        return res.isValid ? null : res.error;
      }
      case "password": {
        const pass = String(value);
        if (!pass) return "A senha é obrigatória.";
        if (pass.length < 8) return "A senha deve ter no mínimo 8 caracteres.";
        if (!passwordStrength.isValid) return "A senha deve conter letras e números.";
        return null;
      }
      case "confirmPassword":
        return validatePasswordConfirmation(regPassword, String(value));
      case "termos":
        return value ? null : "Deve aceitar os Termos de Uso e Política de Privacidade.";
      default:
        return null;
    }
  };

  const handleBlur = (field: string, val: string | boolean) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMessage(null);

    const errNome = validateField("nome", regNome);
    const errCell = validateField("cell", regCell);
    const errPass = validateField("password", regPassword);
    const errConfirm = validateField("confirmPassword", regConfirmPassword);
    const errTermos = validateField("termos", regTermos);

    const newErrors = {
      nome: errNome,
      cell: errCell,
      password: errPass,
      confirmPassword: errConfirm,
      termos: errTermos,
    };
    setErrors(newErrors);
    setTouched({ nome: true, cell: true, password: true, confirmPassword: true, termos: true });

    if (Object.values(newErrors).some((err) => err !== null)) {
      return;
    }

    const phone = validateTelefoneMZ(regCell);
    if (!phone.isValid) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        phone: phone.formatted,
        password: regPassword,
        options: {
          data: {
            nome: regNome.trim(),
            telefone: phone.formatted,
            tipo_usuario: "hospede",
            termos_aceites: regTermos,
            termos_versao: "1.0",
          },
        },
      });

      if (error) {
        setAuthError(mapAuthErrorMessage(error.message));
        return;
      }

      if (data.session && data.user?.phone_confirmed_at) {
        onLoginSuccess(toGuestUser(data.user));
        return;
      }

      if (data.session) {
        const { error: signOutError } = await supabase.auth.signOut();
        if (signOutError) {
          setAuthError("A confirmação por SMS não está ativa. A conta não foi iniciada; contacte o suporte.");
          return;
        }
      }
      setPendingPhone(phone.formatted);
      setAuthMessage("Enviámos um código SMS para confirmar o seu número.");
    } catch {
      setAuthError("Ocorreu um erro inesperado ao criar a conta.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    if (!pendingPhone) return;

    setAuthError(null);
    setAuthMessage(null);
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: pendingPhone,
        token: otp.trim(),
        type: "sms",
      });
      if (error) {
        setAuthError(mapAuthErrorMessage(error.message));
        return;
      }
      if (!data.user || !data.user.phone_confirmed_at) {
        setAuthError("O número ainda não foi confirmado. Verifique o código e tente novamente.");
        return;
      }
      onLoginSuccess(toGuestUser(data.user));
    } catch {
      setAuthError("Ocorreu um erro inesperado ao confirmar o número.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    if (!pendingPhone) return;

    setAuthError(null);
    setAuthMessage(null);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resend({
        type: "sms",
        phone: pendingPhone,
      });
      if (error) {
        setAuthError(mapAuthErrorMessage(error.message));
        return;
      }
      setAuthMessage("Enviámos um novo código SMS.");
    } catch {
      setAuthError("Ocorreu um erro inesperado ao reenviar o código.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="view-auth" className="fixed inset-0 w-screen h-screen z-50 bg-[#0A0B0D]">
      <div
        className={`auth-morph-stage ${isRegister ? "state-register" : ""}`}
        id="auth-morph-container"
      >
        {/* Dual Opposing Morphing Layers */}
        <div className="auth-slice-black" />
        <div className="auth-slice-orange" />

        {/* Content 1: Welcome on Login State (Right Side) */}
        <div className="morph-welcome-box welcome-login">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-4 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>PWA Oficial de Hóspedes</span>
          </div>
          <h2 className="auth-welcome-title">Bem-vindo à Kennet!</h2>
          <p className="auth-welcome-text">
            Arrende casas, vivendas e reserve quartos de pensões em todo Moçambique pelo melhor preço em Meticais.
          </p>
        </div>

        {/* Content 2: Welcome on Register State (Left Side) */}
        <div className="morph-welcome-box welcome-register">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold mb-4 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Registo Simplificado de Hóspede</span>
          </div>
          <h2 className="auth-welcome-title">Crie a sua Conta</h2>
          <p className="auth-welcome-text">
            Basta o seu nome, número de telemóvel e senha para encontrar a sua próxima casa ou estadia ideal.
          </p>
        </div>

        {/* Form 1: Login Form (Left Side) */}
        <div className="morph-form-box form-login-side">
          <div className="auth-form-card">
            <div className="mb-2">
              <span className="text-xs uppercase tracking-widest text-[#D95A1A] font-bold">Kennet Hóspedes</span>
              <h1 className="auth-main-title !mb-6">Iniciar Sessão</h1>
            </div>

            <form onSubmit={handleLoginSubmit}>
              {authError && !isRegister && (
                <div role="alert" className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}
              {authMessage && !isRegister && (
                <p role="status" className="mb-4 text-xs text-emerald-300">{authMessage}</p>
              )}
              <div className="auth-underline-group group">
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-neutral-400 group-focus-within:text-white transition-colors absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    id="login-phone"
                    name="phone"
                    className="auth-underline-input auth-input !pl-7 w-full"
                    placeholder="Telemóvel (+258)"
                    value={loginIdentifier}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setLoginIdentifier(maskTelefoneMZ(e.target.value));
                      setAuthError(null);
                    }}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              <div className="auth-underline-group group">
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-neutral-400 group-focus-within:text-white transition-colors absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    id="login-password"
                    name="password"
                    className="auth-underline-input auth-input !pl-7 !pr-8 w-full"
                    placeholder="Palavra-passe"
                    value={loginPassword}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setLoginPassword(e.target.value);
                      setAuthError(null);
                    }}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    aria-label={showLoginPassword ? "Ocultar senha" : "Ver senha"}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-pill-btn" id="btn-login-submit" disabled={isSubmitting}>
                {isSubmitting ? "A iniciar sessão..." : "Entrar no Kennet"}
              </button>
            </form>

            <div className="auth-footer-prompt auth-footer">
              Ainda não tem conta de hóspede?
              <span
                className="auth-link-orange link"
                id="link-to-register"
                onClick={() => setIsRegister(true)}
              >
                Criar Conta de Hóspede
              </span>
            </div>
          </div>
        </div>

        {/* Form 2: Register Form (Right Side) */}
        <div className="morph-form-box form-register-side">
          <div className="auth-form-card">
            <div className="mb-2">
              <span className="text-xs uppercase tracking-widest text-[#D95A1A] font-bold">Novo Hóspede</span>
              <h1 className="auth-main-title !mb-6">Registo</h1>
            </div>

            {pendingPhone ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="text-center space-y-2">
                  <Phone className="w-10 h-10 text-[#D95A1A] mx-auto" />
                  <h3 className="text-xl font-bold text-white font-['Outfit']">Confirme o seu telemóvel</h3>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Introduza o código enviado por SMS para <strong>{pendingPhone}</strong>.
                  </p>
                </div>
                {authError && (
                  <div role="alert" className="p-3 rounded-lg bg-red-950/70 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                )}
                {authMessage && <p role="status" className="text-xs text-emerald-300">{authMessage}</p>}
                <form onSubmit={handleVerifyOtp} className="space-y-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    aria-label="Código SMS"
                    className="auth-underline-input auth-input w-full text-center tracking-[0.4em]"
                    placeholder="Código de 6 dígitos"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                  />
                  <button type="submit" className="auth-pill-btn w-full" disabled={isSubmitting || otp.length !== 6}>
                    {isSubmitting ? "A confirmar..." : "Confirmar número"}
                  </button>
                </form>
                <button
                  type="button"
                  className="w-full text-sm text-[#D95A1A] hover:underline disabled:opacity-50"
                  onClick={() => void handleResendOtp()}
                  disabled={isSubmitting}
                >
                  Reenviar código SMS
                </button>
                <button
                  type="button"
                  className="w-full text-xs text-neutral-400 hover:text-white"
                  onClick={() => {
                    setPendingPhone(null);
                    setOtp("");
                    setAuthError(null);
                    setAuthMessage(null);
                  }}
                >
                  Voltar ao registo
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} noValidate>
                {authError && isRegister && (
                  <div role="alert" className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-500/60 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{authError}</span>
                  </div>
                )}
                {authMessage && isRegister && (
                  <p role="status" className="mb-4 text-xs text-emerald-300">{authMessage}</p>
                )}
                {/* Nome Completo */}
                <div className="auth-underline-group group">
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-neutral-400 group-focus-within:text-white transition-colors absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      className="auth-underline-input auth-input !pl-7 w-full"
                      placeholder="Nome Completo"
                      value={regNome}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegNome(e.target.value)}
                      onBlur={() => handleBlur("nome", regNome)}
                      required
                    />
                  </div>
                  {errors.nome && touched.nome && (
                    <p className="text-xs text-red-400 mt-1 font-medium">{errors.nome}</p>
                  )}
                </div>

                {/* Número de Celular (+258) */}
                <div className="auth-underline-group group">
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-neutral-400 group-focus-within:text-white transition-colors absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="tel"
                      className="auth-underline-input auth-input !pl-7 w-full"
                      placeholder="84 123 4567 (+258)"
                      maxLength={16}
                      value={regCell}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegCell(maskTelefoneMZ(e.target.value))}
                      onBlur={() => handleBlur("cell", regCell)}
                      required
                    />
                  </div>
                  {errors.cell && touched.cell && (
                    <p className="text-xs text-red-400 mt-1 font-medium">{errors.cell}</p>
                  )}
                </div>

                {/* Palavra-passe */}
                <div className="auth-underline-group group">
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-neutral-400 group-focus-within:text-white transition-colors absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showRegPassword ? "text" : "password"}
                      className="auth-underline-input auth-input !pl-7 !pr-8 w-full"
                      placeholder="Palavra-passe"
                      value={regPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegPassword(e.target.value)}
                      onBlur={() => handleBlur("password", regPassword)}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      aria-label={showRegPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {regPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between items-center text-[11px] text-neutral-400">
                        <span>Segurança da senha:</span>
                        <span className={`font-semibold ${passwordStrength.barClass.replace('bg-', 'text-')}`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${passwordStrength.barClass}`}
                          style={{ width: `${passwordStrength.percent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {errors.password && touched.password && (
                    <p className="text-xs text-red-400 mt-1 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Confirmar Palavra-passe */}
                <div className="auth-underline-group group">
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-neutral-400 group-focus-within:text-white transition-colors absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showRegConfirmPassword ? "text" : "password"}
                      className="auth-underline-input auth-input !pl-7 !pr-8 w-full"
                      placeholder="Confirmar Palavra-passe"
                      value={regConfirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegConfirmPassword(e.target.value)}
                      onBlur={() => handleBlur("confirmPassword", regConfirmPassword)}
                      required
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                      onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                      aria-label={showRegConfirmPassword ? "Ocultar senha" : "Ver senha"}
                    >
                      {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && touched.confirmPassword && (
                    <p className="text-xs text-red-400 mt-1 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Termos de Uso (US-014-T2) */}
                <div className="auth-underline-group !mb-4">
                  <label className="flex items-start gap-2.5 text-xs text-neutral-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="guest-reg-termos"
                      checked={regTermos}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setRegTermos(e.target.checked);
                        handleBlur("termos", e.target.checked);
                      }}
                      className="mt-0.5 accent-[#D95A1A] cursor-pointer"
                      aria-required="true"
                    />
                    <span>
                      Concordo com os{" "}
                      <button
                        type="button"
                        onClick={() => setActiveLegalDoc("termos")}
                        className="text-[#D95A1A] hover:underline font-medium focus:outline-none"
                      >
                        Termos de Uso
                      </button>{" "}
                      e a{" "}
                      <button
                        type="button"
                        onClick={() => setActiveLegalDoc("privacidade")}
                        className="text-[#D95A1A] hover:underline font-medium focus:outline-none"
                      >
                        Política de Privacidade
                      </button>.
                    </span>
                  </label>
                  {errors.termos && touched.termos && (
                    <p className="text-xs text-red-400 mt-1 font-medium">{errors.termos}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="auth-pill-btn flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>A criar conta...</span>
                    </>
                  ) : (
                    <span>Registar como Hóspede</span>
                  )}
                </button>
              </form>
            )}

            <div className="auth-footer-prompt auth-footer">
              Já tem uma conta de hóspede?
              <span
                className="auth-link-orange link"
                id="link-to-login"
                onClick={() => setIsRegister(false)}
              >
                Iniciar Sessão
              </span>
            </div>
          </div>
        </div>
      </div>

      <LegalDocsModal
        docType={activeLegalDoc}
        onClose={() => setActiveLegalDoc(null)}
      />
    </div>
  );
}
