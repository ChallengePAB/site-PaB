import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Youtube, Instagram } from "lucide-react"; 
import { FaTiktok } from "react-icons/fa"; 

const PlayerProfile = () => {
  const { id } = useParams(); // pega o ID da URL
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const response = await fetch(`http://localhost:3001/jogadoras/${id}`);
        const data = await response.json();
        setPlayer(data);
      } catch (error) {
        console.error("Erro ao carregar jogadora:", error);
      }
    };
    fetchPlayer();
  }, [id]);

  if (!player) {
    return <p className="text-center py-10">Carregando perfil...</p>;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto px-4 py-8 text-center">
        {/* Foto de perfil */}
        <img
          src={player.foto || "/jogadora-padrao.png"}
          alt={player.nome}
          className="w-40 h-40 mx-auto rounded-full object-cover shadow-lg"
        />

        {/* Nome */}
        <h1 className="mt-6 text-3xl font-bold text-gray-900">{player.nome}</h1>

        {/* Informações básicas */}
        <div className="mt-4 flex justify-center gap-6 text-gray-600">
          <span><strong>Idade:</strong> {player.idade}</span>
          <span><strong>Altura:</strong> {player.altura}</span>
          <span><strong>Posição:</strong> {player.posicao}</span>
        </div>
        <div className="mt-2 text-gray-600">
          <span><strong>Clube:</strong> {player.clube_atual}</span>
          <span className="ml-6"><strong>Pé:</strong> {player.pe_dominante}</span>
        </div>

        {/* Biografia */}
        {player.biografia && (
          <p className="mt-6 text-gray-700 max-w-2xl mx-auto">{player.biografia}</p>
        )}

        {/* Plataformas */}
        {(player.youtube || player.instagram || player.tiktok) && (
          <div className="flex justify-center gap-6 mt-6">
            {player.youtube && (
              <a href={player.youtube} target="_blank" rel="noopener noreferrer">
                <Youtube className="w-6 h-6 text-red-600 hover:scale-110 transition-transform" />
              </a>
            )}
            {player.instagram && (
              <a href={player.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="w-6 h-6 text-pink-600 hover:scale-110 transition-transform" />
              </a>
            )}
            {player.tiktok && (
              <a href={player.tiktok} target="_blank" rel="noopener noreferrer">
                <FaTiktok className="w-6 h-6 text-black hover:scale-110 transition-transform" />
              </a>
            )}
          </div>
        )}

        {/* Conteúdo */}
        {player.conteudos && player.conteudos.length > 0 && (
          <section className="mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Conteúdos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {player.conteudos.map((c, index) => (
                <img
                  key={index}
                  src={c}
                  alt={`conteudo-${index}`}
                  className="w-full h-48 object-cover rounded-xl shadow-md"
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PlayerProfile;
