const fs = require("fs/promises");
const path = require("path");

// Define os caminhos para todos os seus arquivos JSON
const dbPath = path.join(__dirname, "..", "data", "db.json"); 
const dbUsersPath = path.join(__dirname, "..", "data", "users.json");
const dbPeneirasPath = path.join(__dirname, "..", "data", "peneiras.json");
const dbPromessasPath = path.join(__dirname,"..", "data", "promessas.json");
const dbNoticiasPath = path.join(__dirname,"..", "data", "noticias.json");
const dbEncontroPath = path.join(__dirname, "..", "data", "encontro.json");
const dbCopaPath = path.join(__dirname, "..", "data", "copa.json");

const readJsonFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") {
 
      if (filePath.includes("users.json")) {
        return []; 
      }
      return {}; 
    }
    
    throw error;
  }
};


const writeJsonFile = async (filePath, data) => {

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};


module.exports = {
  readJsonFile,
  writeJsonFile,
  dbPath,
  dbUsersPath,
  dbPeneirasPath,
  dbPromessasPath,
  dbNoticiasPath,
  dbEncontroPath,
  dbCopaPath
};