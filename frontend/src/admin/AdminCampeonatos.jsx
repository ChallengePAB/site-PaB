import React, { useState, useEffect } from 'react';
import { Edit, Save, X, Plus, Trash2 } from 'lucide-react';

export default function AdminCampeonatos() {
  const [activeTab, setActiveTab] = useState('tabela');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Estados para Tabela
  const [tabela, setTabela] = useState([]);
  const [times, setTimes] = useState([]);
  const [editingTabela, setEditingTabela] = useState(false);

  // Estados para Jogos
  const [jogos, setJogos] = useState([]);
  const [editingJogo, setEditingJogo] = useState(null);

  // Estados para Artilharia
  const [artilharia, setArtilharia] = useState([]);
  const [editingArtilharia, setEditingArtilharia] = useState(false);

  useEffect(() => {
    if (activeTab === 'tabela') {
      fetchTabela();
    } else if (activeTab === 'jogos') {
      fetchJogos();
    } else if (activeTab === 'artilharia') {
      fetchArtilharia();
    }
  }, [activeTab]);

  const fetchTabela = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/campeonatos/admin/tabela');
      if (response.ok) {
        const data = await response.json();
        setTabela(data.tabela);
        setTimes(data.times);
      }
    } catch (error) {
      console.error('Erro ao buscar tabela:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJogos = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/campeonatos/admin/jogos');
      if (response.ok) {
        const data = await response.json();
        setJogos(data.jogos);
        setTimes(data.times);
      }
    } catch (error) {
      console.error('Erro ao buscar jogos:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchArtilharia = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/campeonatos/admin/artilharia');
      if (response.ok) {
        const data = await response.json();
        setArtilharia(data.artilharia);
        setTimes(data.times);
      }
    } catch (error) {
      console.error('Erro ao buscar artilharia:', error);
    } finally {
      setLoading(false);
    }
  };

  const salvarTabela = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/campeonatos/admin/tabela', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tabela })
      });

      if (response.ok) {
        setMessage('Tabela atualizada com sucesso!');
        setEditingTabela(false);
      } else {
        setMessage('Erro ao atualizar tabela');
      }
    } catch (error) {
      setMessage('Erro ao atualizar tabela');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const salvarArtilharia = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/campeonatos/admin/artilharia', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artilharia })
      });

      if (response.ok) {
        setMessage('Artilharia atualizada com sucesso!');
        setEditingArtilharia(false);
      } else {
        setMessage('Erro ao atualizar artilharia');
      }
    } catch (error) {
      setMessage('Erro ao atualizar artilharia');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const adicionarArtilheiro = () => {
    setArtilharia([...artilharia, {
      jogador: '',
      posicao: 'ATACANTE',
      gols: 0,
      timeId: times[0]?.id || 1
    }]);
  };

  const removerArtilheiro = (index) => {
    setArtilharia(artilharia.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
        <h1 className="text-4xl font-bold">Administração de Campeonatos</h1>
        <p className="text-purple-100 mt-2">Gerencie tabelas, jogos e artilharia</p>
      </div>

      {message && (
        <div className={`mx-6 mt-4 p-4 rounded-lg ${
          message.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Abas */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 flex gap-8">
          {['tabela', 'jogos', 'artilharia'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading && <div className="text-center py-8">Carregando...</div>}

        {/* Aba Tabela */}
        {activeTab === 'tabela' && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Editar Tabela de Classificação</h2>
              <div className="flex gap-2">
                {editingTabela ? (
                  <>
                    <button
                      onClick={salvarTabela}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingTabela(false)}
                      className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingTabela(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Time</th>
                    <th className="px-4 py-3 text-center">P</th>
                    <th className="px-4 py-3 text-center">J</th>
                    <th className="px-4 py-3 text-center">V</th>
                    <th className="px-4 py-3 text-center">E</th>
                    <th className="px-4 py-3 text-center">D</th>
                    <th className="px-4 py-3 text-center">GP</th>
                    <th className="px-4 py-3 text-center">GC</th>
                    <th className="px-4 py-3 text-center">SG</th>
                  </tr>
                </thead>
                <tbody>
                  {tabela.map((item, index) => {
                    const time = times.find(t => t.id === item.timeId);
                    return (
                      <tr key={item.timeId} className="border-b">
                        <td className="px-4 py-3 font-semibold">{time?.nome || 'Time'}</td>
                        {['P', 'J', 'V', 'E', 'D', 'GP', 'GC', 'SG'].map((campo) => (
                          <td key={campo} className="px-4 py-3 text-center">
                            {editingTabela ? (
                              <input
                                type="number"
                                value={item[campo]}
                                onChange={(e) => {
                                  const novaTabela = [...tabela];
                                  novaTabela[index][campo] = parseInt(e.target.value) || 0;
                                  setTabela(novaTabela);
                                }}
                                className="w-16 px-2 py-1 border rounded text-center"
                              />
                            ) : (
                              item[campo]
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Aba Artilharia */}
        {activeTab === 'artilharia' && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Editar Artilharia</h2>
              <div className="flex gap-2">
                {editingArtilharia ? (
                  <>
                    <button
                      onClick={salvarArtilharia}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      <Save className="w-4 h-4" />
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingArtilharia(false)}
                      className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                    >
                      <X className="w-4 h-4" />
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditingArtilharia(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                )}
              </div>
            </div>

            {editingArtilharia && (
              <button
                onClick={adicionarArtilheiro}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mb-4"
              >
                <Plus className="w-4 h-4" />
                Adicionar Artilheiro
              </button>
            )}

            <div className="space-y-4">
              {artilharia.map((artilheiro, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium mb-1">Jogador</label>
                    {editingArtilharia ? (
                      <input
                        type="text"
                        value={artilheiro.jogador}
                        onChange={(e) => {
                          const novaArtilharia = [...artilharia];
                          novaArtilharia[index].jogador = e.target.value;
                          setArtilharia(novaArtilharia);
                        }}
                        className="w-full px-3 py-2 border rounded"
                      />
                    ) : (
                      <div className="font-semibold">{artilheiro.jogador}</div>
                    )}
                  </div>

                  <div className="w-32">
                    <label className="block text-sm font-medium mb-1">Time</label>
                    {editingArtilharia ? (
                      <select
                        value={artilheiro.timeId}
                        onChange={(e) => {
                          const novaArtilharia = [...artilharia];
                          novaArtilharia[index].timeId = parseInt(e.target.value);
                          setArtilharia(novaArtilharia);
                        }}
                        className="w-full px-3 py-2 border rounded"
                      >
                        {times.map(time => (
                          <option key={time.id} value={time.id}>{time.sigla}</option>
                        ))}
                      </select>
                    ) : (
                      <div>{times.find(t => t.id === artilheiro.timeId)?.sigla}</div>
                    )}
                  </div>

                  <div className="w-24">
                    <label className="block text-sm font-medium mb-1">Posição</label>
                    {editingArtilharia ? (
                      <select
                        value={artilheiro.posicao}
                        onChange={(e) => {
                          const novaArtilharia = [...artilharia];
                          novaArtilharia[index].posicao = e.target.value;
                          setArtilharia(novaArtilharia);
                        }}
                        className="w-full px-3 py-2 border rounded"
                      >
                        <option value="ATACANTE">ATACANTE</option>
                        <option value="MEIO-CAMPO">MEIO-CAMPO</option>
                        <option value="ZAGUEIRO">ZAGUEIRO</option>
                        <option value="GOLEIRO">GOLEIRO</option>
                      </select>
                    ) : (
                      <div>{artilheiro.posicao}</div>
                    )}
                  </div>

                  <div className="w-20">
                    <label className="block text-sm font-medium mb-1">Gols</label>
                    {editingArtilharia ? (
                      <input
                        type="number"
                        value={artilheiro.gols}
                        onChange={(e) => {
                          const novaArtilharia = [...artilharia];
                          novaArtilharia[index].gols = parseInt(e.target.value) || 0;
                          setArtilharia(novaArtilharia);
                        }}
                        className="w-full px-3 py-2 border rounded text-center"
                      />
                    ) : (
                      <div className="text-center font-bold text-orange-600">{artilheiro.gols}</div>
                    )}
                  </div>

                  {editingArtilharia && (
                    <button
                      onClick={() => removerArtilheiro(index)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba Jogos */}
        {activeTab === 'jogos' && !loading && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Gerenciar Jogos</h2>
            <div className="text-center py-8 text-gray-500">
              Funcionalidade de edição de jogos em desenvolvimento
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
