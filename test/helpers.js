import { join } from "path";
import Knex from "knex";
import { Model } from "objection";

require("dotenv").config({ path: join(__dirname, "../.env") });
const config = require("../db.config");

export default async () => {
	const knex = Knex(config[process.env.NODE_ENV]);
	await knex.migrate.latest();
	Model.knex(knex);
};
