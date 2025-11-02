const jwt = require('jsonwebtoken');

// Middleware para verificar o token
const authMiddleware = (req, res, next) => {
    const tokenHeader = req.headers["authorization"];
    if (!tokenHeader) return res.status(401).json({ message: "Token não fornecido." });

    const token = tokenHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token mal formatado." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Adiciona os dados do usuário (id, role) à requisição
        next();
    } catch (err) {
        res.status(401).json({ message: "Token inválido." });
    }
};

// Middleware para verificar se o usuário é Admin
const adminMiddleware = (req, res, next) => {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Acesso negado. Apenas admins podem realizar esta ação." });
    }
    next();
};

module.exports = {
    authMiddleware,
    adminMiddleware,
};