import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Tag, Users, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthContext'; 
import AdminHeader from '../components/AdminHeader'; 


const RankingTags = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
      <Tag className="w-5 h-5 text-blue-500" />
      Ranking de Tags (Mais Visitadas)
    </h3>
    <ul className="space-y-2">
      {data.map((tag, index) => (
        <li key={index} className="flex justify-between items-center text-sm">
          <span>{index + 1}. {tag.nome}</span>
          <span className="font-medium text-gray-700">{tag.visualizacoes.toLocaleString('pt-BR')}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Sub-componente: Análise de Visitantes 
const AnaliseVisitantes = ({ data }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
      <Users className="w-5 h-5 text-green-500" />
      Visitantes Únicos
    </h3>
    <div className="grid grid-cols-3 gap-4 text-center">
      <div>
        <p className="text-2xl font-bold">{data.ultimos7dias.toLocaleString('pt-BR')}</p>
        <p className="text-sm text-gray-500">Últimos 7 dias</p>
      </div>
      <div>
        <p className="text-2xl font-bold">{data.ultimas4semanas.toLocaleString('pt-BR')}</p>
        <p className="text-sm text-gray-500">Últimas 4 semanas</p>
      </div>
      <div>
        <p className="text-2xl font-bold">{data.ultimoMes.toLocaleString('pt-BR')}</p>
        <p className="text-sm text-gray-500">Último mês</p>
      </div>
    </div>
  </div>
);

// Sub-componente: Comparativo de Períodos 
const ComparativoPeriodos = ({ token }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [periodoA, setPeriodoA] = useState({ inicio: '2025-10-01', fim: '2025-10-07' });
  const [periodoB, setPeriodoB] = useState({ inicio: '2025-10-08', fim: '2025-10-14' });

  const fetchData = async () => {
    setLoading(true);
    // Simulação:
    const mockData = {
      periodoA: { total: 15203, dias: [{ dia: 'D1', visitas: 2000 }, { dia: 'D2', visitas: 2200 }, { dia: 'D3', visitas: 2100 }, { dia: 'D4', visitas: 2300 }, { dia: 'D5', visitas: 2250 }, { dia: 'D6', visitas: 2400 }, { dia: 'D7', visitas: 2300 }] },
      periodoB: { total: 18530, dias: [{ dia: 'D1', visitas: 2500 }, { dia: 'D2', visitas: 2400 }, { dia: 'D3', visitas: 2600 }, { dia: 'D4', visitas: 2700 }, { dia: 'D5', visitas: 2800 }, { dia: 'D6', visitas: 2750 }, { dia: 'D7', visitas: 2800 }] }
    };
    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    if(token) fetchData(); 
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-purple-500" />
        Comparativo de Períodos
      </h3>
      {/* Seletores de Data */}
      <div className="flex flex-wrap gap-4 mb-4 text-sm">
        <div className="flex-1 min-w-[200px]">
          <label className="block font-medium">Período A</label>
          <input type="date" value={periodoA.inicio} onChange={(e) => setPeriodoA({ ...periodoA, inicio: e.target.value })} className="border p-1 rounded" />
          <input type="date" value={periodoA.fim} onChange={(e) => setPeriodoA({ ...periodoA, fim: e.target.value })} className="border p-1 rounded ml-2" />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="block font-medium">Período B (Comparação)</label>
          <input type="date" value={periodoB.inicio} onChange={(e) => setPeriodoB({ ...periodoB, inicio: e.target.value })} className="border p-1 rounded" />
          <input type="date" value={periodoB.fim} onChange={(e) => setPeriodoB({ ...periodoB, fim: e.target.value })} className="border p-1 rounded ml-2" />
        </div>
        <button onClick={fetchData} className="bg-purple-600 text-white px-4 py-2 rounded-lg self-end">Comparar</button>
      </div>
      
      {/* Gráfico */}
      {loading ? <div>Carregando gráfico...</div> : data && (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.periodoA.dias.map((d, i) => ({ dia: d.dia, A: d.visitas, B: data.periodoB.dias[i]?.visitas || 0 }))}>
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="A" stroke="#8884d8" name={`Período A (${data.periodoA.total})`} />
              <Line type="monotone" dataKey="B" stroke="#82ca9d" name={`Período B (${data.periodoB.total})`} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};


//  Componente Principal do Dashboard -
const AdminDashboard = () => {
  const { isLogged, role, loading: authLoading, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && (!isLogged || role !== 'admin')) {
      navigate('/login'); // Redireciona se não for admin
    }
  }, [isLogged, role, authLoading, navigate]);

  // --- LÓGICA DA PÁGINA ---
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Só busca os dados se o usuário for admin
    if (isLogged && role === 'admin' && token) {
      const fetchAllKpiData = async () => {
        try {
          setLoading(true);
          const authHeader = { 'Authorization': `Bearer ${token}` };

          const [tagsRes, visitantesRes] = await Promise.all([
            fetch('http://localhost:3001/api/admin/kpi/ranking-tags', { headers: authHeader }),
            fetch('http://localhost:3001/api/admin/kpi/visitantes', { headers: authHeader })
          ]);
          
          if (!tagsRes.ok || !visitantesRes.ok) {
            throw new Error('Falha ao buscar dados do dashboard.');
          }
          const tagsData = await tagsRes.json();
          const visitantesData = await visitantesRes.json();
          
          setKpiData({ tags: tagsData, visitantes: visitantesData });
        } catch (error) {
          console.error("Erro ao buscar KPIs:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchAllKpiData();
    }
  }, [isLogged, role, token]); 

  // Mostra o loading de autenticação ou de dados
  if (authLoading || loading) {
    return <div className="text-center py-24">Carregando...</div>;
  }

  // Se não for admin (embora o redirecionamento já deva ter ocorrido)
  if (!isLogged || role !== 'admin') {
    return <div className="text-center py-24 text-red-500">Acesso Negado.</div>;
  }

  // Se os dados falharem (depois do loading)
  if (!kpiData) {
     return (
        <>
          <AdminHeader />
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <p className="text-red-500">Não foi possível carregar os dados do dashboard.</p>
          </div>
        </>
     );
  }

  // Renderização da página principal
    return (
    <>
      <AdminHeader /> 
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <RankingTags data={kpiData.tags} />
          </div>
          <div className="lg:col-span-2">
            <AnaliseVisitantes data={kpiData.visitantes} />
          </div>
          <div className="lg:col-span-3">
            <ComparativoPeriodos token={token} />
          </div>
        </div>
        </div>
    </>
    );
};

export default AdminDashboard;

