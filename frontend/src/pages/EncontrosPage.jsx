import React, { useState, useEffect } from 'react';
import { MapPin, Sun, Droplet, Wind, Zap, Clock } from 'lucide-react';
import InscricaoModal from './InscricaoModal'; 

//Informações do Local
const LOCATION_INFO = {
  nome: "Encontro PaB - Arena SP",
  horario: "Todos os Domingos, 10:00 - 12:00",
  endereco: "Rua Exemplo de Local, 123 - Bairro, São Paulo - SP",
  googleMapsLink: "https://www.google.com/maps/place/R.+Guaicurus,+1277+-+Lapa,+S%C3%A3o+Paulo+-+SP,+05033-002"
};

//Widget de Clima 
const WeatherWidget = () => {
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClima = async () => {
      try {
        // Busca da API 
        const response = await fetch('http://localhost:3001/api/clima');
        if (response.ok) {
          const data = await response.json();
          setClima(data);
        } else {
          setClima(null); 
        }
      } catch (error) {
        console.error("Erro ao buscar clima:", error);
        setClima(null);
      } finally {
        setLoading(false);
      }
    };
    fetchClima();
  }, []);

  if (loading) {
    return <div className="p-6 bg-gray-100 rounded-lg animate-pulse h-40"></div>;
  }

  // Se a API não retornar dados mostra o placeholder para ver como fica o front
  if (!clima || !clima.temp) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Condições Climáticas</h3>
        <div className="text-center p-4">
          <p className="text-lg text-blue-100">Aqui vai ficar os dados de Edge</p>
          <p className="text-sm text-blue-200">(Dados de temperatura e umidade da sua API)</p>
        </div>
      </div>
    );
  }

  // Se a API funcionar, mostra os dados
  return (
    <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Condições Climáticas</h3>
      <div className="flex items-center justify-between">
        <div className="text-center">
          <p className="text-5xl font-extrabold">{Math.round(clima.temp)}°C</p>
          <p className="text-lg capitalize">{clima.description}</p>
          <p className="text-sm text-blue-100">{clima.local}</p>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2"><Droplet size={16} /> Umidade: {clima.humidity}%</div>
          <div className="flex items-center gap-2"><Wind size={16} /> Vento: 15 km/h</div>
          <div className="flex items-center gap-2"><Sun size={16} /> UV: Alto</div>
        </div>
      </div>
    </div>
  );
};

// Componente Principal da Página de Encontros 
export default function EncontrosPage() {
  // Estado para controlar o modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">Encontros PaB</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Participe dos nossos encontros e mostre seu talento para olheiros e clubes parceiros.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Coluna da Esquerda: Sobre, Local, Mapa */}
            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Informações do Evento</h2>
              
              {/* Sobre o Encontro */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-purple-700 mb-2">Sobre o Encontro</h3>
                <p className="text-gray-600">
                  Nossos encontros são a oportunidade perfeita para você jogar,
                  se conectar com outras atletas e ser vista por profissionais do meio.
                  Trazemos olheiros e treinadores para observar o talento em campo.
                </p>
              </div>

              {/* Local e Horário */}
              <div className="mb-4">
                <p className="text-lg font-semibold text-purple-700">{LOCATION_INFO.nome}</p>
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  {LOCATION_INFO.endereco}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  <Clock size={16} className="mr-2 flex-shrink-0" />
                  {LOCATION_INFO.horario}
                </p>
              </div>

              {/* Mapa */}
              <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                <a href={LOCATION_INFO.googleMapsLink} target="_blank" rel="noopener noreferrer" title="Clique para ver no Google Maps">
                  <img 
                    src="https://placehold.co/600x400/e2e8f0/64748b?text=Clique+para+ver+o+mapa"
                    alt="Mapa para o local"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
                  />
                </a>
              </div>
            </div>

            {/* Coluna da Direita: Clima e Inscrição */}
            <div className="space-y-8">
              <WeatherWidget />
              <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                <Zap size={48} className="text-purple-600 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Inscrições Abertas!</h2>
                <p className="text-gray-600 mb-6">
                  Garanta sua vaga no próximo encontro. Inscreva-se como jogadora individual ou monte seu time.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full bg-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-purple-700 transition-all transform hover:scale-105"
                >
                  Inscreva-se Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* O Modal de Inscrição */}
      <InscricaoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}