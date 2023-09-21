#!/usr/bin/env node

// https://stackoverflow.com/questions/55377103/can-i-import-the-node-postgres-module-pg-or-is-it-commonjs-only#comment131338205_55378800
import pg from 'pg'

const { Pool } = pg
const pool = new Pool({
	host: 'localhost',
	port: 5432,
	database: 'projects/google.com:cloud-spanner-demo/instances/jmakeig-test/databases/pipeline'
});

try {
	const result = await pool.query(`SELECT now();`);
	console.log(await result.rows[0]);
} catch (err) {
	console.error(err.message);
	process.exit(1);
}
process.exit(0);