import 'dotenv/config';
import pg from 'pg';

export class ConstraintViolation extends Error {
	constructor(original) {
		super(original.details);
		this.name = 'ConstraintViolation';
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
	function connect() {
		const config = {
			host: 'localhost',
			port: 5432,
			database: `projects/${process.env.SPANNER_PROJECT}/instances/${process.env.SPANNER_INSTANCE}/databases/${process.env.SPANNER_DATABASE}`
		};
		return new pg.Pool(config);
	}
	const database = connect();
	return {
		database,
		async close() {
			return await database.end();
		},
		async transaction(runner) {
			const client = await database.connect();
			let res;
			try {
				await client.query('BEGIN');
				try {
					res = await runner(client);
					await client.query('COMMIT');
					return res;
				} catch (error) {
					await client.query('ROLLBACK');
					throw wrap_error(error);
				}
			} finally {
				client.release();
			}
		},
		async query(statement, params = []) {
			try {
				return await database.query(statement, params);
			} catch (error) {
				throw wrap_error(error);
			}
		}
	};
}