const { readJsonFile, writeJsonFile, dbCopaPath } = require("../lib/dbHelpers");

// ROTA NOVA: Buscar dados da Copa
exports.getCopa = async (req, res) => {
  try {
    const data = await readJsonFile(dbCopaPath);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler dados da copa." });
  }
};

// ROTA NOVA: Atualizar dados da Copa (Protegida)
exports.updateCopa = async (req, res) => {
  try {
    const dadosAtualizados = req.body;
    await writeJsonFile(dbCopaPath, dadosAtualizados);
    res.status(200).json(dadosAtualizados);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar copa." });
  }
};
