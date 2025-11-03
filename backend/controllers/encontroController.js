const { readJsonFile, writeJsonFile, dbEncontroPath } = require("../lib/dbHelpers");

// Rota simulada para buscar dados do clima 
exports.getClima = async (req, res) => {
  try {
    // A rota retorna em branco, depois vai ser colocada a API
    res.status(200).json({});
  } catch (error) {
    res.status(500).json({ message: "Erro ao simular dados do clima." });
  }
};

// Rota para buscar dados do encontro
exports.getEncontro = async (req, res) => {
  try {
    const data = await readJsonFile(dbEncontroPath);
    res.status(200).json(data.encontroAtual);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler dados do encontro." });
  }
};

// Rota para atualizar dados do encontro (Protegida)
exports.updateEncontro = async (req, res) => {
  try {
    const data = await readJsonFile(dbEncontroPath);
    const dadosAtualizados = req.body;

    // Mescla os dados antigos com os novos
    data.encontroAtual = { ...data.encontroAtual, ...dadosAtualizados };

    await writeJsonFile(dbEncontroPath, data);
    res.status(200).json(data.encontroAtual);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar encontro." });
  }
};
