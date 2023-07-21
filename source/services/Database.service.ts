// Libraries
import {
	Sequelize,
	Transaction,
	Options,
	ModelAttributes,
	ModelOptions,
	HasOneOptions,
	BelongsToOptions,
	HasManyOptions,
	Model,
	DataTypes,
	QueryOptionsWithType,
	QueryTypes,
	InferAttributes,
	InferCreationAttributes,
	WhereOptions,
	Attributes,
	CreationOptional,
	FindOptions,
} from "@sequelize/core";
import { format as sqlFormatter } from "sql-formatter";
import LoggerService from "./Logger.service.ts";

// Modules

class DatabaseService {
	private static sInstance: DatabaseService;

	private connection: Sequelize;

	private constructor(connection: string) {
		const options: Options = {
			define: {
				// Enforcing the table name to be equal to the model name
				freezeTableName: true,
				timestamps: false,
			},

			benchmark: true,

			// Sequelize will set up a connection pool on initialization
			pool: {
				max: 10, // Maximum number of connection instances in the pool
				min: 1, // Minimum number of connection instances in the pool
			},

			logging: (message: string, timestamps?: number) => {
				const prefixes = ["Executing (default): "];
				let idx;

				for (let prefix of prefixes) {
					if ((idx = message.indexOf(prefix)) !== -1) {
						message = message.substring(idx + prefix.length).trim();
						break;
					}
				}

				//

				try {
					LoggerService.information(
						sqlFormatter(message) + `\nQuery took ${timestamps}ms`,
					);
				} catch (error) {
					LoggerService.error("Failed to format SQL query");
				} finally {
					LoggerService.information(
						message + `\n\nQuery took ${timestamps}ms`,
					);
				}
			},

			isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
		};

		this.connection = new Sequelize(connection, options);
	}

	public static async CreateInstance(
		connection: string,
	): Promise<DatabaseService> {
		if (DatabaseService.sInstance) return DatabaseService.sInstance;

		DatabaseService.sInstance = new DatabaseService(connection);

		await DatabaseService.sInstance.connection.authenticate();

		return DatabaseService.sInstance;
	}

	public static get instance(): DatabaseService {
		if (!DatabaseService.sInstance)
			throw new Error("Instance not created");

		return DatabaseService.sInstance;
	}

	public CreateTable<T extends Model<any, any>>(
		tableName: string,
		attributes: ModelAttributes<T, any>,
		options?: ModelOptions<T>,
	) {
		type updatedType = T & {
			createdAt: CreationOptional<number>;
			updatedAt: CreationOptional<number>;
			deletedAt: CreationOptional<number>;
		};

		// Add the createdAt, updatedAt & deletedAt fields to the attributes without default values
		const updatedAttributes = {
			...attributes,
			createdAt: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: () => Date.now(),
			},
			updatedAt: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: () => Date.now(),
			},

			deletedAt: {
				type: DataTypes.BIGINT,
				allowNull: true,
				defaultValue: null,
			},
		};

		// Add the deletedAt field to the default scope where clause to always exclude deleted records
		// and always exclude the deletedAt field from the default scope attributes
		const updatedOptions = {
			...options,
			defaultScope: {
				...((options?.defaultScope || {}) as FindOptions<
					Attributes<T>
				>),
				where: {
					...(options?.defaultScope?.where || {}),
					deletedAt: null,
				} as WhereOptions<updatedType>,
				// attributes: {
				// 	include: [
				// 		...(options?.defaultScope?.attributes?.include || []),
				// 	] as string[],
				// 	exclude: [
				// 		...(options?.defaultScope?.attributes?.exclude || []),
				// 		"deletedAt",
				// 	] as string[],
				// } as FindAttributeOptions,
			},
		} as ModelOptions<T>;

		// Define the model with the updated attributes and options
		const model = this.connection.define(
			tableName,
			updatedAttributes,
			updatedOptions,
		);

		return model;
	}

	public tableHasOne(
		tableName: string,
		targetTableName: string,
		options?: HasOneOptions<string, string>,
	) {
		const table = this.connection.model(tableName);
		const targetTable = this.connection.model(targetTableName);

		table.hasOne(targetTable, options);
	}

	public tableHasMany(
		tableName: string,
		targetTableName: string,
		options?: HasManyOptions<string, string>,
	) {
		const table = this.connection.model(tableName);
		const targetTable = this.connection.model(targetTableName);

		table.hasMany(targetTable, options);
	}

	public tableBelongsToOne(
		tableName: string,
		targetTableName: string,
		options?: BelongsToOptions<string, string>,
	) {
		const table = this.connection.model(tableName);
		const targetTable = this.connection.model(targetTableName);

		table.belongsTo(targetTable, options);
	}

	public tableBelongsToMany(
		tableName1: string,
		tableName2: string,
		targetTableName: string,
	) {
		const table1 = this.connection.model(tableName1);
		const table2 = this.connection.model(tableName2);
		const targetTable = this.connection.model(targetTableName);

		table1.belongsToMany(table2, { through: targetTable });
		table2.belongsToMany(table1, { through: targetTable });
	}

	public async SyncTables() {
		// TODO: Remove the force option in production
		await this.connection.sync({ force: true });
	}

	public GetTable<
		T extends Model<InferAttributes<T>, InferCreationAttributes<T>>,
	>(tableName: string) {
		return this.connection.model<T>(tableName);
	}

	public async Query<T extends QueryTypes>(
		query: string,
		options: QueryOptionsWithType<T>,
	) {
		return await this.connection.query(query, options);
	}

	public async StartTransaction() {
		return await this.connection.startUnmanagedTransaction();
	}
}

export default DatabaseService;
