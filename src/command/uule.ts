import "dotenv/config";
import { program } from "commander";

import { getUule } from "../uule";

export const main = async (location: string, reverseGeo: boolean) => {
	const result = await getUule(location, reverseGeo);
	console.log(result);
};

program
	.requiredOption("-l, --location <location>", "Location Name or Latlng")
	.option("-r, --reverse-geo", "Reverse Geo Location Latlng");
program.parse();
const options = program.opts();

main(options.location, options.reverseGeo);
