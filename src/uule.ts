import "dotenv/config";
import { SERCRET } from "./sercret";

type ResponseData = {
	places: Place[];
};

type Place = {
	formattedAddress: string;
};

const PREFIX = "w+CAIQICI";

export const getUule = async (location: string) => {
	const params = {
		textQuery: location,
	};

	const res = await fetch(
		"https://places.googleapis.com/v1/places:searchText",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Goog-Api-Key": `${process.env.API_KEY}`,
				"X-Goog-FieldMask": "places.formattedAddress",
			},
			body: JSON.stringify(params),
		},
	);

	if (!res.ok) {
		console.log(await res.json());
		throw new Error("Error: Failed to fetch data");
	}

	const data: ResponseData = await res.json();

	const formattedAddress = data.places[0].formattedAddress.replaceAll(
		", ",
		",",
	);

	const sercret = SERCRET[formattedAddress.length.toString()];
	if (!sercret) {
		console.log(formattedAddress);
		throw new Error("Error: Invalid formatted address length");
	}

	const result = `${PREFIX}${sercret}${btoa(formattedAddress)}`;

	return result;
};
