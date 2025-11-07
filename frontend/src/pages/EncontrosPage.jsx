import React, { useState, useEffect } from 'react';
import { MapPin, Sun, Droplet, Wind, Zap, Clock, Calendar } from 'lucide-react';
import InscricaoModal from './InscricaoModal';
import { apiNodeClient } from '../api/api';

const WeatherWidget = () => {
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClima = async () => {
      try {
        const response = await apiNodeClient.get('/api/clima');
        const data = response.data;
        setClima(data);
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

  // Adicionando verificação caso o clima não seja carregado
  if (!clima) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-600 text-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-bold mb-4">Condições Climáticas</h3>
        <p>Não foi possível carregar o clima.</p>
      </div>
    );
  }

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [encontroData, setEncontroData] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Buscar os dados 
  useEffect(() => {
    const fetchEncontroData = async () => {
      setPageLoading(true);
      try {
        const res = await apiNodeClient.get('/api/eventos/encontro');
        const data = res.data;
        setEncontroData(data);
      } catch (err) {
        console.error("Erro ao carregar dados do encontro:", err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchEncontroData();
  }, []);

  // Exibir loading
  if (pageLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lg">Carregando dados do encontro...</div>;
  }

  // Exibir erro
  if (!encontroData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-lg text-red-600">Falha ao carregar dados. Tente novamente.</div>;
  }

  const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_KEY}&q=${encodeURIComponent(encontroData.googleMapsQuery)}`;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            {/* DADOS DINÂMICOS */}
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">{encontroData.titulo}</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {encontroData.descricao}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            <div className="bg-white p-8 rounded-2xl shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Informações do Evento</h2>

              <div className="mb-4">
                {/* DADOS DINÂMICOS */}
                <p className="text-lg font-semibold text-purple-700">{encontroData.localNome}</p>
                <p className="text-gray-600 flex items-center mt-1">
                  <MapPin size={16} className="mr-2 flex-shrink-0" />
                  {encontroData.endereco}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  <Calendar size={16} className="mr-2 flex-shrink-0" />
                  {encontroData.data}
                </p>
                <p className="text-gray-600 flex items-center mt-1">
                  <Clock size={16} className="mr-2 flex-shrink-0" />
                  {encontroData.horario}
                </p>
              </div>

              {/* Colocar aqui o mapa com link */}
              <div className="w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={mapEmbedUrl}
                  title={`Mapa para ${encontroData.localNome}`}
                >
                </iframe>
              </div>
            </div>

            <div className="space-y-8">
              <WeatherWidget />
              <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
                <Zap size={48} className="text-purple-600 mx-auto mb-4" />
                {/* DADOS DINÂMICOS  */}
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  {encontroData.inscricoesAbertas ? "Inscrições Abertas!" : "Inscrições Encerradas"}
                </h2>
                <p className="text-gray-600 mb-6">
                  Garanta sua vaga no próximo encontro. Inscreva-se como jogadora individual ou monte seu time.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  disabled={!encontroData.inscricoesAbertas}
                  className="w-full bg-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-purple-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {encontroData.inscricoesAbertas ? "Inscreva-se Agora" : "Inscrições Encerradas"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InscricaoModal
        isOpen={isModalOpen && encontroData.inscricoesAbertas}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}