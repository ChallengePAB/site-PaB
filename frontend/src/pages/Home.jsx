import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { apiNodeClient } from '../api/api';

const Home = () => {
  const [noticiaPrincipal, setNoticiaPrincipal] = useState(null);
  const [noticiasSecundarias, setNoticiasSecundarias] = useState([]);
  const [loadingNoticias, setLoadingNoticias] = useState(true);
  const [errorNoticias, setErrorNoticias] = useState(null);

  useEffect(() => {
    const fetchNoticias = async () => {
      try {
        const response = await apiNodeClient.get('/api/news');
        const allNews = response.data;

        if (allNews && allNews.length > 0) {
          setNoticiaPrincipal(allNews[0]);
          setNoticiasSecundarias(allNews.slice(1));
        } else {
          setNoticiaPrincipal(null);
          setNoticiasSecundarias([]);
        }
      } catch (err) {
        console.error("Erro ao buscar notícias:", err); 
        setErrorNoticias(err.message);
      } finally {
        setLoadingNoticias(false);
      }
    };
    fetchNoticias();
  }, []); 

  if (loadingNoticias) {
    return <div className="text-center py-24">Carregando página...</div>;
  }

  if (errorNoticias) {
    return <div className="text-center py-24 text-red-500">{errorNoticias}</div>;
  }

  if (!noticiaPrincipal && noticiasSecundarias.length === 0) {
    return <div className="text-center py-24 text-gray-500">Nenhuma notícia encontrada no momento.</div>;
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Seção notícia principal */}
        {noticiaPrincipal && (
          <Link to={`/noticia/${noticiaPrincipal.id}`} className="block group rounded-2xl overflow-hidden">
            <section
              className="relative h-96 w-full bg-cover bg-center transition-transform duration-300 ease-in-out group-hover:scale-102"
              style={{ backgroundImage: `url(/images/noticias/${noticiaPrincipal.imagem})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                <div className="text-white">
                  <div className="flex flex-wrap gap-2 mb-2">
                    {noticiaPrincipal.time && (
                      <span className="text-white text-xs font-medium px-2.5 py-0.5">
                        {noticiaPrincipal.time}
                      </span>
                    )}
                    {noticiaPrincipal.assunto && (
                      <span className="text-white text-xs font-medium px-2.5 py-0.5">
                        {noticiaPrincipal.assunto}
                      </span>
                    )}
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold max-w-2xl leading-tight">
                    {noticiaPrincipal.titulo}
                  </h1>
                </div>
              </div>
            </section>
          </Link>
        )}

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Seção das notícias principais */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-black mb-6 pb-4 border-b">
              Principais Notícias
            </h2>
            <div className="space-y-8">
              {noticiasSecundarias.map((n) => (
                <Link to={`/noticia/${n.id}`} key={n.id} className="group block">
                  <article className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-full md:w-2/5 flex-shrink-0">
                      <img
                        src={`/images/noticias/${n.imagem}`}
                        alt={n.titulo}
                        className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="w-full md:w-3/5">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 transition-colors group-hover:text-violet-600">
                        {n.titulo}
                      </h3>
                      <p className="text-gray-900">
                        {n.subtitulo}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {n.time && (
                          <span className="text-gray-700 text-xs font-medium px-2.5 py-0.5">
                            {n.time}
                          </span>
                        )}
                        {n.assunto && (
                          <span className="text-gray-700 text-xs font-medium px-2.5 py-0.5">
                            {n.assunto}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;