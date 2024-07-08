import { program } from "commander";
import { SERCRET } from "./sercret";

type ResponseData = {
	places: Place[];
};

type Place = {
	formattedAddress: string;
};

const PREFIX = "w+CAIQICI";

const main = async (location: string) => {
	const params = {
		textQuery: location,
	};

	const res = await fetch(
		"https://places.googleapis.com/v1/places:searchText",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": "<api-key>",
				"X-Goog-FieldMask": "places.formattedAddress",
			},
			body: JSON.stringify(params),
		},
	);

	if (!res.ok) {
		throw new Error("Error");
	}

	const data: ResponseData = await res.json();
	const formattedAddress = data.places[0].formattedAddress.replaceAll(
		", ",
		",",
	);
	const sercret = SERCRET[formattedAddress.length.toString()];
	const result = PREFIX + sercret + btoa(formattedAddress);

	console.log(result);
};

program.requiredOption("-l, --location <location>", "Location Name");
program.parse();
const options = program.opts();

main(options.location);
