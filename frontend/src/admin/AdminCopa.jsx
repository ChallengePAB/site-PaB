import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import AdminHeader from '../components/AdminHeader'; 
import { Save, Loader2 } from 'lucide-react';

// Componente reutilizável para os inputs
const FormInput = ({ label, name, value, onChange, type = 'text', rows = 3 }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
    {type === 'textarea' ? (
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    ) : (
    <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
    />
    )}
  </div>
);

// Formulário de Edição da Copa
const CopaForm = ({ token }) => {
  const [formData, setFormData] = useState({
    titulo: '', subtitulo: '', periodo: '', local: '', categorias: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/copa');
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        setMessage('Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('http://localhost:3001/api/copa/atualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      if (!res.ok) throw new Error('Falha ao salvar');
      setMessage('Copa atualizada com sucesso!');
    } catch (err) {
      setMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div>Carregando Copa...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Página "Copa"</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Título da Copa" name="titulo" value={formData.titulo} onChange={handleChange} />
        <FormInput label="Subtítulo" name="subtitulo" value={formData.subtitulo} onChange={handleChange} type="textarea" rows={2} />
        <FormInput label="Período" name="periodo" value={formData.periodo} onChange={handleChange} />
        <FormInput label="Local" name="local" value={formData.local} onChange={handleChange} />
        <FormInput label="Categorias" name="categorias" value={formData.categorias} onChange={handleChange} />
        <button
          type="submit"
          disabled={saving}
          className="w-full flex justify-center items-center gap-2 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          Salvar Copa
        </button>
        {message && <p className="text-center text-sm text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

// Componente Principal
export default function AdminCopa() {
  const { isLogged, role, loading: authLoading, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!isLogged || role !== 'admin')) {
      navigate('/login');
    }
  }, [isLogged, role, authLoading, navigate]);

  if (authLoading) {
    return <div className="text-center py-24">Carregando...</div>;
  }

  return (
    <>
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <CopaForm token={token} />
      </div>
    </>
  );
}
