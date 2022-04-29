import pg from 'pg'

// Cria conexão com o banco de dados local
const pgClient = new pg.Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "",
    database: "contraPonto"
})

export default pgClient;