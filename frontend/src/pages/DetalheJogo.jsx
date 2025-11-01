import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function DetalheJogo() {
  const { jogoId } = useParams();
  const navigate = useNavigate();
  const [jogo, setJogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('escalacao');

  useEffect(() => {
    const fetchJogo = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/campeonatos/jogo/${jogoId}`);
        if (response.ok) {
          const data = await response.json();
          setJogo(data);
        }
      } catch (error) {
        console.error('Erro ao buscar jogo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJogo();
  }, [jogoId]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Carregando...</div>;
  }

  if (!jogo) {
    return <div className="flex items-center justify-center h-screen">Jogo não encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar
        </button>

        <div className="text-center mb-6">
          <div className="text-sm text-blue-100 mb-2">
            {jogo.data} • {jogo.hora} • {jogo.local}
          </div>
          <h1 className="text-4xl font-bold mb-4">
            {jogo.status === 'FINALIZADO' ? 'Resultado' : 'Próximo Jogo'}
          </h1>
        </div>

        {/* Placar Grande */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* Time Casa */}
          <div className="flex flex-col items-center">
            {jogo.timeCasa?.escudo && (
              <img
                src={`/images/escudos/${jogo.timeCasa.escudo}`}
                alt={jogo.timeCasa.nome}
                className="w-24 h-24 rounded-full mb-4 shadow-lg"
              />
            )}
            <h2 className="text-3xl font-bold">{jogo.timeCasa?.nome || 'Time'}</h2>
          </div>

          {/* Placar */}
          <div className="text-center">
            {jogo.status === 'FINALIZADO' ? (
              <div className="text-7xl font-bold">{jogo.placarCasa} x {jogo.placarFora}</div>
            ) : (
              <div className="text-2xl font-semibold text-blue-100">Agendado</div>
            )}
          </div>

          {/* Time Visitante */}
          <div className="flex flex-col items-center">
            {jogo.timeFora?.escudo && (
              <img
                src={`/images/escudos/${jogo.timeFora.escudo}`}
                alt={jogo.timeFora?.nome}
                className="w-24 h-24 rounded-full mb-4 shadow-lg"
              />
            )}
            <h2 className="text-3xl font-bold">{jogo.timeFora?.nome || 'Time'}</h2>
          </div>
        </div>
      </div>

      {/* Abas */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 flex gap-8">
          {['escalacao', 'videos', 'classificacao', 'estatisticas'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-2 font-semibold border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'escalacao' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Escalação Time Casa */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                {jogo.timeCasa?.nome || 'Time'} - Escalação
              </h3>

              {jogo.escalacao?.escalacaoCasa && jogo.escalacao.escalacaoCasa.length > 0 ? (
                <div className="space-y-3">
                  {jogo.escalacao.escalacaoCasa.map((jogador, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-800">{jogador.nome}</div>
                        <div className="text-sm text-gray-500">{jogador.posicao}</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-400">#{jogador.numero}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Sem escalação disponível para este jogo
                </div>
              )}
            </div>

            {/* Escalação Time Visitante */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                {jogo.timeFora?.nome || 'Time'} - Escalação
              </h3>

              {jogo.escalacao?.escalacaoFora && jogo.escalacao.escalacaoFora.length > 0 ? (
                <div className="space-y-3">
                  {jogo.escalacao.escalacaoFora.map((jogador, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-semibold text-gray-800">{jogador.nome}</div>
                        <div className="text-sm text-gray-500">{jogador.posicao}</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-400">#{jogador.numero}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Sem escalação disponível para este jogo
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'videos' && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            Vídeos do jogo em breve
          </div>
        )}

        {activeTab === 'classificacao' && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            Classificação em breve
          </div>
        )}

        {activeTab === 'estatisticas' && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            Estatísticas em breve
          </div>
        )}
      </div>
    </div>
  );
}
