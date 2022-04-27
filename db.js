import pg from 'pg'

const pgClient = new pg.Client({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "",
    database: "contraPonto"
})

export default pgClient;