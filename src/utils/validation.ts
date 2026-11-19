export interface TelefoneValidationResult {
  isValid: boolean;
  error: string | null;
  formatted: string;
}

export interface PasswordStrengthResult {
  score: number;
  label: string;
  percent: number;
  barClass: string;
  isValid: boolean;
}

export function validateNome(nome: string): string | null {
  if (!nome || typeof nome !== "string") {
    return "O nome é obrigatório.";
  }
  const trimmed = nome.trim();
  if (trimmed.length < 3) {
    return "O nome deve ter pelo menos 3 caracteres.";
  }
  return null;
}

export function validateTelefoneMZ(rawPhone: string): TelefoneValidationResult {
  if (!rawPhone || typeof rawPhone !== "string") {
    return {
      isValid: false,
      error: "O número de telefone é obrigatório.",
      formatted: "",
    };
  }

  let cleaned = rawPhone.trim().replace(/[\s\-()]/g, "");

  if (cleaned.startsWith("+258")) {
    cleaned = cleaned.slice(4);
  } else if (cleaned.startsWith("00258")) {
    cleaned = cleaned.slice(5);
  } else if (cleaned.startsWith("258") && cleaned.length === 12) {
    cleaned = cleaned.slice(3);
  }

  if (!/^\d+$/.test(cleaned)) {
    return {
      isValid: false,
      error: "O telefone deve conter apenas números.",
      formatted: "",
    };
  }

  if (cleaned.length !== 9) {
    return {
      isValid: false,
      error: "O telefone moçambicano deve ter 9 dígitos (ex: 84 123 4567).",
      formatted: "",
    };
  }

  const prefixo = cleaned.substring(0, 2);
  const prefixosValidos = ["82", "83", "84", "85", "86", "87"];

  if (!prefixosValidos.includes(prefixo)) {
    return {
      isValid: false,
      error: `Prefixo '${prefixo}' inválido. Use um prefixo nacional (82, 83, 84, 85, 86 ou 87).`,
      formatted: "",
    };
  }

  return {
    isValid: true,
    error: null,
    formatted: `+258${cleaned}`,
  };
}

export function validatePasswordConfirmation(
  password: string,
  confirmation: string
): string | null {
  if (!confirmation) {
    return "A confirmação da senha é obrigatória.";
  }
  if (password !== confirmation) {
    return "As senhas não coincidem.";
  }
  return null;
}

export function checkPasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      label: "Muito fraca",
      percent: 0,
      barClass: "bg-red-500",
      isValid: false,
    };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) {
    return {
      score: 1,
      label: "Fraca",
      percent: 25,
      barClass: "bg-red-500",
      isValid: false,
    };
  } else if (score === 2) {
    return {
      score: 2,
      label: "Média",
      percent: 50,
      barClass: "bg-amber-500",
      isValid: true,
    };
  } else if (score === 3) {
    return {
      score: 3,
      label: "Boa",
      percent: 75,
      barClass: "bg-emerald-500",
      isValid: true,
    };
  } else {
    return {
      score: 4,
      label: "Forte",
      percent: 100,
      barClass: "bg-emerald-400",
      isValid: true,
    };
  }
}
