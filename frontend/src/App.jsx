import { Routes, Route } from 'react-router-dom';

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
import AdminNoticias from './admin/AdminNoticias';
import TabelaCompleta from './pages/TabelaPage';
import DetalheJogo from './pages/DetalheJogo';
import AdminCampeonatos from './admin/AdminCampeonatos';

function App() {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Header /> 
        <main className="flex-grow">
          <Routes>
            {/* Rota para a página inicial */}
            <Route path="/" element={<Home />} />

            {/* Rota para a página de notícias */}
            <Route path="/home" element={<Home />} />

            {/* Rota para a página de detalhes da notícia */}
            <Route path="/noticia/:id" element={<NoticiaPage />} />
            
            {/* Rota para a página da Copa */}
            <Route path="/copa" element={<CopaInscricao />} />

            {/* Rota para a página de Peneiras e Promessas */}
            <Route path="/talentos" element={<Peneiras />} />
            
            {/* Rota para a pagina do formulario */}
            <Route path="/inscricao" element={<InscricaoPage />} />
            
            {/* Rota para a página de Login */}
            <Route path="/login" element={<Login />} />

            {/* Rota para a página de edição de perfil */}
            <Route path="/perfil/editar" element={<EditarPerfil />} />

            {/* Rota para a página de perfil da jogadora */}
            <Route path="/jogadora/:id" element={<PlayerProfile />} />

            {/* Rota para a página de administração de jogadoras */}
            <Route path="/admin/jogadoras" element={<AdminJogadoras />} />
            
            {/* Rota para a página de administração de notícias */}
            <Route path="/admin/noticias" element={<AdminNoticias />} />
            
            {/* Rotas de Campeonato */}
            <Route path="/tabela" element={<TabelaCompleta />} />
            <Route path="/jogo/:jogoId" element={<DetalheJogo />} />
            
            {/* Rota para a página de administração de campeonatos */}
            <Route path="/admin/campeonatos" element={<AdminCampeonatos />} />
          </Routes>
        </main>
        <Footer /> 
      </div>
    </AuthProvider>
  );
}

export default App;
