import http from "http";
import Knex from "knex";
import { Model } from "objection";
import app from "./app";

const PORT = 3000;

const knex = Knex({
	client: "sqlite3",
	useNullAsDefault: true,
	connection: {
		filename: ":memory:"
	}
});

Model.knex(knex);

const main = async () => {
	await knex.schema.createTableIfNotExists("User", table => {
		table.increments("id").primary();
		table.string("username");
		table.string("password");
	});
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
