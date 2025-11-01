import React from 'react';

export default function Artilharia({ artilharia }) {
  if (!artilharia || artilharia.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhum artilheiro disponível</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-orange-600 to-orange-700">
        <h2 className="text-white text-2xl font-bold">Artilharia</h2>
      </div>

      <div className="divide-y">
        {artilharia.map((artilheiro, index) => (
          <div key={index} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-4 flex-1">
              <div className="text-2xl font-bold text-gray-400 w-8">{index + 1}</div>
              
              {artilheiro.time?.escudo && (
                <img
                  src={`/images/escudos/${artilheiro.time.escudo}`}
                  alt={artilheiro.time.nome}
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div>
                <div className="font-semibold text-gray-800">{artilheiro.jogador}</div>
                <div className="text-sm text-gray-500">
                  {artilheiro.time?.nome || 'Time'} • {artilheiro.posicao}
                </div>
              </div>
            </div>

            <div className="text-3xl font-bold text-orange-600">{artilheiro.gols}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
