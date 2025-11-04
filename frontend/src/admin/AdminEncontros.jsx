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

// Componente reutilizável para Checkbox
const FormCheckbox = ({ label, name, checked, onChange }) => (
  <div className="flex items-center">
    <input
      id={name}
      name={name}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
    />
    <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
      {label}
    </label>
  </div>
);

// Formulário de Edição de Encontros
const EncontroForm = ({ token }) => {
  const [formData, setFormData] = useState({
    titulo: '', descricao: '', localNome: '', endereco: '', data: '', horario: '', googleMapsQuery: '',
    maxTimes: 0, maxIndividuais: 0, inscricoesAbertas: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/eventos/encontro');
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
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const dataToSend = {
        ...formData,
        maxTimes: parseInt(formData.maxTimes) || 0,
        maxIndividuais: parseInt(formData.maxIndividuais) || 0,
      };

      const res = await fetch('http://localhost:3001/api/eventos/encontro/atualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });
      if (!res.ok) throw new Error('Falha ao salvar');
      setMessage('Encontro atualizado com sucesso!');
    } catch (err) {
      setMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <div>Carregando Encontro...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Página "Encontros PaB"</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Título do Evento" name="titulo" value={formData.titulo} onChange={handleChange} />
        <FormInput label="Descrição Curta" name="descricao" value={formData.descricao} onChange={handleChange} type="textarea" />
        <FormInput label="Nome do Local" name="localNome" value={formData.localNome} onChange={handleChange} />
        <FormInput label="Endereço Completo" name="endereco" value={formData.endereco} onChange={handleChange} />
        <FormInput label="Data" name="data" value={formData.data} onChange={handleChange} />
        <FormInput label="Horário" name="horario" value={formData.horario} onChange={handleChange} />
        <FormInput label="Query do Google Maps" name="googleMapsQuery" value={formData.googleMapsQuery} onChange={handleChange} />
        <hr className="my-4" />
        <h3 className="text-lg font-semibold text-gray-700">Controle de Inscrições</h3>
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Máximo de Times" name="maxTimes" value={formData.maxTimes} onChange={handleChange} type="number" />
          <FormInput label="Máximo de Individuais" name="maxIndividuais" value={formData.maxIndividuais} onChange={handleChange} type="number" />
        </div>
        <FormCheckbox label="Inscrições Abertas" name="inscricoesAbertas" checked={formData.inscricoesAbertas} onChange={handleChange} />
        
        <button
          type="submit"
          disabled={saving}
          className="w-full flex justify-center items-center gap-2 bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
        >
          {saving ? <Loader2 className="animate-spin" /> : <Save size={18} />}
          Salvar Encontro
        </button>
        {message && <p className="text-center text-sm text-green-600 mt-2">{message}</p>}
      </form>
    </div>
  );
};

// Componente Principal da Página
export default function AdminEncontros() {
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
        <EncontroForm token={token} />
      </div>
    </>
  );
}

