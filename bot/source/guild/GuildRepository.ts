import { sql } from "kysely";
import {
	GuildCreate,
	GuildRead,
	GuildReturn,
	GuildUpdate,
} from "@source/database/tables/GuildsTable";
import DatabaseManager from "@source/database/DatabaseManager";

class GuildRepository {
	public async Create(guild: GuildCreate) {
		const query = sql<GuildReturn>`
				INSERT INTO guilds
				("communicationChannelId")
				VALUES(
					${guild.communicationChannelId},
				)
				ON CONFLICT ("id") DO UPDATE 
				SET
					"communicationChannelId" = EXCLUDED."communicationChannelId",
					"deletedAt" = NULL
				RETURNING *
				`;
		return (await DatabaseManager.instance.ExecuteQuery(query)).rows[0];
	}

	public async Read(filter: GuildRead) {
		return await DatabaseManager.instance
			.SelectFromTable("guilds")
			.where("id", "=", filter.id)
			.where("deletedAt", "is", null)
			.selectAll()
			.executeTakeFirst();
	}

	public async Update(filter: GuildRead, update: GuildUpdate) {
		return await DatabaseManager.instance
			.UpdateTable("guilds")
			.set("communicationChannelId", update.communicationChannelId)
			.where("id", "=", filter.id)
			.where("deletedAt", "is", null)
			.returningAll()
			.executeTakeFirst();
	}

	public async Delete(filter: GuildRead) {
		return await DatabaseManager.instance
			.UpdateTable("guilds")
			.where("id", "=", filter.id)
			.where("deletedAt", "is", null)
			.set("deletedAt", new Date())
			.returningAll()
			.executeTakeFirst();
	}
}

export default GuildRepository;
