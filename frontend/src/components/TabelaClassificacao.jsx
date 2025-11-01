import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export default function TabelaClassificacao({ tabela, onClickTabela }) {
  if (!tabela || tabela.length === 0) {
    return <div className="text-center py-8 text-gray-500">Nenhum dado de tabela disponível</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" onClick={onClickTabela}>
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
              <th className="px-4 py-3 text-center font-semibold text-gray-700">SG</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">ÚLTIMOS JOGOS</th>
            </tr>
          </thead>
          <tbody>
            {tabela.map((item, index) => (
              <tr key={item.timeId} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-bold text-gray-800">{index + 1}</td>
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
                <td className="px-4 py-3 text-center font-semibold text-gray-800">{item.SG}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
