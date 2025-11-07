import { useState, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';
import { apiNodeClient } from '../api/api'; 

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nome: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
    ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      if (!isLogin && formData.password !== formData.confirmPassword) {
        throw new Error('As senhas não coincidem.');
      }

      const url = `/auth/${isLogin ? 'login' : 'register'}`;

      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            nome: formData.nome, 
            email: formData.email, 
            password: formData.password, 
            role: 'comum', 
          };

      const response = await apiNodeClient.post(url, body);
      const data = response.data; 

      if (isLogin) {
        login(data.token, data.role, data.userId, data.jogadoraId); 
        navigate('/home'); 
      } else {
        setMessage('Conta criada com sucesso! Faça login para continuar.');
        setIsLogin(true); 
      }

      setFormData({ 
        email: '', 
        password: '', 
        confirmPassword: '', 
        nome: '', 
      });

    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
      setMessage(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      nome: '',
    });
  };

  return (
    <section id="login" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-purple-600 rounded-lg shadow-xl overflow-hidden">
            <div className="px-8 py-6 text-center text-white">
              <h2 className="text-3xl font-bold mb-2">
                {isLogin ? 'Login' : 'Criar Conta'}
              </h2>
              <p className="text-purple-100">
                {isLogin 
                  ? 'Acesse sua conta no Passa a Bola' 
                  : 'Junte-se à comunidade do futebol feminino'
                }
              </p>
            </div>

            <div className="bg-white px-8 py-8">
              {message && (
                <div className={`mb-6 p-4 rounded-lg text-sm ${
                  message.includes('sucesso') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <>
                    <div>
                      <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleInputChange} required={!isLogin} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400" placeholder="Digite seu nome completo"/>
                      </div>
                    </div>
                  </> 
                )}  
                  
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400" placeholder="seu@email.com"/>
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} id="password" name="password" value={formData.password} onChange={handleInputChange} required className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400" placeholder="Digite sua senha"/>
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirmar Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required={!isLogin} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400" placeholder="Confirme sua senha"/>
                    </div>
                  </div>
                )}

                <button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-400 disabled:bg-purple-400 disabled:cursor-not-allowed" disabled={isSubmitting}>
                  {isSubmitting ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
                </button>
              </form>
              
              <div className="my-6 flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
    
              {isLogin && (
                <div className="mt-4 text-center">
                  <a href="#" className="text-sm text-purple-600 hover:text-purple-800">
                    Esqueceu a senha?
                  </a>
                </div>
              )}

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                  <button type="button" onClick={toggleMode} className="ml-1 text-purple-600 hover:text-purple-800 font-medium">
                    {isLogin ? 'Criar conta' : 'Fazer login'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;