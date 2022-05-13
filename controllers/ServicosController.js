const Responses = require('../utils/Responses')
const ServicosModel = require('../model/ServicosModel');

const Agendamento = require('../services/Agendamento');
const Data = require('../utils/Data');


class ServicosController {
    async Get(req, res){

        // Checa se a query 'descricao', 'titulo' e 'id_tipo_servico' foi passada
        if (Object.keys(req.query).length > 0){
            const query = req.query;

            // true -> retornou dados
            // false -> erro interno
            // null -> sucesso, mas sem dados retornados
            const {status, data, msgError} = await ServicosModel.GetServicoByQueryParams(query)

            if (status === null) return Responses.noContent(res)
            else if (status === false) return Responses.internalServerError(res, msgError)

            return Responses.success(res, data)
        }

        // Faz a busca no banco por todos os serviços
        // true -> retornou dados
        // false -> erro interno
        // null -> sucesso, mas sem dados retornados
        const {data, status, msgError} = await ServicosModel.GetAllServicos()

        if (status === null) return Responses.noContent(res)
        else if (status === false) return Responses.internalServerError(res, msgError)
        
        return Responses.success(res, data)
    }

    async Post(req, res) {
        // Checando se os 5 parametros obrigatórios para requisição foram passados
        if (Object.keys(req.body).length < 5){
            return Responses.badRequest(res, "Certifique-se que está passando todos os campos!")
        }

        const { titulo, descricao, data, id_tipo_servico, idUsuario } = req.body;

        if (titulo === '' || descricao === '' || data === '' || id_tipo_servico === '' || idUsuario === ''){
            return Responses.badRequest(res, "Os campos não estão sendo preenchidos corretamente!")
        }
        if (titulo === null || descricao === null || data === null || id_tipo_servico === null || idUsuario === null){
            return Responses.badRequest(res, "Os campos não estão sendo preenchidos corretamente!")
        }
        if (!data.match(/^\d{4}-[0-1][0-2]-[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/)){
            return Responses.badRequest(res, "A data não tem um formato válido. Ex:'1980-11-24 00:00'")
        }
        if (Data.dataAtual() > new Date(data)){
            return Responses.badRequest(res, "Data do serviço já passou! Por favor informe uma data válida.")
        }

        const servico = {titulo, descricao, data: new Date(data), id_tipo_servico, idUsuario }        

        const {agendamento} = req.body;
        
        // status: null -> Bad Request
        // false -> não usou o agendamento
        // true -> agendamento solicitado
        const responseValidandoAgendamento = Agendamento.validar(agendamento)
        if (responseValidandoAgendamento.status === null){
            const helpRoutes = "EXEMPLO DE REQUISIÇÃO VÁLIDA:  'agendamento': {'repeticao_ate': '1999-11-20 00:00', 'repetir_dias': ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']"
            return Responses.badRequest(res, responseValidandoAgendamento.msgError, [], helpRoutes )
        }
        if (responseValidandoAgendamento.status === true){
            
            const dadosParaAgendamento = {
                repetir_ate: responseValidandoAgendamento.repetir_ate, 
                repetir_dias: responseValidandoAgendamento.repetir_dias
            }

            const agendamento = Agendamento.preparar(dadosParaAgendamento)

            // Agendamento feito!
            const response = await Agendamento.agendar(agendamento, servico)
            if (response.status === false) throw new Error("Erro Interno ao adicionar os serviços!")

            return Responses.created(res)
        }

        // Caso o agendamento não seja solicitado, adicionará um serviço
        const responseAddServicoSemAgendamento = await ServicosModel.AddServico(servico)
        if (responseAddServicoSemAgendamento.status === false) return Responses.internalServerError(res, msgError)

        return Responses.created(res)
    }

    async Delete(req, res) {
        const { id } = req.params;
        
        const responseRemoveServico = await ServicosModel.RemoveServico(id)

        if (responseRemoveServico.status === null) return Responses.unauthenticated(res, "Id informado não corresponde a nenhum serviço!")
        if (responseRemoveServico.status === false) return Responses.internalServerError(res, responseRemoveServico.msgError)

        return Responses.success(res)
    }

}

module.exports = new ServicosController();