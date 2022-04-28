const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { response } = require('../app');
const { hash } = require('bcrypt');
const { hashSync } = require('bcrypt');

exports.getUsuarios = async(req,res,next) => {
    try {
        const query = `SELECT * FROM usuarios`;
        const result = await mysql.execute(query);
        console.log(result)
        if(result.length == 0) {
            // corrigir status code
            return res.status(404).send({ message: 'Não existem usuarios para listar'});
        } else {
            const response = {
                quantidade: result.length,
                usuarios: result.map(user => {
                    return {
                        id_usuario: user.id_usuario,
                        nome: user.nome,
                        email: user.email,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de um usuário específico.',
                            url: 'http://localhost:3025/usuarios/' + user.id_usuario
                        }
                    }
                })
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}

exports.getUsuarioID = async(req,res,next) => {
    try {
        const query = `SELECT * FROM usuarios WHERE id_usuario = ?`;
        const result = await mysql.execute(query,
            [
                req.params.id_usuario
            ]);
        if(result.length == 0) {
            // corrigir status code
            res.status(404).send({ message: 'Não existe nemhum usuário com esse ID.'});
        } else {
            const response = {
                usuario: result.map(user => {
                    return {
                        id_usuario: user.id_usuario,
                        nome: user.nome,
                        email: user.email,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de todos os usuarios',
                            url: 'http://localhost:3025/usuarios' 
                        }
                    }
                })
            }
            return res.status(200).send(response);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: error });
    }
}


exports.cadastroUsuario = async(req,res,next) => {
    try {
        const queryUsuarios = `SELECT * FROM usuarios WHERE email = ?;`
        const resultUsuarios = await mysql.execute(queryUsuarios, 
            [
                req.body.email
            ]);
        if(resultUsuarios.lenght > 0) {
            return res.status(409).send({
                message: 'Email já existente, tente outro'
            });
        } else {

            const hash = bcrypt.hashSync(req.body.senha, 10)

            const query = `INSERT INTO usuarios (nome, email, senha) VALUES (?,?,?);`;
            const result = await mysql.execute(query, [
                req.body.nome,
                req.body.email,
                hash
            ]);

            const response = {
                mensagem: 'Usuário criado com sucesso!',
                usuarioCriado: {
                    id_usuario: result.insertId,
                    nome: req.body.nome,
                    email: req.body.email
                },
                request: {
                    type: "GET",
                    description: "Retorna todos os usuários cadastrados",
                    url: "http://localhost:3025/usuarios"
                }
            }
            return res.status(201).send(response)
        };   
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error:error });
    }        
}

exports.patchUsuario = async(req,res,next) => {
    try {
        const queryUsuarios = `SELECT * FROM usuarios WHERE email = ? and id_usuario = ?`;
        const resultUsuarios = await mysql.execute(queryUsuarios, 
            [   
                req.body.email,
                req.params.id_usuario
            ]);
        if(resultUsuarios.length == 0) {
            return res.status(404).send({ message: 'Usuário inexistente.'});
        } else {

            const hash = bcrypt.hashSync(req.body.senha, 10)

            const query = 
                    `UPDATE     usuarios
                        SET     nome = ?,
                                senha = ?
                        WHERE   email = ?;`;
                        
                const result = await mysql.execute(query,
                    [
                        req.body.nome, 
                        hash,
                        req.body.email
                    ])
                    const response = {
                        mensagem: 'Usuário alterado com sucesso!',
                        usuarioAlterado: {
                            id_usuario: req.params.id_usuario,
                            nome: req.body.nome,
                            email: req.body.email
                        },
                        request: {
                            type: "GET",
                            description: "Retorna todos os usuários",
                            url: "http://localhost:3025/usuarios"
                        }
                    }
                
                return res.status(201).send(response)
        }
    } catch (error) {
        return res.status(500).send({ error:error });
    }
}


exports.loginUsuario = async(req,res,next) => {
    try {
        const queryUsuarios = ` SELECT * FROM usuarios where email = ?;`;
        const resultUsuarios = await mysql.execute(queryUsuarios,
            [
                req.body.email
            ]);
        if(resultUsuarios.length < 1) {
            return res.status(401).send({ message: 'Falha na autenticação'});
        }
        bcrypt.compare(req.body.senha, resultUsuarios[0].senha, (err, result) => {
            if(err) {
                return res.status(401).send({ mensagem: 'Falha na autenticação' })
            }
            if(result) {
                const token = jwt.sign({
                    id_usuario: resultUsuarios[0].id_usuario,
                    email: resultUsuarios[0].email
                }, process.env.JWT_KEY  ,
                {
                    expiresIn: "1h"
                })
                return res.status(200).send({
                    mensagem: 'Autenticado com sucesso',
                    token: token
                })
            }
            return res.status(401).send({ mensagem: 'Falha na autenticação' });  
        })
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}

exports.deleteUsuario = async(req,res,next) => {
    try {
        const queryUsuarios = `SELECT * FROM usuarios WHERE id_usuario = ?`;
        const resultUsuarios = await mysql.execute(queryUsuarios,
            [
                req.params.id_usuario
            ]);
            if(resultUsuarios.length == 0){
                return res.status(404).send({ message: 'Não existe nemhum usuário com esse ID.'});
            ;}

        const query = `DELETE FROM usuarios WHERE id_usuario = ?`;
        const result = await mysql.execute(query,
            [
                req.params.id_usuario
            ]);
        
        const response = {
            message: 'Usuário deletado com sucesso.',
            request: {
                type: 'POST',
                description: 'Cadastra um novo usuário.',
                url: 'http://localhos:3025/usuarios/cadastro',
                body: {
                    nome: 'String',
                    email: 'String',
                    senha: 'String'
                }
            }
        }

        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
}