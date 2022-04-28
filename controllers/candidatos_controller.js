const { query } = require('express');
const mysql = require('../mysql');

exports.postCandidatura = async(req,res,next) => {
    try {
        const validaVaga = await mysql.execute(`SELECT * FROM vagas WHERE id_vaga = ?`,
        [
            req.body.id_vaga
        ]);
        const validaUsuario = await mysql.execute(`SELECT * FROM usuarios WHERE id_usuario = ?`, 
        [
            req.body.id_usuario
        ]);
        
        const validaCandidato = await mysql.execute(`SELECT * FROM candidatos WHERE fk_id_vaga = ? and fk_id_usuario = ?;`,
        [
            req.body.id_vaga,
            req.body.id_usuario
        ])

        let usuarioInvalido = validaCandidato.length > 0 || validaVaga.length == 0 || validaUsuario.length == 0 

        if(usuarioInvalido) {
            res.status(404).send('Informações Invalídas ou inexistentes')
        }else {
            const query = `INSERT INTO candidatos VALUES (?,?)`;
            const result = await mysql.execute(query, 
                [
                    req.body.id_vaga,
                    req.body.id_usuario
                ]) 
                
                const response = {
                    id_vaga: req.body.id_vaga,
                    id_usuario: req.body.id_usuario,
                    request: {
                        type: 'GET',
                        description: 'Retorna todos os candidatos',
                        url:'http://localhost:3025/candidatos'
                    }
                }
                return res.status(201).send(response)
            }
    } catch (error) {
        return res.status(500).send({ error: error})    
    }
}

exports.getCandidatosIdVaga = async(req,res,next) => {
    try {
        const query =`
                  SELECT * FROM candidatos WHERE fk_id_vaga = ?`;
        const result = await mysql.execute(query,
            [
                req.params.id_vaga
            ]);
        if(result.length == 0) {
            return res.status(404).send('Não existe nemhuma vaga candidatada com esse ID.')
        }else {
            return res.status(200).send( result )
        }

    } catch (error) {
        return res.status(500).send({ error: error})     
    }
}


exports.getCandidatosIdUsuario = async(req,res,next) => {
    try {
        const query =`
                SELECT * from candidatos where fk_id_usuario = ?`;
        const result = await mysql.execute(query,
            [
                req.params.id_usuario
            ]);


        if(result.length == 0) {
            return res.status(404).send('Não existe nemhum usuario candidatada com esse ID.')
        }else {
            return res.status(200).send( result )
        }

    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error})     
    }
};


exports.deleteCandidato = async(req,res)=> {
    try {
        const result = await mysql.execute("SELECT * FROM candidatos WHERE fk_id_vaga = ? and fk_id_usuario = ?",
        [
            req.body.id_vaga,req.body.id_usuario
        ]);
        if (result.length == 0) {
            res.status(404).send({
                message: 'ID(s) Invalido(s)'
            });
        }else{
            const query = `DELETE FROM candidatos WHERE fk_id_vaga = ? and fk_id_usuario = ?;`;
            await mysql.execute(query,[req.body.id_vaga,req.body.id_usuario]);
            const response ={
                mensagem : 'Candidato removido'
            }    
            return res.status(202).send(response);    
        }       
    } catch (error) {
        console.log(error)
        return res.status(500).send({ error:error});                        
    };
};
