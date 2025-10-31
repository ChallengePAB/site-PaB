require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Caminhos para arquivos JSON
const dbPath = path.join(__dirname, "db.json"); 
const dbUsersPath = path.join(__dirname, "users.json");
const dbPeneirasPath = path.join(__dirname, "peneiras.json");
const dbPromessasPath = path.join(__dirname, "promessas.json");
const dbNoticiasPath = path.join(__dirname, "noticias.json");

const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      if (filePath.includes("users.json")) return [];
      if (filePath.includes("db.json")) {
        // Estrutura inicial para db.json
        return {
          times: [],
          jogadoresIndividuais: [],
          estatisticas: [
            {
              id: 1,
              totalTimes: 0,
              totalJogadoresIndividuais: 0,
              posicoesOcupadas: {
                Goleiro: 0,
                Zagueiro: 0,
                "Lateral Esquerdo": 0,
                "Lateral Direito": 0,
                Volante: 0,
                "Meio-campista": 0,
                Atacante: 0,
              },
            },
          ],
        };
      }
      return {};
    }
    throw error;
  }
};

const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// ---------------- MIDDLEWARES ----------------
const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Token não fornecido." });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token inválido." });
  }
};

const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Acesso negado. Apenas admins podem realizar esta ação." });
  }
  next();
};

// ---------------- ROTAS DE NOTÍCIAS ----------------
// Rota para LISTAR todas as notícias
app.get('/api/news', async (req, res) => {
  try {
    const data = await readJsonFile(dbNoticiasPath);
    const allNews = [];
    if (data.noticiaPrincipal) {
      allNews.push(data.noticiaPrincipal);
    }
    allNews.push(...(data.noticiasSecundarias || []));
    res.status(200).json(allNews);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de notícias.' });
  }
});

// Rota para OBTER UMA notícia pelo ID
app.get('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJsonFile(dbNoticiasPath);
    let noticia = null;
    if (data.noticiaPrincipal && data.noticiaPrincipal.id == id) {
      noticia = data.noticiaPrincipal;
    } else {
      noticia = data.noticiasSecundarias.find(n => n.id == id);
    }
    if (noticia) {
      res.status(200).json(noticia);
    } else {
      res.status(404).json({ message: 'Notícia não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de notícias.' });
  }
});

// Rota para CRIAR uma nova notícia
app.post('/api/news', async (req, res) => {
  try {
    const noticiaData = req.body;
    const data = await readJsonFile(dbNoticiasPath);
    
    // Gera um novo ID simples (você já tem uma função assim no seu Python)
    const allIds = [data.noticiaPrincipal?.id || 0, ...data.noticiasSecundarias.map(n => n.id)];
    const newId = Math.max(...allIds) + 1;
    
    const newNoticia = { id: newId, ...noticiaData };
    data.noticiasSecundarias.push(newNoticia);
    await writeJsonFile(dbNoticiasPath, data);
    res.status(201).json(newNoticia);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar notícia.' });
  }
});

// Rota para ATUALIZAR uma notícia
app.put('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const noticiaData = req.body;
    const data = await readJsonFile(dbNoticiasPath);
    let updated = false;

    if (data.noticiaPrincipal && data.noticiaPrincipal.id == id) {
      data.noticiaPrincipal = { ...data.noticiaPrincipal, ...noticiaData, id: parseInt(id) };
      updated = true;
    } else {
      const index = data.noticiasSecundarias.findIndex(n => n.id == id);
      if (index !== -1) {
        data.noticiasSecundarias[index] = { ...data.noticiasSecundarias[index], ...noticiaData, id: parseInt(id) };
        updated = true;
      }
    }

    if (updated) {
      await writeJsonFile(dbNoticiasPath, data);
      res.status(200).json({ ...noticiaData, id: parseInt(id) });
    } else {
      res.status(404).json({ message: 'Notícia não encontrada para atualizar.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar notícia.' });
  }
});

// Rota para DELETAR uma notícia
app.delete('/api/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJsonFile(dbNoticiasPath);
    
    if (data.noticiaPrincipal && data.noticiaPrincipal.id == id) {
      return res.status(400).json({ message: 'Não é permitido deletar a notícia principal.' });
    }
    
    const initialLength = data.noticiasSecundarias.length;
    data.noticiasSecundarias = data.noticiasSecundarias.filter(n => n.id != id);
    
    if (data.noticiasSecundarias.length < initialLength) {
      await writeJsonFile(dbNoticiasPath, data);
      res.status(204).send(); // 204 = No Content (sucesso, sem corpo)
    } else {
      res.status(404).json({ message: 'Notícia não encontrada para deletar.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar notícia.' });
  }
});

// ---------------- ROTAS DE PENEIRAS ----------------
app.get("/peneiras", async (req, res) => {
  try {
    const data = await readJsonFile(dbPeneirasPath);
    res.status(200).json(data.peneiras || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler o banco de dados de peneiras." });
  }
});

// ---------------- ROTAS DE PROMESSAS ----------------
app.get("/jogadoras/promessas", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    let role = null;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        role = decoded.role;
      } catch (err) {
        role = null; // token inválido
      }
    }

    const data = await readJsonFile(dbPromessasPath);
    let jogadoras = data.jogadoras || [];

    // Se não for admin, filtra jogadoras ocultas
    if (role !== "admin") {
      jogadoras = jogadoras.filter((j) => !j.oculta);
    }

    res.status(200).json(jogadoras);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler o banco de dados de promessas." });
  }
});

// ---------------- ROTA PARA OCULTAR JOGADORA (ADMIN) ----------------
app.post(
  "/jogadoras/:id/ocultar",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
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
  }
);

// ---------------- ROTA PARA DESOCULTAR JOGADORA (ADMIN) ----------------
app.post(
  "/jogadoras/:id/desocultar",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
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

      // Retorna a jogadora desocultada
      res.json({ message: "Jogadora desocultada com sucesso.", jogadora: jogadoras[index] });
    } catch (err) {
      res.status(500).json({ message: "Erro ao desocultar jogadora." });
    }
  }
);

// ---------------- PERFIL DA JOGADORA ----------------
app.get("/jogadoras/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJsonFile(dbPromessasPath);
    const jogadora = (data.jogadoras || []).find((j) => j.id == id);

    if (!jogadora) {
      return res.status(404).json({ message: "Jogadora não encontrada." });
    }

    const perfilCompleto = {
      ...jogadora,
      biografia: jogadora.biografia ||
        `Esta é a biografia de ${jogadora.nome}, jogadora de destaque no ${jogadora.clube_atual || "seu clube atual"}.`,
      youtube: jogadora.youtube || "",
      instagram: jogadora.instagram || "",
      tiktok: jogadora.tiktok || "",
      conteudos: jogadora.conteudos || [],
    };

    res.status(200).json(perfilCompleto);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar perfil da jogadora." });
  }
});

// ---------------- OBTER PERFIL DA JOGADORA LOGADA ----------------
app.get("/perfil/meu", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jogadora") {
      return res
        .status(403)
        .json({ message: "Apenas jogadoras podem acessar esta rota." });
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
});

// ---------------- ATUALIZAR PERFIL DA JOGADORA ----------------
app.put("/perfil/atualizar", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jogadora") {
      return res
        .status(403)
        .json({ message: "Apenas jogadoras podem atualizar perfis." });
    }

    const {
      nome,
      idade,
      altura,
      pe_dominante,
      clube_atual,
      posicao,
      foto,
      biografia,
      youtube,
      instagram,
      tiktok,
      conteudos,
      oculta,
    } = req.body;

    const data = await readJsonFile(dbPromessasPath);
    const jogadoras = data.jogadoras || [];
    const index = jogadoras.findIndex((j) => j.userId == req.user.id);

    if (index === -1) {
      return res.status(404).json({ message: "Perfil não encontrado." });
    }

    // Atualiza os campos
    jogadoras[index] = {
      ...jogadoras[index],
      nome: nome || jogadoras[index].nome,
      idade: idade !== undefined ? idade : jogadoras[index].idade,
      altura: altura || jogadoras[index].altura,
      pe_dominante: pe_dominante || jogadoras[index].pe_dominante,
      clube_atual: clube_atual || jogadoras[index].clube_atual,
      posicao: posicao || jogadoras[index].posicao,
      foto: foto !== undefined ? foto : jogadoras[index].foto,
      biografia: biografia !== undefined ? biografia : jogadoras[index].biografia,
      youtube: youtube !== undefined ? youtube : jogadoras[index].youtube,
      instagram: instagram !== undefined ? instagram : jogadoras[index].instagram,
      tiktok: tiktok !== undefined ? tiktok : jogadoras[index].tiktok,
      conteudos: oculta !== undefined ? conteudos : jogadoras[index].conteudos,
      oculta: oculta !== undefined ? oculta : jogadoras[index].oculta,
    };

    await writeJsonFile(dbPromessasPath, { jogadoras });

    res.json({ message: "Perfil atualizado com sucesso!", jogadora: jogadoras[index] });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar perfil." });
  }
});

// ---------------- EXCLUIR PERFIL DA JOGADORA ----------------
app.delete("/perfil/excluir", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "jogadora") {
      return res
        .status(403)
        .json({ message: "Apenas jogadoras podem excluir seus próprios perfis." });
    }

    const users = await readJsonFile(dbUsersPath);
    const promessasData = await readJsonFile(dbPromessasPath);

    // Remover usuário
    const userIndex = users.findIndex((u) => u.id === req.user.id);
    if (userIndex === -1) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    users.splice(userIndex, 1);

    // Remover perfil da jogadora
    const jogadoras = promessasData.jogadoras || [];
    const jogadoraIndex = jogadoras.findIndex((j) => j.userId === req.user.id);
    if (jogadoraIndex !== -1) {
      jogadoras.splice(jogadoraIndex, 1);
    }

    // Salvar alterações
    await writeJsonFile(dbUsersPath, users);
    await writeJsonFile(dbPromessasPath, { jogadoras });

    res.json({ message: "Perfil excluído com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir perfil." });
  }
});

// ---------------- EXCLUIR PERFIL DE JOGADORA (ADMIN) ----------------
app.delete(
  "/jogadoras/:id/excluir",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
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

      // Remover perfil da jogadora
      jogadoras.splice(jogadoraIndex, 1);

      // Remover usuário associado (se existir)
      if (jogadora.userId) {
        const userIndex = users.findIndex((u) => u.id === jogadora.userId);
        if (userIndex !== -1) {
          users.splice(userIndex, 1);
          await writeJsonFile(dbUsersPath, users);
        }
      }

      // Salvar alterações
      await writeJsonFile(dbPromessasPath, { jogadoras });

      res.json({ message: "Jogadora excluída com sucesso!" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao excluir jogadora." });
    }
  }
);

// ---------------- ROTAS DE INSCRIÇÕES ----------------

// Rota para obter todos os dados do db.json (para o frontend carregar tudo de uma vez)
app.get("/db", async (req, res) => {
  try {
    const data = await readJsonFile(dbPath);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler o banco de dados principal." });
  }
});

// Rota para obter times
app.get("/times", async (req, res) => {
  try {
    const db = await readJsonFile(dbPath);
    res.status(200).json(db.times || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler os times." });
  }
});

// Rota para adicionar um novo time
app.post("/times", async (req, res) => {
  try {
    const novoTime = req.body;
    const db = await readJsonFile(dbPath);
    db.times.push(novoTime);
    await writeJsonFile(dbPath, db);
    res.status(201).json(novoTime);
  } catch (error) {
    res.status(500).json({ message: "Erro ao adicionar time." });
  }
});

// Rota para obter jogadores individuais
app.get("/jogadoresIndividuais", async (req, res) => {
  try {
    const db = await readJsonFile(dbPath);
    res.status(200).json(db.jogadoresIndividuais || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler jogadores individuais." });
  }
});

// Rota para adicionar um novo jogador individual
app.post("/jogadoresIndividuais", async (req, res) => {
  try {
    console.log("📥 Recebendo inscrição individual:", JSON.stringify(req.body, null, 2));
    const novoJogador = req.body;
    const db = await readJsonFile(dbPath);
    db.jogadoresIndividuais.push(novoJogador);
    await writeJsonFile(dbPath, db);
    console.log("✅ Inscrição individual salva com sucesso!");
    res.status(201).json(novoJogador);
  } catch (error) {
    console.error("❌ Erro ao salvar inscrição individual:", error);
    res.status(500).json({ message: "Erro ao adicionar jogador individual." });
  }
});

// Rota para obter estatísticas
app.get("/estatisticas", async (req, res) => {
  try {
    const db = await readJsonFile(dbPath);
    // Retorna o array de estatísticas, o frontend pegará o primeiro elemento
    res.status(200).json(db.estatisticas || []);
  } catch (error) {
    res.status(500).json({ message: "Erro ao ler estatísticas." });
  }
});

// Rota para atualizar estatísticas (PUT para substituir, PATCH para atualizar parcialmente)
app.put("/estatisticas/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const novasEstatisticas = req.body;
    const db = await readJsonFile(dbPath);

    const index = db.estatisticas.findIndex((s) => s.id == id);
    if (index !== -1) {
      db.estatisticas[index] = { ...db.estatisticas[index], ...novasEstatisticas };
    } else {
      // Se não encontrar, adiciona (caso seja o primeiro PUT)
      db.estatisticas.push({ id: parseInt(id), ...novasEstatisticas });
    }
    await writeJsonFile(dbPath, db);
    res.status(200).json(db.estatisticas[index] || novasEstatisticas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar estatísticas." });
  }
});

// Rota para criar estatísticas (caso não existam)
app.post("/estatisticas", async (req, res) => {
  try {
    const novasEstatisticas = req.body;
    const db = await readJsonFile(dbPath);
    if (!db.estatisticas) {
      db.estatisticas = [];
    }
    db.estatisticas.push({ id: 1, ...novasEstatisticas }); // Garante que o ID seja 1
    await writeJsonFile(dbPath, db);
    res.status(201).json(novasEstatisticas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar estatísticas." });
  }
});

// ---------------- ROTAS DE AUTENTICAÇÃO ----------------
app.post("/auth/register", async (req, res) => {
  try {
    const {
      nome,
      email,
      password,
      role,
      idade,
      altura,
      pe_dominante,
      clube_atual,
      posicao,
    } = req.body;
    const users = await readJsonFile(dbUsersPath);

    if (users.find((user) => user.email === email)) {
      return res.status(400).json({ message: "Este e-mail já está em uso." });
    }

    // Validações para jogadoras
    if (role === "jogadora") {
      if (!idade || !altura || !pe_dominante || !clube_atual || !posicao) {
        return res
          .status(400)
          .json({ message: "Jogadoras devem preencher todos os campos do perfil." });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now(),
      nome,
      email,
      password: hashedPassword,
      role: role || "jogadora",
    };

    users.push(newUser);
    await writeJsonFile(dbUsersPath, users);

    // Se for jogadora, criar perfil no promessas.json
    if (role === "jogadora") {
      const promessasData = await readJsonFile(dbPromessasPath);
      const jogadoras = promessasData.jogadoras || [];

      // Gerar novo ID para a jogadora
      const maxId = jogadoras.length > 0 ? Math.max(...jogadoras.map((j) => j.id)) : 0;
      const newJogadoraId = maxId + 1;

      const novaJogadora = {
        id: newJogadoraId,
        userId: newUser.id,
        nome,
        idade: parseInt(idade),
        altura,
        pe_dominante,
        clube_atual,
        posicao,
        foto: null,
        biografia: "",
        youtube: "",
        instagram: "",
        tiktok: "",
        conteudos: [],
        oculta: false,
      };

      jogadoras.push(novaJogadora);
      await writeJsonFile(dbPromessasPath, { jogadoras });
    }

    res.status(201).json({ message: "Usuário criado com sucesso!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro no servidor." });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJsonFile(dbUsersPath);
    const user = users.find((u) => u.email === email);

    if (!user) {
      return res.status(400).json({ message: "Credenciais inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciais inválidas." });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Se for jogadora, retornar também o ID do perfil
    let jogadoraId = null;
    if (user.role === "jogadora") {
      const promessasData = await readJsonFile(dbPromessasPath);
      const jogadora = (promessasData.jogadoras || []).find(
        (j) => j.userId === user.id
      );
      if (jogadora) {
        jogadoraId = jogadora.id;
      }
    }

    res.json({ token, role: user.role, userId: user.id, jogadoraId });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor." });
  }
});

// ---------------- INICIAR SERVIDOR ----------------
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});
