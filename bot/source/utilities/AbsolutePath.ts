import path from "path";
import { fileURLToPath } from "url";

function AbsolutePath(url: string | URL): string {
	const fileName = fileURLToPath(url);

	return path.dirname(fileName);
}

export default AbsolutePath;
