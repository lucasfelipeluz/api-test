const database = require('../database/connection')

class ServicosModel {
    async GetAllServicos(){
        try {
            const data = await database
                .table('servicos')
                .innerJoin('tipo_servico', 'tipo_servico.id', 'servicos.id_tipo_servico')
                .innerJoin('usuarios', 'usuarios.id', 'servicos.idUsuario')
                .select(
                    ['servicos.id as IdServicos', 'servicos.titulo', 'servicos.descricao', 'servicos.data', 
                    'tipo_servico.id as IdTipoServico', 'tipo_servico.tipoDoServico', 
                    'usuarios.id as IdUsuario', 'usuarios.nome as NomeUsuario'
                    ])

            if (data.length == 0) return {status: null}
            
            return {status: true, data}

        } catch (error) {
            console.warn(error.message)
            return { status: false, msgError: error.message }
        }
    }

    async GetServicoByQueryParams(query){
        try {
            const data = await database
                .table('servicos')
                .where(query)
                .innerJoin('tipo_servico', 'tipo_servico.id', 'servicos.id_tipo_servico')
                .innerJoin('usuarios', 'usuarios.id', 'servicos.idUsuario')
                .select(
                    ['servicos.id as IdServicos','servicos.titulo', 'servicos.descricao', 'servicos.data', 
                    'tipo_servico.id as IdTipoServico', 'tipo_servico.tipoDoServico', 
                    'usuarios.id as IdUsuario', 'usuarios.nome as NomeUsuario'
                    ])

            if (data.length == 0) return {status: null}
        
            return {status: true, data}

        } catch (error) {
            console.warn(error.message)
            return { status: false, msgError: error.message }
        }
    }

    async AddServico(servico, agendamento = null){
        try {
            if(agendamento){


                return {status: true}
            }

            /* const data = await database
                .insert(servico)
                .table('servicos')

            if (data.length > 0) return {status: true} */
            return {status: true};
        } catch (error) {
            console.warn(error.message)
            return { status: false, msgError: error.message }
        }
    }

    async RemoveServico(id){
        try {
            const data = await database
                .delete()
                .where({id})
                .table('servicos')


            if(data < 1) return {status: null, data: []}
            
            return { status: true, data: [] }

        } catch (error) {
            console.warn(error.message)
            return { status: false, msgError: error.message }
        }
    }
}

module.exports = new ServicosModel();