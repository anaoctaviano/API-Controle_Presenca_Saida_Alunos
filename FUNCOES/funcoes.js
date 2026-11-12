// Trazer a lista 
// Saber qual é o último ID cadastrado
// Somar + 1 - para ser o próximo ID
// Return

// Imports
import { listarTodos } from "../MANIPULADOR/manipulador.js";

// Função GerarNovoID

export async function gerarNovoId() {

    const registrosAlunos = await listarTodos();

    // Pegar todos os IDs existentes
    const ids = registrosAlunos.map((aluno) => aluno.id);

    // Retorna o maior ID encontrado + 1, garantindo que seja único
    const novoID = Math.max(...ids) + 1;
    return novoID;
}
