/**
 * Este arquivo funciona como um "mini banco de dados" na memória.
 * Ele armazena o último dado recebido do ESP32.
 */

let latestClima = {
  temp: null,      // Começa como nulo
  humidity: null,  // Começa como nulo
  description: "Aguardando dados do sensor...",
  local: "Encontro PaB"
};

/**
 * @route   POST /api/clima/update
 * @desc    Recebe dados temperatura, umidade do ESP32/Wokwi
 */
const updateClima = (req, res) => {
  const { temperatura, umidade } = req.body;

  if (temperatura === undefined || umidade === undefined) {
    return res.status(400).json({ message: "Dados incompletos. 'temperatura' e 'umidade' são obrigatórios." });
  }

  // Atualiza os dados na memória
  latestClima.temp = temperatura;
  latestClima.humidity = umidade;
  
  // Teste de frases
  if (temperatura > 35) {
    latestClima.description = "Calor extremo!";
  } else if (temperatura < 15) {
    latestClima.description = "Clima frio.";
  } else {
    latestClima.description = "Temperatura agradável";
  }
  
  console.log("DADOS RECEBIDOS (do ESP32):", latestClima);

  // Responde ao ESP32 com sucesso
  res.status(200).json({ message: "Dados recebidos com sucesso!" });
};

/**
 * @route   
 * @desc    
 */
const getClima = (req, res) => {
  console.log("DADOS ENVIADOS (para o React):", latestClima);
  res.status(200).json(latestClima);
};

module.exports = {
  updateClima,
  getClima
};