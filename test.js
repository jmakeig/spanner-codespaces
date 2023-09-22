#!/usr/bin/env node

import { create_connection } from "./db.js";
const db = create_connection();

try {
	/** @type {string} */
	const sql = "SELECT $1 AS message, now() AS now;";
	const retults = await db.query(sql, ["Hello!"]);
	console.log(retults.rows[0]);
} catch (error) {
	console.error(error.message, error.code);
	process.exit(1);
} finally {
	await db.close();
}
process.exit(0);
