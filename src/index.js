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
		await User.query().insert({ username: "mark", password: "1234" });
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
