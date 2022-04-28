const { query } = require('express');
const express = require('express');
const router = express.Router();
const mysql = require('../mysql');

exports.getVagas = async(req,res,next) => {
    try {
        const query = 
             `SELECT    vag.id_vaga,
                        vag.titulo,
                        vag.salario,     
                        vag.descricao,
                        emp.id_empresa,
                        emp.nome
                FROM    vagas AS vag 
          INNER JOIN    empresas AS emp
                  ON    emp.id_empresa = vag.fk_id_empresa;`;
        const result = await mysql.execute(query);
        const response = {
            quantidade: result.length,
            vagas: result.map(vaga => {
                return {
                    titulo: vaga.titulo,
                    salario: vaga.salario,
                    descricao: vaga.descricao,
                    empresa: {
                        id_empresa: vaga.id_empresa,
                        nome: vaga.nome,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de uma empresa específica.',
                            url: 'http://localhost:3025/empresas/' + vaga.id_empresa
                        }
                    },
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de uma vaga específica.',
                        url: 'http://localhost:3025/vagas/' + vaga.id_vaga
                    }
                }
            })
            
        };
        return res.status(200).send( response );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error})    
    }
}

exports.getVagasId = async(req,res,next) => {
    try {
        const queryVagas = `SELECT * FROM vagas WHERE id_vaga = ?;`;
        const resultVagas = await mysql.execute(queryVagas,
            [
                req.params.id_vaga
            ]);
            if(resultVagas.length == 0) {
                return res.status(404).send({ message: 'Não existe nemhuma vaga com esse ID.'});
            }
        const query = 
             `SELECT    vag.id_vaga,
                        vag.titulo,
                        vag.salario,     
                        vag.descricao,
                        emp.id_empresa,
                        emp.nome
                FROM    vagas AS vag 
          INNER JOIN    empresas AS emp
                  ON    emp.id_empresa = vag.fk_id_empresa
               WHERE    id_vaga = ?;`;
        const result = await mysql.execute(query, [req.params.id_vaga]);
        const response = {
            vaga: result.map(vaga => {
                return {
                    titulo: vaga.titulo,
                    salario: vaga.salario,
                    descricao: vaga.descricao,
                    empresa: {
                        id_empresa: vaga.id_empresa,
                        nome: vaga.nome,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de uma empresa específica.',
                            url: 'http://localhost:3025/empresas/' + vaga.id_empresa
                        }
                    },
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de todas as vagas.',
                        url: 'http://localhost:3025/vagas'  
                    }
                }
            })  
        };
        return res.status(200).send( response );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error})    
    }
}

exports.postVagas = async(req,res,next) => {
    try {
        const queryVagas = `SELECT * FROM empresas WHERE id_empresa = ?`
        const resultVagas = await mysql.execute(queryVagas, [req.body.id_empresa]);
        if(resultVagas.length == 0) {
            return res.status(404).send({ message: 'Não existe empresa com esse ID.'})
        }

        const query = `INSERT INTO vagas(fk_id_empresa, titulo, salario, descricao) VALUES (?,?,?,?)`;
        const result = await mysql.execute(query, [req.body.id_empresa, req.body.titulo, req.body.salario, req.body.descricao]);

        const response = {
            vagaCriada:{
                id_vaga: result.insertId,
                titulo: req.body.titulo,
                salario: req.body.salario,
                descricao: req.body.descricao,
                id_empresa: req.body.id_empresa,
                request: {
                    type: 'GET',
                    description: 'Retorna os detalhes de todas as vagas registradas.',
                    url: 'http://localhost:3025/vagas'
                }                        
            }
        }
        return res.status(201).send( response );
    } catch (error) {
        if( error ) { return res.status(500).send({ error: error })};
    }
}

exports.patchVagas = async(req,res,next) => {
    try {
        const queryVagas = `SELECT * FROM vagas WHERE id_vaga = ?`;
        const resultVagas = await mysql.execute(queryVagas, 
            [
                req.params.id_vaga
            ]);
        if(resultVagas.length == 0) {
            res.status(404).send({ message: 'Não há nemhuma vaga com esse ID.' });
        }


        const query = 
            `UPDATE     vagas
                SET     titulo = ?, 
                        salario = ?,
                        descricao = ?
              WHERE     id_vaga = ?`;
        const result = await mysql.execute(query, 
            [
                req.body.titulo, 
                req.body.salario, 
                req.body.descricao, 
                req.params.id_vaga
            ]);


        const response = {
            message: 'Vaga modificada com sucesso.',
            vagaAlterada: {
                titulo: req.body.titulo,
                salario: req.body.salario,
                descricao: req.body.descricao
            },
            request: {
                type: 'POST',
                description: 'Insere um novo registro de vaga.',
                url: 'http://localhost:3025/vagas/cadastro',
                body: {
                    titulo: 'String',
                    salario: 'Number',
                    descricao: 'String',
                    fk_id_empresa: 'Number'
                }
            }                       
            
        };
        return res.status(202).send( response );
    } catch (error) {
        if( error ) { return res.status(500).send({ error: error })};
    }
}

exports.deleteVagas = async(req,res,next) => {
    try {
        const queryVagas = `SELECT * FROM vagas WHERE id_vaga = ?`;
        const resultVagas = await mysql.execute(queryVagas,
            [
                req.params.id_vaga
            ]);

        if(resultVagas.length == 0) {
            res.status(404).send({ message: 'Não há nemhuma vaga com esse ID.' });
        }

        const query = `DELETE FROM vagas WHERE id_vaga = ?`;
        const result = await mysql.execute(query, [
            req.params.id_vaga
        ]);

        const response = {
            message: 'Vaga removida com sucesso.',
            request: {
                type: 'POST',
                description: 'Insere um novo registro de vaga.',
                url: 'http://localhost:3025/vagas/cadastro',
                body: {
                    titulo: 'String',
                    salario: 'Number',
                    descricao: 'String',
                    fk_id_empresa: 'Number'
                }
            }
        }
        return res.status(202).send( response );
    } catch (error) {
        if( error ) { return res.status(500).send({ error: error })};
    }
}