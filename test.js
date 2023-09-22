#!/usr/bin/env node

import { create_connection } from './db.js';
const db = create_connection();

try {
	const retults = await db.query(`SELECT $1 AS message, now() AS now;`, ['Hello!']);
	console.log(retults.rows[0]);
} catch (error) {
	console.error(error.message);
	process.exit(1);
} finally {
	await db.close();
}
process.exit(0);