// Libraries
import {
	DataTypes,
	ModelAttributes,
	Model,
	ModelOptions,
	CreationOptional,
	InferAttributes,
	InferCreationAttributes,
	NonAttribute,
} from "@sequelize/core";

// Modules
import DatabaseService from "../services/Database.service.ts";

interface ServersModel
	extends Model<
		InferAttributes<ServersModel>,
		InferCreationAttributes<ServersModel>
	> {
	id: string;

	communicationChannelId?: CreationOptional<string>;
}

const ServersTableName = "Servers";

const ServersTable: ModelAttributes<ServersModel> = {
	id: {
		type: DataTypes.STRING(26),
		primaryKey: true,
	},

	communicationChannelId: {
		type: DataTypes.TEXT,
		allowNull: true,
		defaultValue: null,
	},
};

DatabaseService.instance.CreateTable<ServersModel>(
	ServersTableName,
	ServersTable,
);

export default ServersModel;
export { ServersTableName };
