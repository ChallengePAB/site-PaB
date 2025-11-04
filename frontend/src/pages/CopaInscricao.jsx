import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom'; 
import { Trophy, Users, User, Calendar, MapPin } from 'lucide-react';

const CopaInscricao = () => {
  const [copaData, setCopaData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchCopaData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/eventos/copa'); 
        if (!res.ok) throw new Error('Falha ao buscar dados');
        const data = await res.json();
        setCopaData(data);
      } catch (err) {
        console.error("Erro ao carregar dados da copa:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCopaData();
  }, []); 

  if (loading) {
    return (
      <section id="copa" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          Carregando informações da copa...
        </div>
      </section>
    );
  }

  //Mostrar erro se os dados não carregarem
  if (!copaData) {
    return (
      <section id="copa" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          Não foi possível carregar os dados da copa.
        </div>
      </section>
    );
  }
  return (
    <section id="copa" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Trophy className="h-16 w-16 text-purple-600" />
          </div>
          {/* DADOS DINÂMICOS */}
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {copaData.titulo} 
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {copaData.subtitulo}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <div className="bg-purple-50 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Informações da Competição
              </h3>
              <div className="space-y-4 text-left">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-semibold">Período</p>
                    {/* DADOS DINÂMICOS */}
                    <p className="text-gray-600">{copaData.periodo}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-semibold">Local</p>
                    {/* DADOS DINÂMICOS */}
                    <p className="text-gray-600">{copaData.local}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            {copaData.inscricoesAbertas ? (
              <Link
                to="/inscricao"
                className="inline-block bg-purple-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-purple-700 transition-transform transform hover:scale-105"
              >
                Inscreva-se Agora
              </Link>
            ) : (
              <p className="inline-block bg-gray-400 text-white font-bold py-3 px-8 rounded-lg text-lg cursor-not-allowed">
                Inscrições Encerradas
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CopaInscricao;