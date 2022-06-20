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

yargs.command("registrar", "Registrar nueva transferencia",{
    descripcion: {
        describe: 'Descripción de la transferencia',
        demand: true,
        alias: 'd'
    },
    monto: {
        describe: 'Monto a transferir',
        demand: true,
        alias: 'm'
    },
    cuenta_origen: {
        describe: 'Cuenta que envía el monto',
        demand: true,
        alias: 'co'
    },
    cuenta_destino: {
        describe: 'Cuenta que recibe el monto',
        demand: true,
        alias: 'cd'
    }
}, async (argumentos) => { // Función asíncrona que registre una nueva transferencia mediante una transacción SQL.
    let { descripcion, monto, cuenta_origen, cuenta_destino } = argumentos;
    try {
        await pool.query("BEGIN");

        const descontar = {
            text: "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 RETURNING *",
            values: [monto, cuenta_origen]
        }
        const resDescontar = await pool.query(descontar); 
        
        const acreditar = {
            text: "UPDATE cuentas SET saldo = saldo - $1 WHERE id = $2 RETURNING *",
            values: [monto, cuenta_destino]
        }
        const resAcreditar = await pool.query(acreditar);

        const nuevaTransferencia = {
            text: "INSERT INTO transferencias (descripcion, fecha, monto, cuenta_origen, cuenta_destino) values ($1, CURRENT_TIMESTAMP, $2, $3, $4) RETURNING *",
            values: [descripcion, monto, cuenta_origen, cuenta_destino]
        }

        const resNuevaTransferencia = await pool.query(nuevaTransferencia);
        console.table(resNuevaTransferencia.rows); // Mostrar por consola la última transferencia registrada.

        
