import { z } from "zod";

const environmentVariables = z.object({
	IS_DEVELOPMENT: z
		.string()
		.transform((value) => Boolean(value))
		.pipe(z.boolean())
		.or(z.undefined()),
	APPLICATION_ID: z.string(),
	CLIENT_TOKEN: z.string(),
	DATABASE_CONNECTION: z.string(),
	DATABASE_DEFAULT_NAME: z.string(),
	DATABASE_NAME: z.string(),
	AUTHOR_PROFILE_URL: z.string(),
	AUTHOR_IMAGE_URL: z.string(),
	AUTHOR_NAME: z.string(),
	AUTHOR_NICKNAME: z.string(),
	AUTHOR_SIGNATURE: z.string(),
});

export default environmentVariables.parse(process.env);
