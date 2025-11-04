require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

// --- IMPORTAÇÃO DOS ROTEADORES ---
const newsRoutes = require('./routes/newsRoutes');
const peneirasRoutes = require('./routes/peneirasRoutes');
const jogadorasRoutes = require('./routes/jogadorasRoutes');
const inscricaoRoutes = require('./routes/inscricaoRoutes');
const authRoutes = require('./routes/authRoutes');
const kpiRoutes = require('./routes/kpiRoutes'); 
const encontroRoutes = require('./routes/encontroRoutes'); 
const copaRoutes = require('./routes/copaRoutes'); 
const climaRoutes = require('./routes/climaRoutes')

const app = express();
const PORT = 3001;

// MIDDLEWARES GLOBAIS
app.use(cors());
app.use(express.json());

// ROTAS DA APLICAÇÃO 

app.use('/api/admin/kpi', kpiRoutes);
app.use('/api/news', newsRoutes);
app.use('/peneiras', peneirasRoutes); 
app.use('/jogadoras', jogadorasRoutes); 
app.use('/', inscricaoRoutes); 
app.use('/auth', authRoutes); 
app.use('/api/eventos/encontro', encontroRoutes); 
app.use('/api/eventos/copa', copaRoutes);
app.use('/api', climaRoutes);


//  INICIAR SERVIDOR 
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});

