import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

const InscricaoPage = () => {
  // Estado principal para controlar o tipo de formulário
  const [tipoInscricao, setTipoInscricao] = useState('individual');

  // Estados para cada tipo de formulário
  const [formDataIndividual, setFormDataIndividual] = useState({ nome: '', email: '', telefone: '', idade: '', posicao: '' });
  const [formDataTime, setFormDataTime] = useState({
    nomeTime: '',
    responsavel: { nome: '', email: '', telefone: '' },
    jogadoras: []
  });
  
  // Estado para a jogadora que está sendo adicionada
  const [novaJogadora, setNovaJogadora] = useState({ nome: '', idade: '', posicao: '' });
  
  // Estados de controle do envio
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [erros, setErros] = useState({});

  const posicoes = ['Goleira', 'Zagueira', 'Lateral Direita', 'Lateral Esquerda', 'Volante', 'Meia', 'Atacante'];
  
  // --- LÓGICA PARA O FORMULÁRIO DE TIME ---

  const handleAdicionarJogadora = () => {
    const { nome, idade, posicao } = novaJogadora;
    if (!nome || !idade || !posicao) {
      setErros({ jogadora: 'Preencha todos os campos da jogadora.' });
      return;
    }
    if (formDataTime.jogadoras.length >= 18) {
      setErros({ jogadora: 'O limite de 18 jogadoras por time foi atingido.' });
      return;
    }
    
    setFormDataTime(prev => ({
      ...prev,
      jogadoras: [...prev.jogadoras, novaJogadora]
    }));
    // Limpa os campos para a próxima jogadora
    setNovaJogadora({ nome: '', idade: '', posicao: '' });
    setErros({});
  };

  const handleRemoverJogadora = (indexToRemove) => {
    setFormDataTime(prev => ({
      ...prev,
      jogadoras: prev.jogadoras.filter((_, index) => index !== indexToRemove)
    }));
  };

  // --- VALIDAÇÃO EM TEMPO REAL PARA O TIME ---
  const validacaoTime = useMemo(() => {
    const totalJogadoras = formDataTime.jogadoras.length;
    const posicoesPreenchidas = new Set(formDataTime.jogadoras.map(j => j.posicao));
    const posicoesFaltantes = posicoes.filter(p => !posicoesPreenchidas.has(p));

    const isMinimoAtingido = totalJogadoras >= 11;
    const isPosicoesOk = posicoesFaltantes.length === 0;

    return {
      totalJogadoras,
      posicoesFaltantes,
      isMinimoAtingido,
      isPosicoesOk,
      podeEnviar: isMinimoAtingido && isPosicoesOk
    };
  }, [formDataTime.jogadoras]);



  const handleInputChange = (e, formType) => {
    const { name, value } = e.target;
    if (formType === 'individual') {
      setFormDataIndividual(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'timeResponsavel') {
      setFormDataTime(prev => ({ ...prev, responsavel: { ...prev.responsavel, [name]: value } }));
    } else if (formType === 'timeNome') {
      setFormDataTime(prev => ({ ...prev, [name]: value }));
    } else if (formType === 'novaJogadora') {
      setNovaJogadora(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');
    setErros({});

    let payload;
    if (tipoInscricao === 'individual') {
      payload = { tipoInscricao, ...formDataIndividual };
    } else {
      if (!validacaoTime.podeEnviar) {
        setSubmitMessage('O formulário do time não atende aos requisitos mínimos.');
        setIsSubmitting(false);
        return;
      }
      payload = { tipoInscricao, ...formDataTime };
    }

    try {
      const response = await fetch('http://localhost:3001/inscricoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Falha no envio.');
      
      setSubmitMessage('Inscrição realizada com sucesso!');
      setFormDataIndividual({ nome: '', email: '', telefone: '', idade: '', posicao: '' });
      setFormDataTime({ nomeTime: '', responsavel: { nome: '', email: '', telefone: '' }, jogadoras: [] });

    } catch (error) {
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
            Formulário de Inscrição
          </h2>

          <div className="mb-8">
            <label className="block text-lg font-medium text-gray-800 mb-3 text-center">Qual o tipo de inscrição?</label>
            <div className="flex justify-center gap-4">
              <button onClick={() => setTipoInscricao('individual')} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${tipoInscricao === 'individual' ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                Individual
              </button>
              <button onClick={() => setTipoInscricao('time')} className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${tipoInscricao === 'time' ? 'bg-violet-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                Time Completo
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
              <div className="space-y-6 animate-fade">
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                  <input type="text" id="nome" name="nome" value={formDataIndividual.nome} onChange={(e) => handleInputChange(e, 'individual')} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" placeholder="Digite seu nome completo"/>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail *</label>
                  <input type="email" id="email" name="email" value={formDataIndividual.email} onChange={(e) => handleInputChange(e, 'individual')} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" placeholder="seu@email.com"/>
                </div>
                <div>
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                  <input type="tel" id="telefone" name="telefone" value={formDataIndividual.telefone} onChange={(e) => handleInputChange(e, 'individual')} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" placeholder="(11) 99999-9999"/>
                </div>
                <div>
                  <label htmlFor="idade" className="block text-sm font-medium text-gray-700 mb-2">Idade *</label>
                  <input type="number" id="idade" name="idade" value={formDataIndividual.idade} onChange={(e) => handleInputChange(e, 'individual')} required min="14" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" placeholder="18"/>
                </div>
                <div>
                  <label htmlFor="posicao" className="block text-sm font-medium text-gray-700 mb-2">Posição *</label>
                  <select id="posicao" name="posicao" value={formDataIndividual.posicao} onChange={(e) => handleInputChange(e, 'individual')} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent">
                    <option value="">Selecione sua posição</option>
                    {posicoes.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

            ) : (
              <div className="space-y-8 animate-fade">
                <div className="p-4 bg-gray-200 border-l-4 border-gray-400 text-violet-900">
                  <p><b>Atenção:</b> A inscrição de time permite até <b>18 jogadoras</b>. Para que a inscrição seja válida, é necessário cadastrar no mínimo <b>11 jogadoras</b> e preencher todas as posições principais (Goleira, Zagueira, etc.).</p>
                </div>
                <fieldset className="border p-4 rounded-lg space-y-4">
                  <legend className="text-lg font-semibold px-2">Dados do Time</legend>
                  <div>
                    <label htmlFor="nomeTime" className="block text-sm font-medium text-gray-700 mb-2">Nome do Time *</label>
                    <input type="text" id="nomeTime" name="nomeTime" value={formDataTime.nomeTime} onChange={(e) => handleInputChange(e, 'timeNome')} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="nomeResponsavel" className="block text-sm font-medium text-gray-700 mb-2">Nome do Responsável *</label>
                    <input type="text" id="nomeResponsavel" name="nome" value={formDataTime.responsavel.nome} onChange={(e) => handleInputChange(e, 'timeResponsavel')} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="emailResponsavel" className="block text-sm font-medium text-gray-700 mb-2">E-mail do Responsável *</label>
                    <input type="email" id="emailResponsavel" name="email" value={formDataTime.responsavel.email} onChange={(e) => handleInputChange(e, 'timeResponsavel')} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
                  </div>
                   <div>
                    <label htmlFor="telefoneResponsavel" className="block text-sm font-medium text-gray-700 mb-2">Telefone do Responsável *</label>
                    <input type="tel" id="telefoneResponsavel" name="telefone" value={formDataTime.responsavel.telefone} onChange={(e) => handleInputChange(e, 'timeResponsavel')} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent" />
                  </div>
                </fieldset>
                <fieldset className="border p-4 rounded-lg">
                  <legend className="text-lg font-semibold px-2">Adicionar Jogadoras</legend>
                  <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label htmlFor="nomeJogadora" className="block text-sm font-medium text-gray-700 mb-2">Nome da Jogadora</label>
                      <input type="text" name="nome" value={novaJogadora.nome} onChange={(e) => handleInputChange(e, 'novaJogadora')} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"/>
                    </div>
                    <div>
                      <label htmlFor="idadeJogadora" className="block text-sm font-medium text-gray-700 mb-2">Idade</label>
                      <input type="number" name="idade" value={novaJogadora.idade} onChange={(e) => handleInputChange(e, 'novaJogadora')} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent"/>
                    </div>
                    <div>
                      <label htmlFor="posicaoJogadora" className="block text-sm font-medium text-gray-700 mb-2">Posição</label>
                      <select name="posicao" value={novaJogadora.posicao} onChange={(e) => handleInputChange(e, 'novaJogadora')} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent">
                        <option value="">Selecione</option>
                        {posicoes.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="text-right mt-4">
                    <button type="button" onClick={handleAdicionarJogadora} className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-900">
                      Adicionar Jogadora
                    </button>
                    {erros.jogadora && <p className="text-red-500 text-sm mt-2">{erros.jogadora}</p>}
                  </div>
                </fieldset>
                <div>
                    <h3 className="text-lg font-semibold mb-2">Time ({validacaoTime.totalJogadoras} / 18)</h3>
                    {formDataTime.jogadoras.length > 0 ? (
                      <ul className="space-y-2 border rounded-lg p-4 max-h-60 overflow-y-auto">
                        {formDataTime.jogadoras.map((jogadora, index) => (
                          <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <span><b>{jogadora.nome}</b> ({jogadora.idade} anos) - {jogadora.posicao}</span>
                            <button type="button" onClick={() => handleRemoverJogadora(index)} className="text-red-500 hover:text-red-700">Remover</button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-700">Nenhuma jogadora adicionada ainda.</p>
                    )}
                    <div className="mt-4 p-4 rounded-lg bg-gray-200">
                        <p className={`font-semibold ${validacaoTime.isMinimoAtingido ? 'text-green-600' : 'text-violet-900'}`}>
                          {validacaoTime.isMinimoAtingido ? `✓ Mínimo de 11 jogadoras atingido (${validacaoTime.totalJogadoras})` : `✗ Mínimo de 11 jogadoras (${validacaoTime.totalJogadoras} de 11)`}
                        </p>
                        <p className={`font-semibold ${validacaoTime.isPosicoesOk ? 'text-green-600' : 'text-violet-900'}`}>
                          {validacaoTime.isPosicoesOk ? '✓ Todas as posições principais foram preenchidas.' : '✗ Faltam posições para serem preenchidas.'}
                        </p>
                        {validacaoTime.posicoesFaltantes.length > 0 && (
                          <p className="text-sm text-violet-900 mt-2"><b>Posições faltando:</b> {validacaoTime.posicoesFaltantes.join(', ')}</p>
                        )}
                    </div>
                </div>
              </div>
            )}
            <div className="mt-8 border-t pt-6">
              <button
                type="submit"
                className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-violet-600 disabled:cursor-not-allowed"
                disabled={isSubmitting || (tipoInscricao === 'time' && !validacaoTime.podeEnviar)}
              >
                {isSubmitting ? 'Enviando...' : 'Realizar Inscrição'}
              </button>
            </div>
          </form>

          <div className="text-center mt-6">
            <Link to="/" className="text-sm text-purple-600 hover:underline">
              &larr; Voltar para a página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InscricaoPage;