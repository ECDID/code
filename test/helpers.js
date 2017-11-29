import { join } from "path";
import Knex from "knex";
import { Model } from "objection";

import config from "../knexfile";

require("dotenv").config({ path: join(__dirname, "../.env") });

export default async () => {
	const knex = Knex(config[process.env.NODE_ENV]);
	await knex.migrate.latest();
	Model.knex(knex);
};
