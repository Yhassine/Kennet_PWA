import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  validateNome,
  validateTelefoneMZ,
  checkPasswordStrength,
  validatePasswordConfirmation,
} from "../utils/validation";
import type { GuestUser } from "../types/guest";

interface GuestAuthViewProps {
  onLoginSuccess: (user: GuestUser) => void;
}

export default function GuestAuthView({ onLoginSuccess }: GuestAuthViewProps) {
  const [isRegister, setIsRegister] = useState(false);

  // -------------------------------------------------------------------------
  // LOGIN STATE
  // -------------------------------------------------------------------------
  const [loginIdentifier, setLoginIdentifier] = useState("armando.mondlane");
  const [loginPassword, setLoginPassword] = useState("Password123!");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      username: loginIdentifier.trim() || "hospede.kennet",
      name: loginIdentifier.includes(".") ? "Armando Mondlane" : loginIdentifier,
      cell: "841234567",
      clientCode: "KEN-MZ-1044",
      role: "guest",
      status: "Ativo",
      avatar: "AM",
    });
  };

  // -------------------------------------------------------------------------
  // REGISTER STATE (HÓSPEDE: NOME, CELULAR, SENHA - SEM EMAIL!)
  // -------------------------------------------------------------------------
  const [regNome, setRegNome] = useState("");
  const [regCell, setRegCell] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regTermos, setRegTermos] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

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

  const handleRegisterSubmit = (e: FormEvent) => {
    e.preventDefault();

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

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setRegSuccess(true);
    }, 900);
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
              <div className="auth-underline-group group">
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-neutral-400 group-focus-within:text-white transition-colors absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    id="login-username"
                    name="username"
                    className="auth-underline-input auth-input !pl-7 w-full"
                    placeholder="Username ou Celular (+258)"
                    value={loginIdentifier}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginIdentifier(e.target.value)}
                    autoComplete="username"
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
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setLoginPassword(e.target.value)}
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

              <button type="submit" className="auth-pill-btn" id="btn-login-submit">
                Entrar no Kennet
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

            {regSuccess ? (
              <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-2xl p-6 text-center space-y-4 animate-in fade-in duration-300">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-bold text-white font-['Outfit']">Conta Criada!</h3>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  Bem-vindo à comunidade Kennet. A sua conta de hóspede foi configurada com sucesso.
                </p>
                <button
                  type="button"
                  className="auth-pill-btn mt-2"
                  onClick={() => {
                    setRegSuccess(false);
                    onLoginSuccess({
                      username: regNome.trim().toLowerCase().replace(/\s+/g, "."),
                      name: regNome,
                      cell: regCell,
                      clientCode: "KEN-MZ-2026",
                      role: "guest",
                      status: "Ativo",
                      avatar: regNome.slice(0, 2).toUpperCase(),
                    });
                  }}
                >
                  Aceder ao Aplicativo
                </button>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} noValidate>
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
                      placeholder="Celular (+258 84/85/86/87)"
                      value={regCell}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setRegCell(e.target.value)}
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

                {/* Termos de Uso */}
                <div className="auth-underline-group !mb-4">
                  <label className="flex items-start gap-2.5 text-xs text-neutral-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={regTermos}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setRegTermos(e.target.checked);
                        handleBlur("termos", e.target.checked);
                      }}
                      className="mt-0.5 accent-[#D95A1A]"
                    />
                    <span>
                      Concordo com os{" "}
                      <span className="text-[#D95A1A] hover:underline">Termos de Uso</span> e{" "}
                      <span className="text-[#D95A1A] hover:underline">Política de Privacidade</span>.
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
    </div>
  );
}
