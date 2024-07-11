import "dotenv/config";
import { SERCRET } from "./sercret";

type Params = {
	key: string;
	latlng?: string;
	result_type?: string;
	address?: string;
	component?: string;
};

type GeoResponseData = {
	results: Result[];
};

type Result = {
	formatted_address: string;
};

const PREFIX = "w+CAIQICI";

export const getUule = async (location: string, reverseGeo: boolean) => {
	const params: Params = {
		key: `${process.env.API_KEY}`,
	};
	if (reverseGeo) {
		params.latlng = location;
		params.result_type = "locality";
	} else {
		params.address = location;
		params.component = "locality";
	}
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
	if (!data.results.length) {
		throw new Error("Error: No data found");
	}

	const formattedAddress = data.results[0].formatted_address.replaceAll(
		", ",
		",",
	);

	const sercret = SERCRET[formattedAddress.length];
	if (!sercret) {
		console.log(formattedAddress);
		throw new Error("Error: Invalid formatted address length");
	}

	const result = `${PREFIX}${sercret}${btoa(formattedAddress)}`;
	return result;
};
