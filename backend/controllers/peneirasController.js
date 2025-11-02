const { readJsonFile, dbPeneirasPath } = require("../lib/dbHelpers");

exports.getPeneiras = async (req, res) => {
    try {
      const data = await readJsonFile(dbPeneirasPath);
      res.status(200).json(data.peneiras || []);
    } catch (error) {
      res.status(500).json({ message: "Erro ao ler o banco de dados de peneiras." });
    }
};
