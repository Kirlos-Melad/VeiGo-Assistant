import { Kysely, Logger, PostgresDialect } from "kysely";
import pg from "pg";

import DatabaseManager, { Database } from "@source/database/DatabaseManager";

class DatabaseManagerFactory {
	/**
	 * Connects to the default database `postgres` and creates a new database with the given name
	 *
	 * @param connection database connection string
	 * @param dbDefaultName the default database name
	 * @param dbName the name of the database to create
	 * @param log
	 * @param ignoreIfExists If true, the database will not be created if it already exists else an interaction from the user is required
	 * @returns the default connection
	 */
	static async Create(
		connection: string,
		dbDefaultName: string,
		dbName: string,
		log: Logger | undefined,
		ignoreIfExists?: boolean,
	) {
		let pgPool = new pg.Pool({
			connectionString: `${connection}/${dbDefaultName}`,
		});
		let pgDialect = new PostgresDialect({
			pool: pgPool,
		});

		let kysely = new Kysely<Database>({ dialect: pgDialect });

		const dbManager = DatabaseManager.CreateInstance("temp", kysely);
		await dbManager.CreateDatabase(dbName, ignoreIfExists);

		pgPool = new pg.Pool({ connectionString: `${connection}/${dbName}` });
		pgDialect = new PostgresDialect({ pool: pgPool });
		kysely = new Kysely<Database>({ dialect: pgDialect, log });

		return DatabaseManager.CreateInstance(kysely);
	}
}

export default DatabaseManagerFactory;
