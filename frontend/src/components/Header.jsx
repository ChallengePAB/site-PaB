import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { AuthContext } from "../components/AuthContext";
import logo from "../assets/logo/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLogged, role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePerfilClick = () => {
    navigate('/perfil/editar');
    setIsMenuOpen(false);
  };

  const activeLinkStyle = { color: "#7B2CBF", fontWeight: "bold" };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/home" className="flex items-center space-x-2">
            <img src={logo} alt="Logo Passa a Bola" className="h-8" />
            <h1 className="text-2xl font-bold text-violet-700">Passa a Bola</h1>
          </Link>

          {/* Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/home" className="text-gray-700 hover:text-purple-600 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Noticias</NavLink>
            <NavLink to="/copa" className="text-gray-700 hover:text-purple-600 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Copa</NavLink>
            <NavLink to="/talentos" className="text-gray-700 hover:text-purple-600 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Peneiras e Talentos</NavLink>

            {isLogged ? (
              <>
                {role === 'jogadora' && (
                  <button 
                    onClick={handlePerfilClick} 
                    className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors font-semibold"
                  >
                    <User className="w-5 h-5" />
                    Meu Perfil
                  </button>
                )}
                {role === 'admin' && (
                  <NavLink 
                    to="/admin/jogadoras" 
                    className="text-gray-700 hover:text-purple-600 transition-colors font-semibold"
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                  >
                    Gerenciar Jogadoras
                  </NavLink>
                )}
                {role === 'admin' && (
                  <NavLink 
                    to="/admin/noticias" 
                    className="text-gray-700 hover:text-purple-600 transition-colors font-semibold"
                    style={({ isActive }) => isActive ? activeLinkStyle : undefined}
                  >
                    Gerenciar Notícias
                  </NavLink>
                )}
                <button onClick={handleLogout} className="text-gray-700 hover:text-purple-600 transition-colors font-semibold">Logout</button>
              </>
            ) : (
              <NavLink to="/login" className="text-gray-700 hover:text-purple-600 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Login</NavLink>
            )}
          </nav>

          {/* Mobile */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-md text-gray-700 hover:bg-gray-100">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/home" className="text-gray-700 hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>Noticias</Link>
              <Link to="/copa" className="text-gray-700 hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>Copa</Link>
              <Link to="/talentos" className="text-gray-700 hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>Peneiras e Talentos</Link>

              {isLogged ? (
                <>
                  {role === 'jogadora' && (
                    <button 
                      onClick={handlePerfilClick} 
                      className="flex items-center gap-2 text-gray-700 hover:text-purple-600 text-left"
                    >
                      <User className="w-5 h-5" />
                      Meu Perfil
                    </button>
                  )}
                  {role === 'admin' && (
                    <Link 
                      to="/admin/jogadoras" 
                      className="text-gray-700 hover:text-purple-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Gerenciar Jogadoras
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-gray-700 hover:text-purple-600 text-left">Logout</button>
                </>
              ) : (
                <Link to="/login" className="text-gray-700 hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>Login</Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;