import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const activeLinkStyle = {
    color: "#7B2CBF",
    fontWeight: "bold",
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">

          <Link to="/home" className="flex items-center space-x-2">
            <img src={logo} alt="Logo Passa a Bola" className="h-8" />{" "}
            <h1 className="text-2xl font-bold text-violet-700">Passa a Bola</h1>
          </Link>

          {/* Responsividade Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/home"
              className="text-gray-700 hover:text-purple-600 transition-colors"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
              Noticias
            </NavLink>

            <NavLink
              to="/copa"
              className="text-gray-700 hover:text-purple-600 transition-colors"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
              Copa
            </NavLink>
            <NavLink
              to="/talentos"
              className="text-gray-700 hover:text-purple-600 transition-colors"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
              Peneiras e Talentos
            </NavLink>

            <NavLink
              to="/login"
              className="text-gray-700 hover:text-purple-600 transition-colors"
              style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}>
              Login
            </NavLink>
          </nav>

          {/* Responsividade Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              <Link
                to="/home"
                className="text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}>
                Noticias
              </Link>

              <Link
                to="/copa"
                className="text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}>
                Copa
              </Link>

              <Link
                to="/talentos"
                className="text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}>
                Peneiras e Talentos
              </Link>

              <Link
                to="/login"
                className="text-gray-700 hover:text-purple-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
