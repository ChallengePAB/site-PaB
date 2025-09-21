// 1. Importar os módulos necessários
require('dotenv').config(); // Lembre-se de ter o arquivo .env
const express = require('express');
const cors = require('cors');
const fs = require('fs/promises'); // Usando a versão de Promises para consistência
const path = require('path');
const bcrypt = require('bcryptjs'); // Para criptografar senhas
const jwt = require('jsonwebtoken'); // Para criar tokens de autenticação


// 2. Inicializar o aplicativo Express
const app = express();
const PORT = 3001;

// 3. Configurar os Middlewares
app.use(cors());
app.use(express.json());

// --- CAMINHOS PARA TODOS OS ARQUIVOS JSON ---
const dbInscricoesPath = path.join(__dirname, 'db.json');
const dbUsersPath = path.join(__dirname, 'users.json');
const dbPeneirasPath = path.join(__dirname, 'peneiras.json');
const dbPromessasPath = path.join(__dirname, 'promessas.json');
const dbNoticiasPath = path.join(__dirname, 'noticias.json');


// --- FUNÇÕES AUXILIARES PARA LER/ESCREVER NOS ARQUIVOS JSON ---
const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      if (filePath.includes('users.json')) return [];
      return {};
    }
    throw error;
  }
};

const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};


app.get('/noticias/home', async (req, res) => {
  try {
    const data = await readJsonFile(dbNoticiasPath);
    res.status(200).json(data || { noticiaPrincipal: {}, noticiasSecundarias: [] });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de dados de notícias.' });
  }
});


// ROTA PARA BUSCAR UMA ÚNICA NOTÍCIA PELO ID
app.get('/noticia/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await readJsonFile(dbNoticiasPath);
    
    // Procura a notícia em ambas as listas
    let artigoAtual = null;
    if (data.noticiaPrincipal && data.noticiaPrincipal.id == id) {
      artigoAtual = data.noticiaPrincipal;
    } else {
      artigoAtual = data.noticiasSecundarias.find(n => n.id == id);
    }

    if (artigoAtual) {
      // Filtra as notícias secundárias para não incluir a notícia atual
      const outrosArtigos = data.noticiasSecundarias
        .filter(n => n.id != id) // Garante que a notícia atual não seja sugerida
        .slice(0, 2); // Pega apenas as duas primeiras

      // Retorna um objeto com a notícia atual e as sugestões
      res.status(200).json({ artigoAtual, outrosArtigos });
    } else {
      res.status(404).json({ message: 'Notícia não encontrada.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de dados de notícias.' });
  }
});

// Rota para buscar dados das Peneiras
app.get('/peneiras', async (req, res) => {
  try {
    const data = await readJsonFile(dbPeneirasPath);
    res.status(200).json(data.peneiras || []);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de dados de peneiras.' });
  }
});

// Rota para buscar dados das Promessas
app.get('/jogadoras/promessas', async (req, res) => {
  try {
    const data = await readJsonFile(dbPromessasPath);
    res.status(200).json(data.jogadoras || []);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao ler o banco de dados de promessas.' });
  }
});

// Rota para receber Inscrições (Times e Individuais)
app.post('/inscricoes', async (req, res) => {
  try {
    const novaInscricao = req.body;

    if ((!novaInscricao.nome || !novaInscricao.email) && !novaInscricao.nomeTime) {
      return res.status(400).json({ message: 'Dados insuficientes para inscrição.' });
    }

    const db = await readJsonFile(dbInscricoesPath);
    const inscricoes = db.inscricoes || [];
    
    const inscricaoFinal = {
      id: Date.now(),
      dataInscricao: new Date().toISOString(),
      ...novaInscricao
    };

    inscricoes.push(inscricaoFinal);
    await writeJsonFile(dbInscricoesPath, { inscricoes });
    
    res.status(201).json({ message: 'Inscrição realizada com sucesso!', data: inscricaoFinal });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});



// Rota de Registro de novos usuários
app.post('/auth/register', async (req, res) => {
  try {
    const { nome, email, password } = req.body;
    const users = await readJsonFile(dbUsersPath);

    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'Este e-mail já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), nome, email, password: hashedPassword };
    
    users.push(newUser);
    await writeJsonFile(dbUsersPath, users);

    res.status(201).json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// Rota de Login de usuários existentes
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = await readJsonFile(dbUsersPath);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});


// 5. Iniciar o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});