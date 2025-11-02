import { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, ShieldCheck } from "lucide-react"; 
import { AuthContext, useAuth } from "../components/AuthContext"; // Importando o useAuth
import logo from "../assets/logo/logo.png";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isLogged, role, logout } = useAuth(); // Usando o hook
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

    const handleAdminClick = () => {
    // --- CORREÇÃO AQUI ---
    // Navega para a rota "dashboard" que está aninhada dentro do "admin"
      navigate('/admin/dashboard'); 
      setIsMenuOpen(false);
    };

    const activeLinkStyle = { color: "#7B2CBF", fontWeight: "bold" };

    return (
      <header className="bg-white shadow-md sticky top-0 z-50 h-16">
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
                  <NavLink to="/tabela" className="text-gray-700 hover:text-purple-600 transition-colors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Tabela</NavLink>

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
                            <button 
                              onClick={handleAdminClick} 
                              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-semibold"
                            >
                              <ShieldCheck className="w-5 h-5" />
                              Painel Admin
                            </button>
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
                      <Link to="/tabela" className="text-gray-700 hover:text-purple-600" onClick={() => setIsMenuOpen(false)}>Tabela</Link>

                      {isLogged ? (
                        <>
                            {role === 'jogadora' && (
                              <button 
                                  onClick={handlePerfilClick} 
                                  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 text-left"
                              >
                                  <User className="w-5 h-5" />
s                               Meu Perfil
                              </button>
                            )}
                            {role === 'admin' && (
                              <button 
                              D onClick={handleAdminClick} 
                                  className="flex items-center gap-2 text-purple-600 hover:text-purple-800 text-left"
                              >
                        D       <ShieldCheck className="w-5 h-5" />
                                  Painel Admin
                              </button>
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

