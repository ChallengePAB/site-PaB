const { readJsonFile, writeJsonFile, dbPromessasPath, dbUsersPath } = require("../lib/dbHelpers");
const jwt = require("jsonwebtoken");

exports.getPromessas = async (req, res) => {
    try {
      const authHeader = req.headers["authorization"];
      let role = null;

      if (authHeader) {
          const token = authHeader.split(" ")[1];
          try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            role = decoded.role;
          } catch (err) {
            role = null;
          }
      }

      const data = await readJsonFile(dbPromessasPath);
      let jogadoras = data.jogadoras || [];

      if (role !== "admin") {
          jogadoras = jogadoras.filter((j) => !j.oculta);
      }

      res.status(200).json(jogadoras);
    } catch (error) {
      res.status(500).json({ message: "Erro ao ler o banco de dados de promessas." });
    }
};

exports.ocultarJogadora = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await readJsonFile(dbPromessasPath);
      const jogadoras = data.jogadoras || [];
      const index = jogadoras.findIndex((j) => j.id == id);
      if (index === -1) {
          return res.status(404).json({ message: "Jogadora não encontrada." });
      }
      jogadoras[index].oculta = true;
      await writeJsonFile(dbPromessasPath, { jogadoras });
      res.json({ message: "Jogadora ocultada com sucesso." });
    } catch (err) {
      res.status(500).json({ message: "Erro ao ocultar jogadora." });
    }
};

exports.desocultarJogadora = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await readJsonFile(dbPromessasPath);
      const jogadoras = data.jogadoras || [];
      const index = jogadoras.findIndex((j) => j.id == id);
      if (index === -1) {
          return res.status(404).json({ message: "Jogadora não encontrada." });
      }
      jogadoras[index].oculta = false;
      await writeJsonFile(dbPromessasPath, { jogadoras });
      res.json({ message: "Jogadora desocultada com sucesso.", jogadora: jogadoras[index] });
    } catch (err) {
      res.status(500).json({ message: "Erro ao desocultar jogadora." });
    }
};

exports.getJogadoraById = async (req, res) => {
    try {
      const { id } = req.params;
      const data = await readJsonFile(dbPromessasPath);
      const jogadora = (data.jogadoras || []).find((j) => j.id == id);
      if (!jogadora) {
          return res.status(404).json({ message: "Jogadora não encontrada." });
      }
      const perfilCompleto = {
          ...jogadora,
          biografia: jogadora.biografia || `Esta é a biografia de ${jogadora.nome}...`,
          youtube: jogadora.youtube || "",
          instagram: jogadora.instagram || "",
          tiktok: jogadora.tiktok || "",
          conteudos: jogadora.conteudos || [],
      };
      res.status(200).json(perfilCompleto);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar perfil da jogadora." });
    }
};

exports.getMyProfile = async (req, res) => {
    try {
      if (req.user.role !== "jogadora") {
          return res.status(403).json({ message: "Apenas jogadoras podem acessar esta rota." });
      }
      const data = await readJsonFile(dbPromessasPath);
      const jogadora = (data.jogadoras || []).find((j) => j.userId == req.user.id);
      if (!jogadora) {
          return res.status(404).json({ message: "Perfil não encontrado." });
      }
      res.status(200).json(jogadora);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar perfil." });
    }
};

exports.updateMyProfile = async (req, res) => {
    try {
      if (req.user.role !== "jogadora") {
          return res.status(403).json({ message: "Apenas jogadoras podem atualizar perfis." });
      }
      const data = await readJsonFile(dbPromessasPath);
      const jogadoras = data.jogadoras || [];
      const index = jogadoras.findIndex((j) => j.userId == req.user.id);
      if (index === -1) {
          return res.status(404).json({ message: "Perfil não encontrado." });
      }
      jogadoras[index] = { ...jogadoras[index], ...req.body };
      await writeJsonFile(dbPromessasPath, { jogadoras });
      res.json({ message: "Perfil atualizado com sucesso!", jogadora: jogadoras[index] });
    } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar perfil." });
    }
};

exports.deleteMyProfile = async (req, res) => {
    try {
      if (req.user.role !== "jogadora") {
          return res.status(403).json({ message: "Apenas jogadoras podem excluir seus próprios perfis." });
      }
      const users = await readJsonFile(dbUsersPath);
      const promessasData = await readJsonFile(dbPromessasPath);
      const userIndex = users.findIndex((u) => u.id === req.user.id);
      if (userIndex === -1) {
          return res.status(404).json({ message: "Usuário não encontrado." });
      }
      users.splice(userIndex, 1);
      const jogadoras = promessasData.jogadoras || [];
      const jogadoraIndex = jogadoras.findIndex((j) => j.userId === req.user.id);
      if (jogadoraIndex !== -1) {
          jogadoras.splice(jogadoraIndex, 1);
      }
      await writeJsonFile(dbUsersPath, users);
      await writeJsonFile(dbPromessasPath, { jogadoras });
      res.json({ message: "Perfil excluído com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir perfil." });
    }
};

exports.deleteJogadoraAsAdmin = async (req, res) => {
    try {
      const { id } = req.params;
      const promessasData = await readJsonFile(dbPromessasPath);
      const users = await readJsonFile(dbUsersPath);
      const jogadoras = promessasData.jogadoras || [];
      const jogadoraIndex = jogadoras.findIndex((j) => j.id == id);
      if (jogadoraIndex === -1) {
          return res.status(404).json({ message: "Jogadora não encontrada." });
      }
      const jogadora = jogadoras[jogadoraIndex];
      jogadoras.splice(jogadoraIndex, 1);
      if (jogadora.userId) {
          const userIndex = users.findIndex((u) => u.id === jogadora.userId);
          if (userIndex !== -1) {
            users.splice(userIndex, 1);
            await writeJsonFile(dbUsersPath, users);
          }
      }
      await writeJsonFile(dbPromessasPath, { jogadoras });
      res.json({ message: "Jogadora excluída com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir jogadora." });
    }
};
