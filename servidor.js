// Servidor do Controle de Presença e Saída de Alunos

// Imports
import express from "express";
import { listarTodos, salvarTodos } from "./MANIPULADOR/manipulador.js";
import { gerarNovoId } from "./FUNCOES/funcoes.js"

const app = express();
const PORT = 3000;
app.use(express.json());

// Lógica - Rotas

// GET - Página de Boas Vindas

app.get("/", (req, res) => {

    res.send("Bem-Vindo a API do Controle de Presença e Saída de Alunos");
});

// GET - Listar registros

app.get("/alunos", async (req, res) => {

    try{
        const registros = await listarTodos();
        return res.status(200).json(registros);
    }
    catch(error){
        console.log("Erro ao listar registros dos alunos", error);
        return res.status(500).json({error: "Não foi possível listar os registros"})
    }
});

// GET - Buscar registro pelo ID

app.get("/aluno/:id", async (req, res) => {

    try{

        // Converter o ID para número
        const id = Number(req.params.id);

        // Ler todos os registros
        const registros = await listarTodos();

        // Procurar o registro do id escolhido
        const registroProcurado = registros.find((registro) => registro.id === id);
        
        if(!registroProcurado) {
            return res.status(404).json({erro: "Registro não encontrado"});
        }

        return res.status(200).json(registroProcurado);

    }
    catch(error){
        console.log("Erro ao listar registro", error);
        return res.status(500).json({error: "Não foi possível listar o registro"});
    }
});

// POST - Registrar um novo aluno

app.post("/alunosPost", async (req, res) => {

    try{

        // Const do novo registro
        const {matricula, nome, turma, data, presente, motivoSaida, minutosFora, alertaTempo} = req.body;

        // Validar campos obrigatórios
        if(!matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora){
            return res.status(404).json({erro: "Todos os campos são obrigatórios"});
        }

        // Gerando um novo ID único
        const id = await gerarNovoId();

        // Criar o objeto com os dados do novo registro
        const novoRegistro = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: Boolean(presente),
            motivoSaida: motivoSaida || null, // Se não for fornecido é nulo
            minutosFora: Number(minutosFora) || 0, // Se não for fornecido é 0
            alertaTempo: alertaTempo || false // Se não for fornecido é false
        }

        // Carregar o novo registro na lista
        const registros = await listarTodos();
        registros.push(novoRegistro);

        // Salvar a lista 
        await salvarTodos(registros);

        return res.status(201).json({mensage: "Registro realizado com sucesso"});

    }
    catch(error){
        console.log("Erro ao registrar novo aluno", error);
        return res.status(500).json({error: "Não foi possível registrar o novo aluno"});
    }
});

// PUT -  Alterar registro

app.put("/alunosPut/:id", async (req, res) => {

    try{

        // Transformar o ID para número
        const id = Number(req.params.id);

        // Lero os dados registrados
        const registros = await listarTodos();

        // Procurar o registro pelo ID
        const registroProcurado = registros.find((registro) => registro.id === id);

        // Verificar se encontrou o registro
        if(!registroProcurado) {
            return res.status(404).json({erro: "Registro não encontrado"});
        }

        // Dados do cadastro
        const {matricula, nome, turma, data, presente, motivoSaida, minutosFora} = req.body;

        // Validar campos obrigatórios
        if(!matricula || !nome || !turma || !data || !presente || !motivoSaida || !minutosFora) {
            return res.status(404).json({erro: "Todos os campos são obrigatórios"});
        }
        
        // Criar o objeto com os dados do registro
        const registroAtualizado = {
            id: Number(id),
            matricula: matricula,
            nome: nome,
            turma: turma,
            data: data,
            presente: Boolean(presente),
            motivoSaida: motivoSaida,
            minutosFora: Number(minutosFora),
            alertaTempo: false    
        }

        // Substituir o registro existente pelo registro atualizado
        const registrosAtualizados = registros.map((registro) => 
            registro.id === id ? registroAtualizado: registro);    

        // Salvar a lista atualizada
        await salvarTodos(registrosAtualizados);

        return res.status(200).json({mensage: "Registro atualizado com sucesso"});

    }
    catch(error){
        console.log("Erro ao alterar registro", error);
        return res.status(500).json({mensage: "Não foi possível alterar e salvar o registro"});
    }
});

// DELETE - Deletar um registro

app.delete("/deletarAluno/:id", async (req, res) => {

    try{

        // Transformar o ID em número
        const id = Number(req.params.id);

        // Ler os registros cadastrados
        const registros = await listarTodos();

        // Mantém todos os registros com id diferente 
        const registrosAtualizados = registros.filter((registro) => registro.id !== id);

        // Verificar se deletou
        if(registrosAtualizados.length === registros.length) {
            return res.status(404).json({erro: "Atendimento não deletado"});
        }

        // Salvar a lista 
        await salvarTodos(registrosAtualizados);

        return res.status(200).json({mensage: "Atendimento excluído com sucesso"});

    }
    catch(error){
        console.log("Erro ao deletar o registro", error);
        return res.status(404).json({error: "Não foi possível deletar o registro"});
    }
});

// Não encontrou a rota

app.use((req, res) => {
    res.status(404).json({erro: "Rota não encontrada"})
});

// Funções Auxiliares

app.listen(PORT, () => {
    console.log("Servidor rodando na porta", PORT);
});

