const { readJsonFile, writeJsonFile, dbCopaPath, dbPath } = require("../lib/dbHelpers");

//LÓGICA DA COPA
exports.getCopa = async (req, res) => {
  try {
    const data = await readJsonFile(dbCopaPath);
    const dbData = await readJsonFile(dbPath);

    res.status(200).json({
      ...data, 
      totalTimes: dbData.times.length,
      totalJogadoresIndividuais: dbData.jogadoresIndividuais.length
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler dados da copa." });
  }
};

exports.updateCopa = async (req, res) => {
  try {
    const dadosAtualizados = req.body;
    await writeJsonFile(dbCopaPath, dadosAtualizados);
    res.status(200).json(dadosAtualizados);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar copa." });
  }
};

