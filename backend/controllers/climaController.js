
let latestClima = {
  temp: null,     
  humidity: null,  
  description: "Aguardando dados do sensor...",
  local: "Encontro PaB"
};

/**
 * @route   
 * @desc    
 */
const updateClima = (req, res) => {
  
  const { temperatura, umidade } = req.body;

  if (temperatura === undefined || umidade === undefined) {
    return res.status(400).json({ message: "Dados incompletos. 'temperatura' e 'umidade' são obrigatórios." });
  }

 
  latestClima.temp = temperatura;
  latestClima.humidity = umidade;
  if (temperatura > 35) {
    latestClima.description = "Calor extremo, o jogo terá pausas para hidratação.";
  } else if (temperatura < 15) {
    latestClima.description = "Clima frio.";
  } else {
    latestClima.description = "Temperatura agradável";
  }
  
  console.log("DADOS RECEBIDOS (do Wokwi):", latestClima);

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