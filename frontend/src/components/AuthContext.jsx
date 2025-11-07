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
    const [userId, setUserId] = useState(null);

    // Carregar dados do localStorage quando o componente montar
    useEffect(() => {
      const savedToken = localStorage.getItem('token');
      const savedRole = localStorage.getItem('role');
      const savedJogadoraId = localStorage.getItem('jogadoraId');
      const savedUserId = localStorage.getItem('userId');
      
      if (savedToken && savedRole) {
          setToken(savedToken);
          setRole(savedRole);
          setIsLogged(true);
          if (savedJogadoraId) {
            setJogadoraId(parseInt(savedJogadoraId));
          }
          if (savedUserId) {
            setUserId(parseInt(savedUserId));
          }
      }
    }, []);

    const login = (newToken, newRole, newUserId, newJogadoraId = null) => {
      // Salvar no state
      setToken(newToken);
      setRole(newRole);
      setIsLogged(true);
      setUserId(newUserId);
      
      // Salvar no localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('role', newRole);
      localStorage.setItem('userId', newUserId.toString());
      
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
      setUserId(null);
      
      // Limpar localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('jogadoraId');
      localStorage.removeItem('userId');
    };

    return (
      <AuthContext.Provider value={{ isLogged, role, token, jogadoraId, userId, login, logout }}>
          {children}
      </AuthContext.Provider>
    );
};
