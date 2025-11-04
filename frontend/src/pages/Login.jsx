import { useState, useContext } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../components/AuthContext';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
	    nome: '',
	    role: 'jogadora', // Padrão inicial
	    idade: '',
    altura: '',
    pe_dominante: 'Direito',
    clube_atual: '',
    posicao: ''
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

      const url = `http://localhost:3001/auth/${isLogin ? 'login' : 'register'}`;
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            nome: formData.nome, 
            email: formData.email, 
            password: formData.password, 
            role: formData.role,
            idade: formData.idade,
            altura: formData.altura,
            pe_dominante: formData.pe_dominante,
            clube_atual: formData.clube_atual,
	            posicao: formData.posicao
	          };
	          
	          // Remove campos de jogadora se a role for 'comum'
	          if (formData.role === 'comum') {
	            delete body.idade;
	            delete body.altura;
	            delete body.pe_dominante;
	            delete body.clube_atual;
	            delete body.posicao;
	          }
	        
	      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro no servidor.');
      }

      if (isLogin) {
        login(data.token, data.role, data.jogadoraId);   // atualiza contexto
        navigate('/home');              // redireciona
      } else {
        setMessage('Conta criada com sucesso! Faça login para continuar.');
        setIsLogin(true); 
      }
      
      setFormData({ 
        email: '', 
        password: '', 
        confirmPassword: '', 
        nome: '', 
        role: 'jogadora',
        idade: '',
        altura: '',
        pe_dominante: 'Direito',
        clube_atual: '',
        posicao: ''
      });

    } catch (error) {
      setMessage(error.message);
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
      role: 'jogadora',
      idade: '',
      altura: '',
      pe_dominante: 'Direito',
      clube_atual: '',
      posicao: ''
    });
  };

  const posicoes = [
    'Goleira',
    'Zagueira',
    'Lateral Direita',
    'Lateral Esquerda',
    'Volante',
    'Meia',
    'Atacante'
  ];

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
                    {formData.role === 'jogadora' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                            <input 
                              type="number" 
                              id="idade" 
                              name="idade" 
	                              value={formData.idade} 
	                              onChange={handleInputChange} 
	                              required={formData.role === 'jogadora'}
	                              min="14"
                              max="40"
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400" 
                              placeholder="Ex: 20"
                            />
                          </div>

                          <div>
                            <label htmlFor="altura" className="block text-sm font-medium text-gray-700 mb-2">Altura</label>
                            <input 
	                              type="text" 
	                              id="altura" 
	                              name="altura" 
	                              value={formData.altura} 
	                              onChange={handleInputChange} 
	                              required={formData.role === 'jogadora'}
	                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400" 
	                              placeholder="Ex: 1.70m"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pé Dominante</label>
                          <select
	                            name="pe_dominante"
	                            value={formData.pe_dominante}
	                            onChange={handleInputChange}
	                            required={formData.role === 'jogadora'}
	                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                          >
                            <option value="Direito">Direito</option>
                            <option value="Esquerdo">Esquerdo</option>
                            <option value="Ambos">Ambos</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="clube_atual" className="block text-sm font-medium text-gray-700 mb-2">Clube Atual</label>
                          <input 
	                            type="text" 
	                            id="clube_atual" 
	                            name="clube_atual" 
	                            value={formData.clube_atual} 
	                            onChange={handleInputChange} 
	                            required={formData.role === 'jogadora'}
	                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400" 
	                            placeholder="Ex: Corinthians"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Posição</label>
                          <select
	                            name="posicao"
	                            value={formData.posicao}
	                            onChange={handleInputChange}
	                            required={formData.role === 'jogadora'}
	                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-400"
                          >
                            <option value="">Selecione uma posição</option>
                            {posicoes.map(pos => (
                              <option key={pos} value={pos}>{pos}</option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}	                  </>
	                )}
	                
	                {/* Seleção de Tipo de Conta */}
	                {!isLogin && (
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Conta</label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="role"
                            value="jogadora"
                            checked={formData.role === 'jogadora'}
                            onChange={handleInputChange}
                            className="form-radio text-purple-600"
                          />
                          <span className="ml-2 text-gray-700">Jogadora</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            name="role"
                            value="comum"
                            checked={formData.role === 'comum'}
                            onChange={handleInputChange}
                            className="form-radio text-purple-600"
                          />
                          <span className="ml-2 text-gray-700">Comum (Apenas nome, email e senha)</span>
                        </label>
                      </div>
                    </div>
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