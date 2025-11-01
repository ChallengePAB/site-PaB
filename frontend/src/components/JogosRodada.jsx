import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function JogosRodada({ jogos, onClickJogo }) {
  const [rodadaAtual, setRodadaAtual] = useState(1);

  const jogosPorRodada = jogos.reduce((acc, jogo) => {
    const rodada = jogo.rodada || 1;
    if (!acc[rodada]) acc[rodada] = [];
    acc[rodada].push(jogo);
    return acc;
  }, {});

  const rodadas = Object.keys(jogosPorRodada).sort((a, b) => b - a);
  const jogosDaRodada = jogosPorRodada[rodadaAtual] || [];

  const proximaRodada = () => {
    const proximoIdx = rodadas.indexOf(String(rodadaAtual)) - 1;
    if (proximoIdx >= 0) setRodadaAtual(parseInt(rodadas[proximoIdx]));
  };

  const rodadaAnterior = () => {
    const anteriorIdx = rodadas.indexOf(String(rodadaAtual)) + 1;
    if (anteriorIdx < rodadas.length) setRodadaAtual(parseInt(rodadas[anteriorIdx]));
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-between">
        <h2 className="text-white text-2xl font-bold">Rodada {rodadaAtual}</h2>
        <div className="flex gap-2">
          <button
            onClick={rodadaAnterior}
            disabled={rodadas.indexOf(String(rodadaAtual)) === rodadas.length - 1}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            onClick={proximaRodada}
            disabled={rodadas.indexOf(String(rodadaAtual)) === 0}
            className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {jogosDaRodada.length > 0 ? (
          jogosDaRodada.map((jogo) => (
            <div
              key={jogo.id}
              onClick={() => onClickJogo(jogo.id)}
              className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="text-sm text-gray-500 mb-2">
                {jogo.data} • {jogo.hora} • {jogo.local}
              </div>

              <div className="flex items-center justify-between">
                {/* Time da Casa */}
                <div className="flex items-center gap-2 flex-1">
                  {jogo.timeCasa?.escudo && (
                    <img
                      src={`/images/escudos/${jogo.timeCasa.escudo}`}
                      alt={jogo.timeCasa.nome}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="font-semibold text-gray-800">{jogo.timeCasa?.nome || 'Time'}</span>
                </div>

                {/* Placar */}
                <div className="px-4 text-center">
                  {jogo.status === 'FINALIZADO' ? (
                    <div className="text-2xl font-bold text-gray-800">
                      {jogo.placarCasa} x {jogo.placarFora}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 font-semibold">
                      {jogo.status === 'AGENDADO' ? 'Agendado' : 'Em andamento'}
                    </div>
                  )}
                </div>

                {/* Time Visitante */}
                <div className="flex items-center gap-2 flex-1 justify-end">
                  <span className="font-semibold text-gray-800">{jogo.timeFora?.nome || 'Time'}</span>
                  {jogo.timeFora?.escudo && (
                    <img
                      src={`/images/escudos/${jogo.timeFora.escudo}`}
                      alt={jogo.timeFora.nome}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                </div>
              </div>

              {jogo.status === 'AGENDADO' && (
                <div className="mt-2 text-xs text-green-600 font-semibold">
                  FIQUE POR DENTRO
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            Nenhum jogo disponível para esta rodada
          </div>
        )}
      </div>
    </div>
  );
}
