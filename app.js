const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const rotaEmpresas = require('./routes/empresas');
const rotaVagas = require('./routes/vagas');
const rotaUsuarios = require('./routes/usuarios');
const rotaCandidatos = require('./routes/candidatos');
const cors = require('cors');


app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors({origin: '*'}));


app.use('/empresas', rotaEmpresas);
app.use('/vagas', rotaVagas);
app.use('/usuarios', rotaUsuarios);
app.use('/candidatos', rotaCandidatos);

app.use((req, res, next) => {
    const erro = new Error('Não encontrado');

    erro.status = 404;
    next(erro);
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    return res.send({
        erro:{
            mensagem: error.message
        }
    });
});

module.exports = app;