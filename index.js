import express from 'express';
import bodyParser from 'body-parser';

import router from './routes/registro.js';
import pgClient from './db.js';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

pgClient.connect();

app.use('/', router)
app.get('/', (req, res) => res.send('[CONTRAPONTO API]'))
app.listen(PORT, () => console.log(`Server is running @ http://localhost:${PORT}`))