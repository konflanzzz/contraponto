import express from "express";
import crypto from 'crypto';
import pgClient from '../db.js';

const router = express.Router();

const registros = [{
        horario: "2022-04-21T08:00:00-03:00",
        id_funcioario: "1",
        id_registro: "dabb0dbe33d60b33ad301cfe74df290d"
    },
    {
        horario: "2022-04-21T12:00:00-03:00",
        id_funcioario: "1",
        id_registro: "aecfb17327b0aa36faaafab689623845"
    },
    {
        horario: "2022-04-21T14:00:00-03:00",
        id_funcioario: "1",
        id_registro: "06487d736e195a361af2a13cb493e129"
    },
    {
        horario: "2022-04-21T18:00:00-03:00",
        id_funcioario: "1",
        id_registro: "cb8d3b3cc097ef6df08e1f8912f82d60"
    }
];

router.get('/contraponto/registro', (req, res) => {
    const request = req.body;

    pgClient.query(`SELECT * FROM registros where id_funcionario=${request.id_funcionario}`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    pgClient.end;
});

router.post('/contraponto/registro', (req, res) => {

    const registro = req.body;

    registro.id_registro = crypto.createHash('md5').update(registro.id_funcioario + registro.horario).digest("hex")

    registros.push(registro)

    let insertQuery = `INSERT INTO registros(id_registro, id_funcionario, horario) 
    values('${registro.id_registro}', '${registro.id_funcioario}', '${registro.horario}')`

    pgClient.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Insertion was successful')
        } else { console.log(err.message) }
    })
    pgClient.end;
});

router.get('/contraponto/remunera', (req, res) => {

    const request = req.body;

    pgClient.query(`SELECT * FROM registros where id_funcionario=${request.id_funcionario}`, (err, result) => {
        if (!err) {

            var horasTrabalhadas = 0;

            var registros_encontrados = result.rows;

            for (let i = 0; i < registros_encontrados.length - 1; i += 2) {
                //console.log('entrada: ' + registros_encontrados[i].horario)
                var date1 = Date.parse(registros_encontrados[i].horario)
                    //console.log('saida: ' + registros_encontrados[i + 1].horario)
                var date2 = Date.parse(registros_encontrados[i + 1].horario)
                var diffaux = Math.abs(date1 - date2) / 3600000;
                horasTrabalhadas += diffaux
            }

            res.send(`salario do funcionario = R$ ` + horasTrabalhadas * 11.50)
        }

    });
    pgClient.end;
});

export default router;