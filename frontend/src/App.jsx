import { Routes, Route } from 'react-router-dom';

// Importe seus componentes de layout e PÁGINAS
import Header from './components/Header';
import Home from './pages/Home'; 
import NoticiaPage from './pages/NoticiaPage';
import CopaInscricao from './pages/CopaInscricao';
import Peneiras from './pages/Peneiras'; 
import InscricaoPage from './pages/InscricaoPage';
import Login from './pages/Login';
import Footer from './components/Footer';
import PlayerProfile from './pages/PlayerProfile'; 
import { AuthProvider } from './components/AuthContext';
import EditarPerfil from './pages/EditarPerfil';
import AdminJogadoras from './admin/AdminJogadoras';
import AdminUserList from './admin/AdminUserList'; 
import AdminNoticias from './admin/AdminNoticias';
import AdminDashboard from './admin/AdminDashboard'; 
import EncontrosPage from './pages/EncontrosPage';
import AdminCopa from './admin/AdminCopa';
import AdminEncontros from './admin/AdminEncontros';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header /> 
        <main className="flex-grow">
          <Routes>
            {/* Rotas Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} /> 
            <Route path="/noticia/:id" element={<NoticiaPage />} />
            <Route path="/copa" element={<CopaInscricao />} />
            <Route path="/talentos" element={<Peneiras />} />
            <Route path="/inscricao" element={<InscricaoPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/jogadora/:id" element={<PlayerProfile />} />
            <Route path="/encontros" element={<EncontrosPage />} />

            <Route path="/perfil/editar" element={<EditarPerfil />} />
            
            {/* --- 2. ADICIONAR A ROTA QUE FALTAVA --- */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
            <Route path="/admin/jogadoras" element={<AdminJogadoras />} />
            <Route path="/admin/noticias" element={<AdminNoticias />} />  
            <Route path="/admin/copa" element={<AdminCopa />} />
            <Route path="/admin/encontros" element={<AdminEncontros />} />
            <Route path="/admin/users" element={<AdminUserList />} />                      
          </Routes>
        </main>
        <Footer /> 
      </div>
    </AuthProvider>
  );
}

export default App;