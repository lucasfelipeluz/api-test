const ServicosModel = require('../model/ServicosModel');
const Data = require('../utils/Data')

class Agendamento{

    validar(agendamento){
        if(agendamento && Object.values(agendamento).length > 0) {
            const dataAtual = Data.dataAtual()
            
            if (dataAtual > new Date(agendamento.repetir_ate)){
                return {status: null, msgError: "Data limite de repetição já passou! Por favor informe uma data válida."}
            }

            if(agendamento.repetir_dias.length > 0){

                if(agendamento.repetir_ate){

                    if (!agendamento.repetir_ate.match(/^\d{4}-[0-1][0-2]-[0-3]\d\s([0-1][0-9]|2[0-3]):[0-5]\d$/)){
                        return {status: null, msgError: "A data limite de repetição não é válida!   Ex: 1999-10-28 00:00"}
                    }
                    
                    return {status: true, repetir_ate: agendamento.repetir_ate, repetir_dias: agendamento.repetir_dias}
                }
                return {status: null, msgError: "Agendamento não foi concluído por falta de dados! Por favor informe até que dia ele será adicionado."}
            }
            return {status: null, msgError: "Agendamento não foi concluído por falta de dados! Por favor informe quais os dias da semana que o produto será adicionado."}
        }
        return {status: false} 
    }

    preparar(agendamento){
        const repetir_dias = agendamento.repetir_dias.map(item => {
            switch(item){
                case "DOM":
                    return 0
                case "SEG":
                    return 1
                case "TER":
                    return 2
                case "QUA":
                    return 3
                case "QUI":
                    return 4
                case "SEX":
                    return 5
                case "SAB":
                    return 6
            }
        });

        const repetir_ate = new Date(agendamento.repetir_ate)

        return { repetir_dias, repetir_ate }
    }

    async agendar(agendamento, servicos){
        try {
            const dataAtual = Data.dataAtual()

            function addDiasAData(data, dias){
                let resultado = new Date(data);
                resultado.setDate(resultado.getDate() + dias);
                return resultado;
            }

            for(let dataEmAgendamento = dataAtual; dataEmAgendamento <= agendamento.repetir_ate; dataEmAgendamento = addDiasAData(dataEmAgendamento, 1)){

                agendamento.repetir_dias.map(async diasDaSemanaPermitidos => {

                    if (dataEmAgendamento.getDay() == diasDaSemanaPermitidos) {

                        const servico = {
                            titulo: servicos.titulo,
                            descricao: servicos.descricao,
                            data: dataEmAgendamento,
                            id_tipo_servico: servicos.id_tipo_servico,
                            idUsuario: servicos.idUsuario
                        }
                        await ServicosModel.AddServico(servico)
                    }
                })
            }

            return {status: true}
            
        } catch (error) {
            console.warn(error.message)
            return { status: false, msgError: error.message }
        }
    }
}

module.exports = new Agendamento()