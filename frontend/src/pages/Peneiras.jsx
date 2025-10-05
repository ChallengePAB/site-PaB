import { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { Link } from "react-router-dom";

// Imagem padrão para jogadoras sem foto
const DEFAULT_PLAYER_IMAGE = '/jogadora-padrao.png';

const Peneiras = () => {
  const [peneiras, setPeneiras] = useState([]);
  const [loadingPeneiras, setLoadingPeneiras] = useState(true);
  const [errorPeneiras, setErrorPeneiras] = useState(null);
  const [filtroCategoria, setFiltroCategoria] = useState('todas');

  const [promessas, setPromessas] = useState([]);
  const [loadingPromessas, setLoadingPromessas] = useState(true);
  const [errorPromessas, setErrorPromessas] = useState(null);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  // Carregar peneiras do backend
  useEffect(() => {
    const fetchPeneiras = async () => {
      try {
        const response = await fetch('http://localhost:3001/peneiras');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPeneiras(data);
      } catch (error) {
        setErrorPeneiras("Não foi possível carregar as peneiras. Verifique o backend.");
      } finally {
        setLoadingPeneiras(false);
      }
    };

    fetchPeneiras();
  }, []);

  // Carregar promessas do backend
  useEffect(() => {
  const fetchPromessas = async () => {
    try {
      // Lê o token do localStorage sempre que for buscar as jogadoras
      const token = localStorage.getItem("token");

      // Monta o header apenas se houver token
      const headers = token ? { "Authorization": `Bearer ${token}` } : {};

      const response = await fetch('http://localhost:3001/jogadoras/promessas', { headers });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setPromessas(data);
    } catch (error) {
      setErrorPromessas("Não foi possível carregar as promessas. Verifique o backend.");
    } finally {
      setLoadingPromessas(false);
    }
  };

  fetchPromessas();
}, []);

  // Ocultar jogadora (só admins)
  const handleOcultarJogadora = async (id) => {
    if (!token) return alert("Você precisa estar logado como admin.");
    try {
      const response = await fetch(`http://localhost:3001/jogadoras/${id}/ocultar`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPromessas(prev => prev.map(p => p.id === id ? { ...p, oculta: true } : p));
        alert("Jogadora ocultada com sucesso!");
      } else {
        alert(data.message || "Erro ao ocultar jogadora.");
      }
    } catch (error) {
      alert("Erro de conexão ao ocultar jogadora.");
    }
  };

  // Desocultar jogadora (só admins)
  const handleDesocultarJogadora = async (id) => {
    if (!token) return alert("Você precisa estar logado como admin.");
    try {
      const response = await fetch(`http://localhost:3001/jogadoras/${id}/desocultar`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      if (response.ok) {
        setPromessas(prev => prev.map(p => p.id === id ? { ...p, oculta: false } : p));
        alert("Jogadora desocultada com sucesso!");
      } else {
        alert(data.message || "Erro ao desocultar jogadora.");
      }
    } catch (error) {
      alert("Erro de conexão ao desocultar jogadora.");
    }
  };

  // Filtra jogadoras visíveis para o usuário
  const promessasVisiveis = promessas.filter(player => role === "admin" || !player.oculta);

  // Agrupa por posição
  const promessasAgrupadas = promessasVisiveis.reduce((acc, player) => {
    if (!acc[player.posicao]) acc[player.posicao] = [];
    acc[player.posicao].push(player);
    return acc;
  }, {});

  const categoriasFiltro = ['todas', 'Sub-18', 'Sub-20'];
  const peneirasFiltradas = filtroCategoria === 'todas' ? peneiras : peneiras.filter(p => p.categoria === filtroCategoria);

  const formatarData = (data) => new Date(data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  return (
    <>
      {/* Seção peneiras em aberto */}
      <section id="peneiras" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Peneiras em Aberto</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Encontre oportunidades para mostrar seu talento!</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categoriasFiltro.map((cat) => (
              <button key={cat} onClick={() => setFiltroCategoria(cat)} className={`px-4 py-2 rounded-md font-semibold transition-colors ${filtroCategoria === cat ? "bg-purple-600 text-white" : "bg-white text-gray-700 border"}`}>
                {cat === 'todas' ? 'Todas' : cat}
              </button>
            ))}
          </div>
          {loadingPeneiras ? <p className="text-center">Carregando peneiras...</p> : 
            errorPeneiras ? <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">{errorPeneiras}</p> : 
            peneirasFiltradas.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {peneirasFiltradas.map((p) => (
                <div key={p.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-900">{p.clube}</h3>
                      <span className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">{p.categoria}</span>
                    </div>
                    <p className="text-gray-600 mb-4">{p.descricao}</p>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600"><Calendar className="h-4 w-4 mr-2 text-purple-600"/>{formatarData(p.data)}</div>
                      <div className="flex items-center text-sm text-gray-600"><MapPin className="h-4 w-4 mr-2 text-purple-600"/>{p.local}</div>
                      <div className="flex items-center text-sm text-gray-600"><Users className="h-4 w-4 mr-2 text-purple-600"/>{p.vagas} vagas</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">Nenhuma peneira encontrada para a categoria selecionada.</p>
          )}
        </div>
      </section>

      <div className="border-t-2 border-gray-100"></div>

      {/* Seção promessas */}
      <section id="promessas" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <Users className="h-16 w-16 text-purple-600" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Conheça as promessas da base</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubra o talento que está surgindo.
            </p>
          </div>

          {loadingPromessas ? (
            <p className="text-center">Carregando promessas...</p>
          ) : errorPromessas ? (
            <p className="text-center text-red-600 bg-red-100 p-4 rounded-md">
              {errorPromessas}
            </p>
          ) : promessasVisiveis.length > 0 ? (
            <div className="max-w-7xl mx-auto space-y-10">
              {Object.entries(promessasAgrupadas).map(([posicao, players]) => (
                <div key={posicao}>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 pb-3 border-b-2 border-gray-200 text-left capitalize">
                    {posicao.replace('-', ' ')}s
                  </h3>
                  <div className="grid grid-flow-col auto-cols-min gap-8 py-4 overflow-x-auto">
                    {players.map((player) => (
                      <div key={player.id} className="flex flex-col items-center w-52 flex-shrink-0 text-center">
                        <Link to={`/jogadora/${player.id}`} className="relative w-52 h-62 shadow-md group overflow-hidden border-2 border-purple-200">
                          <img src={player.foto || DEFAULT_PLAYER_IMAGE} alt={player.nome} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-gray-100/40 flex flex-col justify-center items-center p-2 text-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out">
                            <p className="text-sm font-semibold">{player.clube_atual}</p>
                            <p className="text-xs mt-1">Idade: {player.idade} anos</p>
                            <p className="text-xs mt-1">Altura: {player.altura}</p>
                            <p className="text-xs mt-1">Pé dominante: {player.pe_dominante}</p>
                            {player.oculta && role === "admin" && (
                              <p className="text-red-600 text-xs mt-1 font-bold">Oculta</p>
                            )}
                          </div>
                        </Link>
                        <p className="text-gray-900 font-bold text-lg mt-3">{player.nome}</p>

                        {role === "admin" && (
                          <button onClick={() => player.oculta ? handleDesocultarJogadora(player.id) : handleOcultarJogadora(player.id) } className={`mt-2 px-3 py-1 text-sm rounded text-white ${player.oculta ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}>
                            {player.oculta ? "Desocultar" : "Ocultar"}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Nenhuma promessa da base encontrada no momento.
            </p>
          )}
        </div>
      </section>
    </>
  );
};

export default Peneiras;