import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Users, ShieldCheck, LogOut, Trophy } from 'lucide-react';
import { useAuth } from '../components/AuthContext'; // Verifique o caminho real para seu AuthContext

// --- 1. ESTE É O SEU NOVO COMPONENTE DE HEADER DO ADMIN ---
const AdminHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redireciona para o login após o logout
  };

  // Classes para os links da barra de navegação horizontal
  const linkClass = "flex items-center gap-2 px-3 py-2 text-gray-500 transition-colors hover:text-purple-600";
  const activeLinkClass = "flex items-center gap-2 px-3 py-2 text-purple-600 font-semibold border-b-2 border-purple-600";

  return (
    // O header de admin fica "sticky" logo abaixo do header principal.
    // 'top-16' assume que seu header principal tem 64px (h-16).
    // Se a altura do seu Header principal for diferente (ex: h-20), ajuste este valor.
    <header className="bg-white shadow-sm border-b sticky top-16 z-30">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          
          {/* Título do Painel */}
          <div className="flex items-center gap-2 font-semibold text-gray-700">
            <ShieldCheck className="h-5 w-5 text-purple-600" />
            <span className="text-lg">Painel Admin</span>
          </div>

          {/* Links de Navegação Horizontais */}
          <nav className="flex items-center h-full text-sm font-medium">
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/noticias"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
              <Newspaper className="h-4 w-4" />
              Gerenciar Notícias
            </NavLink>
            <NavLink
              to="/admin/jogadoras"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
              <Users className="h-4 w-4" />
              Gerenciar Jogadoras
            </NavLink>
            <NavLink
              to="/admin/campeonatos"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
              <Trophy className="h-4 w-4" />
              Gerenciar Campeonatos
            </NavLink>
          </nav>
          
          {/* Botão de Sair */}
          <div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 text-sm font-medium transition-all hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
        </div>
      </div>
    </header>
  );
};

// --- 2. O LAYOUT (MOLDE) ---
// Ele renderiza o AdminHeader e a página de admin correspondente
const AdminLayout = () => {
  // Lógica de "Gatekeeper" para proteger as rotas
  const { isLogged, role, loading } = useAuth(); 
  const navigate = useNavigate();
  
  // Mostra "Carregando..." enquanto o AuthContext verifica o login
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Carregando...</div>
      </div>
    );
  }

  // Se não estiver logado ou não for admin, redireciona para o login
  if (!isLogged || role !== 'admin') {
    navigate('/login'); 
    return null; // Não renderiza nada
  }

  // Se for admin, renderiza o layout vertical
  return (
    <div className="w-full">
      <AdminHeader /> {/* <-- 1. Renderiza o Header do Admin no topo */}
      
      {/* 2. Renderiza o conteúdo da página (Dashboard, Noticias, etc.) abaixo */}
      <main className="flex-1 p-6 bg-gray-50/50 min-h-[calc(100vh-128px)]"> 
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;

