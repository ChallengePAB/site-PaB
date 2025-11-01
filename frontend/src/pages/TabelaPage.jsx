import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Artilharia from '../components/Artilharia';

export default function TabelaCompleta() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDados = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/campeonatos/tabela');
        if (response.ok) {
          const data = await response.json();
          setDados(data);
        }
      } catch (error) {
        console.error('Erro ao buscar dados da tabela:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!dados) {
    return <div className="flex items-center justify-center h-screen">Dados não encontrados</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">{dados.campeonato?.nome || 'Campeonato'}</h1>
          <p className="text-green-100">Classificação Completa</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tabela Completa */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gradient-to-r from-green-600 to-green-700">
                <h2 className="text-white text-2xl font-bold">Classificação</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">POS</th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-700">TIME</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">P</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">J</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">V</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">E</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">D</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">GP</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">GC</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">SG</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">%</th>
                      <th className="px-4 py-3 text-center font-semibold text-gray-700">ÚLTIMOS JOGOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dados.tabela?.map((item, index) => {
                      const aproveitamento = ((item.P / (item.J * 3)) * 100).toFixed(0);
                      
                      return (
                        <tr key={item.timeId} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-gray-800">{index + 1}</span>
                              {/* Indicadores de zona */}
                              {index < 4 && (
                                <div className="w-2 h-6 bg-green-500 rounded" title="Libertadores" />
                              )}
                              {index >= 4 && index < 6 && (
                                <div className="w-2 h-6 bg-blue-500 rounded" title="Sul-Americana" />
                              )}
                              {index >= dados.tabela.length - 4 && (
                                <div className="w-2 h-6 bg-red-500 rounded" title="Rebaixamento" />
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {item.time?.escudo && (
                                <img 
                                  src={`/images/escudos/${item.time.escudo}`} 
                                  alt={item.time.nome}
                                  className="w-6 h-6 rounded-full"
                                />
                              )}
                              <span className="font-semibold text-gray-800">{item.time?.nome || 'Time'}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center font-bold text-green-600">{item.P}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.J}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.V}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.E}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.D}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.GP}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{item.GC}</td>
                          <td className="px-4 py-3 text-center font-semibold text-gray-800">{item.SG}</td>
                          <td className="px-4 py-3 text-center text-gray-700">{aproveitamento}%</td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex justify-center gap-1">
                              {item.ultimosJogos?.map((resultado, idx) => (
                                <div
                                  key={idx}
                                  className={`w-4 h-4 rounded-full ${
                                    resultado === 'V' ? 'bg-green-500' :
                                    resultado === 'E' ? 'bg-yellow-500' :
                                    'bg-red-500'
                                  }`}
                                  title={resultado === 'V' ? 'Vitória' : resultado === 'E' ? 'Empate' : 'Derrota'}
                                />
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Legenda */}
              <div className="p-4 bg-gray-50 border-t">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded" />
                    <span>Libertadores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded" />
                    <span>Sul-Americana</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded" />
                    <span>Rebaixamento</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Artilharia */}
          <div className="lg:col-span-1">
            <Artilharia artilharia={dados.artilharia} />
          </div>
        </div>
      </div>
    </div>
  );
}
