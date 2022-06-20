const { Pool } = require('pg');
const yargs = require('yargs');

const config = {
    user: "postgres",
    host: "localhost",
    password: "postgresql",
    database: 'banco',
    port: 5432
};

const pool = new Pool(config);