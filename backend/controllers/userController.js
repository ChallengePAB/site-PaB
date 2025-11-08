const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.json');
const promessasFilePath = path.join(__dirname, '..', 'data', 'promessas.json');

// Função auxiliar para ler e escrever arquivos JSON
const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Erro ao ler o arquivo ${filePath}:`, error.message);
        return null;
    }
};

const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error(`Erro ao escrever no arquivo ${filePath}:`, error.message);
        return false;
    }
};

// 1. Listar usuários não-jogadoras
exports.getNonJogadoraUsers = (req, res) => {
    const usersData = readJsonFile(usersFilePath);
    if (!usersData) {
        return res.status(500).json({ message: 'Erro ao carregar dados de usuários.' });
    }

    // Filtra usuários que não são 'jogadora' e não são 'admin' (opcional, mas foca nos 'comum')
    // A requisição pedia "todos os usuários que não são jogadoras", o que inclui 'admin' e 'comum'.
    const nonJogadoraUsers = usersData.filter(user => user.role !== 'jogadora');

    // Remove a senha antes de enviar
    const safeUsers = nonJogadoraUsers.map(({ password, ...user }) => user);

    res.json(safeUsers);
};

// 2. Transformar usuário em Jogadora
exports.makeUserJogadora = (req, res) => {
    const { userId } = req.params;
    const usersData = readJsonFile(usersFilePath);
    const promessasData = readJsonFile(promessasFilePath);

    if (!usersData || !promessasData) {
        return res.status(500).json({ message: 'Erro ao carregar dados.' });
    }

    const userIndex = usersData.findIndex(u => u.id.toString() === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = usersData[userIndex];

    if (user.role === 'jogadora') {
        return res.status(400).json({ message: 'Usuário já é uma jogadora.' });
    }

    // 2a. Criar perfil em promessas.json
    const newJogadoraId = Math.max(...promessasData.jogadoras.map(j => j.id)) + 1;
    const newJogadoraProfile = {
        id: newJogadoraId,
        nome: user.nome,
        idade: null,
        altura: null,
        pe_dominante: null,
        clube_atual: null,
        posicao: null,
        foto: null,
        conteudos: [],
        oculta: false,
        userId: user.id,
        biografia: "",
        youtube: "",
        instagram: "",
        tiktok: ""
    };

    promessasData.jogadoras.push(newJogadoraProfile);

    // 2b. Atualizar role em users.json
    usersData[userIndex].role = 'jogadora';

    if (!writeJsonFile(usersFilePath, usersData) || !writeJsonFile(promessasFilePath, promessasData)) {
        return res.status(500).json({ message: 'Erro ao salvar dados.' });
    }

    res.json({ message: `Usuário ${user.nome} transformado em jogadora com sucesso.`, jogadoraId: newJogadoraId });
};

// 3. Transformar usuário em Admin
exports.makeUserAdmin = (req, res) => {
    const { userId } = req.params;
    const usersData = readJsonFile(usersFilePath);

    if (!usersData) {
        return res.status(500).json({ message: 'Erro ao carregar dados de usuários.' });
    }

    const userIndex = usersData.findIndex(u => u.id.toString() === userId);
    if (userIndex === -1) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const user = usersData[userIndex];

    if (user.role === 'admin') {
        return res.status(400).json({ message: 'Usuário já é um administrador.' });
    }

    // Atualizar role em users.json
    usersData[userIndex].role = 'admin';

    if (!writeJsonFile(usersFilePath, usersData)) {
        return res.status(500).json({ message: 'Erro ao salvar dados.' });
    }

    res.json({ message: `Usuário ${user.nome} transformado em administrador com sucesso.` });
};

// 4. Deletar usuário
exports.deleteUser = (req, res) => {
    const { userId } = req.params;
    const usersData = readJsonFile(usersFilePath);

    if (!usersData) {
        return res.status(500).json({ message: 'Erro ao carregar dados de usuários.' });
    }

    const initialLength = usersData.length;
    const newUsersData = usersData.filter(u => u.id.toString() !== userId);

    if (newUsersData.length === initialLength) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Se o usuário for uma jogadora, o perfil em promessas.json deve ser removido.
    // (Embora esta rota seja para usuários não-jogadoras, é uma boa prática verificar)
    const promessasData = readJsonFile(promessasFilePath);
    if (promessasData) {
        const initialPromessasLength = promessasData.jogadoras.length;
        promessasData.jogadoras = promessasData.jogadoras.filter(j => j.userId.toString() !== userId);
        if (promessasData.jogadoras.length !== initialPromessasLength) {
            writeJsonFile(promessasFilePath, promessasData);
        }
    }

    if (!writeJsonFile(usersFilePath, newUsersData)) {
        return res.status(500).json({ message: 'Erro ao salvar dados.' });
    }

    res.json({ message: 'Usuário deletado com sucesso.' });
};
