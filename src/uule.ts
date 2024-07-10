import "dotenv/config";
import { SERCRET } from "./sercret";

type PlaceResponseData = {
	places: Place[];
};

type Place = {
	formattedAddress: string;
};

type GeoResponseData = {
	results: Result[];
};

type Result = {
	formatted_address: string;
};

const PREFIX = "w+CAIQICI";

export const getUUleByLocation = async (location: string) => {
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

	const data: PlaceResponseData = await res.json();

	const formattedAddress = data.places[0].formattedAddress.replaceAll(
		", ",
		",",
	);

	return getUule(formattedAddress);
};

export const getUuleByLatlng = async (latlng: string) => {
	const params = {
		latlng,
		result_type: "locality",
		key: `${process.env.API_KEY}`,
	};
	const query = new URLSearchParams(params);
	const res = await fetch(
		`https://maps.googleapis.com/maps/api/geocode/json?${query}`,
		{
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		},
	);

	if (!res.ok) {
		console.log(await res.json());
		throw new Error("Error: Failed to fetch data");
	}

	const data: GeoResponseData = await res.json();

	const formattedAddress = data.results[0].formatted_address.replaceAll(
		", ",
		",",
	);

	return getUule(formattedAddress);
};

export const getUule = async (address: string) => {
	const sercret = SERCRET[address.length];
	if (!sercret) {
		console.log(address);
		throw new Error("Error: Invalid formatted address length");
	}

	const result = `${PREFIX}${sercret}${btoa(address)}`;
	return result;
};
