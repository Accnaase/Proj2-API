const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;


// METODO GET ALL
router.get('/', (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if( error ) { return res.status(500).send({ error: error })};
        conn.query(
            `SELECT * FROM empresas;`,
            (error,result,fields) => {
                conn.release();
                if( error ) { return res.status(500).send({ error: error })};

                if( result.length == 0) {
                    return res.status(444).send({ 
                        message: 'Não há empresas para listar adicione alguma empresa:',
                        request: {
                            type: 'POST',
                            description: 'Insere um novo registro de empresa.',
                            url: 'http://localhost:3030/empresas/cadastro'
                        }
                    })
                }

                const response = {
                    quantidade: result.length,
                    empresas: result.map(empresa => {
                        return {
                            id_empresa: empresa.id_empresa,
                            nome: empresa.nome,
                            request: {
                                type: 'GET',
                                description: 'Retorna os detalhes de uma empresa específica.',
                                url: 'http://localhost:3030/empresas/' + empresa.id_empresa
                            }
                        }
                    })
                    
                };
                return res.status(200).send( response );
            }

        );
    });
});

//METODO POST
router.post('/cadastro', (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if( error ) { return res.status(500).send({ error: error })};
        conn.query(
            `INSERT     INTO empresas (nome) 
             VALUES     (?);`,
            [req.body.nome],
            (error,result,fields) => {
                conn.release();
                if( error ) { return res.status(500).send({ error: error })};
                const response = {
                    empresaCriada:{
                        id_empresa: result.insertId,
                        nome: result.nome,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de todas as empresas registradas.',
                            url: 'http://localhost:3030/empresas'
                        }                        
                    }
                };
                return res.status(201).send( response );
            }
            
        );
    });
});


//METODO GET ID
router.get('/:id_empresa', (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if( error ) { return res.status(500).send({ error: error })};
        conn.query(
            `SELECT     * FROM empresas
             WHERE      id_empresa = ?;`,
             [req.params.id_empresa],
            (error,result,fields) => {
                conn.release();
                if( error ) { return res.status(500).send({ error: error })};
                if( result.length == 0) {
                    return res.status(404).send({ 
                        message: 'Não há nemhuma empresa com esse ID.'
                    })
                }
                const response = {
                    empresa: {
                        id_empresa: empresa.id_empresa,
                        nome: empresa.nome,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de todas as empresas registradas.',
                            url: 'http://localhost:3030/empresas'
                        }
                    }
                };
                return res.status(200).send( response );
            }
        );
    });
});

//METODO PATCH
router.patch('/editar/:id_empresa', (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if( error ) { return res.status(500).send({ error: error })};
        conn.query(
            `SELECT     * FROM empresas 
             WHERE      id_empresa = ?`,
            [req.params.id_empresa],
            (error,results,fields) => {
                if( error ) { return res.status(500).send({ error: error })};
                if(results.length == 0) {
                    return res.status(404).send({ 
                        message: 'Não há nemhuma empresa com esse ID.'
                    })
                }
            });
        conn.query(
            `UPDATE     empresas
             SET        nome = ?
             WHERE      id_empresa = ?`,
            [req.body.nome, req.params.id_empresa],
            (error,result,fields) => {
                conn.release();
                if( error ) { return res.status(500).send({ error: error })};
                const response = {
                    message: 'Empresa alterada com sucesso.',
                    request: {
                        type: 'POST',
                        description: 'Insere um novo registro de empresa.',
                        url: 'http://localhost:3030/empresas/cadastro'
                    }                       
                    
                };
                return res.status(202).send( response );
            }
        );
    });
});

//METODO DELETE
router.delete('/:id_empresa', (req,res,next) => {
    mysql.getConnection((error,conn) => {
        if( error ) { return res.status(500).send({ error: error })};
        conn.query(
            `SELECT     * FROM empresas 
             WHERE      id_empresa = ?`,
            [req.params.id_empresa],
            (error,results,fields) => {
                if( error ) { return res.status(500).send({ error: error })};
                if(results.length == 0) {
                    return res.status(404).send({ 
                        message: 'Não há nemhuma empresa com esse ID.'
                    })
                }
            });
        conn.query(
            `DELETE FROM    empresas
             WHERE          id_empresa = ?;`,
             [req.params.id_empresa],
            (error,result,fields) => {
                conn.release();
                if( error ) { return res.status(500).send({ error: error })};
                const response = {
                    message: 'Empresa removido com sucesso',
                    request: {
                        tipo: 'POST',
                        description: 'Insere um na base de dados',
                        url: 'http://localhost:3030/empresas/cadastro',
                        body: {
                            nome: 'String'
                        }
                    }
                };
                return res.status(202).send( response );
            }
        );
    });
});


module.exports = router;