import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext'; 
import { Trash2, Eye, EyeOff, Search, User } from 'lucide-react';
import AdminHeader from '../components/AdminHeader'; 

import { apiNodeClient } from '../api/api'; 

const AdminJogadoras = () => {
  const { token, role } = useContext(AuthContext); 
  const navigate = useNavigate();
  const [jogadoras, setJogadoras] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jogadoraToDelete, setJogadoraToDelete] = useState(null);

  useEffect(() => {
    if (role !== 'admin') {
      navigate('/home');
      return;
    }
    carregarJogadoras();
  }, [role, navigate]);

  const carregarJogadoras = async () => {
    try {
      const response = await apiNodeClient.get('/jogadoras/promessas');
      setJogadoras(response.data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExcluirJogadora = async () => {
    if (!jogadoraToDelete) return;

    try {
      await apiNodeClient.delete(`/jogadoras/${jogadoraToDelete.id}/excluir`);
      console.log('Jogadora excluída com sucesso!');

      setShowDeleteModal(false);
      setJogadoraToDelete(null);
      carregarJogadoras(); 
    } catch (error) {
      console.error('Erro ao excluir jogadora:', error);
    }
  };

  const handleToggleVisibilidade = async (jogadora) => {
    try {
      const endpoint = jogadora.oculta ? 'desocultar' : 'ocultar';
      await apiNodeClient.post(`/jogadoras/${jogadora.id}/${endpoint}`);
      carregarJogadoras();
    } catch (error) {
      console.error('Erro ao alterar visibilidade:', error);
    }
  };

  const confirmarExclusao = (jogadora) => {
    setJogadoraToDelete(jogadora);
    setShowDeleteModal(true);
  };

  const jogadorasFiltradas = jogadoras.filter(j => 
    j.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (j.clube_atual && j.clube_atual.toLowerCase().includes(searchTerm.toLowerCase())) || // Adicionado check de existência
    (j.posicao && j.posicao.toLowerCase().includes(searchTerm.toLowerCase())) // Adicionado check de existência
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando jogadoras...</p>
      </div>
    );
  }

  return (
    <>
    <AdminHeader />
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Gerenciar Jogadoras</h1>
            <p className="text-purple-100 mt-2">Administração de perfis de jogadoras</p>
          </div>

          {/* Busca */}
          <div className="p-6 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nome, clube ou posição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          {/* Lista de Jogadoras */}
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              Total: <strong>{jogadorasFiltradas.length}</strong> jogadora(s)
            </p>

            {jogadorasFiltradas.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma jogadora encontrada.</p>
            ) : (
              <div className="space-y-4">
                {jogadorasFiltradas.map((jogadora) => (
                  <div
                    key={jogadora.id}
                    className={`border rounded-lg p-4 ${jogadora.oculta ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Informações da Jogadora */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <User className="w-5 h-5 text-purple-600" />
                          <h3 className="text-lg font-bold text-gray-900">{jogadora.nome}</h3>
                          {jogadora.oculta && (
                            <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded">
                              Oculto
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                          <div><strong>Idade:</strong> {jogadora.idade}</div>
                          <div><strong>Altura:</strong> {jogadora.altura}</div>
                          <div><strong>Posição:</strong> {jogadora.posicao}</div>
                          <div><strong>Clube:</strong> {jogadora.clube_atual}</div>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/jogadora/${jogadora.id}`)}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                        >
                          Ver Perfil
                        </button>
                        <button
                          onClick={() => handleToggleVisibilidade(jogadora)}
                          className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                            jogadora.oculta
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                          }`}
                          title={jogadora.oculta ? 'Tornar visível' : 'Ocultar'}
                        >
                          {jogadora.oculta ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => confirmarExclusao(jogadora)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && jogadoraToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
              </div>
              
              <p className="text-gray-700 mb-2">
                Tem certeza que deseja excluir o perfil de:
              </p>
              <p className="text-lg font-bold text-gray-900 mb-4">
                {jogadoraToDelete.nome}
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Esta ação não pode ser desfeita. O perfil e a conta da jogadora serão permanentemente removidos.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setJogadoraToDelete(null);
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExcluirJogadora}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors"
                >
                  Sim, Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default AdminJogadoras;