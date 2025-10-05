import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';

const InscricaoPage = () => {
  const [tipoInscricao, setTipoInscricao] = useState('individual');
  const [formDataIndividual, setFormDataIndividual] = useState({ 
    nome: '', email: '', telefone: '', idade: '', posicao: '', cpf: '' 
  });
  const [formDataTime, setFormDataTime] = useState({
    nomeTime: '',
    responsavel: { nome: '', email: '', telefone: '', cpf: '' },
    jogadores: []
  });
  const [novoJogador, setNovoJogador] = useState({ 
    nome: '', idade: '', posicao: '', cpf: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [erros, setErros] = useState({});
  const [timesExistentes, setTimesExistentes] = useState([]);
  const [posicoesDisponiveis, setPosicoesDisponiveis] = useState({});
  const [estatisticas, setEstatisticas] = useState({
    totalTimes: 0,
    totalJogadoresIndividuais: 0,
    posicoesOcupadas: {}
  });

  const esquemaTatico = {
    'Goleiro': { quantidade: 1, categoria: 'defesa' },
    'Zagueiro': { quantidade: 2, categoria: 'defesa' },
    'Lateral Esquerdo': { quantidade: 1, categoria: 'defesa' },
    'Lateral Direito': { quantidade: 1, categoria: 'defesa' },
    'Volante': { quantidade: 1, categoria: 'meio' },
    'Meio-campista': { quantidade: 2, categoria: 'meio' },
    'Atacante': { quantidade: 3, categoria: 'ataque' }
  };

  const posicoes = Object.keys(esquemaTatico);
  const LIMITE_TIMES = 8;
  const JOGADORES_POR_TIME = 11;

  // Validação de CPF
  const validarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let digitoVerificador1 = resto < 2 ? 0 : resto;
    if (parseInt(cpfLimpo.charAt(9)) !== digitoVerificador1) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let digitoVerificador2 = resto < 2 ? 0 : resto;
    return parseInt(cpfLimpo.charAt(10)) === digitoVerificador2;
  };

  // Formatação de CPF
  const formatarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Verificar CPF duplicado
  const cpfJaExiste = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    const cpfNoTime = formDataTime.jogadores.some(jogador => 
      jogador.cpf.replace(/\D/g, '') === cpfLimpo
    );
    const cpfDoResponsavel = formDataTime.responsavel.cpf.replace(/\D/g, '') === cpfLimpo;
    return cpfNoTime || cpfDoResponsavel;
  };

  // Inicializar posições disponíveis com valores padrão
  const inicializarPosicoesDisponiveis = () => {
    const disponibilidade = {};
    posicoes.forEach(posicao => {
      disponibilidade[posicao] = esquemaTatico[posicao].quantidade * LIMITE_TIMES;
    });
    setPosicoesDisponiveis(disponibilidade);
  };

  useEffect(() => {
    carregarDadosExistentes();
  }, []);

  const carregarDadosExistentes = async () => {
    try {
      // Carregar times
      const timesResponse = await fetch('http://localhost:3001/times');
      const times = timesResponse.ok ? await timesResponse.json() : [];
      
      // Carregar jogadores individuais
      const jogadoresResponse = await fetch('http://localhost:3001/jogadoresIndividuais');
      const jogadoresIndividuais = jogadoresResponse.ok ? await jogadoresResponse.json() : [];
      
      // Carregar estatísticas
      const estatisticasResponse = await fetch('http://localhost:3001/estatisticas');
      const estatisticasArray = estatisticasResponse.ok ? await estatisticasResponse.json() : [];
      const estatisticasData = estatisticasArray.length > 0 ? estatisticasArray[0] : {
        totalTimes: 0,
        totalJogadoresIndividuais: 0,
        posicoesOcupadas: {}
      };
      
      // Atualizar estados
      setTimesExistentes(times);
      setEstatisticas(estatisticasData);
      
      // Calcular posições disponíveis baseado nos dados reais
      calcularPosicoesDisponiveisReal(times, jogadoresIndividuais);
      
    } catch (error) {
      console.error('Erro ao carregar dados existentes:', error);
      inicializarPosicoesDisponiveis();
    }
  };

  const calcularPosicoesDisponiveisReal = (times, jogadoresIndividuais) => {
    const contagemPosicoes = {};
    posicoes.forEach(posicao => {
      contagemPosicoes[posicao] = 0;
    });

    // Contar jogadores de times
    times.forEach(time => {
      if (time.jogadores) {
        time.jogadores.forEach(jogador => {
          if (contagemPosicoes.hasOwnProperty(jogador.posicao)) {
            contagemPosicoes[jogador.posicao]++;
          }
        });
      }
    });

    // Contar jogadores individuais
    jogadoresIndividuais.forEach(jogador => {
      if (contagemPosicoes.hasOwnProperty(jogador.posicao)) {
        contagemPosicoes[jogador.posicao]++;
      }
    });

    // Calcular disponibilidade
    const disponibilidade = {};
    posicoes.forEach(posicao => {
      const totalVagas = esquemaTatico[posicao].quantidade * LIMITE_TIMES;
      const ocupadas = contagemPosicoes[posicao];
      disponibilidade[posicao] = Math.max(0, totalVagas - ocupadas);
    });

    setPosicoesDisponiveis(disponibilidade);
  };

  const validacaoTime = useMemo(() => {
    const totalJogadores = formDataTime.jogadores.length;
    const contagemPosicoes = {};
    posicoes.forEach(posicao => {
      contagemPosicoes[posicao] = 0;
    });

    formDataTime.jogadores.forEach(jogador => {
      if (contagemPosicoes.hasOwnProperty(jogador.posicao)) {
        contagemPosicoes[jogador.posicao]++;
      }
    });

    const posicoesFaltantes = [];
    const posicoesExcedentes = [];

    posicoes.forEach(posicao => {
      const necessario = esquemaTatico[posicao].quantidade;
      const atual = contagemPosicoes[posicao];
      
      if (atual < necessario) {
        posicoesFaltantes.push(`${posicao} (${atual}/${necessario})`);
      } else if (atual > necessario) {
        posicoesExcedentes.push(`${posicao} (${atual}/${necessario})`);
      }
    });

    const isEsquemaCorreto = posicoesFaltantes.length === 0 && posicoesExcedentes.length === 0;
    const isQuantidadeCorreta = totalJogadores === JOGADORES_POR_TIME;

    return {
      totalJogadores,
      posicoesFaltantes,
      posicoesExcedentes,
      isEsquemaCorreto,
      isQuantidadeCorreta,
      podeEnviar: isEsquemaCorreto && isQuantidadeCorreta
    };
  }, [formDataTime.jogadores]);

  const podeAdicionarTime = timesExistentes.length < LIMITE_TIMES;

  const posicaoDisponivelIndividual = (posicao) => {
    return (posicoesDisponiveis[posicao] || 0) > 0;
  };

  const handleAdicionarJogador = () => {
    const { nome, idade, posicao, cpf } = novoJogador;
    
    if (!nome || !idade || !posicao || !cpf) {
      setErros({ jogador: 'Preencha todos os campos do jogador.' });
      return;
    }

    if (!validarCPF(cpf)) {
      setErros({ jogador: 'CPF inválido. Verifique os dígitos.' });
      return;
    }

    if (cpfJaExiste(cpf)) {
      setErros({ jogador: 'Este CPF já foi cadastrado neste time.' });
      return;
    }

    const contagemAtual = formDataTime.jogadores.filter(j => j.posicao === posicao).length;
    const limiteposicao = esquemaTatico[posicao].quantidade;
    
    if (contagemAtual >= limiteposicao) {
      setErros({ jogador: `A posição ${posicao} já está completa neste time (${limiteposicao} jogador${limiteposicao > 1 ? 'es' : ''}).` });
      return;
    }

    if (formDataTime.jogadores.length >= JOGADORES_POR_TIME) {
      setErros({ jogador: `O limite de ${JOGADORES_POR_TIME} jogadores por time foi atingido.` });
      return;
    }
    
    const jogadorFormatado = {
      ...novoJogador,
      cpf: formatarCPF(cpf)
    };
    
    setFormDataTime(prev => ({
      ...prev,
      jogadores: [...prev.jogadores, jogadorFormatado]
    }));
    
    setNovoJogador({ nome: '', idade: '', posicao: '', cpf: '' });
    setErros({});
  };

  const handleRemoverJogador = (indexToRemove) => {
    setFormDataTime(prev => ({
      ...prev,
      jogadores: prev.jogadores.filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    
    if (formType === 'individual') {
      if (name === 'cpf') {
        const cpfFormatado = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        setFormDataIndividual(prev => ({ ...prev, [name]: cpfFormatado }));
      } else {
        setFormDataIndividual(prev => ({ ...prev, [name]: value }));
      }
    } else if (formType === 'timeResponsavel') {
      if (name === 'cpf') {
        const cpfFormatado = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        setFormDataTime(prev => ({ ...prev, responsavel: { ...prev.responsavel, [name]: cpfFormatado } }));
      } else {
        setFormDataTime(prev => ({ ...prev, responsavel: { ...prev.responsavel, [name]: value } }));
      }
    } else if (formType === 'timeNome') {
      setFormDataTime(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'novoJogador') {
      if (name === 'cpf') {
        const cpfFormatado = value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        setNovoJogador(prev => ({ ...prev, [name]: cpfFormatado }));
      } else {
        setNovoJogador(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const atualizarEstatisticas = async (novaInscricao, tipoOperacao = 'adicionar') => {
    try {
      // Buscar estatísticas atuais
      const response = await fetch('http://localhost:3001/estatisticas');
      const estatisticasArray = await response.json();
      
      let estatisticasAtuais;
      if (estatisticasArray.length > 0) {
        estatisticasAtuais = estatisticasArray[0];
      } else {
        // Criar estatísticas iniciais se não existirem
        estatisticasAtuais = {
          id: 1,
          totalTimes: 0,
          totalJogadoresIndividuais: 0,
          posicoesOcupadas: {}
        };
      }

      // Inicializar posições se não existirem
      posicoes.forEach(posicao => {
        if (!estatisticasAtuais.posicoesOcupadas[posicao]) {
          estatisticasAtuais.posicoesOcupadas[posicao] = 0;
        }
      });

      if (tipoOperacao === 'adicionar') {
        if (novaInscricao.tipoInscricao === 'individual') {
          estatisticasAtuais.totalJogadoresIndividuais++;
          estatisticasAtuais.posicoesOcupadas[novaInscricao.posicao]++;
        } else if (novaInscricao.tipoInscricao === 'time') {
          estatisticasAtuais.totalTimes++;
          novaInscricao.jogadores.forEach(jogador => {
            estatisticasAtuais.posicoesOcupadas[jogador.posicao]++;
          });
        }
      }

      // Atualizar ou criar estatísticas no servidor
      if (estatisticasArray.length > 0) {
        await fetch(`http://localhost:3001/estatisticas/1`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(estatisticasAtuais),
        });
      } else {
        await fetch('http://localhost:3001/estatisticas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(estatisticasAtuais),
        });
      }

      return estatisticasAtuais;
    } catch (error) {
      console.error('Erro ao atualizar estatísticas:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setErros({});

    if (tipoInscricao === 'individual') {
      if (!validarCPF(formDataIndividual.cpf)) {
        setSubmitMessage('CPF inválido. Verifique os dígitos.');
        setIsSubmitting(false);
        return;
      }
      
      if (!posicaoDisponivelIndividual(formDataIndividual.posicao)) {
        setSubmitMessage(`A posição ${formDataIndividual.posicao} não está mais disponível. Todas as vagas foram preenchidas.`);
        setIsSubmitting(false);
        return;
      }
    } else {
      if (!validarCPF(formDataTime.responsavel.cpf)) {
        setSubmitMessage('CPF do responsável inválido. Verifique os dígitos.');
        setIsSubmitting(false);
        return;
      }
      
      if (!podeAdicionarTime) {
        setSubmitMessage(`Limite de ${LIMITE_TIMES} times atingido. Não é possível adicionar mais times.`);
        setIsSubmitting(false);
        return;
      }
      
      if (!validacaoTime.podeEnviar) {
        setSubmitMessage('O time deve ter exatamente 11 jogadores com as posições corretas do esquema tático.');
        setIsSubmitting(false);
        return;
      }
    }

    try {
      let novaInscricao;
      let endpoint;
      
      if (tipoInscricao === 'individual') {
        novaInscricao = { 
          tipoInscricao: 'individual',
          ...formDataIndividual,
          dataInscricao: new Date().toISOString()
        };
        endpoint = 'http://localhost:3001/jogadoresIndividuais';
      } else {
        novaInscricao = { 
          tipoInscricao: 'time',
          ...formDataTime,
          dataInscricao: new Date().toISOString()
        };
        endpoint = 'http://localhost:3001/times';
      }

      // Salvar a inscrição
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaInscricao),
      });

      if (!response.ok) throw new Error('Falha no envio.');

      // Atualizar estatísticas
      await atualizarEstatisticas(novaInscricao, 'adicionar');
      
      setSubmitMessage('Inscrição realizada com sucesso!');
      setFormDataIndividual({ nome: '', email: '', telefone: '', idade: '', posicao: '', cpf: '' });
      setFormDataTime({ nomeTime: '', responsavel: { nome: '', email: '', telefone: '', cpf: '' }, jogadores: [] });
      
      // Recarregar dados para atualizar disponibilidade
      await carregarDadosExistentes();

    } catch (error) {
      console.error('Erro ao realizar inscrição:', error);
      setSubmitMessage('Erro ao realizar inscrição. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white border rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Formulário de Inscrição - Campeonato de Futebol
          </h2>

          {/* Status do campeonato */}
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${timesExistentes.length === LIMITE_TIMES ? 'bg-green-50 border-green-500' : 'bg-blue-50 border-blue-500'}`}>
            <h3 className="font-semibold text-gray-900 mb-3">
              🏆 Status do Campeonato
            </h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{timesExistentes.length}</div>
                <div className="text-sm text-gray-600">Times Inscritos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{LIMITE_TIMES - timesExistentes.length}</div>
                <div className="text-sm text-gray-600">Vagas de Times</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{estatisticas.totalJogadoresIndividuais}</div>
                <div className="text-sm text-gray-600">Jogadores Individuais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">4-3-3</div>
                <div className="text-sm text-gray-600">Esquema Tático</div>
              </div>
            </div>
          </div>

          {/* Seleção do tipo de inscrição */}
          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-800 mb-3 text-center">Qual o tipo de inscrição?</label>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setTipoInscricao('individual')} 
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${tipoInscricao === 'individual' ? 'bg-violet-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                👤 Individual
              </button>
              <button 
                onClick={() => setTipoInscricao('time')} 
                disabled={!podeAdicionarTime}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${tipoInscricao === 'time' ? 'bg-violet-600 text-white shadow-lg' : podeAdicionarTime ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                ⚽ Time Completo {!podeAdicionarTime && '(Limite atingido)'}
              </button>
            </div>
          </div>

          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg text-center ${submitMessage.includes('sucesso') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {submitMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {tipoInscricao === 'individual' ? (
              <div className="space-y-6">
                {/* Disponibilidade de posições */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">📊 Disponibilidade de Posições</h4>
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    {posicoes.map(posicao => {
                      const vagas = posicoesDisponiveis[posicao] || 0;
                      const disponivel = vagas > 0;
                      return (
                        <div key={posicao} className={`p-3 rounded-lg ${disponivel ? 'border-2 border-green-500 bg-green-50' : 'border-2 border-red-500 bg-red-50'}`}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-800">{posicao}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${disponivel ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                              {vagas} vagas
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Campos do formulário individual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    value={formDataIndividual.nome} 
                    onChange={(e) => handleInputChange(e, 'individual')} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    placeholder="Digite seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
                  <input 
                    type="text" 
                    name="cpf" 
                    value={formDataIndividual.cpf} 
                    onChange={(e) => handleInputChange(e, 'individual')} 
                    required 
                    maxLength="14"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    placeholder="000.000.000-00"
                  />
                  {formDataIndividual.cpf && !validarCPF(formDataIndividual.cpf) && (
                    <p className="text-red-500 text-xs mt-1">CPF inválido</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formDataIndividual.email} 
                    onChange={(e) => handleInputChange(e, 'individual')} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                  <input 
                    type="tel" 
                    name="telefone" 
                    value={formDataIndividual.telefone} 
                    onChange={(e) => handleInputChange(e, 'individual')} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idade *</label>
                  <input 
                    type="number" 
                    name="idade" 
                    value={formDataIndividual.idade} 
                    onChange={(e) => handleInputChange(e, 'individual')} 
                    required 
                    min="14" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    placeholder="18"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Posição *</label>
                  <select 
                    name="posicao" 
                    value={formDataIndividual.posicao} 
                    onChange={(e) => handleInputChange(e, 'individual')} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                  >
                    <option value="">Selecione sua posição</option>
                    {posicoes.map(p => {
                      const vagas = posicoesDisponiveis[p] || 0;
                      const disponivel = vagas > 0;
                      return (
                        <option key={p} value={p} disabled={!disponivel}>
                          {p} {!disponivel ? '(Indisponível)' : `(${vagas} vagas)`}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

            ) : (
              // Formulário de time
              <div className="space-y-8">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-900">
                  <p><b>Esquema Tático 4-3-3:</b> O time deve ter exatamente <b>11 jogadores</b> nas seguintes posições:</p>
                  <ul className="mt-2 text-sm grid md:grid-cols-3 gap-1">
                    {posicoes.map(posicao => (
                      <li key={posicao}>• {esquemaTatico[posicao].quantidade} {posicao}</li>
                    ))}
                  </ul>
                </div>

                {/* Dados do time */}
                <fieldset className="border p-4 rounded-lg space-y-4">
                  <legend className="text-lg font-semibold px-2">Dados do Time</legend>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Time *</label>
                    <input 
                      type="text" 
                      name="nomeTime" 
                      value={formDataTime.nomeTime} 
                      onChange={(e) => handleInputChange(e, 'timeNome')} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Responsável *</label>
                    <input 
                      type="text" 
                      name="nome" 
                      value={formDataTime.responsavel.nome} 
                      onChange={(e) => handleInputChange(e, 'timeResponsavel')} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CPF do Responsável *</label>
                    <input 
                      type="text" 
                      name="cpf" 
                      value={formDataTime.responsavel.cpf} 
                      onChange={(e) => handleInputChange(e, 'timeResponsavel')} 
                      required 
                      maxLength="14"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                      placeholder="000.000.000-00"
                    />
                    {formDataTime.responsavel.cpf && !validarCPF(formDataTime.responsavel.cpf) && (
                      <p className="text-red-500 text-xs mt-1">CPF inválido</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">E-mail do Responsável *</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formDataTime.responsavel.email} 
                      onChange={(e) => handleInputChange(e, 'timeResponsavel')} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefone do Responsável *</label>
                    <input 
                      type="tel" 
                      name="telefone" 
                      value={formDataTime.responsavel.telefone} 
                      onChange={(e) => handleInputChange(e, 'timeResponsavel')} 
                      required 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    />
                  </div>
                </fieldset>

                {/* Adicionar jogadores */}
                <fieldset className="border p-4 rounded-lg">
                  <legend className="text-lg font-semibold px-2">Adicionar Jogadores</legend>
                  <div className="grid md:grid-cols-5 gap-4 items-end">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                      <input 
                        type="text" 
                        name="nome" 
                        value={novoJogador.nome} 
                        onChange={(e) => handleInputChange(e, 'novoJogador')} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                      <input 
                        type="text" 
                        name="cpf" 
                        value={novoJogador.cpf} 
                        onChange={(e) => handleInputChange(e, 'novoJogador')} 
                        maxLength="14"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                      <input 
                        type="number" 
                        name="idade" 
                        value={novoJogador.idade} 
                        onChange={(e) => handleInputChange(e, 'novoJogador')} 
                        min="14"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Posição</label>
                      <select 
                        name="posicao" 
                        value={novoJogador.posicao} 
                        onChange={(e) => handleInputChange(e, 'novoJogador')} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                      >
                        <option value="">Selecione</option>
                        {posicoes.map(p => {
                          const contagemAtual = formDataTime.jogadores.filter(j => j.posicao === p).length;
                          const limite = esquemaTatico[p].quantidade;
                          const disponivel = contagemAtual < limite;
                          
                          return (
                            <option key={p} value={p} disabled={!disponivel}>
                              {p} {!disponivel ? '(Completa)' : `(${contagemAtual}/${limite})`}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <button 
                        type="button" 
                        onClick={handleAdicionarJogador} 
                        disabled={formDataTime.jogadores.length >= JOGADORES_POR_TIME}
                        className="w-full bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>
                  {erros.jogador && <p className="text-red-500 text-sm mt-2">{erros.jogador}</p>}
                </fieldset>

                {/* Lista de jogadores */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">Escalação do Time ({validacaoTime.totalJogadores} / {JOGADORES_POR_TIME})</h3>
                  {formDataTime.jogadores.length > 0 ? (
                    <div className="space-y-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                      {formDataTime.jogadores.map((jogador, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>
                            <b>{jogador.nome}</b> ({jogador.idade} anos) - {jogador.posicao} - CPF: {jogador.cpf}
                          </span>
                          <button 
                            type="button" 
                            onClick={() => handleRemoverJogador(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-700">Nenhum jogador adicionado ainda.</p>
                  )}

                  <div className="mt-4 p-4 rounded-lg bg-gray-50 border">
                    <h4 className="font-semibold mb-2">Status da Escalação</h4>
                    <div className="space-y-1 text-sm">
                      <p className={`${validacaoTime.isQuantidadeCorreta ? 'text-green-600' : 'text-red-600'}`}>
                        {validacaoTime.isQuantidadeCorreta ? '✓' : '✗'} Quantidade de jogadores: {validacaoTime.totalJogadores}/{JOGADORES_POR_TIME}
                      </p>
                      <p className={`${validacaoTime.isEsquemaCorreto ? 'text-green-600' : 'text-red-600'}`}>
                        {validacaoTime.isEsquemaCorreto ? '✓' : '✗'} Esquema tático correto
                      </p>
                      
                      {validacaoTime.posicoesFaltantes.length > 0 && (
                        <p className="text-red-600 text-xs mt-2">
                          <b>Posições faltando:</b> {validacaoTime.posicoesFaltantes.join(', ')}
                        </p>
                      )}
                      
                      {validacaoTime.posicoesExcedentes.length > 0 && (
                        <p className="text-red-600 text-xs mt-2">
                          <b>Posições excedentes:</b> {validacaoTime.posicoesExcedentes.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de envio */}
            <div className="mt-8 border-t pt-6">
              <button
                type="submit"
                className={`w-full bg-purple-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center ${isSubmitting ? 'animate-pulse' : ''}`}
                disabled={
                  isSubmitting || 
                  (tipoInscricao === 'time' && !validacaoTime.podeEnviar) ||
                  (tipoInscricao === 'individual' && formDataIndividual.posicao && !posicaoDisponivelIndividual(formDataIndividual.posicao)) ||
                  (tipoInscricao === 'time' && !podeAdicionarTime)
                }
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-2 border-b-2 border-white rounded-full"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    🚀 Realizar Inscrição
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-purple-600 hover:underline">
              ← Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscricaoPage;