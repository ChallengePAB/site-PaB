const { readJsonFile, writeJsonFile, dbEncontroPath, dbPath } = require("../lib/dbHelpers");

// Rota para buscar dados do clima (simulada)
exports.getClima = async (req, res) => {
  try {
    // Retorna em branco, depois será colocada a API
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: "Erro ao simular dados do clima." });
  }
};

// --- LÓGICA DOS ENCONTROS ---
exports.getEncontro = async (req, res) => {
  try {
    const data = await readJsonFile(dbEncontroPath);
    const dbData = await readJsonFile(dbPath);
    
    res.status(200).json({
      ...data, 
      totalTimes: dbData.times.length,
      totalJogadoresIndividuais: dbData.jogadoresIndividuais.length
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler dados do encontro." });
  }
};

exports.updateEncontro = async (req, res) => {
  try {
    const dadosAtualizados = req.body;
    // Escreve os dados atualizados no encontro.json
    await writeJsonFile(dbEncontroPath, dadosAtualizados);
    res.status(200).json(dadosAtualizados);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar encontro." });
  }
};

