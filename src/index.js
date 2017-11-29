import http from "http";
import * as path from "path";
import Knex from "knex";
import { Model } from "objection";
import config from "../knexfile";
import app from "./app";

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const PORT = process.env.PORT;

const knex = Knex(config[process.env.NODE_ENV]);

Model.knex(knex);

const main = async () => {
	const server = http.createServer(app);
	server.listen(PORT, err => {
		if (err) {
			throw err;
		}
		console.log(`Server listening on port ${PORT}`);
	});
};

// https://github.com/Vincit/objection.js/tree/master/examples/express-es7
// https://github.com/scoutforpets/objection-password
// https://github.com/Vincit/objection.js/issues/196

main();
