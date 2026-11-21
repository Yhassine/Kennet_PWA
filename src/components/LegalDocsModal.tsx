import { useEffect } from "react";
import { X, ShieldCheck, FileText } from "lucide-react";

export type LegalDocType = "termos" | "privacidade" | null;

interface LegalDocsModalProps {
  docType: LegalDocType;
  onClose: () => void;
}

export default function LegalDocsModal({ docType, onClose }: LegalDocsModalProps) {
  useEffect(() => {
    if (!docType) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [docType, onClose]);

  if (!docType) return null;

  const isTermos = docType === "termos";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-legal-modal-title"
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl text-neutral-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800 bg-neutral-900/90">
          <div className="flex items-center gap-2.5">
            {isTermos ? (
              <FileText className="w-5 h-5 text-[#D95A1A]" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-[#D95A1A]" />
            )}
            <h3 id="guest-legal-modal-title" className="text-base font-semibold text-white">
              {isTermos ? "Termos de Uso (Versão 1.0)" : "Política de Privacidade (Versão 1.0)"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="flex-1 overflow-y-auto px-5 py-4 text-xs sm:text-sm text-neutral-300 space-y-3.5 leading-relaxed">
          {isTermos ? (
            <>
              <p className="text-[11px] text-neutral-400">
                Última atualização: 10 de Outubro de 2026 · Válido para a República de Moçambique.
              </p>
              <h4 className="font-semibold text-white text-sm">1. Objeto e Serviços da PensãoApp</h4>
              <p>
                A PensãoApp (Kennet) conecta hóspedes a alojamentos, residenciais e vivendas em Moçambique, permitindo pesquisa, reserva e comunicação com senhorios e estabelecimentos.
              </p>
              <h4 className="font-semibold text-white text-sm">2. Registo e Conta de Hóspede</h4>
              <p>
                O hóspede autentica-se preferencialmente via número de telemóvel moçambicano (+258) com verificação por código SMS (OTP). O hóspede compromete-se a fornecer informações verídicas e manter a segurança da sua senha.
              </p>
              <h4 className="font-semibold text-white text-sm">3. Preçário, Reservas e Pagamentos em MZN</h4>
              <p>
                Os preços de diárias e serviços são estipulados em Meticais (MZN). As transações podem ser pagas diretamente via M-Pesa, e-Mola ou na receção, conforme a política do anfitrião.
              </p>
              <h4 className="font-semibold text-white text-sm">4. Cancelamentos e Regras de Estadia</h4>
              <p>
                O hóspede deve respeitar os horários de check-in/check-out e o regulamento interno de cada hospedagem. Cancelamentos obedecem aos prazos exibidos antes da confirmação da reserva.
              </p>
              <h4 className="font-semibold text-white text-sm">5. Jurisdição e Resolução de Litígios</h4>
              <p>
                Estes termos são regidos pelo ordenamento jurídico da República de Moçambique, com competência territorial exclusiva atribuída aos tribunais da Cidade de Maputo.
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] text-neutral-400">
                Última atualização: 10 de Outubro de 2026 · Válido para a República de Moçambique.
              </p>
              <h4 className="font-semibold text-white text-sm">1. Informações Recolhidas</h4>
              <p>
                Para prestação do serviço de reservas recolhemos apenas o nome, telemóvel (+258), histórico de estadias e preferências. Não vendemos nem partilhamos dados com terceiros não autorizados.
              </p>
              <h4 className="font-semibold text-white text-sm">2. Segurança de Autenticação e Cifra</h4>
              <p>
                As palavras-passe são protegidas por criptografia irreversível e o envio de códigos SMS destina-se estritamente à verificação da posse do contacto.
              </p>
              <h4 className="font-semibold text-white text-sm">3. Sigilo de Transações Móveis</h4>
              <p>
                Identificadores de transação de carteiras móveis (M-Pesa / e-Mola) são cifrados e processados em conformidade com as diretivas do Banco de Moçambique.
              </p>
              <h4 className="font-semibold text-white text-sm">4. Direitos do Hóspede</h4>
              <p>
                O utilizador tem o direito de consultar, atualizar ou requerer a eliminação do seu perfil e a anonimização dos dados pessoais após a conclusão das estadias ativas.
              </p>
            </>
          )}
        </div>

        {/* Rodapé */}
        <div className="flex items-center justify-end px-5 py-3 border-t border-neutral-800 bg-neutral-900/90">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#D95A1A] hover:bg-[#c24e14] text-white transition-colors"
          >
            Entendi e Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
