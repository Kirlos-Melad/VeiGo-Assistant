import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

function Load(directory: string, recursive?: boolean) {
	const directoryContent = fs.readdirSync(directory, {
		withFileTypes: true,
	});

	const files: string[] = [];

	for (const content of directoryContent) {
		const contentPath = path.join(directory, content.name);

		if (content.isDirectory() && recursive)
			files.push(...Load(contentPath, true));
		else if (content.isFile()) files.push(contentPath);
	}

	return files;
}

async function DependencyLoader(directory: string, recursive?: boolean) {
	const dependencies = Load(directory, recursive);

	const promises = dependencies.map(async (dependencyPath) => {
		const dependencyPathUrl = pathToFileURL(dependencyPath).href;
		const dependency = await import(dependencyPathUrl);
		return dependency;
	});

	const results = await Promise.all(promises);
	return results;
}

export default DependencyLoader;
