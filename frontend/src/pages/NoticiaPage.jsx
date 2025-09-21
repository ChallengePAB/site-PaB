import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User } from 'lucide-react';

export default function NoticiaPage() {
  const { id } = useParams();
  
  // Estados separados para a notícia principal e as sugestões
  const [artigo, setArtigo] = useState(null);
  const [outrosArtigos, setOutrosArtigos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Rola a página para o topo sempre que uma nova notícia é carregada
    window.scrollTo(0, 0);

    const fetchNoticia = async () => {
      setLoading(true); // Reinicia o loading para transições de página
      try {
        const response = await fetch(`http://localhost:3001/noticia/${id}`);
        if (!response.ok) {
          throw new Error('Notícia não encontrada.');
        }
        const data = await response.json();
        // Atualiza os dois estados com os dados recebidos da API
        setArtigo(data.artigoAtual);
        setOutrosArtigos(data.outrosArtigos);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNoticia();
  }, [id]); // O [id] garante que a busca é refeita se o usuário clicar em uma notícia sugerida

  if (loading) {
    return <div className="text-center py-24">Carregando notícia...</div>;
  }
  
  if (error || !artigo) {
    return <div className="text-center py-24 text-red-500">{error || 'Artigo não encontrado.'}</div>;
  }

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
          <div className="flex items-center text-sm text-gray-500 mb-8 border-y py-4">
            <div className="flex items-center mr-6"><User size={16} className="mr-2" /><span>Por Passa a Bola</span></div>
            <div className="flex items-center"><Calendar size={16} className="mr-2" /><span>Publicado em 15 de Setembro de 2025</span></div>
          </div>
          <div className="prose lg:prose-xl max-w-none text-gray-800">
            <p>{artigo.conteudo}</p>
          </div>
        </article>
        
        {/* --- NOVA SEÇÃO "CONTINUE LENDO" --- */}
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