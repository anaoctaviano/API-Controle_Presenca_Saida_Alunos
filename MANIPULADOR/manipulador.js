// Manipulador do arquivo

// Imports 
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Sempre vai encontrar o caminho

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const caminhoDados = path.join(__dirname, "..", "BD", "registros_alunos.json");

// Lógica

// Função ListarTodos os registros

export async function listarTodos() {

    const conteudo = await fs.readFile(caminhoDados, "utf-8");
    return JSON.parse(conteudo);
}

// Função SalvarTodos

export async function salvarTodos(registros) {

    await fs.writeFile(caminhoDados, JSON.stringify(registros, null, 2), "utf-8");
}

