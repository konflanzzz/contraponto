import express from "express";
import crypto from 'crypto';
import pgClient from '../db.js';


const router = express.Router();

// implementa um rota para obter todos registros de ponto de um usuário
router.get('/contraponto/registro', (req, res) => {

    // obtem os dados da requisicao
    const request = req.body;

    // cria uma query para o banco contendo o id_funcionario obtido da requisição recebida
    // e inicia uma conexão com o banco
    pgClient.query(`SELECT * FROM registros where id_funcionario=${request.id_funcionario}`, (err, result) => {

        // condicional para caso nao aconteça erros na query
        if (!err) {

            // retorna para o client, os registros obtidos do banco
            res.send({
                xStat: "Consulta de registros realizada com sucesso",
                cStat: 200,
                registros: result.rows
            })
        }
    });

    // encerra conexão com o banco
    pgClient.end;
});

// implementa uma rota para permitir o registro do ponto do funcionário
router.post('/contraponto/registro', (req, res) => {

    // obtem os dados da requisição
    const registro = req.body;

    // cria uma md5 para servir como identificador unico do registro do ponto
    registro.id_registro = crypto.createHash('md5').update(registro.id_funcioario + registro.horario).digest("hex")

    // cria uma query com os dados obtidos na requisicao para inserir o registro de ponto no banco de dados
    let insertQuery = `INSERT INTO registros(id_registro, id_funcionario, horario) 
    values('${registro.id_registro}', '${registro.id_funcioario}', '${registro.horario}')`

    // inicia a conexão com o banco
    pgClient.query(insertQuery, (err, result) => {

        if (!err) {
            // se não houver erros gera uma mensagem de retorno para o client
            res.send({ xStat: "Registro de ponto efetuado com sucesso", cStat: 200 })
        } else {
            // caso haja algum erro, registra no console a mensagem capturada 
            console.log(err.message)
        }
    })

    // encerra conexão com o banco
    pgClient.end;
});





// implementa uma rota para permitir o calculo do salario baseado em horas trabalhadas
router.get('/contraponto/remunera', (req, res) => {

    // obtem os dados da requisição
    const request = req.body;

    // cria uma query para o banco contendo o id_funcionario obtido da requisição recebida
    // e inicia uma conexão com o banco
    pgClient.query(`SELECT * FROM registros where id_funcionario=${request.id_funcionario}`, (err, result) => {

        // caso nao haja erros, segue para o calculo
        if (!err) {

            // inicia uma variavel auxiliar
            var horasTrabalhadas = 0;

            // atribui a um array os resultados obtidos da busca / consulta no banco
            var registros_encontrados = result.rows;

            // percorre todos os registros, ao passo de 2 a 2
            // para que o indice PAR seja considerado a ENTRADA
            // e para que o indice IMPAR seja considerado uma SAIDA
            for (let i = 0; i < registros_encontrados.length - 1; i += 2) {

                //obtem a data e hora de entrada
                var date1 = Date.parse(registros_encontrados[i].horario)

                // obtem a data e hora de saida
                var date2 = Date.parse(registros_encontrados[i + 1].horario)

                // calcula a diferenca de horas entre as duas data e horas
                var diffaux = Math.abs(date1 - date2) / 3600000;

                // adiciona consecutivamente a variavel da diferenca de horas 
                // sob as horas trabalhadas
                horasTrabalhadas += diffaux
            }

            // retorna para o client o valor de horas multiplicadas pelo salario / hora
            // resultando no valor em R$ a ser pago
            res.send({
                xStat: "Sucesso ao calcular remuneração do colaborador",
                cStat: 200,
                remuneracao: horasTrabalhadas * 11.50
            })
        }
    });

    // encerra conexão com o banco
    pgClient.end;
});

export default router;