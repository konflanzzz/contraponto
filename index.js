import express from 'express';
import bodyParser from 'body-parser';

import router from './routes/registro.js';
import pgClient from './db.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// inicia conexão com o banco de dados
pgClient.connect();

app.use('/', router)
app.get('/', (req, res) => res.send('[CONTRAPONTO API]'))

// inicia o servidor na porta definida
app.listen(PORT, () => console.log(`Servidor está online em: @ http://localhost:${PORT}`))