import * as path from "path";
import { promises as fs } from "fs";
import {
	Kysely,
	Migrator,
	FileMigrationProvider,
	IsolationLevel,
	sql,
	RawBuilder,
} from "kysely";

import Logger from "@source/utilities/Logger";
import AbsolutePath from "@source/utilities/AbsolutePath";
import { GuildsTable } from "./tables/GuildsTable";

interface Database {
	guilds: GuildsTable;
}

class DatabaseManager {
	private static sDefaultInstanceName: string;
	private static sInstances: Map<string, DatabaseManager>;

	private mName: string;
	private mConnection: Kysely<Database>;
	private mIsTransactionActive: boolean;

	private constructor(connectionName: string, connection: Kysely<Database>) {
		this.mName = connectionName;
		this.mConnection = connection;
		this.mIsTransactionActive = false;
	}

	private static CreateInstanceWithName(
		connectionName: string,
		connection: Kysely<Database>,
	) {
		if (DatabaseManager.sInstances.has(connectionName)) {
			throw new Error(`Connection "${connectionName}" already exists`);
		}

		const instance = new DatabaseManager(connectionName, connection);
		DatabaseManager.sInstances.set(connectionName, instance);

		return instance;
	}

	public static CreateInstance(connection: Kysely<Database>): DatabaseManager;
	public static CreateInstance(
		connectionName: string,
		connection: Kysely<Database>,
	): DatabaseManager;

	public static CreateInstance(
		connectionNameOrConnection: string | Kysely<Database>,
		connection?: Kysely<Database>,
	): DatabaseManager {
		DatabaseManager.sDefaultInstanceName = "default";

		if (!DatabaseManager.sInstances) {
			DatabaseManager.sInstances = new Map();
		}

		if (typeof connectionNameOrConnection === "string") {
			return DatabaseManager.CreateInstanceWithName(
				connectionNameOrConnection,
				connection!,
			);
		} else {
			return DatabaseManager.CreateInstanceWithName(
				DatabaseManager.sDefaultInstanceName,
				connectionNameOrConnection,
			);
		}
	}

	/**
	 * @returns the default instance
	 * @throws Error if the default instance does not exist
	 */
	public static get instance() {
		return DatabaseManager.sInstances.get(
			DatabaseManager.sDefaultInstanceName,
		)!;
	}

	/**
	 * @returns a map of all the instances
	 */
	public static GetInstance(name: string) {
		return DatabaseManager.sInstances.get(name);
	}

	public static DeleteInstance(name: string) {
		DatabaseManager.sInstances.delete(name);
	}

	public get name(): Readonly<string> {
		return this.mName;
	}

	public async CreateDatabase(name: string, ignoreIfExists = true) {
		const result = await sql`
			SELECT oid
			FROM pg_database
			WHERE datname = '${sql.raw(name)}'
		`.execute(this.mConnection);

		Logger.warning(`Found the next`, result);

		if (result.rows.length == 1) {
			if (ignoreIfExists) {
				return;
			}

			Logger.warning(`Database "${name}" already exists`);
			const answer = await Logger.message(
				`Do you want to delete it? [Y/n]`,
			);

			if (answer.toLowerCase() === "y") {
				await this.DropDatabase(name);
			} else {
				Logger.information("Database creation was cancelled");
				return;
			}
		}

		await sql`CREATE DATABASE ${sql.raw(name)}`.execute(this.mConnection);
	}

	public async DropDatabase(name: string) {
		await sql`DROP DATABASE IF EXISTS ${sql.raw(name)}`.execute(
			this.mConnection,
		);
	}

	public async WithTransaction<T>(
		callback: (trx: Kysely<Database>) => Promise<T>,
		isolationLevel: IsolationLevel = "snapshot",
	) {
		return await this.mConnection
			.transaction()
			.setIsolationLevel(isolationLevel)
			.execute(callback);
	}

	public async StartTransaction(
		isolationLevel: IsolationLevel = "serializable",
	) {
		await sql`BEGIN TRANSACTION ISOLATION LEVEL ${sql.raw(
			isolationLevel.toUpperCase(),
		)};`.execute(this.mConnection);
		this.mIsTransactionActive = true;
	}

	public async CommitTransaction() {
		await sql`COMMIT TRANSACTION;`.execute(this.mConnection);
		this.mIsTransactionActive = false;
	}

	public async RollbackTransaction() {
		await sql`ROLLBACK TRANSACTION;`.execute(this.mConnection);
		this.mIsTransactionActive = false;
	}

	public get isTransactionActive() {
		return this.mIsTransactionActive;
	}

	public InsertIntoTable(table: keyof Database) {
		return this.mConnection.insertInto(table);
	}

	public SelectFromTable(table: keyof Database) {
		return this.mConnection.selectFrom(table);
	}

	public UpdateTable(table: keyof Database) {
		return this.mConnection.updateTable(table);
	}

	public DeleteFromTable(table: keyof Database) {
		return this.mConnection.deleteFrom(table);
	}

	public async ExecuteQuery<T>(query: RawBuilder<T>) {
		return await query.execute(this.mConnection);
	}

	private async MigrateTable(folder: string) {
		const db = this.mConnection;
		const migrator = new Migrator({
			db,
			provider: new FileMigrationProvider({
				fs,
				path,
				migrationFolder: folder,
			}),
		});

		const { error, results } = await migrator.migrateToLatest();

		results?.forEach((it) => {
			if (it.status === "Success") {
				Logger.information(
					`Migration "${it.migrationName}" was executed successfully`,
				);
			} else if (it.status === "Error") {
				Logger.error(
					`Failed to execute migration "${it.migrationName}"`,
				);
			}
		});

		if (error) {
			Logger.error("Failed to migrate");
			Logger.error(error);
			process.exit(1);
		}
	}

	public async Migrate() {
		const migrationsPath = path.join(
			AbsolutePath(import.meta.url),
			"migrations",
		);

		const folders = await fs.readdir(migrationsPath, {
			withFileTypes: true,
		});

		Logger.information("Starting Migrations");
		for (const folder of folders) {
			if (folder.isDirectory())
				await this.MigrateTable(path.join(migrationsPath, folder.name));
		}
	}
}

export default DatabaseManager;
export type { Database };
