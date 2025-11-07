import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';

const InscricaoPage = () => {
  const [tipoInscricao, setTipoInscricao] = useState('individual');
  const [formDataIndividual, setFormDataIndividual] = useState({ 
    nome: '', email: '', telefone: '', idade: '', cpf: '' 
  });
  const [formDataTime, setFormDataTime] = useState({
    nomeTime: '',
    responsavel: { nome: '', email: '', telefone: '', cpf: '' },
    jogadores: []
  });
  const [novoJogador, setNovoJogador] = useState({ 
    nome: '', idade: '', cpf: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [erros, setErros] = useState({});
  const [timesExistentes, setTimesExistentes] = useState([]);
  const [estatisticas, setEstatisticas] = useState({
    totalTimes: 0,
    totalJogadoresIndividuais: 0
  });

  const LIMITE_TIMES = 8;
  const MIN_JOGADORES_POR_TIME = 11;
  const MAX_JOGADORES_POR_TIME = 18;

  // Validação de CPF desligada 
  {/*const validarCPF = (cpf) => {
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
  };*/}

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
        totalJogadoresIndividuais: 0
      };
      
      // Atualizar estados
      setTimesExistentes(times);
      setEstatisticas(estatisticasData);
      
    } catch (error) {
      console.error('Erro ao carregar dados existentes:', error);
    }
  };

  const validacaoTime = useMemo(() => {
    const totalJogadores = formDataTime.jogadores.length;
    
    const isQuantidadeCorreta = totalJogadores >= MIN_JOGADORES_POR_TIME && totalJogadores <= MAX_JOGADORES_POR_TIME;

    return {
      totalJogadores,
      isQuantidadeCorreta,
      podeEnviar: isQuantidadeCorreta
    };
  }, [formDataTime.jogadores]);

  const podeAdicionarTime = timesExistentes.length < LIMITE_TIMES;

  const handleAdicionarJogador = () => {
    const { nome, idade, cpf } = novoJogador;
    
    if (!nome || !idade || !cpf) {
      setErros({ jogador: 'Preencha todos os campos do jogador.' });
      return;
    }

{/*    if (!validarCPF(cpf)) {
      setErros({ jogador: 'CPF inválido. Verifique os dígitos.' });
      return;
    }  */}     

    if (cpfJaExiste(cpf)) {
      setErros({ jogador: 'Este CPF já foi cadastrado neste time.' });
      return;
    }

    if (formDataTime.jogadores.length >= MAX_JOGADORES_POR_TIME) {
      setErros({ jogador: `O limite de ${MAX_JOGADORES_POR_TIME} jogadoras por time foi atingido.` });
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
    
    setNovoJogador({ nome: '', idade: '', cpf: '' });
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
          totalJogadoresIndividuais: 0
        };
      }

      if (tipoOperacao === 'adicionar') {
        if (novaInscricao.tipoInscricao === 'individual') {
          estatisticasAtuais.totalJogadoresIndividuais++;
        } else if (novaInscricao.tipoInscricao === 'time') {
          estatisticasAtuais.totalTimes++;
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
      {/*if (!validarCPF(formDataIndividual.cpf)) {
        setSubmitMessage('CPF inválido. Verifique os dígitos.');
        setIsSubmitting(false);
        return;
      }
    } else {
      if (!validarCPF(formDataTime.responsavel.cpf)) {
        setSubmitMessage('CPF do responsável inválido. Verifique os dígitos.');
        setIsSubmitting(false);
        return;
      }*/}
      
      if (!podeAdicionarTime) {
        setSubmitMessage(`Limite de ${LIMITE_TIMES} times atingido. Não é possível adicionar mais times.`);
        setIsSubmitting(false);
        return;
      }
      
      if (!validacaoTime.podeEnviar) {
        setSubmitMessage(`O time deve ter entre ${MIN_JOGADORES_POR_TIME} e ${MAX_JOGADORES_POR_TIME} jogadoras.`);
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
      setFormDataIndividual({ nome: '', email: '', telefone: '', idade: '', cpf: '' });
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
            <div className="grid md:grid-cols-3 gap-4">
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
                <div className="text-sm text-gray-600">Jogadoras Individuais</div>
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
              // Formulário individual
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                  <input 
                    type="text" 
                    name="nome" 
                    value={formDataIndividual.nome} 
                    onChange={(e) => handleInputChange(e, 'individual')} 
                    required 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"
                    placeholder="Seu nome completo"
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
                  {/*{formDataIndividual.cpf && !validarCPF(formDataIndividual.cpf) && (
                    <p className="text-red-500 text-xs mt-1">CPF inválido</p>
                  )}*/}
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
              </div>

            ) : (
              // Formulário de time
              <div className="space-y-8">
                <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-900">
                  <p><b>Requisitos do Time:</b> O time deve ter entre <b>{MIN_JOGADORES_POR_TIME} e {MAX_JOGADORES_POR_TIME} jogadoras</b>.</p>
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
                    {/*{formDataTime.responsavel.cpf && !validarCPF(formDataTime.responsavel.cpf) && (
                      <p className="text-red-500 text-xs mt-1">CPF inválido</p>
                    )}*/}
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
                  <legend className="text-lg font-semibold px-2">Adicionar Jogadoras</legend>
                  <div className="grid md:grid-cols-4 gap-4 items-end">
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
                      <button 
                        type="button" 
                        onClick={handleAdicionarJogador} 
                        disabled={formDataTime.jogadores.length >= MAX_JOGADORES_POR_TIME}
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
                  <h3 className="text-lg font-semibold mb-2">Escalação do Time ({validacaoTime.totalJogadores} / {MIN_JOGADORES_POR_TIME}-{MAX_JOGADORES_POR_TIME})</h3>
                  {formDataTime.jogadores.length > 0 ? (
                    <div className="space-y-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                      {formDataTime.jogadores.map((jogador, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <span>
                            <b>{jogador.nome}</b> ({jogador.idade} anos) - CPF: {jogador.cpf}
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
                    <p className="text-gray-700">Nenhuma jogadora adicionada ainda.</p>
                  )}

                  <div className="mt-4 p-4 rounded-lg bg-gray-50 border">
                    <h4 className="font-semibold mb-2">Status da Escalação</h4>
                    <div className="space-y-1 text-sm">
                      <p className={`${validacaoTime.isQuantidadeCorreta ? 'text-green-600' : 'text-red-600'}`}>
                        {validacaoTime.isQuantidadeCorreta ? '✓' : '✗'} Quantidade de jogadoras: {validacaoTime.totalJogadores} ({MIN_JOGADORES_POR_TIME}-{MAX_JOGADORES_POR_TIME} necessárias)
                      </p>
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