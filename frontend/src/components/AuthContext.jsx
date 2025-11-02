import { createContext, useState, useEffect, useContext } from 'react'; 

export const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};



export const AuthProvider = ({ children }) => {
    const [isLogged, setIsLogged] = useState(false);
    const [role, setRole] = useState(null);
    const [token, setToken] = useState(null);
    const [jogadoraId, setJogadoraId] = useState(null);

    // Carregar dados do localStorage quando o componente montar
    useEffect(() => {
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      const savedJogadoraId = localStorage.getItem('jogadoraId');
      
      if (savedToken && savedRole) {
          setToken(savedToken);
          setRole(savedRole);
          setIsLogged(true);
          if (savedJogadoraId) {
            setJogadoraId(parseInt(savedJogadoraId));
          }
      }
    }, []);

    const login = (newToken, newRole, newJogadoraId = null) => {
      // Salvar no state
      setToken(newToken);
      setRole(newRole);
      setIsLogged(true);
      
      // Salvar no localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', newRole);
      
      // Se for jogadora, salvar também o jogadoraId
      if (newJogadoraId) {
          setJogadoraId(newJogadoraId);
          localStorage.setItem('jogadoraId', newJogadoraId.toString());
      }
    };

    const logout = () => {
      // Limpar state
      setToken(null);
      setRole(null);
      setIsLogged(false);
      setJogadoraId(null);
      
      // Limpar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('jogadoraId');
    };

    return (
      <AuthContext.Provider value={{ isLogged, role, token, jogadoraId, login, logout }}>
          {children}
      </AuthContext.Provider>
    );
};
