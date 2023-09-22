import "dotenv/config";
import pg from "pg";

export class ConstraintViolation extends Error {
	constructor(original) {
		super(original.message);
		this.name = "ConstraintViolation";
		this.original = original;
	}
}

function wrap_error(error) {
	// https://www.postgresql.org/docs/9.6/errcodes-appendix.html
	// if ('23505' === error?.code) {
	// https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto#L84
	if (6 === error?.code) {
		return new ConstraintViolation(error);
	}
	return error;
}

export function create_connection() {
	/**
	 * Initialize the connection pool.
	 * Gets the connection config from `.env`.
	 *
	 * @returns {pg.Pool}
	 */
	function connect() {
		/** @type {pg.PoolConfig} */
		const config = {
			host: "localhost",
			port: 5432,
			database: `projects/${process.env.SPANNER_PROJECT}/instances/${process.env.SPANNER_INSTANCE}/databases/${process.env.SPANNER_DATABASE}`,
		};
		return new pg.Pool(config);
	}

	/** @type {pg.Pool} */
	const connection = connect();

	return {
		/** @type {pg.Pool} */
		get connection() {
			return connection;
		},
		/**
		 * Close the connection pool.
		 *
		 * @returns {Promise<void>}
		 */
		async close() {
			return await connection.end();
		},
		/**
		 * Wraps a callback in a database transaction. Thrown errors will rollaback.
		 *
		 * @param {function(pg.PoolClient): Promise<pg.QueryResult<any>>} runner
		 * @returns {Promise<pg.QueryResult<any>>}
		 */
		async transaction(runner) {
			const client = await connection.connect();
			let res;
			try {
				await client.query("BEGIN");
				try {
					res = await runner(client);
					await client.query("COMMIT");
					return res;
				} catch (error) {
					await client.query("ROLLBACK");
					throw wrap_error(error);
				}
			} finally {
				client.release();
			}
		},
		/**
		 * Single-statement query that requires no cleanup.
		 *
		 * @param {string} statement
		 * @param {any[]} [params = []]
		 * @returns {Promise<pg.QueryResult<any>>}
		 */
		async query(statement, params = []) {
			try {
				return await connection.query(statement, params);
			} catch (error) {
				throw wrap_error(error);
			}
		},
	};
}
