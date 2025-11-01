const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const router = express.Router();
const DATA_FILE = path.join(__dirname, '..', 'campeonatos.json');

// Função auxiliar para ler os dados
const readData = async () => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler dados de campeonatos:", error);
        return { campeonatos: [], times: [], tabela: [], jogos: [], artilharia: [], escalacoes: [] };
    }
};

// Função auxiliar para escrever os dados
const writeData = async (data) => {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
};

// GET /api/campeonatos/home - Dados para a Home (Tabela Pequena, Jogos e Artilharia)
router.get('/home', async (req, res) => {
    const data = await readData();
    
    // Mapear a tabela para incluir o nome e escudo do time
    const tabelaComTime = data.tabela.map(item => {
        const time = data.times.find(t => t.id === item.timeId);
        return { ...item, time };
    }).slice(0, 5); // Apenas os 5 primeiros para a home

    // Mapear os jogos para incluir os dados dos times
    const jogosComTimes = data.jogos.map(jogo => {
        const timeCasa = data.times.find(t => t.id === jogo.timeCasaId);
        const timeFora = data.times.find(t => t.id === jogo.timeForaId);
        return { ...jogo, timeCasa, timeFora };
    });

    // Mapear a artilharia para incluir o nome e escudo do time
    const artilhariaComTime = data.artilharia.map(artilheiro => {
        const time = data.times.find(t => t.id === artilheiro.timeId);
        return { ...artilheiro, time };
    });

    res.json({
        campeonato: data.campeonatos[0], // Assumindo um único campeonato principal
        tabela: tabelaComTime,
        jogos: jogosComTimes,
        artilharia: artilhariaComTime
    });
});

// GET /api/campeonatos/tabela - Tabela Completa
router.get('/tabela', async (req, res) => {
    const data = await readData();
    
    const tabelaCompleta = data.tabela.map(item => {
        const time = data.times.find(t => t.id === item.timeId);
        return { ...item, time };
    });

    const artilhariaComTime = data.artilharia.map(artilheiro => {
        const time = data.times.find(t => t.id === artilheiro.timeId);
        return { ...artilheiro, time };
    });

    res.json({
        campeonato: data.campeonatos[0],
        tabela: tabelaCompleta,
        artilharia: artilhariaComTime
    });
});

// GET /api/campeonatos/jogo/:id - Detalhes do Jogo e Escalação
router.get('/jogo/:id', async (req, res) => {
    const jogoId = parseInt(req.params.id);
    const data = await readData();
    
    const jogo = data.jogos.find(j => j.id === jogoId);
    if (!jogo) {
        return res.status(404).json({ message: "Jogo não encontrado" });
    }

    const timeCasa = data.times.find(t => t.id === jogo.timeCasaId);
    const timeFora = data.times.find(t => t.id === jogo.timeForaId);
    const escalacao = data.escalacoes.find(e => e.jogoId === jogoId);

    res.json({
        ...jogo,
        timeCasa,
        timeFora,
        escalacao: escalacao || { escalacaoCasa: [], escalacaoFora: [] }
    });
});

// --- Rotas de Administração (CRUD) ---

// GET /api/campeonatos/admin/tabela - Tabela para Edição
router.get('/admin/tabela', async (req, res) => {
    const data = await readData();
    res.json({
        campeonato: data.campeonatos[0],
        tabela: data.tabela,
        times: data.times
    });
});

// PUT /api/campeonatos/admin/tabela - Atualiza a Tabela
router.put('/admin/tabela', async (req, res) => {
    const { tabela } = req.body;
    const data = await readData();
    
    // Validação básica
    if (!Array.isArray(tabela)) {
        return res.status(400).json({ message: "Formato de tabela inválido" });
    }

    data.tabela = tabela;
    await writeData(data);
    res.json({ message: "Tabela atualizada com sucesso" });
});

// GET /api/campeonatos/admin/jogos - Jogos para Edição
router.get('/admin/jogos', async (req, res) => {
    const data = await readData();
    
    const jogosComTimes = data.jogos.map(jogo => {
        const timeCasa = data.times.find(t => t.id === jogo.timeCasaId);
        const timeFora = data.times.find(t => t.id === jogo.timeForaId);
        return { ...jogo, timeCasa, timeFora };
    });

    res.json({ jogos: jogosComTimes, times: data.times });
});

// PUT /api/campeonatos/admin/jogo/:id - Atualiza Jogo e Escalação
router.put('/admin/jogo/:id', async (req, res) => {
    const jogoId = parseInt(req.params.id);
    const { jogoAtualizado, escalacaoAtualizada } = req.body;
    const data = await readData();

    // Atualiza Jogo
    const jogoIndex = data.jogos.findIndex(j => j.id === jogoId);
    if (jogoIndex === -1) {
        return res.status(404).json({ message: "Jogo não encontrado" });
    }
    data.jogos[jogoIndex] = { ...data.jogos[jogoIndex], ...jogoAtualizado };

    // Atualiza Escalação
    const escalacaoIndex = data.escalacoes.findIndex(e => e.jogoId === jogoId);
    if (escalacaoAtualizada) {
        if (escalacaoIndex !== -1) {
            data.escalacoes[escalacaoIndex] = { ...data.escalacoes[escalacaoIndex], ...escalacaoAtualizada };
        } else {
            data.escalacoes.push({ jogoId, ...escalacaoAtualizada });
        }
    } else if (escalacaoIndex !== -1) {
        // Remove escalação se for enviada como null/vazio
        data.escalacoes.splice(escalacaoIndex, 1);
    }

    await writeData(data);
    res.json({ message: "Jogo e escalação atualizados com sucesso" });
});

// GET /api/campeonatos/admin/artilharia - Artilharia para Edição
router.get('/admin/artilharia', async (req, res) => {
    const data = await readData();
    res.json({ artilharia: data.artilharia, times: data.times });
});

// PUT /api/campeonatos/admin/artilharia - Atualiza Artilharia
router.put('/admin/artilharia', async (req, res) => {
    const { artilharia } = req.body;
    const data = await readData();
    
    if (!Array.isArray(artilharia)) {
        return res.status(400).json({ message: "Formato de artilharia inválido" });
    }

    data.artilharia = artilharia;
    await writeData(data);
    res.json({ message: "Artilharia atualizada com sucesso" });
});


module.exports = router;
