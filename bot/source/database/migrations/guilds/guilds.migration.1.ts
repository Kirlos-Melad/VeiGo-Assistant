import { Kysely, sql } from "kysely";

async function up(db: Kysely<any>) {
	await sql`
        CREATE TABLE "guilds" (
            "id" TEXT PRIMARY KEY,
            "communicationChannelId" TEXT,
            "createdAt" TIMESTAMP NOT NULL DEFAULT current_timestamp,
            "updatedAt" TIMESTAMP NOT NULL DEFAULT current_timestamp
        );
    `.execute(db);

	await sql`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER
        LANGUAGE PLPGSQL
        AS $$
        BEGIN
            NEW."updatedAt" = current_timestamp;
            RETURN NEW;
        END;
        $$
        `.execute(db);

	await sql`
        CREATE TRIGGER update_guilds_updated_at
        BEFORE UPDATE
        ON "guilds"
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column()
        `.execute(db);
}

async function down(db: Kysely<any>) {
	await sql`DROP TRIGGER update_guilds_updated_at ON "guilds";`.execute(db);
	await sql`DROP FUNCTION update_updated_at_column;`.execute(db);
	await sql`DROP TABLE IF EXISTS "guilds";`.execute(db);
}

export { up, down };
