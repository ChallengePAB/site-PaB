import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';
import { apiNodeClient } from '../api/api';

export default function NoticiaPage() {
  const { id } = useParams();
  const [artigo, setArtigo] = useState(null);
  const [outrosArtigos, setOutrosArtigos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchNoticia = async () => {
      setLoading(true);
      try {
        const response = await apiNodeClient.get(`/api/news/${id}`);
        setArtigo(response.data);

        const allNewsResponse = await apiNodeClient.get('/api/news');
        const allNews = allNewsResponse.data;
        const outros = allNews.filter(n => n.id != id).slice(0, 4);
        setOutrosArtigos(outros);

      } catch (err) {
        console.error("Erro ao buscar notícia:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticia();
  }, [id]);

  if (loading) {
    return <div className="text-center py-24">Carregando notícia...</div>;
  }

  if (error || !artigo) {
    return <div className="text-center py-24 text-red-500">{error || 'Artigo não encontrado.'}</div>;
  }

  const renderConteudo = () => {
    if (Array.isArray(artigo.conteudo)) {
      return artigo.conteudo.map((bloco, index) => {
        if (bloco.type === 'paragraph') {
          return <p key={index}>{bloco.value}</p>;
        }
        if (bloco.type === 'subtitle') {
          return <h2 key={index}>{bloco.value}</h2>;
        }
        return null;
      });
    }
    if (typeof artigo.conteudo === 'string') {
      return <p>{artigo.conteudo}</p>;
    }
    return null;
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <img
            src={`/images/noticias/${artigo.imagem}`}
            alt={artigo.titulo}
            className="w-full h-96 object-cover rounded-2xl shadow-lg mb-8"
          />
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            {artigo.titulo}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            {artigo.subtitulo}
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {artigo.time && (
              <span className=" text-gray-700 text-xs font-medium me-2 px-2.5 py-0.5 ">
                {artigo.time}
              </span>
            )}
            {artigo.assunto && (
              <span className=" text-gray-700 text-xs font-medium me-2 px-2.5 py-0.5 ">
                {artigo.assunto}
              </span>
            )}
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-8 border-y py-4">
            <div className="flex items-center mr-6"><User size={16} className="mr-2" /><span>Por Passa a Bola</span></div>
            <div className="flex items-center"><Calendar size={16} className="mr-2" /><span>Publicado em 15 de Setembro de 2025</span></div>
          </div>


          <div className="prose lg:prose-xl max-w-none text-gray-800">
            {renderConteudo()}
          </div>
        </article>

        {/* --- SEÇÃO "CONTINUE LENDO" --- */}
        {outrosArtigos.length > 0 && (
          <section className="max-w-4xl mx-auto mt-16 pt-8 border-t">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Continue Lendo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {outrosArtigos.map(outroArtigo => (
                <Link to={`/noticia/${outroArtigo.id}`} key={outroArtigo.id} className="group block">
                  <div className="overflow-hidden rounded-lg shadow-md">
                    <img
                      src={`/images/noticias/${outroArtigo.imagem}`}
                      alt={outroArtigo.titulo}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 transition-colors group-hover:text-purple-600">
                        {outroArtigo.titulo}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}