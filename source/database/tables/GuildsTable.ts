import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

interface GuildsTable {
	id: ColumnType<string, string, never>;

	communicationChannelId?: string;

	createdAt: ColumnType<Date, never, never>;
	updatedAt: ColumnType<Date, never, never>;
	deletedAt: ColumnType<never, never, Date | null>;
}

type GuildReturn = Selectable<GuildsTable>;
type GuildCreate = Insertable<GuildsTable>;
type GuildRead = Pick<GuildReturn, "id">;
type GuildUpdate = Omit<Updateable<GuildsTable>, "deletedAt">;

export type { GuildsTable, GuildReturn, GuildCreate, GuildRead, GuildUpdate };
