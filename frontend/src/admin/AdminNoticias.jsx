import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import AdminHeader from '../components/AdminHeader';
import { apiNodeClient } from '../api/api';

export default function AdminNoticias() {
  const [noticias, setNoticias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const [formData, setFormData] = useState({
    imagem: '',
    titulo: '',
    subtitulo: '',
    time: '',
    assunto: '',
    conteudo: [{ type: 'paragraph', value: '' }],
  });

  useEffect(() => {
    fetchNoticias();
  }, []);

  const fetchNoticias = async () => {
    try {
      setLoading(true);
      const response = await apiNodeClient.get('/api/news');
      setNoticias(response.data);
      setError(null);
    } catch (err) {
      console.error("Erro ao carregar notícias:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (noticia) => {
    let conteudoArray;
    if (typeof noticia.conteudo === 'string') {
      conteudoArray = [{ type: 'paragraph', value: noticia.conteudo }];
    } else if (Array.isArray(noticia.conteudo)) {
      conteudoArray = noticia.conteudo;
    } else {
      conteudoArray = [{ type: 'paragraph', value: '' }];
    }

    setFormData({
      ...noticia,
      time: noticia.time || '',
      assunto: noticia.assunto || '',
      conteudo: conteudoArray,
    });
    setEditingId(noticia.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await apiNodeClient.delete(`/api/news/${id}`);
      setNoticias(noticias.filter(n => n.id !== id));
    } catch (err) {
      console.error("Erro ao deletar notícia:", err);
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await apiNodeClient.put(`/api/news/${editingId}`, formData);
      } else {
        await apiNodeClient.post('/api/news', formData);
      }
      await fetchNoticias();
      resetForm();
    } catch (err) {
      console.error("Erro ao salvar notícia:", err);
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      imagem: '',
      titulo: '',
      subtitulo: '',
      time: '',
      assunto: '',
      conteudo: [{ type: 'paragraph', value: '' }],
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleConteudoChange = (index, field, value) => {
    const newConteudo = [...formData.conteudo];
    newConteudo[index][field] = value;
    setFormData({ ...formData, conteudo: newConteudo });
  };

  const addConteudoBloco = () => {
    setFormData({
      ...formData,
      conteudo: [...formData.conteudo, { type: 'paragraph', value: '' }],
    });
  };

  const removeConteudoBloco = (index) => {
    const newConteudo = formData.conteudo.filter((_, i) => i !== index);
    setFormData({ ...formData, conteudo: newConteudo });
  };

  if (loading) return <div className="text-center py-8">Carregando notícias...</div>;

  return (
    <>
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gerenciar Notícias</h1>
          <button
            onClick={() => (editingId ? resetForm() : setShowForm(!showForm))}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Nova Notícia
          </button>
        </div>

        {error && <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>}

        {/* Formulário */}
        {showForm && (
          <div className="bg-gray-100 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">{editingId ? 'Editar' : 'Criar'} Notícia</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold mb-2">Imagem </label>
                <input
                  type="text"
                  value={formData.imagem}
                  onChange={(e) => setFormData({ ...formData, imagem: e.target.value })}
                  placeholder="ex: mainPageNews1.png"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Título</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Título da notícia"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Subtítulo</label>
                <input
                  type="text"
                  value={formData.subtitulo}
                  onChange={(e) => setFormData({ ...formData, subtitulo: e.target.value })}
                  placeholder="Subtítulo da notícia"
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              {/* Campo para Tag de Time */}
              <div>
                <label className="block font-semibold mb-2">Tag de Time</label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  placeholder=""
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              {/*Campo para Tag de Assunto */}
              <div>
                <label className="block font-semibold mb-2">Tag de Assunto</label>
                <input
                  type="text"
                  value={formData.assunto}
                  onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                  placeholder=""
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Conteúdo (Parágrafos)</label>
                <div className="space-y-3">
                  {formData.conteudo.map((bloco, index) => (
                    <div key={index} className="flex gap-2">
                      <select
                        value={bloco.type}
                        onChange={(e) => handleConteudoChange(index, 'type', e.target.value)}
                        className="px-4 py-2 border rounded-lg w-32"
                      >
                        <option value="paragraph">Parágrafo</option>
                        <option value="subtitle">Subtítulo</option>
                      </select>
                      <textarea
                        value={bloco.value}
                        onChange={(e) => handleConteudoChange(index, 'value', e.target.value)}
                        placeholder="Conteúdo..."
                        className="flex-1 px-4 py-2 border rounded-lg"
                        rows="3"
                        required
                      />
                      {formData.conteudo.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeConteudoBloco(index)}
                          className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addConteudoBloco}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  + Adicionar Parágrafo
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Atualizar' : 'Criar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Notícias */}
        <div className="space-y-4">
          {noticias.length === 0 ? (
            <p className="text-gray-500">Nenhuma notícia encontrada.</p>
          ) : (
            noticias.map((noticia) => (
              <div key={noticia.id} className="bg-white border rounded-lg shadow">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedId(expandedId === noticia.id ? null : noticia.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{noticia.titulo}</h3>
                    <p className="text-gray-600 text-sm">{noticia.subtitulo}</p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(noticia);
                      }}
                      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(noticia.id);
                      }}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                    {expandedId === noticia.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </div>
                </div>

                {/* Conteúdo Expandido */}
                {expandedId === noticia.id && (
                  <div className="p-4 bg-gray-50 border-t">
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Imagem:</strong> {noticia.imagem}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Time:</strong> {noticia.time || 'N/A'}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Assunto:</strong> {noticia.assunto || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <strong className="block mb-2">Conteúdo:</strong>
                      <div className="space-y-3 bg-white p-3 rounded">
                        {/* Tratamento para conteúdo como string ou array */}
                        {Array.isArray(noticia.conteudo) ? (
                          noticia.conteudo.map((bloco, index) => (
                            <div key={index} className="border-l-4 border-blue-500 pl-3">
                              <p className="text-xs text-gray-500 mb-1">
                                {bloco.type === 'paragraph' ? 'Parágrafo' : 'Subtítulo'}
                              </p>
                              <p className="text-gray-800">{bloco.value}</p>
                            </div>
                          ))
                        ) : (
                          <div className="border-l-4 border-blue-500 pl-3">
                            <p className="text-xs text-gray-500 mb-1">Parágrafo</p>
                            <p className="text-gray-800">{noticia.conteudo}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}