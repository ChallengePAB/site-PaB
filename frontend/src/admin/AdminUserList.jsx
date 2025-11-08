import React, { useState, useEffect } from 'react';
import AdminHeader from '../components/AdminHeader';
import { apiNodeClient } from '../api/api'; // Assumindo que você tem um cliente API configurado
import { Users, UserCheck, UserPlus, Trash2, Loader2, AlertTriangle } from 'lucide-react';

const AdminUserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionStatus, setActionStatus] = useState({}); // Para gerenciar o status de ações por usuário

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // Rota que criamos no backend: GET /admin/users/non-jogadoras
            const response = await apiNodeClient.get('/admin/users/non-jogadoras');
            setUsers(response.data);
        } catch (err) {
            console.error("Erro ao buscar usuários:", err);
            setError("Não foi possível carregar a lista de usuários. Verifique o servidor.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (userId, actionType) => {
        setActionStatus(prev => ({ ...prev, [userId]: { loading: true, error: null } }));
        try {
            let url = '';
            let successMessage = '';

            switch (actionType) {
                case 'make-jogadora':
                    url = `/admin/users/${userId}/make-jogadora`;
                    successMessage = 'Usuário transformado em Jogadora com sucesso!';
                    break;
                case 'make-admin':
                    url = `/admin/users/${userId}/make-admin`;
                    successMessage = 'Usuário transformado em Admin com sucesso!';
                    break;
                case 'delete':
                    url = `/admin/users/${userId}`;
                    successMessage = 'Usuário deletado com sucesso.';
                    break;
                default:
                    throw new Error('Ação inválida.');
            }

            if (actionType === 'delete') {
                await apiNodeClient.delete(url);
            } else {
                await apiNodeClient.post(url);
            }

            // Atualiza a lista após a ação
            fetchUsers();
            setActionStatus(prev => ({ ...prev, [userId]: { success: successMessage } }));

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Erro na ação.';
            setActionStatus(prev => ({ ...prev, [userId]: { error: errorMessage } }));
            console.error(`Erro ao executar ação ${actionType} para o usuário ${userId}:`, err);
        }
    };

    const UserRow = ({ user }) => {
        const status = actionStatus[user.id] || {};

        return (
            <tr className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nome}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex px-2 text-xs font-semibold leading-5 rounded-full ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                        {user.role.toUpperCase()}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                        {/* Botão Transformar em Jogadora */}
                        {user.role !== 'jogadora' && (
                            <button
                                onClick={() => handleAction(user.id, 'make-jogadora')}
                                disabled={status.loading}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                                title="Transformar em Jogadora"
                            >
                                {status.loading && status.action === 'make-jogadora' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserCheck className="h-4 w-4" />}
                                Jogadora
                            </button>
                        )}

                        {/* Botão Transformar em Admin */}
                        {user.role !== 'admin' && (
                            <button
                                onClick={() => handleAction(user.id, 'make-admin')}
                                disabled={status.loading}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                                title="Transformar em Admin"
                            >
                                {status.loading && status.action === 'make-admin' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                                Admin
                            </button>
                        )}

                        {/* Botão Deletar */}
                        <button
                            onClick={() => {
                                if (window.confirm(`Tem certeza que deseja deletar o usuário ${user.nome}?`)) {
                                    handleAction(user.id, 'delete');
                                }
                            }}
                            disabled={status.loading}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            title="Deletar Usuário"
                        >
                            {status.loading && status.action === 'delete' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            Deletar
                        </button>
                    </div>
                    {status.error && (
                        <p className="mt-1 text-xs text-red-600 flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" /> {status.error}
                        </p>
                    )}
                    {status.success && (
                        <p className="mt-1 text-xs text-green-600">{status.success}</p>
                    )}
                </td>
            </tr>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Users className="h-7 w-7 mr-3 text-purple-600" />
                        Gerenciar Usuários
                    </h1>
                    <button
                        onClick={fetchUsers}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                        disabled={loading}
                    >
                        {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Atualizar Lista'}
                    </button>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 border-l-4 border-red-500">
                            <p className="font-medium">{error}</p>
                        </div>
                    )}

                    {loading && !error && (
                        <div className="p-6 text-center text-gray-500">
                            <Loader2 className="h-8 w-8 mx-auto animate-spin text-purple-500" />
                            <p className="mt-2">Carregando usuários...</p>
                        </div>
                    )}

                    {!loading && !error && users.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
                            <p className="text-lg font-medium">Nenhum usuário não-jogadora encontrado.</p>
                            <p className="mt-1 text-sm">Todos os usuários estão com o papel de 'jogadora' ou 'admin'.</p>
                        </div>
                    )}

                    {!loading && !error && users.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nome
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            E-mail
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Papel (Role)
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map(user => (
                                        <UserRow key={user.id} user={user} />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminUserList;