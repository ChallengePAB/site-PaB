const { readJsonFile, writeJsonFile, dbPath } = require("../lib/dbHelpers");

exports.getDb = async (req, res) => {
  try {
    const data = await readJsonFile(dbPath);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler o banco de dados principal." });
  }
};

exports.getTimes = async (req, res) => {
  try {
    const db = await readJsonFile(dbPath);
    res.status(200).json(db.times || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler os times." });
  }
};

exports.addTime = async (req, res) => {
  try {
    const novoTime = req.body;
    const db = await readJsonFile(dbPath);
    db.times.push(novoTime);
    await writeJsonFile(dbPath, db);
    res.status(201).json(novoTime);
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar time." });
  }
};

exports.getJogadoresIndividuais = async (req, res) => {
  try {
    const db = await readJsonFile(dbPath);
    res.status(200).json(db.jogadoresIndividuais || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler jogadores individuais." });
  }
};

exports.addJogadorIndividual = async (req, res) => {
  try {
    const novoJogador = req.body;
    const db = await readJsonFile(dbPath);
    db.jogadoresIndividuais.push(novoJogador);
    await writeJsonFile(dbPath, db);
    res.status(201).json(novoJogador);
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar jogador individual." });
  }
};

exports.getEstatisticas = async (req, res) => {
  try {
    const db = await readJsonFile(dbPath);
    res.status(200).json(db.estatisticas || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler estatísticas." });
  }
};

exports.updateEstatisticas = async (req, res) => {
  try {
    const { id } = req.params;
    const novasEstatisticas = req.body;
    const db = await readJsonFile(dbPath);
    const index = db.estatisticas.findIndex((s) => s.id == id);
    if (index !== -1) {
      db.estatisticas[index] = { ...db.estatisticas[index], ...novasEstatisticas };
    } else {
      db.estatisticas.push({ id: parseInt(id), ...novasEstatisticas });
    }
    await writeJsonFile(dbPath, db);
    res.status(200).json(db.estatisticas[index] || novasEstatisticas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar estatísticas." });
  }
};

exports.createEstatisticas = async (req, res) => {
  try {
    const novasEstatisticas = req.body;
    const db = await readJsonFile(dbPath);
    if (!db.estatisticas) {
      db.estatisticas = [];
    }
    db.estatisticas.push({ id: 1, ...novasEstatisticas });
    await writeJsonFile(dbPath, db);
    res.status(201).json(novasEstatisticas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar estatísticas." });
  }
};
