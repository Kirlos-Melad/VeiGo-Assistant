import path from "path";
import { fileURLToPath } from "url";

function __dirname(url: string | URL): string {
	const __filename = fileURLToPath(url);

	return path.dirname(__filename);
}

export default __dirname;
