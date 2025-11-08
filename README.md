# ⚽ Passa a Bola - Plataforma de Futebol Feminino

Passa a Bola é uma plataforma web completa dedicada a conectar, valorizar e dar visibilidade ao cenário do futebol feminino. O projeto funciona como um hub central para atletas, olheiros e fãs, oferecendo perfis de jogadoras, gerenciamento de peneiras, notícias e um painel administrativo robusto para gerenciamento de conteúdo.

Este projeto utiliza uma arquitetura **Cliente-Servidor unificada**, com um frontend em **React** (hospedado na Vercel) e um backend monolítico em **Node.js** (hospedado no Render).

## 📸 Screenshot

(Aqui você pode adicionar um screenshot da sua página inicial funcionando)

## 🌐 Acesso ao Site

Você não precisa instalar nada para ver o projeto! A aplicação está disponível publicamente, hospedada na **Vercel**, e consome a API backend hospedada no **Render**.

Acesse o site ao vivo aqui:
[https://site-pab.vercel.app/]([https://site-pab.vercel.app/](https://site-pab.vercel.app/))

## ✨ Funcionalidades Principais

### Frontend (React)

*   **Página Inicial Dinâmica:** Exibe notícias e widgets de jogos, todos consumidos do backend Node.js.
*   **Página de Talentos:** Lista de peneiras e galeria de "Promessas da Base".
*   **Páginas de Eventos:**
    *   Página da Copa: Página de informações com botão para o formulário de inscrição da copa.
    *   Página de Encontros: Página de informações com mapa do Google Maps, widget de clima (via API) e botão para o Modal de Inscrição.
*   **Formulário de Inscrição Modal:** Lógica avançada para inscrição Individual (com 1-2 posições) ou de Time Completo (com validação de min/max de jogadoras e vagas).
*   **Sistema de Notícias:** Rota dinâmica (`/noticia/:id`) que exibe o conteúdo completo da notícia.
*   **Sistema de Autenticação:**
    *   Páginas de Login e Cadastro com criptografia (**bcrypt**) e tokens (**JWT**).
    *   Contexto de Autenticação (**AuthContext**) que gerencia o estado de login em toda a aplicação.
*   Perfis de jogadora editáveis (`/perfil/editar`).
*   **Design Responsivo:** Construído com **Tailwind CSS**.

### Backend (Node.js)

*   **API RESTful Completa:** Serve todos os dados de Auth, Peneiras, Promessas, Inscrições, Campeonatos e Notícias, tudo em um único servidor Node.js.
*   **Painel de Administrador:**
    *   Dashboard de KPIs: Com gráficos para análise de dados (com dados simulados).
    *   Gerenciamento de Conteúdo: CRUD completo para Notícias, Jogadoras (ocultar/desocultar), e Eventos (Copa e Encontros).
    *   Rotas Protegidas: Acesso ao painel garantido apenas para usuários com `role` de "admin".
*   **Integração com APIs Externas:**
    *   Possui rotas proxy seguras para buscar dados da API de Futebol (para tabelas e jogos).
    *   Possui uma rota (`/api/clima`) que chama uma API de clima externa.
*   **Integração IoT (Render):**
    *   O backend Node.js (hospedado no Render) possui um endpoint (`/api/clima-data`) para receber dados POST de simulações IoT (Wokwi).
    *   A página "Encontros" (`/encontros`) busca e exibe esses dados em tempo real.

## 🛠️ Tecnologias Utilizadas

### Frontend (React)

*   React 18 (com Hooks e Context API)
*   Vite (Build tool)
*   React Router v6 (Roteamento)
*   Tailwind CSS (Estilização)
*   Axios (Cliente HTTP para comunicação com o backend)
*   Lucide React (Ícones)
*   Recharts (Gráficos para o Dashboard)

### Backend (Node.js)

*   Node.js
*   Express.js (Servidor e Roteamento no padrão MVC - Routes/Controllers)
*   JSON Web Token (JWT) (Autenticação)
*   bcrypt.js (Criptografia de senhas)
*   Axios (Para chamadas de APIs externas)
*   cors / dotenv

### Banco de Dados

*   Arquivos JSON (Simulação de múltiplos bancos de dados para persistência no Render)

### Deploy

*   Frontend: Vercel
*   Backend: Render

## 👩‍💻 Desenvolvedores

Este projeto foi criado com dedicação por:

*   Thayná Ferreira Lopes - 566349
*   Leonardo Grosskopf Martins - 562255
*   Julia Souza Costa Schiavi - 562418
*   Sofia Viegas Bomeny - 563270
