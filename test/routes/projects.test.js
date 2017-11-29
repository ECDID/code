import * as path from "path";
import test from "ava";
import request from "supertest";
import Knex from "knex";
import { Model } from "objection";

import User from "../../src/models/user";
import app from "../../src/app";
import config from "../../knexfile";

require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const GOOD_LOGIN = { username: "mark", password: "1234" };

test.before(async () => {
	const knex = Knex(config[process.env.NODE_ENV]);
	await knex.migrate.latest();
	Model.knex(knex);
	await User.query().insert(GOOD_LOGIN);
});

test("GET / unauthenticated", async t => {
	const res = await request(app).get("/");
	t.is(res.status, 302);
	t.is(res.header.location, "/login");
});

test("GET / authenticated", async t => {
	const agent = request.agent(app);

	await agent.post("/login")
		.type("form")
		.send(GOOD_LOGIN);

	const res = await agent.get("/");
	t.is(res.status, 200);
	t.is(res.type, "text/html");
});
