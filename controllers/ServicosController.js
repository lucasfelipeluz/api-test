const Responses = require('../utils/Responses')
const ServicosModel = require('../model/ServicosModel');

const Agendamento = require('../services/Agendamento')


class ServicosController {
    async Get(req, res){
        if (Object.keys(req.query).length > 0){
            const query = req.query;

            const {status, data, msgError} = await ServicosModel.GetServicoByQueryParams(query)

            if (status === null) return Responses.noContent(res)
            else if (status === false) return Responses.internalServerError(res, msgError)

            return Responses.success(res, data)
        }

        const {data, status, msgError} = await ServicosModel.GetAllServicos()

        if (status === null) return Responses.noContent(res)
        else if (status === false) return Responses.internalServerError(res, msgError)
        
        return Responses.success(res, data)

    }

    async Post(req, res) {
        if (Object.keys(req.body).length < 5){
            return Responses.badRequest(res, "Certifique-se que está passando todos os campos!")
        }

        const {agendamento} = req.body;
        const responseAgendamento = Agendamento.validar(agendamento)


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

        /* 
        status: null -> Bad Request
        false -> não usou o agendamento
        true -> agendamento solicitado */
        if (responseAgendamento.status === false){
            return
        }
        if (responseAgendamento.status === null){
            const helpRoutes = "EXEMPLO DE REQUISIÇÃO VÁLIDA:  'agendamento': {'repeticao_ate': '1999-11-20 00:00', 'repetir_dias': ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM']"
            return Responses.badRequest(res, responseAgendamento.msgError, [], helpRoutes )
        }
        if (responseAgendamento.status === true){
            console.log(responseAgendamento)

        }

        const servico = {titulo, descricao, data: new Date(data).toISOString(), id_tipo_servico, idUsuario }        

        const responseAddServico = await ServicosModel.AddServico(servico)
        if (responseAddServico.status === false) return Responses.internalServerError(res, responseAddServico.msgError)

        return Responses.internalServerError(res)
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