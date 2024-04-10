import { Kysely, sql } from "kysely";

async function up(db: Kysely<any>) {
	await sql`
        ALTER TABLE "guilds"
		ADD COLUMN "deletedAt" TIMESTAMP DEFAULT NULL;
    `.execute(db);
}

async function down(db: Kysely<any>) {
	await sql`
        ALTER TABLE "guilds"
		DROP COLUMN "deletedAt";
    `.execute(db);
}

export { up, down };
