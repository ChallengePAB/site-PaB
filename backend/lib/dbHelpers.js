const fs = require("fs/promises");
const path = require("path");


const dbPath = path.join(__dirname, "..", "data", "db.json"); 
const dbUsersPath = path.join(__dirname, "..", "data", "users.json");
const dbPeneirasPath = path.join(__dirname,"..", "data", "peneiras.json");
const dbPromessasPath = path.join(__dirname,"..", "data", "promessas.json");
const dbNoticiasPath = path.join(__dirname,"..", "data", "noticias.json");


// Lê o arquivo JSON de forma assíncrona.

const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
      if (filePath.includes("users.json")) return [];
      if (filePath.includes("db.json")) {
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

//Escreve dados no arquivo JSON de forma assíncrona.

const writeJsonFile = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// Exporta as funções e os caminhos para que os controladores possam usá-los
module.exports = {
  readJsonFile,
  writeJsonFile,
  dbPath,
  dbUsersPath,
  dbPeneirasPath,
  dbPromessasPath,
  dbNoticiasPath,
};
