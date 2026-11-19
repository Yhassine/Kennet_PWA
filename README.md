# Kennet — PWA Oficial para Hóspedes e Inquilinos

Aplicativo Web Progressivo (PWA) dedicado exclusivamente aos **Hóspedes e Inquilinos** da plataforma **Kennet**, focado na busca, reserva e arrendamento de acomodações, vivendas, apartamentos e pensões em Moçambique.

---

## 🚀 Funcionalidades Exclusivas para Hóspedes

1. **Autenticação Direcionada (Hóspedes)**:
   - Início de sessão com Username ou Celular (+258) e Senha.
   - Registo simplificado apenas com **Nome, Celular e Senha** (sem necessidade de e-mail).
   - Transição contínua fluida liquid morph (preto e laranja).
   - Suporte a código de cliente único: `KEN-MZ-XXXX`.

2. **Exploração e Filtros Regionais**:
   - Arrendamento de Casas (Vivendas e Apartamentos com renda mensal) e Diárias de Pensões.
   - Filtro por províncias: Maputo Cidade, Maputo Província, Gaza, Inhambane, Sofala, Nampula, etc.
   - Destaque para infraestruturas críticas moçambicanas (Gerador 24/7, Furo de água potável, Climatização AC, Garagem).

3. **Mapa Interativo (Split View)**:
   - Visualização de pins no mapa com preços em Meticais (MT).
   - Seleção rápida de anúncios diretamente pelo mapa.

4. **Reservas & Agendamento de Visitas**:
   - Diárias para pensões e pousadas com confirmação imediata.
   - Agendamento de **Visitas Presenciais Gratuitas** para imóveis de arrendamento residencial.
   - Simulação de pagamentos Mobile Money: **M-Pesa (Vodacom MZ)** e **e-Mola (Movitel MZ)** com fluxo push STK.

5. **PWA Mobile-First**:
   - Service Worker (`/sw.js`) com cache inteligente e suporte offline.
   - `manifest.webmanifest` para instalação direta no ecrã inicial do smartphone.
   - Barra de navegação inferior estilo nativo: *Explorar*, *Mapa*, *Salvos*, *Reservas* e *Perfil*.

---

## 🛠️ Tecnologias Utilizadas

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Estilos**: Tailwind CSS v4 + Design System Kennet
- **Ícones**: Lucide React
- **Backend / Auth**: Supabase Client

---

## 📦 Como Executar

```bash
cd kenneth-guest-pwa
npm install
npm run dev
```

A aplicação estará disponível em `http://localhost:5174`.
