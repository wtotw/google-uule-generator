import * as fs from "node:fs";
import * as csv from "csv";
import { PromisePool } from "@supercharge/promise-pool";

import { getUuleByLatlng } from "./uule";

const HEADER = [
	"会社ID",
	"会社名",
	"店舗ID",
	"店舗名",
	"stores_latitude",
	"stores_longitude",
	"craw_ranking_latitude",
	"craw_ranking_longitude",
	"都道府県",
	"市区町村",
	"取得地域",
	"uule",
	"削除済み",
] as const;

const isTarget = (row: { [key in (typeof HEADER)[number]]: string }) => {
	return (
		row.削除済み !== "TRUE" &&
		row.stores_latitude &&
		row.stores_longitude &&
		!row.uule
	);
};

const input = fs.readFileSync("public/csv/input/list.csv", "utf-8");
csv.parse(
	input,
	{ columns: true },
	async (_err, data: { [key in (typeof HEADER)[number]]: string }[]) => {
		console.log(data.length);

		const { errors, results } = await PromisePool.for(data)
			.withConcurrency(10)
			.useCorrespondingResults()
			.process(async (row) => {
				if (!isTarget(row)) {
					return Promise.resolve();
				}

				return await getUuleByLatlng(
					`${row.stores_latitude},${row.stores_longitude}`,
				);
			});
		if (errors.length) {
			console.error("errors: ", errors);
		}

		const uuleData = data.map((row, i) => {
			if (!isTarget(row)) {
				return row;
			}
			return { ...row, uule: results[i] };
		});

		csv.stringify(
			uuleData,
			{ header: true, columns: HEADER },
			(err, output) => {
				if (err) {
					console.error(err);
					return;
				}
				fs.writeFileSync("public/csv/output/list.csv", output);
			},
		);
	},
);
