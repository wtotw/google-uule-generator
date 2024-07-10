import "dotenv/config";
import { program } from "commander";

import { getUUleByLocation, getUuleByLatlng } from "../uule";

export const main = async (location: string, reverseGeo: boolean) => {
	const result = reverseGeo
		? await getUuleByLatlng(location)
		: await getUUleByLocation(location);
	console.log(result);
};

program
	.requiredOption("-l, --location <location>", "Location Name or Latlng")
	.option("-r, --reverse-geo", "Reverse Geo Location Latlng");
program.parse();
const options = program.opts();

main(options.location, options.reverseGeo);
