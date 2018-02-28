import http from "http";
import Knex from "knex";
import { Model } from "objection";

import app from "./app";
import User from "./models/user";

require("dotenv").config();
const config = require("../db.config");

const PORT = process.env.PORT;

const knex = Knex(config[process.env.NODE_ENV]);
Model.knex(knex);

const main = async () => {
	if (process.env.NODE_ENV === "development") {
		await knex("User").delete();
		await knex("Project").delete();
		await User.query().insertGraph({
			username: "mark",
			password: "1234",
			projects: [
				{
					name: "project 1",
					batches: [{
						rfidTag: "1x"
					},
					{
						rfidTag: "2x"
					}]
				},
				{
					name: "project 2",
					batches: [{
						rfidTag: "3x"
					},
					{
						rfidTag: "4x"
					}]
				},
				{
					name: "project 3",
					batches: [{
						rfidTag: "5x"
					},
					{
						rfidTag: "6x"
					}]
				}
			]
		});
	}

	const server = http.createServer(app);
	server.listen(PORT, err => {
		if (err) {
			throw err;
		}
		console.log(`Server listening on port ${PORT}`);
	});
};

main();
