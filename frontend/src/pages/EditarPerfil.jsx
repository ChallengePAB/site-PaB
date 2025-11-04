import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { User, Mail, MapPin, Activity, Award, Image, Plus, X, Eye, EyeOff, Trash2 } from 'lucide-react';

const EditarPerfil = () => {
  const { token, role, logout, userId } = useContext(AuthContext);
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [novoConteudo, setNovoConteudo] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [perfil, setPerfil] = useState({
    nome: '',
    idade: '',
    altura: '',
    pe_dominante: 'Direito',
    clube_atual: '',
    posicao: '',
    foto: '',
    biografia: '',
    youtube: '',
    instagram: '',
    tiktok: '',
    conteudos: [],
    oculta: false
  });

	  useEffect(() => {
	    if (role !== 'jogadora' && role !== 'comum') {
	      navigate('/home');
	      return;
	    }
	    carregarPerfil();
	  }, [role, navigate, userId]);

		  const carregarPerfil = async () => {
		    try {
		      if (role === 'jogadora') {
		        const response = await fetch('http://localhost:3001/perfil/meu', {
		          headers: {
		            'Authorization': `Bearer ${token}`
		          }
		        });
		
		        if (!response.ok) {
		          throw new Error('Erro ao carregar perfil de jogadora');
		        }
		        const jogadoraData = await response.json();
		        setPerfil(jogadoraData);
		
		      } else if (role === 'comum') {
		        const response = await fetch('http://localhost:3001/auth/me', {
		          headers: {
		            'Authorization': `Bearer ${token}`
		          }
		        });
		        
		        if (!response.ok) {
		          throw new Error('Erro ao carregar dados do usuário');
		        }
		        const comumData = await response.json();
		        setPerfil({ nome: comumData.nome });
		      }
		    } catch (error) {
		      setMessage('Erro ao carregar perfil: ' + error.message);
		    } finally {
		      setIsLoading(false);
		    }
		  };
		
		  const handleInputChange = (e) => {
		    const { name, value, type, checked } = e.target;
		    setPerfil(prev => ({
		      ...prev,
		      [name]: type === 'checkbox' ? checked : value
		    }));
		  };
		
		  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    try {
      let url = '';
      let body = {};
      
      if (role === 'jogadora') {
        url = 'http://localhost:3001/perfil/atualizar';
        body = perfil;
      } else if (role === 'comum') {
        url = 'http://localhost:3001/auth/update-profile';
        body = { nome: perfil.nome };
      }
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao atualizar perfil');
      }

      setMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Erro: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const adicionarConteudo = () => {
    if (novoConteudo.trim()) {
      setPerfil(prev => ({
        ...prev,
        conteudos: [...prev.conteudos, novoConteudo.trim()]
      }));
      setNovoConteudo('');
    }
  };

  const removerConteudo = (index) => {
    setPerfil(prev => ({
      ...prev,
      conteudos: prev.conteudos.filter((_, i) => i !== index)
    }));
  };

  const handleExcluirPerfil = async () => {
    try {
      const response = await fetch('http://localhost:3001/perfil/excluir', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao excluir perfil');
      }

      alert('Perfil excluído com sucesso!');
      logout();
      navigate('/login');
    } catch (error) {
      alert('Erro ao excluir perfil: ' + error.message);
    }
  };

  const posicoes = [
    'Goleira',
    'Zagueira',
    'Lateral Direita',
    'Lateral Esquerda',
    'Volante',
    'Meia',
    'Atacante'
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl text-gray-600">Carregando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-purple-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Editar Meu Perfil</h1>
            <p className="text-purple-100 mt-2">Mantenha suas informações atualizadas</p>
          </div>

          {/* Mensagem de feedback */}
          {message && (
            <div className={`mx-8 mt-6 p-4 rounded-lg ${
              message.includes('sucesso') 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Informações Básicas */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-6 h-6 text-purple-600" />
                Informações Básicas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    name="nome"
                    value={perfil.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
                
                {role === 'jogadora' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                      <input
                        type="number"
                        name="idade"
                        value={perfil.idade}
                        onChange={handleInputChange}
                        required
                        min="14"
                        max="40"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Altura</label>
                      <input
                        type="text"
                        name="altura"
                        value={perfil.altura}
                        onChange={handleInputChange}
                        required
                        placeholder="Ex: 1.70m"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pé Dominante</label>
                      <select
                        name="pe_dominante"
                        value={perfil.pe_dominante}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        <option value="Direito">Direito</option>
                        <option value="Esquerdo">Esquerdo</option>
                        <option value="Ambos">Ambos</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Clube Atual</label>
                      <input
                        type="text"
                        name="clube_atual"
                        value={perfil.clube_atual}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Posição</label>
                      <select
                        name="posicao"
                        value={perfil.posicao}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      >
                        {posicoes.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </section>

            {role === 'jogadora' && (
              <>
                {/* Mídias Sociais */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-purple-600" />
                    Mídias Sociais
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">YouTube (Link)</label>
                      <input
                        type="url"
                        name="youtube"
                        value={perfil.youtube}
                        onChange={handleInputChange}
                        placeholder="Ex: https://youtube.com/..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Instagram (@)</label>
                      <input
                        type="text"
                        name="instagram"
                        value={perfil.instagram}
                        onChange={handleInputChange}
                        placeholder="Ex: @seunome"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">TikTok (@)</label>
                      <input
                        type="text"
                        name="tiktok"
                        value={perfil.tiktok}
                        onChange={handleInputChange}
                        placeholder="Ex: @seunome"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                    </div>
                  </div>
                </section>

                {/* Biografia e Foto */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Image className="w-6 h-6 text-purple-600" />
                    Biografia e Foto
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Biografia</label>
                      <textarea
                        name="biografia"
                        value={perfil.biografia}
                        onChange={handleInputChange}
                        rows="5"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">URL da Foto de Perfil</label>
                      <input
                        type="url"
                        name="foto"
                        value={perfil.foto}
                        onChange={handleInputChange}
                        placeholder="Link direto para a imagem"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      {perfil.foto && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Pré-visualização:</p>
                          <img src={perfil.foto} alt="Pré-visualização da foto" className="w-32 h-32 object-cover rounded-full border-2 border-purple-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Conteúdos de Destaque */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-purple-600" />
                    Conteúdos de Destaque (Links)
                  </h2>
                  <div className="space-y-4">
                    {perfil.conteudos.map((link, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-100 rounded-lg">
                        <a href={link} target="_blank" rel="noopener noreferrer" className="flex-1 text-purple-600 hover:underline truncate">{link}</a>
                        <button
                          type="button"
                          onClick={() => removerConteudo(index)}
                          className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <div className="flex gap-3">
                      <input
                        type="url"
                        value={novoConteudo}
                        onChange={(e) => setNovoConteudo(e.target.value)}
                        placeholder="Adicionar novo link de conteúdo"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
                      />
                      <button
                        type="button"
                        onClick={adicionarConteudo}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-5 h-5" />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </section>

                {/* Configurações de Privacidade */}
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <EyeOff className="w-6 h-6 text-purple-600" />
                    Configurações
                  </h2>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="oculta"
                      name="oculta"
                      checked={perfil.oculta}
                      onChange={handleInputChange}
                      className="h-5 w-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="oculta" className="ml-3 text-sm font-medium text-gray-700">
                      Ocultar meu perfil de buscas e listagens (Apenas acessível por link direto)
                    </label>
                  </div>
                </section>
              </>
            )}

            {/* Botões de Ação */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={() => { logout(); navigate('/login'); }}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                Sair (Logout)
              </button>
              <div className="flex gap-4">
                {role === 'jogadora' && perfil.id && (
                  <button
                    type="button"
                    onClick={() => navigate(`/jogadora/${perfil.id}`)}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-colors"
                  >
                    Visualizar Perfil
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>

            {role === 'jogadora' && (
              /* Zona de Perigo - Excluir Perfil */
              <section className="mt-8 pt-8 border-t border-red-200">
                <h2 className="text-2xl font-bold text-red-600 mb-4 flex items-center gap-2">
                  <Trash2 className="w-6 h-6" />
                  Zona de Perigo
                </h2>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    <strong>Atenção:</strong> Esta ação é irreversível. Ao excluir seu perfil, todos os seus dados serão permanentemente removidos do sistema.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Excluir Meu Perfil
                  </button>
                </div>
              </section>
            )}
          </form>
        </div>

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
              </div>
              
              <p className="text-gray-700 mb-6">
                Tem certeza que deseja excluir seu perfil? Esta ação não pode ser desfeita e todos os seus dados serão permanentemente removidos.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExcluirPerfil}
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
  );
};

export default EditarPerfil;