const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readJsonFile, writeJsonFile, dbUsersPath, dbPromessasPath } = require("../lib/dbHelpers");

exports.register = async (req, res) => {
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
	      
	      // Define a role padrão como 'jogadora' se não for fornecida ou se for 'comum' (para evitar criação de perfil jogadora acidental)
	      const finalRole = role === "comum" ? "comum" : "jogadora";
      const users = await readJsonFile(dbUsersPath);

      if (users.find((user) => user.email === email)) {
          return res.status(400).json({ message: "Este e-mail já está em uso." });
      }

	      if (finalRole === "jogadora") {
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
	          role: finalRole,
	      };

	      users.push(newUser);
	      await writeJsonFile(dbUsersPath, users);
	
	      if (finalRole === "jogadora") {
          const promessasData = await readJsonFile(dbPromessasPath);
          const jogadoras = promessasData.jogadoras || [];
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
	            oculta: false, // Jogadoras são visíveis por padrão
	          };
          jogadoras.push(novaJogadora);
          await writeJsonFile(dbPromessasPath, { jogadoras });
      }
      res.status(201).json({ message: "Usuário criado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor." });
    }
};

exports.login = async (req, res) => {
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

	      let jogadoraId = null;
	      if (user.role === "jogadora") {
	          const promessasData = await readJsonFile(dbPromessasPath);
	          const jogadora = (promessasData.jogadoras || []).find(
	            (j) => j.userId === user.id
	          );
	          if (jogadora) {
	            jogadoraId = jogadora.id;
	          }
	      } else if (user.role === "comum") {
	          // Usuários comuns não têm perfil de jogadora, então jogadoraId permanece null
	          // e não há necessidade de buscar em dbPromessasPath
	      }

	      res.json({ token, role: user.role, userId: user.id, jogadoraId });
	    } catch (error) {
	      res.status(500).json({ message: "Erro no servidor." });
	    }
	};
	
	exports.updateProfile = async (req, res) => {
	    try {
	      const { nome } = req.body;
	      const userId = req.user.id;
	      const users = await readJsonFile(dbUsersPath);
	      const userIndex = users.findIndex((u) => u.id === userId);
	
	      if (userIndex === -1) {
	          return res.status(404).json({ message: "Usuário não encontrado." });
	      }
	
	      // Atualiza o nome do usuário
	      users[userIndex].nome = nome || users[userIndex].nome;
	
	      await writeJsonFile(dbUsersPath, users);
	
	      // Se for jogadora, atualiza o nome também no perfil de jogadora
	      if (users[userIndex].role === "jogadora") {
	          const promessasData = await readJsonFile(dbPromessasPath);
	          const jogadoras = promessasData.jogadoras || [];
	          const jogadoraIndex = jogadoras.findIndex((j) => j.userId === userId);
	          if (jogadoraIndex !== -1) {
	            jogadoras[jogadoraIndex].nome = nome || jogadoras[jogadoraIndex].nome;
	            await writeJsonFile(dbPromessasPath, { jogadoras });
	          }
	      }
	
	      res.json({ message: "Perfil de usuário atualizado com sucesso!", user: users[userIndex] });
	    } catch (error) {
	      console.error(error);
	      res.status(500).json({ message: "Erro ao atualizar perfil de usuário." });
	    }
	};
	
	exports.me = async (req, res) => {
	    try {
	      const users = await readJsonFile(dbUsersPath);
	      const user = users.find((u) => u.id === req.user.id);
	
	      if (!user) {
	          return res.status(404).json({ message: "Usuário não encontrado." });
	      }
	
	      // Retorna apenas informações seguras
	      res.json({ id: user.id, nome: user.nome, email: user.email, role: user.role });
	    } catch (error) {
	      console.error(error);
	      res.status(500).json({ message: "Erro ao buscar dados do usuário." });
	    }
	};