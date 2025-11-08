import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, Users, ShieldCheck, LogOut, Trophy, CalendarHeart, UserCog } from 'lucide-react'; // Adicionado UserCog para Gerenciar Usuários
import { useAuth } from '../components/AuthContext'; 

const AdminHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  const linkClass = "flex items-center gap-2 px-3 py-2 text-gray-500 transition-colors hover:text-purple-600";
  const activeLinkClass = "flex items-center gap-2 px-3 py-2 text-purple-600 font-semibold border-b-2 border-purple-600";

	  return (
	    <header className="bg-white shadow-sm border-b sticky top-16 z-30">
	      <div className="container mx-auto px-4">
	        <div className="flex h-14 items-center justify-between">
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
              to="/admin/copa"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
            <Trophy className="h-4 w-4" />
              Gerenciar Copa
            </NavLink>
            <NavLink
              to="/admin/encontros"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
            <CalendarHeart className="h-4 w-4" />
              Gerenciar Encontros
            </NavLink>
            <NavLink
              to="/admin/users"
              className={({ isActive }) => isActive ? activeLinkClass : linkClass}
            >
            <UserCog className="h-4 w-4" />
              Gerenciar Usuários
            </NavLink>
	          </nav>
	          {/* Botão de Logout */}
	          <button
	            onClick={handleLogout}
	            className="flex items-center gap-2 px-3 py-2 text-red-600 transition-colors hover:text-red-800 font-semibold text-sm"
	          >
	            <LogOut className="h-4 w-4" />
	            Sair (Logout)
	          </button>
	        </div>
      </div>
    </header>
    );
};

export default AdminHeader;