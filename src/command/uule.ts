import "dotenv/config";
import { program } from "commander";

import { getUule } from "../uule";

export const main = async (location: string) => {
	const result = await getUule(location);
	console.log(result);
};

program.requiredOption("-l, --location <location>", "Location Name");
program.parse();
const options = program.opts();

main(options.location);
