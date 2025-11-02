// Mock Data: Funções que simulam busca no banco de dados 

// Simula a busca do ranking de tags
const getRankingTags = (req, res) => {
    try {
    const mockTags = [
        { nome: "Brasileirão", visualizacoes: 48201 },
        { nome: "Corinthians", visualizacoes: 39500 },
        { nome: "Peneiras", visualizacoes: 21090 },
        { nome: "Transferências", visualizacoes: 15230 },
        { nome: "Seleção Brasileira", visualizacoes: 12100 },
    ];
    res.json(mockTags);
    } catch (error) {
    res.status(500).json({ message: "Erro ao buscar ranking de tags", error: error.message });
    }
};

// Simula a busca de visitantes
const getVisitantes = (req, res) => {
    try {
    const mockVisitantes = {
        ultimos7dias: 35201,
        ultimas4semanas: 140920,
        ultimoMes: 161400,
    };
    res.json(mockVisitantes);
    } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados de visitantes", error: error.message });
    }
};

// Simula a busca do comparativo
const getComparativo = (req, res) => {
  try {
    // Gerando dados falsos para os gráficos
    const generatePeriodData = (total) => {
      let dias = [];
      for (let i = 1; i <= 7; i++) {
        dias.push({ dia: `D${i}`, visitas: Math.floor(Math.random() * (total / 5)) + (total / 10) });
      }
      return dias;
    };

    const totalA = Math.floor(Math.random() * 5000) + 10000; 
    const totalB = Math.floor(Math.random() * 5000) + 12000; 

    const mockData = {
      periodoA: { total: totalA, dias: generatePeriodData(totalA) },
      periodoB: { total: totalB, dias: generatePeriodData(totalB) }
    };
    res.json(mockData);

  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar dados comparativos", error: error.message });
  }
};


module.exports = {
    getRankingTags,
    getVisitantes,
    getComparativo,
};