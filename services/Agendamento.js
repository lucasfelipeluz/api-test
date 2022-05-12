class Agendamento{

    validar(agendamento){
        if(agendamento) {
            
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




}

module.exports = new Agendamento()