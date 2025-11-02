const { readJsonFile, writeJsonFile, dbNoticiasPath } = require("../lib/dbHelpers");

exports.getAllNews = async (req, res) => {
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
};

exports.getNewsById = async (req, res) => {
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
};

exports.createNews = async (req, res) => {
    try {
      const noticiaData = req.body;
      const data = await readJsonFile(dbNoticiasPath);
      const allIds = [data.noticiaPrincipal?.id || 0, ...data.noticiasSecundarias.map(n => n.id)];
      const newId = Math.max(...allIds) + 1;
      
      const newNoticia = { id: newId, ...noticiaData };
      data.noticiasSecundarias.push(newNoticia);
      await writeJsonFile(dbNoticiasPath, data);
      res.status(201).json(newNoticia);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar notícia.' });
    }
};

exports.updateNews = async (req, res) => {
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
};

exports.deleteNews = async (req, res) => {
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
          res.status(204).send();
      } else {
          res.status(404).json({ message: 'Notícia não encontrada para deletar.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar notícia.' });
    }
};
