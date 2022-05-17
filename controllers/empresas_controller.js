const mysql = require('../mysql');

exports.getVagasDeUmaEmpresa = async(req,res,next) => {
    try {
        const query = `
        SELECT   emp.nome, 
                    emp.id_empresa, 
                    vag.titulo, 
                    vag.salario, 
                    vag.descricao
            FROM    empresas AS emp
            JOIN    vagas AS vag
            ON    vag.fk_id_empresa = emp.id_empresa AND vag.fk_id_empresa = ?;`;
        const result = await mysql.execute(query, [req.params.id_empresa]);
        if(result.lenght == 0){
            return res.status(404).send({
                message: 'Não existe empresa com esse ID.'
            });
        }

        const response = {
            quantidade: result.lenght,
            empresa: {
                nome: result[0].nome,
                id_empresa: result[0].id_empresa,
                vagas: result.map(vaga => {
                    return {
                        titulo: vaga.titulo,
                        salario: vaga.salario,
                        descricao: vaga.descricao,
                        request: {
                            type: "GET",
                            description: "Retorna todas as empresas",
                            url: "http://localhost/empresas"
                        }
                    }
                })
            }
        };
        return res.status(200).send(response)
    } catch (error) {
        return res.status(500).send({ error: error})   

    }
}

exports.getEmpresas = async(req,res,next) => {
    try {
        const query = `SELECT * FROM empresas`
        const result = await mysql.execute(query);
    
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
        return res.status(200).send(response)
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error})   
    }
}

exports.getEmpresaId = async(req,res,next) => {
    try {
        const query = `SELECT * FROM empresas WHERE id_empresa = ?;`
        const result = await mysql.execute(query,
            [
                req.params.id_empresa
            ]);
                if(result.length == 0) {
                    return res.status(404).send({ message: 'Não há nemhuma empresa com esse ID.'})
                }
                const response = {
                    empresa: {
                        id_empresa: result[0].id_empresa,
                        nome: result[0].nome,
                        request: {
                            type: 'GET',
                            description: 'Retorna os detalhes de todas as empresas registradas.',
                            url: 'http://localhost:3030/empresas'
                        }
                    }
                };
                return res.status(200).send( response );
    } catch (error) {
        return res.status(500).send({ error: error})    
    }
}

exports.postEmpresa = async(req,res,next) => {
    try {
        const query = `INSERT INTO empresas (nome) VALUES (?);`
        const result = await mysql.execute(query,
        [
            req.body.nome,
        ]);
            const response = {
                empresaCriada:{
                    id_empresa: result.insertId,
                    nome: req.body.nome,
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de todas as empresas registradas.',
                        url: 'http://localhost:3030/empresas'
                    }                                      
                }
            };
            return res.status(201).send( response );
    } catch (error) {
        console.log(error);
        return res.status(500).send({ error: error})    
    }
}

exports.patchEmpresas = async(req,res,next) => {

    try {
        const queryEmpresa = `SELECT * FROM empresas WHERE id_empresa = ?`;
        const resultEmpresa = await mysql.execute(queryEmpresa,
            [
                req.params.id_empresa
            ]);
            if(resultEmpresa.length == 0) {
                return res.status(404).send({message: 'Não exsite nemhuma empresa com esse ID.'})
            }
    
        const query = `UPDATE empresas SET nome = ? WHERE id_empresa = ?`;
        const result = await mysql.execute(query,
            [
                req.body.nome,
                req.params.id_empresa
            ]);
    
            const response = {
                message: 'Empresa alterada com sucesso.',
                request: {
                    type: 'POST',
                    description: 'Insere um novo registro de empresa.',
                    url: 'http://localhost:3030/empresas/cadastro',
                    body: {
                        nome: 'String'
                    }
                }                       
                
            };
            return res.status(202).send( response );
    } catch (error) {
        return res.status(500).send({ error: error}); 
    }    
}   

exports.deleteEmpresa = async(req,res,next) => {


    try {
        const queryEmpresa = `SELECT * FROM empresas WHERE id_empresa = ?`;
    const resultEmpresa = await mysql.execute(queryEmpresa, 
        [
            req.params.id_empresa
        ])
        if(resultEmpresa.length == 0) {
            return res.status(404).send({message: 'Não exsite nemhuma empresa com esse ID.'})
        }
    
    const query = `DELETE FROM empresas WHERE id_empresa = ?`;
    const result = await mysql.execute(query,
        [
            req.params.id_empresa
        ]);

        const response = {
            message: 'Empresa deletada com sucesso.',
            request: {
                type: 'POST',
                description: 'Insere um novo registro de empresa.',
                url: 'http://localhost:3030/empresas/cadastro',
                body: {
                    nome: 'String'
                }
            }                       
            
        };
        return res.status(202).send( response );
    } catch (error) {
        return res.status(500).send({ error: error})    
    }
    
}